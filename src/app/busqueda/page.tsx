"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect, useMemo } from "react"
import { SearchIcon } from "lucide-react"
import { ProductGrid } from "@/components/catalog/product-grid"
import { FiltersSidebar, FiltersMobileTrigger, type ActiveFilters } from "@/components/catalog/filters-sidebar"
import { SortDropdown } from "@/components/catalog/sort-dropdown"
import { ViewToggle } from "@/components/catalog/view-toggle"
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav"
import { searchProductsAction, getCategoriesAction } from "@/actions/catalog-actions"
import type { Product, Category } from "@/types"
import { useAuth } from "@/context/auth-context"
import { PRICE_MAX } from "@/lib/constants"

function applySortOrder(products: Product[], sortBy: string): Product[] {
  const sorted = [...products]
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price)
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price)
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    default:
      return sorted
  }
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [rawResults, setRawResults] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    brands: [],
    priceRange: [0, PRICE_MAX],
  })
  const [sortBy, setSortBy] = useState("popular")
  const [view, setView] = useState<"grid" | "list">("grid")

  useEffect(() => {
    getCategoriesAction().then(setCategories)
  }, [])

  useEffect(() => {
    ;(query ? searchProductsAction(query) : Promise.resolve([])).then(setRawResults).catch(() => setRawResults([]))
    // Reset filters on new search
    Promise.resolve().then(() => setActiveFilters({ brands: [], priceRange: [0, PRICE_MAX] }))
  }, [query])

  const brands = useMemo(() => [...new Set(rawResults.map((p) => p.brand))].sort(), [rawResults])

  const { isAuthenticated } = useAuth()

  const results = useMemo(() => {
    const filtered = rawResults.filter((p) => {
      if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(p.brand)) return false
      
      // Only filter by price if authenticated
      if (isAuthenticated) {
        if (p.price < activeFilters.priceRange[0] || p.price > activeFilters.priceRange[1]) return false
      }
      
      return true
    })

    // Only sort by price if authenticated
    let effectiveSortBy = sortBy
    if (!isAuthenticated && (sortBy === "price-asc" || sortBy === "price-desc")) {
      effectiveSortBy = "popular"
    }

    return applySortOrder(filtered, effectiveSortBy)
  }, [rawResults, activeFilters, sortBy, isAuthenticated])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-12">
      <BreadcrumbNav
        items={[
          { label: "Inicio", href: "/" },
          { label: "Búsqueda" },
          ...(query ? [{ label: `"${query}"` }] : []),
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-foreground">
          {query ? `Resultados para "${query}"` : "Búsqueda"}
        </h1>
      </div>

      {!query ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <SearchIcon className="size-12" />
          <p>Usá la barra de búsqueda para encontrar productos</p>
        </div>
      ) : (
        <div className="mt-6 flex gap-8">
          <FiltersSidebar
            categories={categories}
            brands={brands}
            products={rawResults}
            onFiltersChange={setActiveFilters}
          />

          <div className="flex-1">
            <div className="mb-4 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <FiltersMobileTrigger
                  categories={categories}
                  brands={brands}
                  products={rawResults}
                  onFiltersChange={setActiveFilters}
                />
                <SortDropdown value={sortBy} onValueChange={setSortBy} />
              </div>
              <ViewToggle view={view} onViewChange={setView} />
            </div>

            <ProductGrid
              products={results}
              resultCount={results.length}
              view={view}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  )
}
