/**
 * Acciones de servidor para gestión de productos (panel admin).
 * ABM completo con validación de duplicados (marca+modelo), generación de slug.
 * La limpieza de carritos al desactivar se delega a validateCart (CU016).
 *
 * Casos de uso relacionados: CU007, CU008, CU009
 */
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { toUIProduct } from "@/lib/db/utils"
import type { Product } from "@/types"
import { productSchema, type ProductSchema } from "@/lib/schemas"
import { toSlug } from "@/lib/utils"
import { requireAdmin } from "./_guard"

/** Obtiene todos los productos con su categoría para el listado del admin. */
export async function getAdminProducts() {
  await requireAdmin()
  // Traer TODOS los productos (activos e inactivos) con su categoría
  // A diferencia del catálogo público, el admin ve todo
  const products = await prisma.product.findMany({
    include: { category: true },       // Incluir nombre de la categoría
    orderBy: { createdAt: "desc" },    // Más recientes primero
  })
  return products.map(toUIProduct)      // Convertir al formato de la UI
}

/** CU007: Crea un nuevo producto. Valida duplicado marca+modelo y genera slug. */
export async function createProduct(data: ProductSchema) {
  await requireAdmin()

  // PASO 1: Validar los datos con Zod (precio > 0, stock >= 0, etc.)
  const validatedFields = productSchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  // PASO 2: Verificar que no exista otro producto con la misma marca Y modelo
  // Ej: si ya existe "Logitech G502", no se puede crear otro "logitech g502"
  const duplicate = await prisma.product.findFirst({
    where: {
      brand: { equals: data.brand, mode: "insensitive" },
      model: { equals: data.model, mode: "insensitive" },
    },
  })
  if (duplicate) {
    return { error: `Ya existe un producto con la marca "${data.brand}" y modelo "${data.model}"` }
  }

  // PASO 3: Crear el producto en la DB
  // El slug se genera combinando marca + modelo: "Logitech G502" → "logitech-g502"
  await prisma.product.create({
    data: {
      code: data.code,
      slug: toSlug(data.brand) + "-" + toSlug(data.model),
      brand: data.brand,
      model: data.model,
      description: data.description,
      manufacturer: data.manufacturer,
      price: data.price,
      images: data.images,
      status: data.status,
      stock: data.stock,
      categoryId: data.categoryId,
    },
  })
  revalidatePath("/admin/productos")
  revalidatePath("/")
  return { success: true }
}

/**
 * CU009: Modifica un producto existente.
 * Valida duplicado marca+modelo (excluyendo el propio) y regenera slug si cambian.
 */
export async function updateProduct(id: string, data: Partial<Product>) {
  await requireAdmin()

  // PASO 1: Validar los datos con Zod (validación parcial porque no todos los campos son obligatorios)
  const validatedFields = productSchema.partial().safeParse(data)
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  // PASO 2: Si se cambió marca o modelo, verificar que no esté duplicado
  if (data.brand && data.model) {
    const duplicate = await prisma.product.findFirst({
      where: {
        brand: { equals: data.brand, mode: "insensitive" },
        model: { equals: data.model, mode: "insensitive" },
        id: { not: id },  // Excluir el producto que estamos editando
      },
    })
    if (duplicate) {
      return { error: `Ya existe otro producto con la marca "${data.brand}" y modelo "${data.model}"` }
    }
  }

  // PASO 3: Regenerar el slug si cambiaron marca o modelo
  let newSlug: string | undefined
  if (data.brand || data.model) {
    // Obtener los valores actuales para combinar con los nuevos
    const current = await prisma.product.findUnique({ where: { id }, select: { brand: true, model: true } })
    const brand = data.brand ?? current?.brand ?? ""
    const model = data.model ?? current?.model ?? ""
    newSlug = toSlug(brand) + "-" + toSlug(model)
  }

  // PASO 4: Actualizar solo los campos que se enviaron
  // El patrón ...(condición && { campo: valor }) agrega el campo SOLO si se envió
  await prisma.product.update({
    where: { id },
    data: {
      ...(data.code && { code: data.code }),
      ...(data.brand && { brand: data.brand }),
      ...(data.model && { model: data.model }),
      ...(newSlug && { slug: newSlug }),
      ...(data.description && { description: data.description }),
      ...(data.manufacturer && { manufacturer: data.manufacturer }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.status && { status: data.status }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.images && Array.isArray(data.images) && { images: data.images }),
    },
  })
  revalidatePath("/admin/productos")
  revalidatePath("/")
  return { success: true }
}

/**
 * CU008: Activa/Desactiva un producto (baja lógica).
 * La limpieza de carritos la maneja validateCart (CU016) al abrir el carrito,
 * así el cliente recibe un toast explicando por qué el producto fue removido.
 */
export async function toggleProductStatus(id: string, currentStatus: string) {
  await requireAdmin()

  // Invertir el estado: si estaba ACTIVE pasa a INACTIVE, y viceversa
  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"

  await prisma.product.update({
    where: { id },
    data: { status: newStatus },
  })
  revalidatePath("/admin/productos")
  revalidatePath("/")
  return { success: true }
}

