"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PriceDisplay } from "@/components/shared/price-display"
import type { Product } from "@/types"

import { useAuth } from "@/context/auth-context"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { isAuthenticated } = useAuth()

  const stockColor =
    product.stock === 0
      ? "text-destructive"
      : product.stock <= 5
        ? "text-yellow-500"
        : "text-success"

  const stockText =
    product.stock === 0
      ? "Sin stock"
      : product.stock <= 5
        ? `Quedan ${product.stock} unidades`
        : "En stock"

  return (
    <div className="flex flex-col gap-4">
      {/* Badges */}
      <div className="flex items-center gap-2">
        {product.isNew && <Badge>Nuevo</Badge>}
        {product.stock === 0 && <Badge variant="destructive">Sin stock</Badge>}
      </div>

      {/* Brand */}
      <span className="text-sm uppercase tracking-wider text-muted-foreground">
        {product.brand}
      </span>

      {/* Model */}
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        {product.model}
      </h1>

      {/* Price */}
      <div className="text-2xl">
        {isAuthenticated ? (
          <PriceDisplay price={product.price} />
        ) : (
          <span className="text-lg font-medium text-muted-foreground">
            Iniciá sesión para ver precio
          </span>
        )}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2">
        <div className={`size-2 rounded-full ${product.stock === 0 ? "bg-destructive" : product.stock <= 5 ? "bg-yellow-500" : "bg-success"}`} />
        <span className={`text-sm font-medium ${stockColor}`}>{stockText}</span>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Descripción</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      <Separator />

      {/* Specs table */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Especificaciones</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted-foreground">Código</span>
          <span className="text-foreground">{product.code}</span>
          <span className="text-muted-foreground">Marca</span>
          <span className="text-foreground">{product.brand}</span>
          <span className="text-muted-foreground">Modelo</span>
          <span className="text-foreground">{product.model}</span>
          <span className="text-muted-foreground">Fabricante</span>
          <span className="text-foreground">{product.manufacturer}</span>
        </div>
      </div>
    </div>
  )
}
