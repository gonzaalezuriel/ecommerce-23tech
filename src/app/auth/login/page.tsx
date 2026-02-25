"use client"

import { useState, useTransition, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPending, startTransition] = useTransition()
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Completá todos los campos")
      return
    }

    startTransition(async () => {
      const success = await login(email, password)
      if (success) {
        toast.success("Inicio de sesión exitoso")
        
        // Obtenemos la sesión en tiempo real para ver el rol
        const session = await getSession()
        
        // Si el callback es admin pero el usuario es cliente, lo mandamos al home o a cuenta
        if (callbackUrl.includes("/admin") && session?.user?.role === "CLIENT") {
          router.push("/")
        } 
        // A la inversa: si el callback es una página de cliente exclusiva y entra un Admin, lo mandamos a su panel
        else if (
          (callbackUrl.includes("/cuenta") || callbackUrl.includes("/historial") || callbackUrl.includes("/carrito")) 
          && session?.user?.role === "ADMIN"
        ) {
          router.push("/admin")
        } 
        else {
          router.push(callbackUrl)
        }
      } else {
        toast.error("Email o contraseña incorrectos")
      }
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>Ingresá tus datos para acceder a tu cuenta</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isPending}>
              {isPending ? "Ingresando..." : "Iniciar sesión"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿No tenés cuenta?{" "}
              <Link href="/auth/registro" className="text-primary hover:underline">
                Registrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
