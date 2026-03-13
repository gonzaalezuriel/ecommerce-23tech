"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CardContent } from "@/components/ui/card"
import { SpotlightCard } from "@/components/animations/spotlight-card"
import { Badge } from "@/components/ui/badge"
import { PriceDisplay } from "@/components/shared/price-display"
import type { Product } from "@/types"
import { useAuth } from "@/context/auth-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth()
  const [imgError, setImgError] = useState(false)

  const firstImage = product.images?.[0]
  const showImage = firstImage && !imgError

  return (
    <Link href={`/producto/${product.slug}`} className="group block h-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      <SpotlightCard className="flex h-full flex-col gap-0 p-0 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(0,212,255,0.15)]">
        {/* Image area */}
        <div className="relative aspect-square bg-white overflow-hidden rounded-t-xl">
          {showImage ? (
            <Image
              src={firstImage}
              alt={`${product.brand} ${product.model}`}
              fill
              className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/30">
                {product.brand.charAt(0)}
              </span>
            </div>
          )}

          {/* Top-left badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
            {product.isNew && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0.5 z-20 relative">
                Nuevo
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 z-20 relative">
                Sin stock
              </Badge>
            )}
          </div>
        </div>

        {/* Card content */}
        <CardContent className="flex flex-col gap-1.5 p-3 md:p-4 z-20 relative">
          {/* Brand */}
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </span>

          {/* Model name */}
          <h3 className="line-clamp-2 text-sm font-medium text-foreground">
            {product.model}
          </h3>

          {/* Price */}
          <PriceDisplay
            price={product.price}
            isAuthenticated={isAuthenticated}
            className="mt-1 text-base font-bold text-foreground"
          />

          {/* Stock indicator */}
          {product.stock === 0 && (
            <span className="text-xs text-destructive">Sin stock</span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-xs text-yellow-500">
              Quedan {product.stock} unidades
            </span>
          )}
        </CardContent>
      </SpotlightCard>
    </Link>
  )
}
