"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CategoryNav } from "@/components/catalog/category-nav"
import { ProductGrid } from "@/components/catalog/product-grid"
import { FiltersSidebar, FiltersMobileTrigger, type ActiveFilters } from "@/components/catalog/filters-sidebar"
import { ViewToggle } from "@/components/catalog/view-toggle"
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav"
import type { Category, Product } from "@/types"
import { PRICE_MAX } from "@/lib/constants"

interface CatalogClientProps {
  products: Product[]
  categories: Category[]
  isAuthenticated: boolean
}



export function CatalogClient({ products, categories, isAuthenticated }: CatalogClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const catSlug = searchParams.get("cat")

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    brands: [],
    priceRange: [0, PRICE_MAX],
  })
  const [view, setView] = useState<"grid" | "list">("grid")

  const activeCategory = catSlug
    ? categories.find((c) => c.slug === catSlug) ?? null
    : null

  // Apply all filters: category + brand + price
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      if (p.status !== "ACTIVE") return false
      if (activeCategory && p.categoryId !== activeCategory.id) return false
      if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(p.brand)) return false
      
      // Only filter by price if authenticated
      if (isAuthenticated) {
        if (p.price < activeFilters.priceRange[0] || p.price > activeFilters.priceRange[1]) return false
      }
      
      return true
    })

    return filtered
  }, [products, activeCategory, activeFilters, isAuthenticated])

  // Derive brands from ALL products (or use a prop if we fetched them)
  const brands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))].sort()
  }, [products])

  // Smooth scroll to catalog when a category is selected
  useEffect(() => {
    if (catSlug) {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })
    }
  }, [catSlug])

  function handleCategoryChange(categoryId: string | null) {
    if (categoryId) {
      const cat = categories.find((c) => c.id === categoryId)
      if (cat) router.push(`/catalogo?cat=${cat.slug}`, { scroll: false })
    } else {
      router.push("/catalogo", { scroll: false })
    }
  }

  // Build a descriptive title for the results
  const resultsTitle = useMemo(() => {
    const parts: string[] = []
    if (activeCategory) parts.push(activeCategory.name)
    if (activeFilters.brands.length === 1) parts.push(activeFilters.brands[0])
    else if (activeFilters.brands.length > 1) parts.push(`${activeFilters.brands.length} marcas`)
    return parts.length > 0 ? parts.join(" · ") : "Todos los productos"
  }, [activeCategory, activeFilters.brands])

  return (
    <div>
      <div className="bg-background border-b border-border/40 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Catálogo Completo</h1>
          <p className="text-muted-foreground">Explora nuestra selección de hardware de alto rendimiento.</p>
        </div>
      </div>

      <CategoryNav categories={categories} activeSlug={catSlug} />

      <div id="catalogo" className="mx-auto max-w-7xl px-4 pb-12">
        <BreadcrumbNav
          items={[
            { label: "Inicio", href: "/" },
            { label: "Catálogo", href: "/catalogo" },
            ...(activeCategory ? [{ label: activeCategory.name }] : []),
          ]}
        />

        <div className="mt-6 flex gap-8">
          {/* Sidebar filters (desktop) */}
          <FiltersSidebar
            categories={categories}
            brands={brands}
            products={products}
            activeCategoryId={activeCategory?.id ?? null}
            onCategoryChange={handleCategoryChange}
            onFiltersChange={setActiveFilters}
          />

          {/* Main content */}
          <div className="flex-1">
            {/* Sort + View controls */}
            <div className="mb-4 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <FiltersMobileTrigger
                  categories={categories}
                  brands={brands}
                  products={products}
                  activeCategoryId={activeCategory?.id ?? null}
                  onCategoryChange={handleCategoryChange}
                  onFiltersChange={setActiveFilters}
                />
              </div>
              <ViewToggle view={view} onViewChange={setView} />
            </div>

            <ProductGrid
              products={filteredProducts}
              title={resultsTitle}
              resultCount={filteredProducts.length}
              view={view}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
