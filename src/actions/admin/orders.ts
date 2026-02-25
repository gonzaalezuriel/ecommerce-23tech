/**
 * Acciones de servidor para gestión de órdenes (panel admin).
 * Permite ver todas las órdenes y cambiar su estado (PENDIENTE → PAGADO → ENVIADO → etc.)
 * Todas las funciones verifican que el usuario sea ADMIN antes de ejecutarse.
 */
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { OrderStatus } from "@/types"
import { requireAdmin } from "./_guard"

/** Obtiene todas las órdenes con datos del usuario e items para el panel admin. */
export async function getAdminOrders() {
  // Verificar que sea admin (si no lo es, lanza error)
  await requireAdmin()

  // Traer todas las órdenes, de la más reciente a la más antigua
  // include = incluir datos del usuario (nombre, email) y los items del pedido
  const orders = await prisma.order.findMany({
    orderBy: { date: "desc" },
    include: {
      user: { select: { name: true, lastname: true, email: true } },
      items: {
        include: { product: true },
      },
    },
  })

  // Transformar los datos de Prisma a un formato más simple para la UI
  return orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    userName: `${order.user.name} ${order.user.lastname}`,
    userEmail: order.user.email,
    date: order.date.toISOString(),
    total: Number(order.total),
    status: order.status,
    address: order.address,
    phone: order.phone,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      productName: `${item.product.brand} ${item.product.model}`,
    })),
  }))
}

/** Actualiza el estado de un pedido (ej: de PENDIENTE a PAGADO, de PAGADO a ENVIADO). */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin()

  // Actualizar el campo status de la orden indicada
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  })

  // Invalidar las páginas que muestran órdenes para que se recarguen con el nuevo estado
  revalidatePath("/admin")
  revalidatePath("/historial")
  revalidatePath("/admin/ordenes")
  return { success: true }
}
