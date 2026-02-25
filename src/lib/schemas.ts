/**
 * Esquemas de validación Zod para todas las operaciones del sistema.
 * Centraliza las reglas de validación (frontend + backend):
 * - DNI: 7-8 dígitos numéricos
 * - Password: 8+ caracteres, mayúscula, minúscula y número
 * - Nombre/Apellido: solo letras (incluyendo acentos y ñ), 2-50 caracteres
 * - Producto: precio > 0, stock >= 0, campos obligatorios
 * - Categoría: nombre 2-50 caracteres
 */
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  lastname: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/, "El apellido solo puede contener letras y espacios"),
  document: z
    .string()
    .regex(/^[0-9]{7,8}$/, "El DNI debe tener entre 7 y 8 números"),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "El teléfono debe tener entre 10 y 15 números")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .optional()
    .or(z.literal("")),
  email: z.string().email("El correo electrónico no es válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/(?=.*\d)/, "Debe contener al menos un número")
    .regex(/(?=.*[a-z])/, "Debe contener al menos una minúscula")
    .regex(/(?=.*[A-Z])/, "Debe contener al menos una mayúscula"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const productSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  manufacturer: z.string().min(1, "El fabricante es requerido"),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  images: z.array(z.string().url("URL de imagen inválida")).min(1, "Debe haber al menos una imagen"),
})

export type ProductSchema = z.infer<typeof productSchema>

export const profileUpdateSchema = z.object({
  name: registerSchema.shape.name,
  lastname: registerSchema.shape.lastname,
  email: registerSchema.shape.email,
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "El teléfono debe tener entre 10 y 15 números")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .optional()
    .or(z.literal("")),
})

export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>

export const adminCreateUserSchema = z.object({
  name: registerSchema.shape.name,
  lastname: registerSchema.shape.lastname,
  document: registerSchema.shape.document,
  email: registerSchema.shape.email,
  password: registerSchema.shape.password,
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "El teléfono debe tener entre 10 y 15 números")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .optional()
    .or(z.literal("")),
  role: z.enum(["ADMIN", "CLIENT"]).optional(),
})

export type AdminCreateUserSchema = z.infer<typeof adminCreateUserSchema>

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  description: z.string().optional(),
})

export type CategorySchema = z.infer<typeof categorySchema>

export const checkoutSchema = z.object({
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "El teléfono debe tener entre 10 y 15 números"),
})

export type CheckoutSchema = z.infer<typeof checkoutSchema>

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/(?=.*\d)/, "Debe contener al menos un número")
    .regex(/(?=.*[a-z])/, "Debe contener al menos una minúscula")
    .regex(/(?=.*[A-Z])/, "Debe contener al menos una mayúscula"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmNewPassword"],
})

export type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>
