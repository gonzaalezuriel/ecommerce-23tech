import { formatPrice, cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  isAuthenticated?: boolean
  className?: string
}

export function PriceDisplay({ price, isAuthenticated = true, className }: PriceDisplayProps) {
  if (!isAuthenticated) {
    return (
      <span className="text-sm text-muted-foreground italic">
        Iniciá sesión para ver el precio
      </span>
    )
  }

  return (
    <span className={cn("text-primary font-bold", className)}>
      {formatPrice(price)}
    </span>
  )
}
