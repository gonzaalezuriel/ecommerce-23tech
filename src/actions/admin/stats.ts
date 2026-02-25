/**
 * Acciones de servidor para estadísticas del dashboard admin.
 * Obtiene métricas generales del sistema y los últimos pedidos.
 */
"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "./_guard"

/**
 * Obtiene las estadísticas del dashboard: totales de productos, categorías,
 * usuarios, ventas del mes actual, y los 10 pedidos más recientes.
 */
export async function getAdminStats() {
  await requireAdmin()

  // Calcular el primer día del mes actual (para filtrar ventas del mes)
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Promise.all = ejecutar todas estas consultas EN PARALELO (al mismo tiempo)
  // En vez de esperar una por una, se ejecutan todas juntas → más rápido
  const [productCount, activeProducts, categoryCount, activeCategories, userCount, activeUsers, orders, monthRevenue] =
    await Promise.all([
      prisma.product.count(),                                   // Total de productos
      prisma.product.count({ where: { status: "ACTIVE" } }),    // Productos activos
      prisma.category.count(),                                  // Total de categorías
      prisma.category.count({ where: { active: true } }),       // Categorías activas
      prisma.user.count(),                                      // Total de usuarios
      prisma.user.count({ where: { active: true } }),           // Usuarios activos
      prisma.order.findMany({                                   // Últimas 10 órdenes
        take: 10,
        orderBy: { date: "desc" },
        include: {
          user: { select: { name: true, lastname: true } },
          items: { select: { quantity: true } },
        },
      }),
      prisma.order.aggregate({                                  // Sumar ventas del mes
        where: { date: { gte: startOfMonth } },                 // gte = "mayor o igual que"
        _sum: { total: true },                                   // _sum = sumar el campo total
      }),
    ])

  // Convertir el total del mes de Decimal a número (si no hay ventas, devuelve 0)
  const totalRevenue = Number(monthRevenue._sum.total ?? 0)

  // Armar el objeto de respuesta con los datos formateados para la UI
  return {
    productCount,
    activeProducts,
    categoryCount,
    activeCategories,
    userCount,
    activeUsers,
    totalRevenue,
    recentOrders: orders.map((o) => ({
      id: o.id,
      userName: `${o.user.name} ${o.user.lastname}`,
      date: o.date.toISOString(),
      total: Number(o.total),
      status: o.status,
      // Sumar todas las cantidades de items para mostrar "X productos" en el dashboard
      itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
    })),
  }
}
