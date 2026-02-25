/**
 * Acciones de servidor para autenticación de usuarios.
 * Maneja el registro de nuevos clientes con validación de datos,
 * encriptación de contraseña (bcrypt).
 * El auto-login post-registro se maneja del lado del cliente.
 *
 * Caso de uso relacionado: CU019
 */
"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

import { registerSchema } from "@/lib/schemas"

/**
 * CU019: Registra un nuevo cliente en el sistema.
 * Valida datos con Zod, verifica duplicados (email y documento),
 * hashea la contraseña. El auto-login se realiza en el cliente.
 * El perfil se asigna como CLIENT por defecto.
 */
export async function register(data: unknown) {
  // PASO 1: Validar los datos del formulario con Zod (nombre, email, contraseña, etc.)
  // Si algo no cumple las reglas (ej: contraseña sin mayúscula), frena y devuelve el error
  const validatedFields = registerSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { name, lastname, email, password, document, address, phone } = validatedFields.data

  // PASO 2: Verificar que no exista otro usuario con el mismo email O documento
  // OR = "o" → busca si algún usuario ya tiene ESE email o ESE documento
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { document }
      ]
    }
  })

  // Si encontró alguien, identificamos cuál campo está duplicado para mostrar el error correcto
  if (existingUser) {
    if (existingUser.email === email) {
      return { error: "Ya existe una cuenta con ese correo electrónico" }
    }
    return { error: "Ya existe una cuenta con ese documento" }
  }

  // PASO 3: Encriptar la contraseña con bcrypt antes de guardarla
  // El número 10 es el "salt" (rondas de encriptación, más alto = más seguro pero más lento)
  // NUNCA se guarda la contraseña en texto plano en la base de datos
  const hashedPassword = await bcrypt.hash(password, 10)

  // PASO 4: Crear el nuevo usuario en la base de datos
  // Siempre se crea con rol "CLIENT" y activo. El auto-login se hace desde el frontend.
  await prisma.user.create({
    data: {
      name,
      lastname,
      email,
      document,
      password: hashedPassword,
      address: address || undefined,
      phone: phone || undefined,
      role: "CLIENT",
      active: true,
    },
  })

  return { success: true }
}

