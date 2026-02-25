"use client"

import { useState, useEffect, useCallback } from "react"
import type { Category } from "@/types"
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
} from "@/actions/admin/categories"

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  const load = useCallback(async () => {
    try {
      const data = await getAdminCategories()
      setCategories(data)
    } catch (error) {
      console.error("[useAdminCategories] Error al cargar categorías:", error)
    }
  }, [])

  useEffect(() => {
    void (async () => { await load() })()
  }, [load])

  const createCategoryItem = async (data: Partial<Category>) => {
    const result = await createCategory(data)
    if (result.success) await load()
    return result
  }

  const updateCategoryItem = async (id: string, data: Partial<Category>) => {
    const result = await updateCategory(id, data)
    if (result.success) await load()
    return result
  }

  const toggleCategory = async (id: string, currentActive: boolean) => {
    const result = await toggleCategoryStatus(id, currentActive)
    if (result.success) await load()
    return result
  }

  return {
    categories,
    createCategory: createCategoryItem,
    updateCategory: updateCategoryItem,
    toggleCategory,
  }
}
