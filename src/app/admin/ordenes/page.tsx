"use client"

import { useState } from "react"

import { formatPrice } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAdminOrders } from "@/hooks/use-admin-orders"
import { ORDER_STATUS_MAP } from "@/lib/constants"
import type { OrderStatus } from "@/types"

export default function AdminOrdersPage() {
  const { orders, isLoading, updateStatus } = useAdminOrders()
  const [statusToUpdate, setStatusToUpdate] = useState<{ id: string; status: OrderStatus } | null>(null)

  function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setStatusToUpdate({ id: orderId, status: newStatus })
  }

  async function confirmStatusChange() {
    if (!statusToUpdate) return
    try {
      const result = await updateStatus(statusToUpdate.id, statusToUpdate.status)
      if (result.success) {
        toast.success("Estado actualizado")
      } else {
        toast.error("No se pudo actualizar el estado")
      }
    } catch {
      toast.error("Error de servidor")
    } finally {
      setStatusToUpdate(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Gestión de Órdenes</h1>
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead className="hidden sm:table-cell">Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Cargando...
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No hay órdenes registradas.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    {order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.userName}</span>
                      <span className="text-xs text-muted-foreground">{order.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {new Date(order.date).toLocaleDateString("es-AR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ORDER_STATUS_MAP[order.status]?.color || "outline"}>
                      {ORDER_STATUS_MAP[order.status]?.label || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "PENDING")}>
                          Marcar como Pendiente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "PAID")}>
                          Marcar como Pagado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "SHIPPED")}>
                          Marcar como Enviado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "DELIVERED")}>
                          Marcar como Entregado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "CANCELLED")} className="text-destructive">
                          Cancelar Orden
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!statusToUpdate}
        onOpenChange={(open) => !open && setStatusToUpdate(null)}
        title="Actualizar estado de orden"
        description={
          statusToUpdate
            ? `¿Estás seguro de cambiar el estado de la orden a "${ORDER_STATUS_MAP[statusToUpdate.status]?.label || statusToUpdate.status}"?`
            : "¿Estás seguro de realizar este cambio?"
        }
        onConfirm={confirmStatusChange}
        confirmText="Actualizar"
      />
    </div>
  )
}
