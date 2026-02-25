"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
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
    <Link href={`/producto/${product.slug}`} className="group block">
      <Card className="relative gap-0 overflow-hidden border-border p-0 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]">
        {/* Image area */}
        <div className="relative aspect-square bg-muted">
          {showImage ? (
            <Image
              src={firstImage}
              alt={`${product.brand} ${product.model}`}
              fill
              className="object-contain p-4"
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
              <Badge variant="default" className="text-[10px] px-1.5 py-0.5">
                Nuevo
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                Sin stock
              </Badge>
            )}
          </div>
        </div>

        {/* Card content */}
        <CardContent className="flex flex-col gap-1.5 p-3 md:p-4">
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
      </Card>
    </Link>
  )
}
