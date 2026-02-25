export type Role = "ADMIN" | "CLIENT"
export type ProductStatus = "ACTIVE" | "INACTIVE"

export interface SessionUser {
  id: string
  name: string
  lastname: string
  email: string
  role: Role
}

export interface User {
  id: string
  document: string
  name: string
  lastname: string
  email: string
  address?: string
  phone?: string
  password?: string
  role: Role
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  active: boolean
  createdAt: string
  productCount?: number
}

export interface Product {
  id: string
  code: string
  slug: string
  brand: string
  model: string
  description: string
  manufacturer: string
  price: number
  images: string[]
  status: ProductStatus
  stock: number
  categoryId: string
  category?: Category
  createdAt: string
  updatedAt: string
  isNew?: boolean
}

export interface CartItem {
  id: string
  cartId?: string
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  unitPrice: number
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  date: string
  address: string
  phone: string
  status: OrderStatus
}
