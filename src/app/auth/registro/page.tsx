"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    document: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const { register } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.name || !form.lastname || !form.document || !form.email || !form.password) {
      toast.error("Completá todos los campos obligatorios")
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    startTransition(async () => {
      const success = await register(form)
      if (success) {
        toast.success("¡Cuenta creada! Iniciando sesión...")
        router.push("/")
      }
      // Si falla, auth-context ya muestra el toast con el error correcto del servidor
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>Completá tus datos para registrarte en 23Tech</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre (letras, 2 a 50 car.)"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  pattern="[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,50}"
                  title="Solo letras y espacios, mín. 2 caracteres"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastname">Apellido *</Label>
                <Input
                  id="lastname"
                  placeholder="Tu apellido (letras, 2 a 50 car.)"
                  value={form.lastname}
                  onChange={(e) => update("lastname", e.target.value)}
                  required
                  pattern="[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,50}"
                  title="Solo letras y espacios, mín. 2 caracteres"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="document">Documento *</Label>
              <Input
                id="document"
                placeholder="DNI (7 u 8 números)"
                value={form.document}
                onChange={(e) => update("document", e.target.value)}
                required
                pattern="[0-9]{7,8}"
                maxLength={8}
                title="Entre 7 y 8 números"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  placeholder="Tu dirección (mín. 5 car.)"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  minLength={5}
                  title="Mínimo 5 caracteres"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  type="tel"
                  id="phone"
                  placeholder="Tu teléfono"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  pattern="[0-9]{10,15}"
                  title="Entre 10 y 15 números"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mín. 8 caracteres, Mayús, Minús, Núm"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Mín. 8 caracteres, al menos una mayúscula, una minúscula y un número"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirmar *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repetí la contraseña"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isPending}>
              {isPending ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Iniciá sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
