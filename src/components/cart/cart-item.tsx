"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PriceDisplay } from "@/components/shared/price-display"
import { formatPrice } from "@/lib/utils"
import type { CartItem as CartItemType } from "@/types"

interface CartItemProps {
  item: CartItemType
  onQuantityChange?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [prevItemQty, setPrevItemQty] = useState(item.quantity)
  const [quantity, setQuantity] = useState(item.quantity)
  const subtotal = item.product.price * quantity

  // Sincronizar el estado local cuando el prop cambia (ej: validateCart ajusta la cantidad)
  if (prevItemQty !== item.quantity) {
    setPrevItemQty(item.quantity)
    setQuantity(item.quantity)
  }

  function updateQuantity(newQty: number) {
    const clamped = Math.min(Math.max(1, newQty), item.product.stock)
    setQuantity(clamped)
    onQuantityChange?.(item.id, clamped)
  }

  return (
    <div className="flex gap-3 sm:gap-4 rounded-lg border border-border bg-card p-3 sm:p-4">
      {/* Product image placeholder */}
      <Link
        href={`/producto/${item.product.slug}`}
        className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted md:size-24"
      >
        {item.product.images?.[0] ? (
          <Image
            src={item.product.images[0]}
            alt={`${item.product.brand} ${item.product.model}`}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-muted-foreground/30">
            {item.product.brand.charAt(0)}
          </span>
        )}
      </Link>

      {/* Product info */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/producto/${item.product.slug}`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {item.product.brand} {item.product.model}
            </Link>
            <p className="text-xs text-muted-foreground">
              Precio unitario: {formatPrice(item.product.price)}
            </p>
          </div>

          {/* Remove button with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive">
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de que querés eliminar &ldquo;{item.product.brand} {item.product.model}&rdquo; del carrito?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onRemove?.(item.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Quantity + Subtotal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="size-3" />
            </Button>
            <Input
              type="number"
              min={1}
              max={item.product.stock}
              value={quantity}
              onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
              className="h-8 w-12 rounded-none border-x-0 text-center text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={quantity >= item.product.stock}
            >
              <Plus className="size-3" />
            </Button>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold">
              <PriceDisplay price={subtotal} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
