"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product, Category } from "@/types"
import type { ProductSchema } from "@/lib/schemas"
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
} from "@/actions/admin/products"
import { getAdminCategories } from "@/actions/admin/categories"

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const load = useCallback(async () => {
    try {
      const [productData, categoryData] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ])
      setProducts(productData)
      setCategories(categoryData)
    } catch (error) {
      console.error("[useAdminProducts] Error al cargar productos:", error)
    }
  }, [])

  useEffect(() => {
    void (async () => { await load() })()
  }, [load])

  const createProductItem = async (data: ProductSchema) => {
    const result = await createProduct(data)
    if (result.success) await load()
    return result
  }

  const updateProductItem = async (id: string, data: Partial<Product>) => {
    const result = await updateProduct(id, data)
    if (result.success) await load()
    return result
  }

  const toggleProduct = async (id: string, currentStatus: string) => {
    const result = await toggleProductStatus(id, currentStatus)
    if (result.success) await load()
    return result
  }

  return { products, categories, createProduct: createProductItem, updateProduct: updateProductItem, toggleProduct }
}
