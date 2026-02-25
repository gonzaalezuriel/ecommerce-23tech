"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, XCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { ProductForm } from "@/components/admin/product-form"
import { useAdminProducts } from "@/hooks/use-admin-products"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types"
import type { ProductSchema } from "@/lib/schemas"

export default function AdminProductsPage() {
  const { products, categories, createProduct, updateProduct, toggleProduct } = useAdminProducts()
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productToToggle, setProductToToggle] = useState<Product | null>(null)
  const [pendingSaveData, setPendingSaveData] = useState<ProductSchema | null>(null)
  const [isPending, startTransition] = useTransition()

  function getCategoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.name || "—"
  }

  const columns: Column<Product>[] = [
    { key: "code", header: "Código", className: "hidden lg:table-cell", render: (p) => <span className="font-mono text-xs">{p.code}</span> },
    { key: "brand", header: "Marca", render: (p) => <span className="text-sm">{p.brand}</span> },
    { key: "model", header: "Modelo", render: (p) => <span className="text-sm font-medium">{p.model}</span> },
    {
      key: "category",
      header: "Categoría",
      className: "hidden md:table-cell",
      render: (p) => <Badge variant="secondary" className="text-xs">{getCategoryName(p.categoryId)}</Badge>,
    },
    {
      key: "price",
      header: "Precio",
      render: (p) => <span className="text-sm font-semibold text-primary">{formatPrice(p.price)}</span>,
      className: "text-right",
    },
    {
      key: "stock",
      header: "Stock",
      render: (p) => (
        <span className={`text-sm ${p.stock === 0 ? "text-destructive" : p.stock <= 5 ? "text-yellow-500" : ""}`}>
          {p.stock}
        </span>
      ),
      className: "text-center hidden sm:table-cell",
    },
    {
      key: "status",
      header: "Estado",
      render: (p) => (
        <Badge variant={p.status === "ACTIVE" ? "outline" : "destructive"} className="text-xs">
          {p.status === "ACTIVE" ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
  ]

  function handleNew() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  function handleSave(data: ProductSchema) {
    setFormOpen(false)
    setPendingSaveData(data)
  }

  function confirmSave() {
    if (!pendingSaveData) return
    const data = pendingSaveData
    setPendingSaveData(null)
    startTransition(async () => {
      const result = editingProduct
        ? await updateProduct(editingProduct.id, data)
        : await createProduct(data)
      if (result.error) {
        toast.error(result.error)
        setFormOpen(true)
        return
      }
      setEditingProduct(null)
      toast.success(editingProduct ? "Producto actualizado" : "Producto creado")
    })
  }

  function handleToggle() {
    if (!productToToggle) return
    startTransition(async () => {
      const result = await toggleProduct(productToToggle.id, productToToggle.status)
      if (result.success) {
        toast.success(productToToggle.status === "ACTIVE" ? "Producto desactivado" : "Producto reactivado")
      }
      setProductToToggle(null)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Productos</h1>
        <Button onClick={handleNew} className="gap-2 self-start sm:self-auto">
          <Plus className="size-4" />
          Nuevo Producto
        </Button>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Buscar por código, marca o modelo..."
        searchFilter={(product, q) => {
          const query = q.toLowerCase()
          return (
            product.code.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.model.toLowerCase().includes(query)
          )
        }}
        actions={(product) => (
          <>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEdit(product)} disabled={isPending}>
              <Pencil className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setProductToToggle(product)} disabled={isPending}>
              {product.status === "ACTIVE" ? (
                <XCircle className="size-4 text-destructive" />
              ) : (
                <CheckCircle className="size-4 text-success" />
              )}
            </Button>
          </>
        )}
      />

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSave={handleSave}
        categories={categories}
      />

      <ConfirmDialog
        open={!!productToToggle}
        onOpenChange={(open) => !open && setProductToToggle(null)}
        title={productToToggle?.status === "ACTIVE" ? "Desactivar producto" : "Reactivar producto"}
        description={
          productToToggle?.status === "ACTIVE"
            ? `¿Estás seguro de desactivar "${productToToggle?.brand} ${productToToggle?.model}"?`
            : `¿Querés reactivar "${productToToggle?.brand} ${productToToggle?.model}"?`
        }
        onConfirm={handleToggle}
        variant={productToToggle?.status === "ACTIVE" ? "destructive" : "default"}
        confirmText={productToToggle?.status === "ACTIVE" ? "Desactivar" : "Reactivar"}
      />

      <ConfirmDialog
        open={!!pendingSaveData}
        onOpenChange={(open) => {
          if (!open) {
            setPendingSaveData(null)
          }
        }}
        title={editingProduct ? "Confirmar modificación" : "Confirmar creación"}
        description={
          editingProduct
            ? `¿Estás seguro de guardar los cambios del producto "${editingProduct.brand} ${editingProduct.model}"?`
            : "¿Estás seguro de crear este nuevo producto?"
        }
        onConfirm={confirmSave}
        onCancel={() => setFormOpen(true)}
        confirmText={editingProduct ? "Guardar cambios" : "Crear producto"}
      />
    </div>
  )
}
