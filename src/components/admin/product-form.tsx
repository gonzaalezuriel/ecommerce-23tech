"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Product, ProductStatus, Category } from "@/types"
import type { ProductSchema } from "@/lib/schemas"

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSave: (data: ProductSchema) => void
  categories?: Category[]
}

function ProductFormContent({ product, onSave, onOpenChange, categories = [] }: Omit<ProductFormProps, "open">) {
  const [form, setForm] = useState({
    code: product?.code ?? "",
    brand: product?.brand ?? "",
    model: product?.model ?? "",
    description: product?.description ?? "",
    manufacturer: product?.manufacturer ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
    categoryId: product?.categoryId ?? "",
    status: (product?.status ?? "ACTIVE") as ProductStatus,
    images: product?.images && product.images.length > 0 ? product.images : [""],
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      code: form.code,
      brand: form.brand,
      model: form.model,
      description: form.description,
      manufacturer: form.manufacturer,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
      status: form.status,
      images: form.images.filter(url => url.trim() !== ""), // Filtrar URLs vacías
    })
  }

  return (
    <>
      <ScrollArea className="max-h-[60vh] pr-4">
        <form id="product-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pf-code">Código *</Label>
              <Input id="pf-code" value={form.code} onChange={(e) => update("code", e.target.value)} placeholder="Ej: PROD-001 (mín. 1 car.)" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pf-brand">Marca *</Label>
              <Input id="pf-brand" value={form.brand} onChange={(e) => update("brand", e.target.value)} placeholder="Ej: Samsung (mín. 1 car.)" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pf-model">Modelo *</Label>
              <Input id="pf-model" value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="Ej: Galaxy S24 (mín. 1 car.)" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pf-manufacturer">Fabricante *</Label>
              <Input id="pf-manufacturer" value={form.manufacturer} onChange={(e) => update("manufacturer", e.target.value)} placeholder="Ej: Samsung Electronics (mín. 1 car.)" required />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="pf-desc">Descripción *</Label>
            <Textarea id="pf-desc" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pf-price">Precio *</Label>
              <Input id="pf-price" type="number" min={1} step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} required placeholder="Ej: 150000" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pf-stock">Stock *</Label>
              <Input id="pf-stock" type="number" min={0} step="1" value={form.stock} onChange={(e) => update("stock", e.target.value)} required placeholder="Ej: 10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Categoría *</Label>
            <Select value={form.categoryId} onValueChange={(v) => update("categoryId", v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.filter((c: Category) => c.active).map((cat: Category) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Estado *</Label>
            <Select value={form.status} onValueChange={(v) => setForm((prev) => ({ ...prev, status: v as ProductStatus }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="INACTIVE">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sección de Imágenes */}
          <div className="flex flex-col gap-3">
            <Label>Imágenes del Producto</Label>
            
            {/* Lista de imágenes actuales */}
            <div className="grid gap-2">
              {form.images.map((url, index) => (
                <div key={`${index}-${url}`} className="flex items-center gap-2">
                  <Input 
                    value={url} 
                    onChange={(e) => {
                      const newImages = [...form.images]
                      newImages[index] = e.target.value
                      setForm(prev => ({ ...prev, images: newImages }))
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon"
                    onClick={() => {
                      const newImages = form.images.filter((_, i) => i !== index)
                      setForm(prev => ({ ...prev, images: newImages }))
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Botón para agregar nueva imagen */}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2 w-full gap-2 border-dashed"
              onClick={() => setForm(prev => ({ ...prev, images: [...prev.images, ""] }))}
            >
              <Plus className="size-4" />
              Agregar URL de imagen
            </Button>
            
            {form.images.length === 0 && (
              <p className="text-xs text-muted-foreground text-destructive">
                * Se requiere al menos una imagen (puede ser una URL externa).
              </p>
            )}
          </div>
        </form>
      </ScrollArea>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit" form="product-form">
          {product ? "Guardar cambios" : "Crear producto"}
        </Button>
      </DialogFooter>
    </>
  )
}

export function ProductForm({ open, onOpenChange, product, onSave, categories }: ProductFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        </DialogHeader>
        {open && (
          <ProductFormContent
            key={product?.id ?? "new"}
            product={product}
            onSave={onSave}
            onOpenChange={onOpenChange}
            categories={categories}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
