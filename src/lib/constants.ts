/**
 * Constantes globales de la aplicación.
 * Rangos de precios para filtros del catálogo y mapeo de estados de órdenes.
 */
export const PRICE_MIN = 0
export const PRICE_MAX = 3500000

export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: "default" | "secondary" | "outline" | "destructive" }
> = {
  PENDING: { label: "Pendiente", color: "outline" },
  PAID: { label: "Pagado", color: "secondary" },
  SHIPPED: { label: "Enviado", color: "secondary" },
  DELIVERED: { label: "Entregado", color: "default" },
  CANCELLED: { label: "Cancelado", color: "destructive" },
}
