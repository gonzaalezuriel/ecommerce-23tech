/**
 * Acciones de servidor para gestión del carrito de compras.
 * Maneja agregar, actualizar, eliminar y validar items del carrito.
 * Cada operación verifica la sesión del usuario y la propiedad del carrito.
 *
 * Casos de uso relacionados: CU014, CU016, CU017
 */
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"
import { toUIProduct } from "@/lib/db/utils"

/** Obtiene el carrito del usuario autenticado con los productos incluidos. */
export async function getCart() {
  noStore()
  const session = await auth()
  if (!session?.user?.id) return null

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true
            }
          }
        },
        orderBy: {
          product: {
            brand: 'asc'
          }
        }
      }
    }
  })

  if (!cart) return null

  // Serializar los Decimal del producto anidado antes de pasarlo al cliente
  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      product: toUIProduct(item.product)
    }))
  }
}


/**
 * CU014: Agrega un producto al carrito.
 * Si el producto ya existe en el carrito, acumula la cantidad.
 * Valida existencia, estado activo y stock disponible antes de agregar.
 */
export async function addToCart(productId: string, quantity: number) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Debes iniciar sesión" }

  // CU014: Validar que el producto exista, esté activo y tenga stock suficiente
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || product.status === "INACTIVE") {
    return { error: "El producto no está disponible o fue dado de baja" }
  }
  if (product.stock === 0) {
    return { error: "No hay stock disponible para este producto" }
  }
  if (product.stock < quantity) {
    return { error: `Stock insuficiente. Disponible: ${product.stock} unidades` }
  }

  const userId = session.user.id

  // Asegurar que el carrito exista para el usuario
  let cart = await prisma.cart.findUnique({
    where: { userId },
  })

  if (!cart) {
    // Si no existe, crear un nuevo carrito
    cart = await prisma.cart.create({
      data: { userId },
    })
  }

  // Verificar si el item ya existe en el carrito
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  })

  if (existingItem) {
    // Si el item existe, actualizar la cantidad
    const totalQuantity = existingItem.quantity + quantity
    if (totalQuantity > product.stock) {
      return { error: `Stock insuficiente. Ya tenés ${existingItem.quantity} en el carrito. Disponible: ${product.stock}` }
    }
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: totalQuantity },
    })
  } else {
    // Si el item no existe, crearlo
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    })
  }

  revalidatePath("/carrito")
  return { success: true }
}

/** CU016: Actualiza la cantidad de un item del carrito, validando stock. */
export async function updateQuantity(itemId: string, quantity: number) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  if (quantity < 1) return { error: "Cantidad inválida" }

  // Verificar ownership: el item debe pertenecer al carrito del usuario
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId: session.user.id } },
    include: { product: { select: { stock: true } } },
  })
  if (!item) return { error: "No autorizado" }

  // Validar que la cantidad no supere el stock disponible
  if (quantity > item.product.stock) {
    return { error: `Stock insuficiente. Máximo disponible: ${item.product.stock}` }
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  })

  revalidatePath("/carrito")
  return { success: true }
}

/** CU017: Elimina un item específico del carrito. */
export async function removeItem(itemId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  // Verificar ownership: el item debe pertenecer al carrito del usuario
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId: session.user.id } },
  })
  if (!item) return { error: "No autorizado" }

  await prisma.cartItem.delete({
    where: { id: itemId },
  })

  revalidatePath("/carrito")
  return { success: true }
}

/** Vacía completamente el carrito del usuario (usado al finalizar compra). */
export async function clearCart() {
  const session = await auth()
  if (!session?.user?.id) return

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  })

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })
  }
}

// CU016: Verifica el estado de los productos del carrito y su disponibilidad en stock.
// Elimina automáticamente los items con problemas y devuelve las advertencias.
/**
 * CU016: Valida el estado del carrito al visualizarlo.
 * Elimina productos inactivos o sin stock, ajusta cantidades que excedan el stock.
 * Retorna warnings para notificar al usuario de los cambios realizados.
 */
export async function validateCart() {
  noStore()
  const session = await auth()
  if (!session?.user?.id) return { warnings: [] }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  if (!cart || cart.items.length === 0) return { warnings: [] }

  const warnings: string[] = []
  const itemsToRemove: string[] = []

  for (const item of cart.items) {
    if (item.product.status === "INACTIVE") {
      warnings.push(`"${item.product.brand} ${item.product.model}" fue dado de baja y se eliminó de tu carrito.`)
      itemsToRemove.push(item.id)
    } else if (item.product.stock === 0) {
      warnings.push(`"${item.product.brand} ${item.product.model}" no tiene stock disponible y se eliminó de tu carrito.`)
      itemsToRemove.push(item.id)
    } else if (item.quantity > item.product.stock) {
      warnings.push(`"${item.product.brand} ${item.product.model}": la cantidad fue ajustada al stock disponible (${item.product.stock} unidades).`)
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: item.product.stock },
      })
    }
  }

  if (itemsToRemove.length > 0) {
    await prisma.cartItem.deleteMany({ where: { id: { in: itemsToRemove } } })
  }

  return { warnings }
}

