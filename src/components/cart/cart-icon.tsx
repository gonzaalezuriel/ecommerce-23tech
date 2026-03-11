"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"

export function CartIcon() {
  const { itemCount } = useCart()

  return (
    <Link href="/carrito" className="relative inline-flex items-center group">
      <ShoppingCart className="size-5 text-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2.5 size-4 p-0 flex items-center justify-center text-[10px]">
          {itemCount}
        </Badge>
      )}
    </Link>
  )
}
