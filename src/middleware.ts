/**
 * Middleware de Next.js para protección de rutas.
 * Se ejecuta ANTES de cada petición del usuario.
 *
 * ¿Qué hace?
 * Evalúa las reglas definidas en auth.config.ts (callback "authorized")
 * y decide si el usuario puede acceder a la ruta solicitada.
 * Si no tiene permiso, lo redirige automáticamente a /auth/login.
 */
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Exportar la función auth del middleware (NextAuth se encarga de todo)
export default NextAuth(authConfig).auth

// Configuración del matcher: define a QUÉ rutas se aplica el middleware.
// Este patrón excluye: archivos de la API, archivos estáticos (_next/static),
// imágenes optimizadas (_next/image) y archivos .png.
// El resto de rutas SÍ pasan por el middleware.
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
