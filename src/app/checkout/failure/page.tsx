"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function CheckoutFailurePage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
        <XCircle className="size-8" />
      </div>
      
      <h1 className="text-3xl font-bold text-foreground">Pago fallido</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Hubo un problema al procesar tu pago.
        No se ha realizado ningún cargo a tu cuenta.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg" variant="default">
          <Link href="/carrito">Volver al carrito</Link>
        </Button>
      </div>
    </div>
  )
}
