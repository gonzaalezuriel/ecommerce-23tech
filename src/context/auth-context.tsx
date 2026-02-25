/**
 * Contexto global de autenticación.
 * Provee estado de sesión (usuario, rol, isAuthenticated) y acciones
 * (login, logout) a todos los componentes de la app via useAuth().
 * Envuelve NextAuth/next-auth y centraliza la lógica de sesión.
 */
"use client"

import { createContext, useContext } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { toast } from "sonner"
import type { SessionUser } from "@/types"
import { register as registerAction } from "@/actions/auth-actions"

interface RegisterData {
  name: string
  lastname: string
  document: string
  email: string
  address: string
  phone: string
  password: string
}

interface AuthContextType {
  user: SessionUser | null
  role: "ADMIN" | "CLIENT" | "GUEST"
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // useSession() viene de NextAuth y nos da la sesión actual
  // status puede ser: "loading" (cargando), "authenticated" (logueado), "unauthenticated" (no logueado)
  const { data: session, status } = useSession()

  // Armar el objeto "user" con los datos de la sesión (o null si no hay sesión)
  const user: SessionUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: session.user.role as "ADMIN" | "CLIENT",
        lastname: session.user.lastname ?? "",
      }
    : null

  const isAuthenticated = status === "authenticated"
  // Si no hay usuario, el rol es "GUEST" (visitante)
  const role = (user?.role ?? "GUEST") as "ADMIN" | "CLIENT" | "GUEST"

  // LOGIN: Intenta iniciar sesión con email y contraseña
  // redirect: false = no redirigir automáticamente (lo manejamos nosotros)
  // Devuelve true si fue exitoso, false si falló
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      return !result?.error
    } catch {
      return false
    }
  }

  // REGISTRO: Primero registra al usuario en la DB, después hace auto-login
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // 1. Llamar a la server action que crea el usuario en la DB
      const result = await registerAction(data)
      if (result?.error) {
        toast.error(result.error)
        return false
      }

      // 2. Si se creó exitosamente, hacer login automáticamente
      //    para que el usuario no tenga que llenar el formulario de login otra vez
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (signInResult?.error) {
        toast.error("Cuenta creada, pero hubo un error al iniciar sesión. Intentá iniciar sesión manualmente.")
        return false
      }

      return true
    } catch {
      toast.error("Error al registrarse")
      return false
    }
  }

  // LOGOUT: Cierra la sesión y redirige al inicio
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        logout: handleLogout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
