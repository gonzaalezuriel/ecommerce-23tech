/**
 * Funciones de mapeo Prisma → UI.
 *
 * ¿Por qué existen?
 * Prisma usa tipos especiales (Decimal para precios, Date para fechas) que NO se
 * pueden enviar directamente al navegador. Estas funciones los convierten a tipos
 * simples (number, string) que el frontend puede usar sin problemas.
 */
import { Prisma } from "@prisma/client"
import { Product, Category, ProductStatus } from "@/types"

/** Convierte un producto de Prisma al tipo Product que usa la interfaz. */
export function toUIProduct(
  product: Prisma.ProductGetPayload<{ include: { category: true } }>
): Product {
  return {
    id: product.id,
    code: product.code,
    slug: product.slug,
    brand: product.brand,
    model: product.model,
    description: product.description,
    manufacturer: product.manufacturer,
    price: Number(product.price),       // Decimal → number (ej: Decimal(150000) → 150000)
    images: product.images,
    status: product.status as ProductStatus,
    stock: product.stock,
    categoryId: product.categoryId,
    category: product.category ? toUICategory(product.category) : undefined,
    createdAt: product.createdAt.toISOString(),   // Date → string ISO
    updatedAt: product.updatedAt.toISOString(),   // Date → string ISO
    // isNew = true si el producto fue creado hace menos de 15 días (para mostrar badge "Nuevo")
    isNew: product.createdAt > new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  }
}

/** Convierte una categoría de Prisma al tipo Category que usa la interfaz. */
export function toUICategory(category: Prisma.CategoryGetPayload<Record<string, never>>): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || undefined,  // null → undefined
    active: category.active,
    createdAt: category.createdAt.toISOString(),      // Date → string ISO
  }
}
