"use client"

import { useState, useEffect, useCallback } from "react"
import type { OrderStatus } from "@/types"
import { getAdminOrders, updateOrderStatus } from "@/actions/admin/orders"

type AdminOrder = Awaited<ReturnType<typeof getAdminOrders>>[number]

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getAdminOrders()
      setOrders(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void (async () => { await load() })()
  }, [load])

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const result = await updateOrderStatus(orderId, status)
    if (result.success) await load()
    return result
  }

  return { orders, isLoading, updateStatus }
}
