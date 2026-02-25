/**
 * Acciones de servidor para gestión del perfil del usuario autenticado.
 * Maneja consulta de órdenes, perfil, actualización de datos y cambio de contraseña.
 *
 * Casos de uso relacionados: CU013, CU020
 */
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { toUIProduct } from "@/lib/db/utils"
import { profileUpdateSchema, passwordUpdateSchema } from "@/lib/schemas"

/** CU013: Obtiene el historial de compras del usuario autenticado. */
export async function getUserOrders() {
  // Verificar que el usuario esté logueado, si no devuelve lista vacía
  const session = await auth()
  if (!session?.user?.id) return []

  // Obtener todas las órdenes del usuario, ordenadas de más reciente a más antigua
  // include = incluir los items de cada orden, y de cada item, el producto con su categoría
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: { category: true }
          }
        }
      }
    },
    orderBy: { date: "desc" }
  })

  // Convertir los datos de Prisma (Decimal, Date) a tipos que el navegador pueda leer
  return orders.map(order => ({
    id: order.id,
    userId: order.userId,
    total: Number(order.total),       // Decimal → número
    date: order.date.toISOString(),   // Date → texto ISO
    address: order.address,
    phone: order.phone,
    status: order.status,
    items: order.items.map(item => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      product: toUIProduct(item.product)
    }))
  }))
}

/** CU020: Obtiene los datos del perfil (sin password) del usuario autenticado. */
export async function getUserProfile() {
  // Verificar sesión. Si no está logueado, devuelve null
  const session = await auth()
  if (!session?.user?.id) return null

  // Buscar al usuario por ID. select = "solo traer estos campos" (excluye password por seguridad)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      lastname: true,
      email: true,
      document: true,
      address: true,
      phone: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  if (!user) return null

  // Convertir valores: null → "" (para que los inputs del formulario no se quejen)
  // y Date → ISO string (para que el navegador pueda leerlo)
  return {
    ...user,
    address: user.address ?? "",
    phone: user.phone ?? "",
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

/**
 * CU020: Actualiza los datos personales del usuario.
 * Valida con Zod y verifica que el email no esté en uso por otra cuenta.
 */
export async function updateUserInfo(data: {
  name: string
  lastname: string
  email: string
  address: string
  phone: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  // PASO 1: Validar los datos con Zod (formato de email, largo de nombre, etc.)
  const validatedFields = profileUpdateSchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  // PASO 2: Si cambió el email, verificar que no esté en uso por OTRA cuenta
  if (data.email !== session.user.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    })
    if (existing && existing.id !== session.user.id) {
      return { error: "Ese email ya está registrado en otra cuenta" }
    }
  }

  // PASO 3: Actualizar los datos del usuario en la base de datos
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      address: data.address,
      phone: data.phone,
    },
  })

  return { success: true }
}

/**
 * CU020: Cambia la contraseña del usuario.
 * Verifica la contraseña actual, valida que la nueva sea diferente
 * a la anterior, y la hashea con bcrypt antes de guardar.
 */
export async function changeUserPassword(data: {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  // PASO 1: Validar formato de las contraseñas con Zod
  const validatedFields = passwordUpdateSchema.safeParse(data)
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  // PASO 2: Obtener la contraseña actual del usuario de la DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },  // Solo traer el campo password
  })

  if (!user || !user.password) {
    return { error: "Usuario no encontrado" }
  }

  // PASO 3: Verificar que la contraseña actual ingresada sea correcta
  // bcrypt.compare compara la contraseña en texto plano con la versión encriptada
  const passwordsMatch = await bcrypt.compare(data.currentPassword, user.password)
  if (!passwordsMatch) {
    return { error: "La contraseña actual es incorrecta" }
  }

  // PASO 4: Verificar que la nueva contraseña sea diferente a la actual
  const isSamePassword = await bcrypt.compare(data.newPassword, user.password)
  if (isSamePassword) {
    return { error: "La nueva contraseña no puede ser igual a la actual" }
  }

  // PASO 5: Encriptar la nueva contraseña y guardarla en la DB
  const hashedPassword = await bcrypt.hash(data.newPassword, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  return { success: true }
}
