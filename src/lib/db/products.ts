/**
 * Capa de acceso a datos para productos.
 * Consultas Prisma para el catálogo público: listado, filtros por categoría,
 * detalle por slug, búsqueda por texto y productos más vendidos.
 * Solo retorna productos activos al público (CU012, CU015).
 */
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { toUIProduct } from "./utils"
import { Product } from "@/types"

/** Obtiene productos activos con filtro opcional por categoría. */
export async function getProducts({
  limit,
  categorySlug,
}: {
  limit?: number
  categorySlug?: string
} = {}): Promise<Product[]> {
  // Armar el filtro: siempre productos activos
  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
  }

  // Si se pasó una categoría (ej: /catalogo/perifericos), filtrar por ella
  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    }
  }

  // Buscar en la DB. take = límite de resultados. orderBy = más recientes primero.
  const products = await prisma.product.findMany({
    where,
    take: limit,
    include: {
      category: true,  // Incluir la categoría del producto
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Convertir de formato Prisma a formato UI
  return products.map(toUIProduct)
}

/**
 * CU012: Productos más vendidos para la página de inicio.
 * Agrupa por cantidad vendida en OrderItems y completa con recientes si faltan.
 */
export async function getBestSellers(limit = 4): Promise<Product[]> {
  // PASO 1: Agrupar los OrderItems por productId y sumar las cantidades vendidas
  // groupBy = agrupar. _sum = sumar. orderBy _sum desc = los más vendidos primero.
  const topSales = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  })

  // FALLBACK: Si no hay órdenes todavía, mostrar los productos más recientes
  if (topSales.length === 0) {
    return getProducts({ limit })
  }

  // PASO 2: Obtener los productos completos (con categoría) de los más vendidos
  const productIds = topSales.map((s) => s.productId)

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE" },
    include: { category: true },
  })

  // Mantener el orden: el más vendido primero
  const sorted = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products

  // Si algunos de los más vendidos fueron desactivados, completar con los más recientes
  if (sorted.length < limit) {
    const extra = await prisma.product.findMany({
      where: { status: "ACTIVE", id: { notIn: productIds } },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit - sorted.length,
    })
    return [...sorted, ...extra].map(toUIProduct)
  }

  return sorted.map(toUIProduct)
}


/** CU015: Obtiene el detalle de un producto por su slug. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: {
      slug,
      status: "ACTIVE",
    },
    include: {
      category: true,
    },
  })

  if (!product) return null

  return toUIProduct(product)
}

/** Obtiene productos relacionados de la misma categoría (excluyendo el actual). */
export async function getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: {
        not: productId,
      },
      status: "ACTIVE",
    },
    take: limit,
    include: {
      category: true,
    },
  })

  return products.map(toUIProduct)
}

/** CU015: Busca productos activos por marca, modelo o descripción.
 *  mode: "insensitive" = no importa mayúsculas/minúsculas (ej: "logitech" encuentra "Logitech")
 *  contains = "que contenga" (ej: buscar "log" encuentra "Logitech")
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      // OR = buscar en cualquiera de estos campos
      OR: [
        { brand: { contains: query, mode: "insensitive" } },
        { model: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      category: true,
    },
  })

  return products.map(toUIProduct)
}
