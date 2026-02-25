"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export default function CheckoutPendingPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-6">
        <Clock className="size-8" />
      </div>
      
      <h1 className="text-3xl font-bold text-foreground">Pago pendiente</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Tu pago está siendo procesado. Te avisaremos cuando se confirme.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/historial">Ver estado de orden</Link>
        </Button>
      </div>
    </div>
  )
}
