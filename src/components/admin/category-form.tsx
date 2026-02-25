"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Category } from "@/types"

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSave: (data: Partial<Category>) => void
}

function CategoryFormContent({ category, onSave, onOpenChange }: Omit<CategoryFormProps, "open">) {
  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      name,
      description,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="cf-name">Nombre *</Label>
        <Input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Electrónica (2-50 caracteres)" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cf-desc">Descripción</Label>
        <Textarea
          id="cf-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Televisores, celulares, computadoras..."
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit">{category ? "Guardar cambios" : "Crear categoría"}</Button>
      </DialogFooter>
    </form>
  )
}

export function CategoryForm({ open, onOpenChange, category, onSave }: CategoryFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
        </DialogHeader>
        {open && (
          <CategoryFormContent
            key={category?.id ?? "new"}
            category={category}
            onSave={onSave}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
