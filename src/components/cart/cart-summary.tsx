import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

interface CartSummaryProps {
  itemCount: number
  total: number
  onCheckout?: () => void
}

export function CartSummary({ itemCount, total, onCheckout }: CartSummaryProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-lg font-semibold text-foreground">Resumen del pedido</h3>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Productos ({itemCount})</span>
          <span className="text-foreground">{formatPrice(total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Envío</span>
          <span className="text-success text-sm">Gratis</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary">{formatPrice(total)}</span>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button size="lg" className="w-full font-semibold" onClick={onCheckout}>
          Finalizar compra
        </Button>
        <Button variant="outline" size="lg" className="w-full" asChild>
          <Link href="/">Seguir comprando</Link>
        </Button>
      </div>
    </div>
  )
}
