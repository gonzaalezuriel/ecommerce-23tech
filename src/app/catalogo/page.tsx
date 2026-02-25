import { Suspense } from "react"
import { getProducts } from "@/lib/db/products"
import { getCategories } from "@/lib/db/categories"
import { CatalogClient } from "./catalog-client"
import { auth } from "@/auth"

export const dynamic = "force-dynamic" // Ensure we don't cache stale data for now

export default async function CatalogPage() {
  const products = await getProducts()
  const categories = await getCategories()
  const session = await auth()
  const isAuthenticated = !!session?.user

  return (
    <Suspense fallback={<div className="container mx-auto p-8">Cargando catálogo...</div>}>
      <CatalogClient products={products} categories={categories} isAuthenticated={isAuthenticated} />
    </Suspense>
  )
}
