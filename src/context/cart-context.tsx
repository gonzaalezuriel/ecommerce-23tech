/**
 * Contexto global del carrito de compras.
 * Mantiene el estado del carrito en el cliente con actualizaciones optimistas
 * y sincroniza con la base de datos via server actions.
 * Carga automáticamente el carrito al autenticarse el usuario.
 *
 * Casos de uso relacionados: CU014, CU016, CU017
 */
"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import type { CartItem, Product } from "@/types"
import { useRouter } from "next/navigation"
import {
  getCart,
  addToCart as addToCartAction,
  updateQuantity as updateQuantityAction,
  removeItem as removeItemAction,
  clearCart as clearCartAction,
} from "@/actions/cart-actions"

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  clearLocalCart: () => void
  fetchDBCart: (silent?: boolean) => Promise<void>
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { status } = useSession()
  const isAuthenticated = status === "authenticated"
  const router = useRouter()

  // Helper to fetch DB cart and update state (stable ref via useCallback)
  const fetchDBCart = useCallback(async (silent: boolean = false) => {
    const dbCart = await getCart()
    if (dbCart) {
      const newItems = dbCart.items.map((i) => ({
        id: i.id,
        cartId: i.cartId,
        productId: i.productId,
        quantity: i.quantity,
        product: i.product as Product,
      }))

      // Detectar productos que desaparecieron (dado de baja o sin stock)
      setItems((prev) => {
        if (prev.length > 0) {
          const newIds = new Set(newItems.map((i) => i.productId))
          const removed = prev.filter((i) => !newIds.has(i.productId))
          if (!silent) {
            removed.forEach((i) =>
              toast.warning(`"${i.product.brand} ${i.product.model}" se eliminó del carrito porque fue dado de baja o se quedó sin stock`, { id: `removed-${i.productId}`, duration: 6000 })
            )
          }
        }
        return newItems
      })
    } else {
      setItems([])
    }
  }, [])

  // Al autenticarse: cargar el carrito desde la DB
  useEffect(() => {
    if (!isAuthenticated) return
    void (async () => { await fetchDBCart() })()
  }, [isAuthenticated, fetchDBCart])

  const addItem = async (product: Product, quantity: number) => {
    const response = await addToCartAction(product.id, quantity)

    // CU014: Si el servidor frena por stock insuficiente o producto dado de baja
    if (response && response.error) {
      toast.error(response.error)

      if (response.error.includes("dado de baja")) {
        setTimeout(() => router.push("/catalogo"), 1500)
      } else if (response.error.includes("Stock insuficiente") || response.error.includes("No hay stock")) {
        setTimeout(() => router.refresh(), 1500)
      }

      return
    }

    await fetchDBCart()
    toast.success("Producto agregado al carrito")
  }

  const removeItem = async (productId: string) => {
    const itemToRemove = items.find((i) => i.productId === productId)
    setItems((prev) => prev.filter((i) => i.productId !== productId))
    toast.success("Producto eliminado")

    if (itemToRemove) {
      try {
        await removeItemAction(itemToRemove.id)
      } catch {
        toast.error("No se pudo eliminar el producto, intentá de nuevo")
        await fetchDBCart()
      }
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return
    const itemToUpdate = items.find((i) => i.productId === productId)

    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )

    if (itemToUpdate) {
      try {
        const result = await updateQuantityAction(itemToUpdate.id, quantity)
        if (result?.error) {
          toast.error(result.error)
          await fetchDBCart()
        }
      } catch {
        toast.error("No se pudo actualizar la cantidad, intentá de nuevo")
        await fetchDBCart()
      }
    }
  }

  const clearCart = async () => {
    const previousItems = [...items]
    setItems([])
    try {
      await clearCartAction()
    } catch {
      toast.error("No se pudo vaciar el carrito, intentá de nuevo")
      setItems(previousItems)
    }
  }

  // Solo limpia el estado local (sin llamar a la DB).
  // Usar después de createOrder, que ya limpia la DB en la transacción.
  const clearLocalCart = () => {
    setItems([])
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearLocalCart,
        fetchDBCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
