"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/types"
import type { AdminCreateUserSchema } from "@/lib/schemas"
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  toggleUserStatus,
} from "@/actions/admin/users"

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([])

  const load = useCallback(async () => {
    try {
      const data = await getAdminUsers()
      setUsers(data)
    } catch (error) {
      console.error("[useAdminUsers] Error al cargar usuarios:", error)
    }
  }, [])

  useEffect(() => {
    void (async () => { await load() })()
  }, [load])

  const createUser = async (data: AdminCreateUserSchema) => {
    const result = await createAdminUser(data)
    if (result.success) await load()
    return result
  }

  const updateUser = async (id: string, data: Partial<User> & { password?: string }) => {
    const result = await updateAdminUser(id, data)
    if (result.success) await load()
    return result
  }

  const toggleUser = async (id: string, active: boolean) => {
    const result = await toggleUserStatus(id, active)
    if (result.success) await load()
    return result
  }

  return { users, createUser, updateUser, toggleUser }
}
