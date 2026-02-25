"use client"

import { useEffect, useState } from "react"
import { Package, FolderOpen, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAdminStats } from "@/actions/admin/stats"
import { formatPrice } from "@/lib/utils"

export default function AdminDashboard() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAdminStats>> | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        No se pudieron cargar las estadísticas. Intentá recargar la página.
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const statCards = [
    {
      title: "Productos",
      value: stats.productCount,
      icon: Package,
      description: `${stats.activeProducts} activos`,
    },
    {
      title: "Categorías",
      value: stats.categoryCount,
      icon: FolderOpen,
      description: `${stats.activeCategories} activas`,
    },
    {
      title: "Usuarios",
      value: stats.userCount,
      icon: Users,
      description: `${stats.activeUsers} activos`,
    },
    {
      title: "Ventas del mes",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      description: `${stats.recentOrders.length} pedidos recientes`,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos pedidos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead className="hidden sm:table-cell">Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right hidden md:table-cell">Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No hay pedidos aún
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {order.id.slice(0, 8).toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm hidden sm:table-cell">{order.userName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                      {new Date(order.date).toLocaleDateString("es-AR")}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell className="text-right text-sm hidden md:table-cell">{order.itemCount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
