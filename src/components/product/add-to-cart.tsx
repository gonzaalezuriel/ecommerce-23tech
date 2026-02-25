"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/types"

import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { LogIn } from "lucide-react"

interface AddToCartProps {
  product: Product
}

export function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { isAuthenticated, role } = useAuth()
  const stock = product.stock

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1))
  }

  function increment() {
    setQuantity((q) => Math.min(stock, q + 1))
  }

  function handleAdd() {
    addItem(product, quantity)
  }

  if (!isAuthenticated) {
    return (
      <Button asChild size="lg" className="w-full gap-2 font-semibold">
        <Link href="/auth/login">
          <LogIn className="size-5" />
          Iniciá sesión para comprar
        </Link>
      </Button>
    )
  }

  if (role === "ADMIN") {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Cantidad:</span>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={decrement}
            disabled={quantity <= 1 || stock === 0}
          >
            <Minus className="size-4" />
          </Button>
          <Input
            type="number"
            min={1}
            max={stock}
            value={quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value) || 1
              setQuantity(Math.min(Math.max(1, v), stock))
            }}
            className="h-9 w-14 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            disabled={stock === 0}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={increment}
            disabled={quantity >= stock || stock === 0}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* Add to cart button */}
      <Button
        size="lg"
        className="w-full gap-2 font-semibold"
        onClick={handleAdd}
        disabled={stock === 0}
      >
        <ShoppingCart className="size-5" />
        {stock === 0 ? "Sin stock" : "Agregar al carrito"}
      </Button>
    </div>
  )
}
