/**
 * Acciones de servidor para el catálogo público.
 * Son "wrappers" (envoltorios) de las funciones de lib/db/.
 *
 * ¿Por qué existen si solo llaman a otra función?
 * Porque los componentes del cliente ("use client") NO pueden llamar
 * directamente a funciones del servidor. Necesitan pasar por una
 * Server Action (marcada con "use server") como intermediario.
 */
"use server"

import { searchProducts } from "@/lib/db/products"
import { getCategories } from "@/lib/db/categories"
import type { Product, Category } from "@/types"

/** Busca productos por texto (marca, modelo o descripción). Wrapper de searchProducts. */
export async function searchProductsAction(query: string): Promise<Product[]> {
  return searchProducts(query)
}

/** Obtiene todas las categorías activas. Wrapper de getCategories. */
export async function getCategoriesAction(): Promise<Category[]> {
  return getCategories()
}
