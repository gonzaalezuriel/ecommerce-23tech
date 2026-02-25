"use client"

import { useState, useEffect, Fragment } from "react"
import { CalendarIcon, ChevronDown, ChevronUp, History } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav"
import { getUserOrders } from "@/actions/user-actions"
import { formatPrice } from "@/lib/utils"
import { ORDER_STATUS_MAP } from "@/lib/constants"
import type { Order } from "@/types"

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    getUserOrders().then((data) => {
      setOrders(data as Order[])
      setLoading(false)
    })
  }, [])

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date)
    if (dateFrom && orderDate < dateFrom) return false
    if (dateTo) {
      const endOfDay = new Date(dateTo)
      endOfDay.setHours(23, 59, 59, 999)
      if (orderDate > endOfDay) return false
    }
    return true
  })

  function toggleExpand(orderId: string) {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId))
  }

  function clearDates() {
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-12">
      <BreadcrumbNav items={[{ label: "Inicio", href: "/" }, { label: "Historial de compras" }]} />

      <div className="mt-6 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <History className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Historial de compras</h1>
      </div>

      {/* Date filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="size-4" />
              {dateFrom ? dateFrom.toLocaleDateString("es-AR") : "Desde"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="size-4" />
              {dateTo ? dateTo.toLocaleDateString("es-AR") : "Hasta"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
          </PopoverContent>
        </Popover>

        {(dateFrom || dateTo) && (
          <Button variant="ghost" size="sm" onClick={clearDates}>
            Limpiar
          </Button>
        )}
      </div>

      {/* Orders table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Cargando historial...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No se encontraron compras en el rango seleccionado
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <Fragment key={order.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => toggleExpand(order.id)}
                  >
                    <TableCell>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {order.id.slice(0, 8).toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.date).toLocaleDateString("es-AR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ORDER_STATUS_MAP[order.status]?.color ?? "outline"} className="text-xs">
                        {ORDER_STATUS_MAP[order.status]?.label ?? order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </TableCell>
                  </TableRow>

                  {/* Expanded detail */}
                  {expandedOrder === order.id && (
                    <TableRow key={`${order.id}-detail`}>
                      <TableCell colSpan={6} className="bg-accent/30 p-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-xs text-muted-foreground">
                            Dirección: {order.address} | Tel: {order.phone}
                          </p>
                          <div className="mt-2 overflow-x-auto rounded border border-border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Producto</TableHead>
                                  <TableHead className="text-center">Cant.</TableHead>
                                  <TableHead className="text-right">P. Unitario</TableHead>
                                  <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell className="text-sm">
                                      <div className="flex items-center gap-3">
                                        <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                                          {item.product.images?.[0] ? (
                                            <Image
                                              src={item.product.images[0]}
                                              alt={`${item.product.brand} ${item.product.model}`}
                                              fill
                                              className="object-cover"
                                            />
                                          ) : (
                                            <span className="text-xs font-bold text-muted-foreground/30">
                                              {item.product.brand.charAt(0)}
                                            </span>
                                          )}
                                        </div>
                                        <span>
                                          {item.product.brand} {item.product.model}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                      {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                      {formatPrice(item.unitPrice)}
                                    </TableCell>
                                    <TableCell className="text-right text-sm font-medium">
                                      {formatPrice(item.unitPrice * item.quantity)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
