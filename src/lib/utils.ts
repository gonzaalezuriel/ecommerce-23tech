/**
 * Funciones utilitarias generales de la aplicación.
 * Incluye utilidades para CSS (cn), generación de slugs y formato de precios.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combina clases CSS con soporte para condicionales y merge de Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un slug URL-friendly a partir de un texto.
 * Normaliza acentos (NFD), elimina diacríticos y reemplaza espacios por guiones.
 * Ej: "Periféricos Gaming" → "perifericos-gaming"
 */

export function toSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price)
}
