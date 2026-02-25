"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, UserX, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { UserForm } from "@/components/admin/user-form"
import { useAdminUsers } from "@/hooks/use-admin-users"
import { toast } from "sonner"
import type { User } from "@/types"
import type { AdminCreateUserSchema } from "@/lib/schemas"

export default function AdminUsersPage() {
  const { users, createUser, updateUser, toggleUser } = useAdminUsers()
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToToggle, setUserToToggle] = useState<User | null>(null)
  const [pendingSaveData, setPendingSaveData] = useState<AdminCreateUserSchema | null>(null)
  const [isPending, startTransition] = useTransition()

  const columns: Column<User>[] = [
    { key: "document", header: "Documento", className: "hidden md:table-cell", render: (u) => <span className="font-mono text-xs">{u.document}</span> },
    { key: "name", header: "Nombre", render: (u) => `${u.name} ${u.lastname}` },
    { key: "email", header: "Email", className: "hidden sm:table-cell", render: (u) => <span className="text-sm">{u.email}</span> },
    {
      key: "role",
      header: "Perfil",
      render: (u) => (
        <Badge variant={u.role === "ADMIN" ? "default" : "secondary"} className="text-xs">
          {u.role === "ADMIN" ? "Admin" : "Cliente"}
        </Badge>
      ),
    },
    {
      key: "active",
      header: "Estado",
      render: (u) => (
        <Badge variant={u.active ? "outline" : "destructive"} className="text-xs">
          {u.active ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
  ]

  function handleNew() {
    setEditingUser(null)
    setFormOpen(true)
  }

  function handleEdit(user: User) {
    setEditingUser(user)
    setFormOpen(true)
  }

  function handleSave(data: AdminCreateUserSchema) {
    setFormOpen(false)
    setPendingSaveData(data)
  }

  function confirmSave() {
    if (!pendingSaveData) return
    const data = pendingSaveData
    setPendingSaveData(null)
    startTransition(async () => {
      const result = editingUser
        ? await updateUser(editingUser.id, data)
        : await createUser(data)
      if (result.error) {
        toast.error(result.error)
        setFormOpen(true)
        return
      }
      setEditingUser(null)
      toast.success(editingUser ? "Usuario actualizado" : "Usuario creado")
    })
  }

  function handleToggle() {
    if (!userToToggle) return
    startTransition(async () => {
      await toggleUser(userToToggle.id, userToToggle.active)
      toast.success(userToToggle.active ? "Usuario dado de baja" : "Usuario reactivado")
      setUserToToggle(null)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
        <Button onClick={handleNew} className="gap-2 self-start sm:self-auto">
          <Plus className="size-4" />
          Nuevo Usuario
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Buscar por nombre, email o documento..."
        searchFilter={(user, q) => {
          const query = q.toLowerCase()
          return (
            user.name.toLowerCase().includes(query) ||
            user.lastname.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.document.includes(query)
          )
        }}
        actions={(user) => (
          <>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEdit(user)} disabled={isPending}>
              <Pencil className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setUserToToggle(user)} disabled={isPending}>
              {user.active ? (
                <UserX className="size-4 text-destructive" />
              ) : (
                <UserCheck className="size-4 text-success" />
              )}
            </Button>
          </>
        )}
      />

      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editingUser}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!userToToggle}
        onOpenChange={(open) => !open && setUserToToggle(null)}
        title={userToToggle?.active ? "Dar de baja usuario" : "Reactivar usuario"}
        description={
          userToToggle?.active
            ? `¿Estás seguro de dar de baja a "${userToToggle?.name} ${userToToggle?.lastname}"?`
            : `¿Querés reactivar a "${userToToggle?.name} ${userToToggle?.lastname}"?`
        }
        onConfirm={handleToggle}
        variant={userToToggle?.active ? "destructive" : "default"}
        confirmText={userToToggle?.active ? "Dar de baja" : "Reactivar"}
      />

      <ConfirmDialog
        open={!!pendingSaveData}
        onOpenChange={(open) => {
          if (!open) {
            setPendingSaveData(null)
          }
        }}
        title={editingUser ? "Confirmar modificación" : "Confirmar creación"}
        description={
          editingUser
            ? `¿Estás seguro de guardar los cambios del usuario "${editingUser.name} ${editingUser.lastname}"?`
            : "¿Estás seguro de crear este nuevo usuario?"
        }
        onConfirm={confirmSave}
        onCancel={() => setFormOpen(true)}
        confirmText={editingUser ? "Guardar cambios" : "Crear usuario"}
      />
    </div>
  )
}
