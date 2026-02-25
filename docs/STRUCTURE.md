# 📁 Estructura del Proyecto — 23Tech E-commerce

## Visión General

23Tech es una aplicación web de e-commerce construida con **Next.js 16 (App Router)** y **TypeScript**. Utiliza una arquitectura de capas que separa claramente la presentación, la lógica de negocio y el acceso a datos.

```
ecommerce-23tech/
├── docs/                          ← Documentación del proyecto
│   ├── STRUCTURE.md               ← Este archivo
│   ├── Archivo_de_Requerimientos.md ← Especificación de casos de uso
│   └── ERD.svg                    ← Diagrama entidad-relación de la DB
│
├── prisma/                        ← Base de datos (Prisma ORM)
│   ├── schema.prisma              ← Definición del modelo de datos
│   ├── migrations/                ← Migraciones SQL versionadas
│   └── seed.ts                    ← Datos iniciales (admin + productos)
│
├── public/                        ← Archivos estáticos (favicon, imágenes)
│
├── src/                           ← Código fuente principal
│   ├── actions/                   ← Server Actions (lógica de negocio)
│   ├── app/                       ← Rutas y páginas (Next.js App Router)
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts   ← Ruta API de NextAuth
│   ├── components/                ← Componentes React reutilizables
│   ├── context/                   ← Contextos globales (React Context)
│   ├── hooks/                     ← Custom hooks (administración de datos)
│   ├── lib/                       ← Utilidades, validaciones, acceso a DB
│   ├── types/                     ← Tipos TypeScript compartidos
│   │   └── next-auth.d.ts         ← Declaraciones de tipos para NextAuth
│   ├── auth.ts                    ← Configuración de NextAuth (Credentials)
│   ├── auth.config.ts             ← Reglas de autorización por ruta
│   └── middleware.ts              ← Middleware de protección de rutas
│
├── .gitignore                     ← Archivos excluidos del repositorio
├── package.json                   ← Dependencias y scripts
├── README.md                      ← Documentación principal
└── tsconfig.json                  ← Configuración TypeScript
```

---

## Capas de la Arquitectura

### 1. Presentación — `src/app/` y `src/components/`

La capa de presentación usa el **App Router de Next.js**, donde cada carpeta dentro de `src/app/` representa una ruta.

#### Rutas Públicas (accesibles sin sesión)

| Ruta               | Archivo                | Descripción                                          |
| ------------------ | ---------------------- | ---------------------------------------------------- |
| `/`                | `app/page.tsx`         | Home: hero, categorías, productos más vendidos       |
| `/catalogo`        | `app/catalogo/`        | Catálogo completo con filtros por categoría y precio |
| `/producto/[slug]` | `app/producto/[slug]/` | Detalle del producto                                 |
| `/busqueda`        | `app/busqueda/`        | Búsqueda por texto con filtros                       |
| `/auth/login`      | `app/auth/login/`      | Inicio de sesión                                     |
| `/auth/registro`   | `app/auth/registro/`   | Registro de nuevo cliente                            |

#### Rutas API

| Ruta                      | Archivo                               | Descripción                               |
| ------------------------- | ------------------------------------- | ----------------------------------------- |
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | Ruta API de NextAuth (manejo de sesiones) |

#### Rutas Protegidas (requieren sesión de cliente)

| Ruta          | Archivo          | Descripción                                      |
| ------------- | ---------------- | ------------------------------------------------ |
| `/carrito`    | `app/carrito/`   | Carrito de compras                               |
| `/historial`  | `app/historial/` | Historial de compras                             |
| `/cuenta`     | `app/cuenta/`    | Perfil y configuración de la cuenta              |
| `/checkout/*` | `app/checkout/`  | Resultado del checkout (success/failure/pending) |

#### Rutas Admin (requieren rol ADMIN)

| Ruta                | Archivo                 | Descripción                |
| ------------------- | ----------------------- | -------------------------- |
| `/admin`            | `app/admin/`            | Dashboard con estadísticas |
| `/admin/usuarios`   | `app/admin/usuarios/`   | ABM de usuarios            |
| `/admin/productos`  | `app/admin/productos/`  | ABM de productos           |
| `/admin/categorias` | `app/admin/categorias/` | ABM de categorías          |
| `/admin/ordenes`    | `app/admin/ordenes/`    | Gestión de órdenes         |

#### Componentes — `src/components/`

| Carpeta    | Contenido                                                 |
| ---------- | --------------------------------------------------------- |
| `admin/`   | Formularios y tablas del panel admin                      |
| `auth/`    | Componentes de login, registro, ruta protegida            |
| `cart/`    | Items del carrito, resumen de compra                      |
| `catalog/` | Cards de productos, filtros, sidebar                      |
| `layout/`  | Header, footer, providers                                 |
| `product/` | Detalle del producto, galería, productos relacionados     |
| `shared/`  | Componentes genéricos reutilizables                       |
| `ui/`      | Componentes base (shadcn/ui): Button, Dialog, Input, etc. |

---

### 2. Lógica de Negocio — `src/actions/`

Todas las operaciones de negocio se implementan como **Server Actions** de Next.js. Cada acción valida datos, verifica permisos y opera sobre la base de datos.

```
src/actions/
├── auth-actions.ts        ← Registro de clientes (CU019)
├── cart-actions.ts        ← Agregar, actualizar, eliminar items del carrito (CU014-CU017)
├── catalog-actions.ts     ← Consultas del catálogo público (filtrado, ordenamiento)
├── order-actions.ts       ← Finalizar compra con transacción atómica (CU018)
├── user-actions.ts        ← Perfil, historial, cambio de contraseña (CU013, CU020)
└── admin/                 ← Acciones protegidas por rol ADMIN
    ├── _guard.ts          ← Guard que verifica sesión + rol ADMIN
    ├── categories.ts      ← ABM categorías (CU004-CU006)
    ├── orders.ts          ← Gestión de órdenes (visualización y cambio de estado)
    ├── products.ts        ← ABM productos (CU007-CU009)
    ├── users.ts           ← ABM usuarios (CU001-CU003)
    └── stats.ts           ← Estadísticas del dashboard
```

**Flujo de una acción típica:**

1. Verificar sesión (`auth()` o `requireAdmin()`)
2. Validar datos con Zod (`schemas.ts`)
3. Verificar reglas de negocio (duplicados, stock, etc.)
4. Operar sobre la DB (Prisma)
5. Revalidar caché (`revalidatePath`)
6. Retornar resultado (`{ success }` o `{ error }`)

---

### 3. Estado del Cliente — `src/context/`

```
src/context/
├── auth-context.tsx        ← Estado global de autenticación (useAuth)
├── cart-context.tsx        ← Estado global del carrito con optimistic updates (useCart)
└── next-auth-provider.tsx  ← Provider de NextAuth (SessionProvider) que envuelve la app
```

- **`AuthContext`**: Envuelve NextAuth para proveer `user`, `role`, `isAuthenticated` y `logout` a toda la app.
- **`CartContext`**: Mantiene el carrito en el cliente, sincroniza con la DB via server actions, y aplica actualizaciones optimistas para UX instantánea.
- **`NextAuthProvider`**: Wrapper del `SessionProvider` de NextAuth, necesario para que los componentes cliente accedan a la sesión.

---

### 4. Acceso a Datos — `src/lib/db/`

Capa de consultas Prisma para lectura pública (catálogo, categorías):

```
src/lib/db/
├── products.ts            ← Consultas de productos (listado, búsqueda, más vendidos)
├── categories.ts          ← Consultas de categorías activas
└── utils.ts               ← Mapeo Prisma → tipos UI (Decimal→number, Date→string)
```

---

### 5. Utilidades y Configuración — `src/lib/`

```
src/lib/
├── prisma.ts              ← Instancia singleton del cliente Prisma
├── schemas.ts             ← Esquemas Zod (validación frontend + backend)
├── constants.ts           ← Constantes globales (rangos de precios, estados)
├── email.ts               ← Envío de emails transaccionales (Resend)
└── utils.ts               ← Funciones utilitarias (cn, toSlug, formatPrice)
```

---

### 6. Custom Hooks — `src/hooks/`

Hooks personalizados que encapsulan la lógica de estado y operaciones CRUD para las pantallas del panel admin:

```
src/hooks/
├── use-admin-categories.ts  ← Estado y operaciones CRUD de categorías
├── use-admin-orders.ts      ← Estado y operaciones de gestión de órdenes
├── use-admin-products.ts    ← Estado y operaciones CRUD de productos
└── use-admin-users.ts       ← Estado y operaciones CRUD de usuarios
```

---

### 7. Tipos TypeScript — `src/types/`

```
src/types/
├── index.ts               ← Tipos compartidos del proyecto (Product, Category, User, etc.)
└── next-auth.d.ts         ← Extensión de tipos de NextAuth (agrega role al User/Session)
```

---

### 8. Autenticación y Seguridad

```
src/auth.ts                ← Config de NextAuth v5 con Credentials provider
src/auth.config.ts         ← Reglas de autorización por ruta
src/middleware.ts           ← Middleware que protege rutas antes de cada request
```

**Estrategia de seguridad:**

- **JWT** para sesiones (sin base de datos para sesiones)
- **bcrypt** para hash de contraseñas
- **Middleware** protege rutas por rol antes de renderizar
- **Server Actions** verifican sesión en cada operación
- **Precios ocultos** para visitantes no autenticados

---

### 9. Modelo de Datos — `prisma/schema.prisma`

| Modelo      | Descripción                                                   |
| ----------- | ------------------------------------------------------------- |
| `User`      | Usuarios del sistema (admin y clientes)                       |
| `Category`  | Categorías de productos                                       |
| `Product`   | Productos del catálogo                                        |
| `Cart`      | Carrito de compras (1:1 con User)                             |
| `CartItem`  | Items del carrito (producto + cantidad)                       |
| `Order`     | Órdenes de compra finalizadas                                 |
| `OrderItem` | Items de una orden (con precio unitario al momento de compra) |

**Enums:** `Role` (ADMIN/CLIENT), `ProductStatus` (ACTIVE/INACTIVE), `OrderStatus` (PENDING/PAID/SHIPPED/DELIVERED/CANCELLED)

> 📊 Ver diagrama completo en [`docs/ERD.svg`](ERD.svg)

---

## Flujo de Datos Resumido

```
[Navegador]
     ↓
[Middleware] → Verifica sesión y rol
     ↓
[App Router] → Renderiza página
     ↓                    ↓
[Server Component]    [Client Component]
  (fetch inicial)       (interacción)
     ↓                    ↓
[lib/db/*]           [Server Actions]
     ↓                    ↓
[Prisma] ←────────── [Prisma]
     ↓
[PostgreSQL (Neon)]
```
