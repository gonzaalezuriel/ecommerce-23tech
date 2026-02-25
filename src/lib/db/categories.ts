/**
 * Capa de acceso a datos para categorías.
 * Consultas Prisma para obtener categorías activas (menú, filtros).
 */
import { prisma } from "@/lib/prisma"
import { toUICategory } from "./utils"
import { Category } from "@/types"

/** Obtiene todas las categorías activas ordenadas por nombre. */
export async function getCategories(): Promise<Category[]> {
  try {
    // Buscar categorías activas, ordenadas alfabéticamente
    const categories = await prisma.category.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",  // asc = ascendente (A → Z)
      },
    })

    // Convertir al formato de la UI
    return categories.map(toUICategory)
  } catch {
    // Durante el build de Vercel (despliegue), la DB puede no estar disponible aún.
    // En vez de que el build falle, retornamos un array vacío.
    // Cuando la app esté corriendo, la DB ya va a estar disponible y funciona normal.
    return []
  }
}

/** Busca una categoría activa por su slug. */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: {
      slug,
      active: true,
    },
  })

  if (!category) return null

  return toUICategory(category)
}
