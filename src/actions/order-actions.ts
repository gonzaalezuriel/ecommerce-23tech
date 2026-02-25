/**
 * Acciones de servidor para gestión de órdenes de compra.
 * Maneja la creación de órdenes con validación de stock, decremento atómico
 * y envío de email de confirmación.
 *
 * Caso de uso relacionado: CU018
 */
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendOrderConfirmationEmail } from "@/lib/email"
import { checkoutSchema } from "@/lib/schemas"

/**
 * CU018: Finaliza la compra del usuario.
 * Proceso:
 * 1. Verifica sesión y existencia del carrito con items
 * 2. Valida stock disponible para cada producto
 * 3. Transacción atómica: decrementa stock + crea la orden
 * 4. Actualiza estado a PAID y limpia el carrito
 * 5. Envía email de confirmación (no bloqueante)
 */
export async function createOrder(data: { address: string; phone: string }) {
  // PASO 1: Verificar que el usuario esté logueado y que su cuenta siga activa
  const session = await auth()
  if (!session?.user?.id) return { error: "Debes iniciar sesión" }

  // Verificar que la cuenta no haya sido dada de baja por un admin
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || !user.active) return { error: "Tu cuenta ha sido desactivada" }

  // PASO 2: Validar que la dirección y teléfono tengan el formato correcto (Zod)
  const parsed = checkoutSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos de entrega inválidos" }
  }

  const userId = session.user.id

  // PASO 3: Obtener el carrito del usuario con todos sus productos
  // include = "incluir también" → trae los items y dentro de cada item, el producto
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  // Si no tiene carrito o está vacío, no se puede comprar
  if (!cart || cart.items.length === 0) {
    return { error: "Los productos de tu carrito ya no están disponibles" }
  }

  // PASO 4: TRANSACCIÓN ATÓMICA — "todo o nada"
  // Si algo falla adentro (ej: no hay stock), se deshace TODO automáticamente
  try {
    const order = await prisma.$transaction(async (tx) => {
      // Recorrer cada producto del carrito, verificar stock y calcular el total
      let total = 0
      const orderItemsData = []

      for (const item of cart.items) {
        // Si el producto fue desactivado, no se puede comprar
        if (item.product.status !== "ACTIVE") {
          throw new Error(`El producto ${item.product.brand} ${item.product.model} ya no está disponible`)
        }
        // Si no hay suficiente stock, lanza un error y la transacción se deshace
        if (item.product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.product.model}`)
        }
        
        // Calcular subtotal de este item (precio × cantidad)
        const unitPrice = Number(item.product.price)
        total += unitPrice * item.quantity
        
        // Preparar los datos del item para la orden
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })

        // Descontar el stock del producto (decrement = restar)
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      }

      // Crear la orden en estado PENDIENTE (el stock ya se descontó arriba)
      // items: { create: orderItemsData } → crea los OrderItem asociados a esta orden
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          address: data.address,
          phone: data.phone,
          date: new Date(),
          status: "PENDING", // Nace como PENDIENTE, luego pasa a PAGADO
          items: {
            create: orderItemsData
          }
        }
      })
      
      return { order: newOrder, items: cart.items, total, cartId: cart.id }
    })

    // PASO 5: Segunda transacción — simula que el pago fue aprobado
    // En un sistema real, esto lo haría la pasarela de pago (MercadoPago, Stripe, etc.)
    await prisma.$transaction(async (tx) => {
      // Cambiar el estado de PENDIENTE a PAGADO
      await tx.order.update({
        where: { id: order.order.id },
        data: { status: "PAID" }
      })
      // Vaciar el carrito del usuario (ya compró, no necesita los items)
      await tx.cartItem.deleteMany({
        where: { cartId: order.cartId }
      })
    })

    // PASO 6: Enviar email de confirmación al cliente
    // Si el envío falla, la compra se completa igual (no bloquea el proceso)
    await sendOrderConfirmationEmail({
      to: session.user.email!,
      userName: session.user.name || "Cliente",
      orderId: order.order.id,
      items: order.items.map((item) => ({
        brand: item.product.brand,
        model: item.product.model,
        quantity: item.quantity,
        unitPrice: Number(item.product.price),
      })),
      total: order.total,
      address: data.address,
      phone: data.phone,
    })

    // PASO 7: Invalidar las páginas que muestran datos que cambiaron
    // Esto le dice a Next.js "recargá estos datos la próxima vez que alguien visite estas páginas"
    revalidatePath("/historial")
    revalidatePath("/admin")
    revalidatePath("/carrito")

    // Devolver éxito y redirigir a la página de confirmación
    return { success: true, orderId: order.order.id, url: "/checkout/success" }

  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Error al procesar la orden" }
  }
}

