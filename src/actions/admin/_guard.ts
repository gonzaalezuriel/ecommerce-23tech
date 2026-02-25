/**
 * Guard de autorización para acciones del panel administrativo.
 * Verifica que el usuario tenga sesión activa y rol ADMIN.
 * Todas las acciones admin importan esta función como primera línea de defensa.
 */
"use server"

import { auth } from "@/auth"

/** Lanza error si el usuario no está autenticado o no es ADMIN. */
export async function requireAdmin() {
  // Obtener la sesión actual del usuario
  const session = await auth()
  // Si no hay sesión (no logueado) O si su rol no es ADMIN → acceso denegado
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("No autorizado")
  }
  // Si pasó las dos verificaciones, devolver la sesión para que la función que llamó pueda usarla
  return session
}
