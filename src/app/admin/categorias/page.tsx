"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, XCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { CategoryForm } from "@/components/admin/category-form"
import { useAdminCategories } from "@/hooks/use-admin-categories"
import { toast } from "sonner"
import type { Category } from "@/types"

export default function AdminCategoriesPage() {
  const { categories, createCategory, updateCategory, toggleCategory } = useAdminCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToToggle, setCategoryToToggle] = useState<Category | null>(null)
  const [pendingSaveData, setPendingSaveData] = useState<Partial<Category> | null>(null)
  const [isPending, startTransition] = useTransition()

  const columns: Column<Category>[] = [
    { key: "name", header: "Nombre", render: (c) => <span className="font-medium">{c.name}</span> },
    {
      key: "description",
      header: "Descripción",
      className: "hidden md:table-cell",
      render: (c) => (
        <span className="line-clamp-1 text-sm text-muted-foreground">{c.description || "—"}</span>
      ),
    },
    {
      key: "products",
      header: "Productos",
      className: "hidden sm:table-cell",
      render: (c) => <span className="text-sm">{c.productCount ?? 0}</span>,
    },
    {
      key: "active",
      header: "Estado",
      render: (c) => (
        <Badge variant={c.active ? "outline" : "destructive"} className="text-xs">
          {c.active ? "Activa" : "Inactiva"}
        </Badge>
      ),
    },
  ]

  function handleNew() {
    setEditingCategory(null)
    setFormOpen(true)
  }

  function handleEdit(category: Category) {
    setEditingCategory(category)
    setFormOpen(true)
  }

  function handleSave(data: Partial<Category>) {
    setFormOpen(false)
    setPendingSaveData(data)
  }

  function confirmSave() {
    if (!pendingSaveData) return
    const data = pendingSaveData
    setPendingSaveData(null)
    startTransition(async () => {
      const result = editingCategory
        ? await updateCategory(editingCategory.id, data)
        : await createCategory(data)
      if (result.error) {
        toast.error(result.error)
        setFormOpen(true)
        return
      }
      setEditingCategory(null)
      toast.success(editingCategory ? "Categoría actualizada" : "Categoría creada")
    })
  }

  function handleToggle() {
    if (!categoryToToggle) return
    startTransition(async () => {
      const result = await toggleCategory(categoryToToggle.id, categoryToToggle.active)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(categoryToToggle.active ? "Categoría desactivada" : "Categoría reactivada")
      }
      setCategoryToToggle(null)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
        <Button onClick={handleNew} className="gap-2 self-start sm:self-auto">
          <Plus className="size-4" />
          Nueva Categoría
        </Button>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        searchPlaceholder="Buscar categoría..."
        searchFilter={(cat, q) => cat.name.toLowerCase().includes(q.toLowerCase())}
        actions={(cat) => (
          <>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEdit(cat)} disabled={isPending}>
              <Pencil className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setCategoryToToggle(cat)} disabled={isPending}>
              {cat.active ? (
                <XCircle className="size-4 text-destructive" />
              ) : (
                <CheckCircle className="size-4 text-success" />
              )}
            </Button>
          </>
        )}
      />

      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!categoryToToggle}
        onOpenChange={(open) => !open && setCategoryToToggle(null)}
        title={categoryToToggle?.active ? "Desactivar categoría" : "Reactivar categoría"}
        description={
          categoryToToggle?.active
            ? `¿Estás seguro de desactivar "${categoryToToggle?.name}"?`
            : `¿Querés reactivar "${categoryToToggle?.name}"?`
        }
        onConfirm={handleToggle}
        variant={categoryToToggle?.active ? "destructive" : "default"}
        confirmText={categoryToToggle?.active ? "Desactivar" : "Reactivar"}
      />

      <ConfirmDialog
        open={!!pendingSaveData}
        onOpenChange={(open) => {
          if (!open) {
            setPendingSaveData(null)
          }
        }}
        title={editingCategory ? "Confirmar modificación" : "Confirmar creación"}
        description={
          editingCategory
            ? `¿Estás seguro de guardar los cambios de la categoría "${editingCategory.name}"?`
            : "¿Estás seguro de crear esta nueva categoría?"
        }
        onConfirm={confirmSave}
        onCancel={() => setFormOpen(true)}
        confirmText={editingCategory ? "Guardar cambios" : "Crear categoría"}
      />
    </div>
  )
}
