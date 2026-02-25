/**
 * Acciones de servidor para gestión de usuarios (panel admin).
 * ABM completo con encriptación bcrypt, validación de duplicados (email/documento)
 * y limpieza de carritos al dar de baja un usuario.
 *
 * Casos de uso relacionados: CU001, CU002, CU003
 */
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import type { User } from "@/types"
import { adminCreateUserSchema, type AdminCreateUserSchema } from "@/lib/schemas"
import { requireAdmin } from "./_guard"

/** Obtiene todos los usuarios (sin password) para el listado del admin. */
export async function getAdminUsers() {
  await requireAdmin()
  // Traer todos los usuarios pero SIN el campo password (por seguridad)
  // select = "solo traer estos campos", si no se lista un campo, no se trae
  const users = await prisma.user.findMany({
    select: {
      id: true,
      document: true,
      name: true,
      lastname: true,
      email: true,
      address: true,
      phone: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
      // password: NO se incluye por seguridad
    },
    orderBy: { createdAt: "desc" },
  })
  // Convertir null a "" y Date a ISO string para la UI
  return users.map((u) => ({
    ...u,
    address: u.address ?? "",
    phone: u.phone ?? "",
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  })) as User[]
}

/** CU001: Crea un nuevo usuario desde el panel admin. Valida email y documento duplicados, hashea password. */
export async function createAdminUser(data: AdminCreateUserSchema) {
  await requireAdmin()

  // PASO 1: Validar los datos con Zod (email válido, contraseña segura, etc.)
  const validatedFields = adminCreateUserSchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  // PASO 2: Verificar que el email Y el documento no estén en uso
  // OR = buscar si algún usuario ya tiene ESE email o ESE documento
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email! },
        { document: data.document! },
      ],
    },
  })
  if (existing) {
    // Identificar cuál campo está duplicado para mostrar el error correcto
    if (existing.email === data.email) {
      return { error: `El email "${data.email}" ya está registrado en otra cuenta` }
    }
    return { error: `El documento "${data.document}" ya está registrado en otra cuenta` }
  }

  // PASO 3: Encriptar la contraseña y crear el usuario
  const hashedPassword = await bcrypt.hash(data.password, 10)
  await prisma.user.create({
    data: {
      document: data.document!,
      name: data.name!,
      lastname: data.lastname!,
      email: data.email!,
      address: data.address,
      phone: data.phone,
      password: hashedPassword,
      role: data.role || "CLIENT",  // Si no se especifica, es CLIENT
    },
  })
  revalidatePath("/admin/usuarios")
  return { success: true }
}

/**
 * CU002: Modifica un usuario existente desde el panel admin.
 * Valida email duplicado. Si se envía password, lo hashea; sino lo ignora.
 */
export async function updateAdminUser(id: string, data: Partial<User> & { password?: string }) {
  await requireAdmin()

  // PASO 1: Si el password viene vacío (no se quiere cambiar), lo removemos
  // para que Zod no lo valide como contraseña inválida
  const dataToValidate = { ...data }
  if (!dataToValidate.password) delete dataToValidate.password

  // PASO 2: Validar los datos con Zod (validación parcial)
  const validatedFields = adminCreateUserSchema.partial().safeParse(dataToValidate)
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  // PASO 3: Si se cambió el email, verificar que no esté en uso por otra cuenta
  if (data.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing && existing.id !== id) {
      return { error: `El email "${data.email}" ya está registrado en otra cuenta` }
    }
  }

  // PASO 4: Si se envió una nueva contraseña, encriptarla. Si no, dejarla como está.
  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined

  // PASO 5: Actualizar solo los campos que se enviaron
  await prisma.user.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.lastname && { lastname: data.lastname }),
      ...(data.email && { email: data.email }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.role && { role: data.role }),
      ...(hashedPassword && { password: hashedPassword }),
    },
  })
  revalidatePath("/admin/usuarios")
  return { success: true }
}

/**
 * CU003: Activa/Desactiva un usuario (baja lógica).
 * Al desactivar, elimina su carrito de compras pendiente para que no queden items huérfanos.
 */
export async function toggleUserStatus(id: string, currentActive: boolean) {
  await requireAdmin()

  // Si estamos DESACTIVANDO el usuario (pasando de activo a inactivo)
  if (currentActive) {
    // Primero eliminar los items del carrito y después el carrito en sí
    // (hay que borrar los items primero por la relación de clave foránea)
    await prisma.cartItem.deleteMany({ where: { cart: { userId: id } } })
    await prisma.cart.deleteMany({ where: { userId: id } })
  }

  // Invertir el estado del usuario
  await prisma.user.update({
    where: { id },
    data: { active: !currentActive },
  })
  revalidatePath("/admin/usuarios")
  return { success: true }
}
