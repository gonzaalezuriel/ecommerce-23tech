"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
        <CheckCircle2 className="size-8" />
      </div>
      
      <h1 className="text-3xl font-bold text-foreground">¡Pago Exitoso!</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Tu pago ha sido procesado correctamente.
        Te enviamos un email con los detalles de tu compra.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/historial">Ver mis compras</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/catalogo">Seguir comprando</Link>
        </Button>
      </div>
    </div>
  )
}
