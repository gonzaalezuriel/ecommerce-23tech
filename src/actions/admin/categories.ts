/**
 * Acciones de servidor para gestión de categorías (panel admin).
 * ABM completo con validación de nombre duplicado, generación automática de slug
 * y protección contra eliminación de categorías con productos asociados.
 *
 * Casos de uso relacionados: CU004, CU005, CU006
 */
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { toUICategory } from "@/lib/db/utils"
import type { Category } from "@/types"
import { categorySchema } from "@/lib/schemas"
import { toSlug } from "@/lib/utils"
import { requireAdmin } from "./_guard"

/** Obtiene todas las categorías con la cantidad de productos activos asociados. */
export async function getAdminCategories() {
  // Verificar que el usuario sea admin (si no, lanza error)
  await requireAdmin()

  // Traer todas las categorías con el conteo de productos activos
  // _count = contar. select = "contá solo los productos con status ACTIVE"
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: { where: { status: "ACTIVE" } } } } },
    orderBy: { name: "asc" },
  })

  // Convertir al formato de la UI y agregar el conteo de productos
  return categories.map((c) => ({
    ...toUICategory(c),
    productCount: c._count.products,  // Número de productos activos en esta categoría
  }))
}

/** CU004: Crea una nueva categoría. Valida nombre duplicado y genera slug automático. */
export async function createCategory(data: Partial<Category>) {
  await requireAdmin()

  // PASO 1: Validar los datos con Zod (nombre entre 2 y 50 caracteres)
  const validatedFields = categorySchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  // PASO 2: Verificar que no exista otra categoría con el mismo nombre
  // mode: "insensitive" = no importa mayúsculas ("Celulares" = "celulares")
  const duplicate = await prisma.category.findFirst({
    where: { name: { equals: data.name!, mode: "insensitive" } },
  })
  if (duplicate) {
    return { error: `Ya existe una categoría con el nombre "${data.name}"` }
  }

  // PASO 3: Crear la categoría en la DB
  // El slug se genera automáticamente: "Periféricos Gaming" → "perifericos-gaming"
  await prisma.category.create({
    data: {
      name: data.name!,
      slug: data.slug || toSlug(data.name!),
      description: data.description,
      active: true,
    },
  })

  // PASO 4: Invalidar las páginas que muestran categorías para que se recarguen
  revalidatePath("/admin/categorias")
  revalidatePath("/")
  return { success: true }
}

/**
 * CU006: Modifica una categoría existente.
 * Valida nombre duplicado (excluyendo la propia) y regenera slug.
 */
export async function updateCategory(id: string, data: Partial<Category>) {
  await requireAdmin()

  // PASO 1: Si se cambió el nombre, validar formato y que no esté duplicado
  if (data.name) {
    const validatedFields = categorySchema.partial().safeParse(data)
    if (!validatedFields.success) {
      return { error: validatedFields.error.issues[0].message }
    }

    // Buscar si OTRA categoría (id distinto) tiene el mismo nombre
    const duplicate = await prisma.category.findFirst({
      where: {
        name: { equals: data.name, mode: "insensitive" },
        id: { not: id },  // Excluir la categoría que estamos editando
      },
    })
    if (duplicate) {
      return { error: `Ya existe otra categoría con el nombre "${data.name}"` }
    }
  }

  // PASO 2: Regenerar el slug si cambió el nombre
  const newSlug = data.name ? toSlug(data.name) : undefined

  // PASO 3: Actualizar solo los campos que se enviaron
  // El patrón ...(condición && { campo: valor }) agrega el campo SOLO si la condición es true
  await prisma.category.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(newSlug && { slug: newSlug }),
      ...(data.description !== undefined && { description: data.description }),
    },
  })
  revalidatePath("/admin/categorias")
  revalidatePath("/")
  return { success: true }
}

/**
 * CU005: Activa/Desactiva una categoría (baja lógica).
 * No permite desactivar si tiene productos activos asociados.
 */
export async function toggleCategoryStatus(id: string, currentActive: boolean) {
  await requireAdmin()

  // Si estamos DESACTIVANDO (currentActive = true → queremos ponerla en false)
  if (currentActive) {
    // Contar cuántos productos activos tiene esta categoría
    const count = await prisma.product.count({ where: { categoryId: id, status: "ACTIVE" } })
    // Si tiene al menos 1, NO se puede desactivar (primero hay que desactivar los productos)
    if (count > 0) return { error: "No se puede desactivar una categoría con productos activos asociados" }
  }

  // Invertir el estado: si estaba activa pasa a inactiva, y viceversa
  await prisma.category.update({
    where: { id },
    data: { active: !currentActive },  // ! = invertir el valor booleano
  })
  revalidatePath("/admin/categorias")
  revalidatePath("/")
  return { success: true }
}
