"use client"

import Link from "next/link"
import Image from "next/image"
import { ProductCard } from "@/components/catalog/product-card"
import { PriceDisplay } from "@/components/shared/price-display"
import { useAuth } from "@/context/auth-context"
import type { Product } from "@/types"

interface ProductGridProps {
  products: Product[]
  title?: string
  resultCount?: number
  view?: "grid" | "list"
}

export function ProductGrid({ products, title, resultCount, view = "grid" }: ProductGridProps) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex flex-col gap-4">
      {/* Optional header */}
      {(title || resultCount !== undefined) && (
        <div className="flex items-baseline gap-2">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          {resultCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              ({resultCount} {resultCount === 1 ? "producto" : "productos"})
            </span>
          )}
        </div>
      )}

      {/* Product grid/list or empty state */}
      {products.length > 0 ? (
        view === "list" ? (
          <div className="flex flex-col gap-3">
            {products.map((product) => (
              <Link key={product.id} href={`/producto/${product.slug}`} className="group block">
                <div className="flex gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]">
                  <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {/* Letra de fallback (siempre debajo) */}
                    <span className="text-2xl font-bold text-muted-foreground/30">
                      {product.brand.charAt(0)}
                    </span>
                    {/* Imagen real encima — si falla, la letra queda visible */}
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={`${product.brand} ${product.model}`}
                        fill
                        className="object-contain p-1"
                        onError={(e) => { e.currentTarget.style.display = "none" }}
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {product.brand}
                    </span>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {product.model}
                    </h3>
                    {product.description && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <PriceDisplay
                        price={product.price}
                        isAuthenticated={isAuthenticated}
                        className="text-base font-bold"
                      />
                      {product.stock === 0 ? (
                        <span className="text-xs text-destructive">Sin stock</span>
                      ) : product.stock <= 5 ? (
                        <span className="text-xs text-yellow-500">Quedan {product.stock}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16">
          <p className="text-muted-foreground">No se encontraron productos</p>
        </div>
      )}
    </div>
  )
}
