/**
 * Configuración compartida de NextAuth (usado por middleware y auth.ts).
 * Define las rutas protegidas y reglas de autorización:
 * - /admin/* requiere rol ADMIN
 * - /carrito, /historial, /cuenta, /checkout/* requieren sesión activa
 * - Rutas públicas: /, /catalogo, /producto/*, /busqueda, /auth/*
 */
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  // Páginas personalizadas de autenticación (en vez de las por defecto de NextAuth)
  pages: {
    signIn: "/auth/login",       // Si no tiene acceso, redirigir acá
    newUser: "/auth/registro",   // Página de registro
  },
  callbacks: {
    // CALLBACK 1: ¿Está autorizado a entrar a esta ruta?
    // Se ejecuta ANTES de cada request. Decide si el usuario puede pasar o lo redirige.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnAccount = nextUrl.pathname.startsWith("/cuenta")
      const isOnCart = nextUrl.pathname.startsWith("/carrito")
      const isOnHistory = nextUrl.pathname.startsWith("/historial")

      // Rutas /admin/* → solo ADMIN puede entrar
      if (isOnAdmin) {
        if (isLoggedIn && auth.user.role === "ADMIN") return true
        return false // No es admin → redirige a /auth/login
      }

      // Rutas de cliente (/cuenta, /carrito, /historial) → requieren estar logueado
      if (isOnAccount || isOnCart || isOnHistory) {
        // Si es admin, redirigir al panel en lugar de mostrar la pantalla de login
        if (isLoggedIn && auth.user.role === "ADMIN") {
          return Response.redirect(new URL("/admin", nextUrl))
        }
        if (isLoggedIn) return true
        return false  // No logueado → redirige a /auth/login
      }

      // Todo lo demás es público (home, catálogo, producto, búsqueda)
      return true
    },
    // CALLBACK 2: Enriquecer el JWT con datos extra del usuario
    // Cuando el usuario se loguea, NextAuth crea un JWT (token). Acá le agregamos
    // el id, rol y apellido para tenerlos disponibles en toda la app.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.lastname = user.lastname ?? ""
      }
      return token
    },
    // CALLBACK 3: Copiar los datos del JWT al objeto sesión
    // Cuando un componente llama a useSession() o auth(), los datos del JWT
    // se copian acá para que estén disponibles en session.user
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "CLIENT"
        session.user.lastname = token.lastname as string
      }
      return session
    },
  },
  providers: [], // Los proveedores se configuran en auth.ts (Credentials)
} satisfies NextAuthConfig
