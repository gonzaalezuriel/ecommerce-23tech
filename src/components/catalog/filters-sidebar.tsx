"use client"

import { useState, useMemo } from "react"
import { Filter, SlidersHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { formatPrice } from "@/lib/utils"
import type { Category, Product } from "@/types"
import { useAuth } from "@/context/auth-context"
import { PRICE_MIN, PRICE_MAX } from "@/lib/constants"

export interface ActiveFilters {
  brands: string[]
  priceRange: [number, number]
}

interface FilterContentProps {
  categories: Category[]
  brands: string[]
  products: Product[]
  activeCategoryId?: string | null
  onCategoryChange?: (categoryId: string | null) => void
  onFiltersChange?: (filters: ActiveFilters) => void
}

function FilterContent({
  categories,
  brands,
  activeCategoryId,
  onCategoryChange,
  onFiltersChange,
}: FilterContentProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [localSelectedCategories, setLocalSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX])
  const [brandSearch, setBrandSearch] = useState("")
  const { isAuthenticated } = useAuth()

  // Use controlled state if props provided, otherwise local state
  const isControlled = onCategoryChange !== undefined
  const selectedCategories = isControlled
    ? (activeCategoryId ? [activeCategoryId] : [])
    : localSelectedCategories

  const filteredBrands = useMemo(() => {
    if (!brandSearch) return brands
    return brands.filter((b) =>
      b.toLowerCase().includes(brandSearch.toLowerCase())
    )
  }, [brandSearch, brands])

  function toggleBrand(brand: string) {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    setSelectedBrands(next)
    onFiltersChange?.({ brands: next, priceRange })
  }

  function handlePriceChange(value: [number, number]) {
    setPriceRange(value)
    onFiltersChange?.({ brands: selectedBrands, priceRange: value })
  }

  function toggleCategory(categoryId: string) {
    if (isControlled && onCategoryChange) {
      onCategoryChange(selectedCategories.includes(categoryId) ? null : categoryId)
    } else {
      setLocalSelectedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((c) => c !== categoryId)
          : [...prev, categoryId]
      )
    }
  }

  function clearFilters() {
    setSelectedBrands([])
    setPriceRange([PRICE_MIN, PRICE_MAX])
    setBrandSearch("")
    onFiltersChange?.({ brands: [], priceRange: [PRICE_MIN, PRICE_MAX] })
    if (isControlled && onCategoryChange) {
      onCategoryChange(null)
    } else {
      setLocalSelectedCategories([])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2">
        <Filter className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
      </div>

      <Accordion type="multiple" defaultValue={["marca", "precio", "categoria"]}>
        {/* Brand filter */}
        <AccordionItem value="marca">
          <AccordionTrigger className="text-sm hover:no-underline">
            Marca
            {selectedBrands.length > 0 && (
              <span className="ml-auto mr-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {selectedBrands.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar marca..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-2">
                {filteredBrands.map((brand) => (
                  <div key={brand} className="flex items-center gap-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                    />
                    <Label
                      htmlFor={`brand-${brand}`}
                      className="cursor-pointer text-xs font-normal"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price filter - Only for authenticated users */}
        {isAuthenticated && (
          <AccordionItem value="precio">
            <AccordionTrigger className="text-sm hover:no-underline">
              Precio
              {(priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX) && (
                <span className="ml-auto mr-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  ✓
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] || ""}
                    onChange={(e) =>
                      handlePriceChange([Number(e.target.value) || 0, priceRange[1]])
                    }
                    className="h-8 text-xs"
                  />
                  <span className="text-xs text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] || ""}
                    onChange={(e) =>
                      handlePriceChange([priceRange[0], Number(e.target.value) || PRICE_MAX])
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <Slider
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={10000}
                  value={priceRange}
                  onValueChange={(value) => handlePriceChange(value as [number, number])}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Category filter */}
        <AccordionItem value="categoria">
          <AccordionTrigger className="text-sm hover:no-underline">
            Categoría
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              {categories
                .filter((cat) => cat.active)
                .map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={`cat-${category.id}`}
                      className="cursor-pointer text-xs font-normal"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear filters */}
      <Button
        variant="outline"
        size="sm"
        className="mt-2 w-full text-xs"
        onClick={clearFilters}
      >
        Limpiar filtros
      </Button>
    </div>
  )
}

type FiltersSidebarProps = FilterContentProps

export function FiltersSidebar(props: FiltersSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="sticky top-20 rounded-lg border border-border bg-card p-4">
        <FilterContent {...props} />
      </div>
    </aside>
  )
}

type FiltersMobileTriggerProps = FilterContentProps

export function FiltersMobileTrigger(props: FiltersMobileTriggerProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="size-4" />
            Filtros
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] overflow-y-auto p-4">
          <SheetHeader className="p-0 pb-4">
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <FilterContent {...props} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
