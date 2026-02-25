# 🛒 23Tech — E-commerce de Tecnología

**23Tech** es una aplicación web de comercio electrónico especializada en productos de tecnología gaming y alto rendimiento. Desarrollada con **Next.js 16**, **TypeScript**, **Prisma** y **PostgreSQL**.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Variables de Entorno](#-variables-de-entorno)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Modelo de Datos](#-modelo-de-datos)
- [Funcionalidades](#-funcionalidades)
- [Casos de Uso Implementados](#-casos-de-uso-implementados)
- [Requisitos No Funcionales](#-requisitos-no-funcionales)
- [Validaciones de Datos](#-validaciones-de-datos)
- [Rutas de la Aplicación](#-rutas-de-la-aplicación)
- [Seguridad](#-seguridad)

---

## 🧰 Stack Tecnológico

| Categoría          | Tecnología                                                               | Versión       |
| ------------------ | ------------------------------------------------------------------------ | ------------- |
| **Framework**      | [Next.js](https://nextjs.org/) (App Router)                              | 16.1.6        |
| **Lenguaje**       | [TypeScript](https://www.typescriptlang.org/)                            | 5.x           |
| **Base de Datos**  | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) | —             |
| **ORM**            | [Prisma](https://www.prisma.io/)                                         | 5.10.2        |
| **Autenticación**  | [NextAuth v5](https://authjs.dev/) (JWT + Credentials)                   | 5.0.0-beta.30 |
| **UI**             | [React](https://react.dev/) + [shadcn/ui](https://ui.shadcn.com/)        | 19.2.3        |
| **Estilos**        | [Tailwind CSS](https://tailwindcss.com/)                                 | 4.x           |
| **Validación**     | [Zod](https://zod.dev/)                                                  | 4.x           |
| **Formularios**    | [React Hook Form](https://react-hook-form.com/)                          | 7.x           |
| **Notificaciones** | [Sonner](https://sonner.emilkowal.ski/)                                  | 2.x           |
| **Iconos**         | [Lucide React](https://lucide.dev/)                                      | 0.563.0       |
| **Emails**         | [Resend](https://resend.com/) (opcional)                                 | 6.x           |
| **Encriptación**   | [bcryptjs](https://www.npmjs.com/package/bcryptjs)                       | 3.x           |

---

## 📦 Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **PostgreSQL** (local o servicio cloud como [Neon](https://neon.tech/), [Supabase](https://supabase.com/), etc.)

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/gonzaalezuriel/ecommerce-23tech.git
cd ecommerce-23tech
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las variables necesarias. Ver la sección [Variables de Entorno](#-variables-de-entorno) para más detalles.

### 4. Configurar la base de datos

```bash
# Generar el cliente Prisma
npx prisma generate

# Ejecutar las migraciones
npx prisma migrate deploy

# Poblar la base de datos con datos iniciales
npx prisma db seed
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en **http://localhost:3000**

---

## 📜 Scripts Disponibles

| Script      | Comando                  | Descripción                                              |
| ----------- | ------------------------ | -------------------------------------------------------- |
| **dev**     | `npm run dev`            | Inicia el servidor de desarrollo con hot reload          |
| **build**   | `npm run build`          | Compila la aplicación para producción                    |
| **start**   | `npm start`              | Inicia el servidor de producción (requiere build previo) |
| **lint**    | `npm run lint`           | Ejecuta ESLint sobre el proyecto                         |
| **seed**    | `npx prisma db seed`     | Pobla la DB con datos iniciales (admin + productos)      |
| **migrate** | `npx prisma migrate dev` | Crea y aplica nuevas migraciones                         |
| **studio**  | `npx prisma studio`      | Abre el explorador visual de la base de datos            |

---

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

| Variable              | Requerida | Descripción                                                                                          |
| --------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`        | ✅ Sí     | URL de conexión a PostgreSQL                                                                         |
| `AUTH_SECRET`         | ✅ Sí     | Secreto para firmar los tokens JWT de NextAuth. Generar con `openssl rand -base64 32`                |
| `NEXT_PUBLIC_APP_URL` | ✅ Sí     | URL base de la aplicación (ej: `http://localhost:3000`)                                              |
| `RESEND_API_KEY`      | ❌ No     | API key de Resend para emails de confirmación. Si no se configura, los emails fallan silenciosamente |

---

## 🔑 Usuario Administrador

Al ejecutar el seed (`npx prisma db seed`), se crea un usuario administrador con rol ADMIN.

Las credenciales del admin se configuran directamente en el archivo `prisma/seed.ts`, el cual está excluido de Git (`.gitignore`) por seguridad.

> ⚠️ Antes de ejecutar el seed, revisar y personalizar los datos del admin en `prisma/seed.ts`.

---

## 📁 Estructura del Proyecto

```
ecommerce-23tech/
├── docs/                   ← Documentación (estructura, requisitos, ERD)
├── prisma/                 ← Esquema de datos, migraciones y seed
├── public/                 ← Archivos estáticos
├── src/
│   ├── actions/            ← Server Actions (lógica de negocio)
│   │   └── admin/          ← Acciones del panel admin (protegidas)
│   ├── app/                ← Rutas y páginas (Next.js App Router)
│   ├── components/         ← Componentes React reutilizables
│   ├── context/            ← Contextos globales (auth, carrito)
│   ├── hooks/              ← Custom hooks
│   ├── lib/                ← Utilidades, validaciones, DB queries
│   ├── types/              ← Tipos TypeScript compartidos
│   ├── auth.ts             ← Configuración de NextAuth
│   ├── auth.config.ts      ← Reglas de autorización por ruta
│   └── middleware.ts       ← Middleware de protección de rutas
├── .gitignore              ← Archivos excluidos del repositorio
└── README.md               ← Este archivo
```

> 📖 Para una descripción detallada de cada capa, archivo y flujo de datos, ver [`docs/STRUCTURE.md`](docs/STRUCTURE.md).

---

## 🗃️ Modelo de Datos

La base de datos utiliza **PostgreSQL** con el ORM **Prisma**. El esquema define 7 modelos y 3 enums:

| Modelo      | Descripción                                               | Relaciones principales                      |
| ----------- | --------------------------------------------------------- | ------------------------------------------- |
| `User`      | Usuarios del sistema (admin y clientes)                   | → Cart (1:1), → Orders (1:N)                |
| `Category`  | Categorías de productos                                   | → Products (1:N)                            |
| `Product`   | Productos del catálogo                                    | → Category (N:1), → CartItems, → OrderItems |
| `Cart`      | Carrito de compras por usuario                            | → User (1:1), → CartItems (1:N)             |
| `CartItem`  | Ítem dentro de un carrito                                 | → Cart (N:1), → Product (N:1)               |
| `Order`     | Orden de compra finalizada                                | → User (N:1), → OrderItems (1:N)            |
| `OrderItem` | Ítem de una orden (precio congelado al momento de compra) | → Order (N:1), → Product (N:1)              |

**Enums:**

- `Role`: `ADMIN` | `CLIENT`
- `ProductStatus`: `ACTIVE` | `INACTIVE`
- `OrderStatus`: `PENDING` | `PAID` | `SHIPPED` | `DELIVERED` | `CANCELLED`

> 📊 Ver el diagrama entidad-relación completo en [`docs/ERD.svg`](docs/ERD.svg).

---

## ✨ Funcionalidades

### Tienda Pública

- 🏠 **Página de inicio** con hero, categorías y productos más vendidos
- 📦 **Catálogo** con filtros por categoría y rango de precios
- 🔍 **Búsqueda** de productos por marca, modelo o descripción
- 📄 **Detalle del producto** con galería de imágenes y productos relacionados
- 🔒 **Precios ocultos** para visitantes (solo visibles al autenticarse)

### Cliente Autenticado

- 🛒 **Carrito de compras** persistente con actualizaciones optimistas
- 🛍️ **Finalización de compra** con validación de stock en tiempo real
- 📧 **Email de confirmación** automático al completar la compra
- 📋 **Historial de compras** con filtro por fechas
- ⚙️ **Configuración de cuenta** (datos personales y cambio de contraseña)
- 📝 **Registro** accesible desde cualquier página

### Panel de Administración

- 📊 **Dashboard** con estadísticas en tiempo real (productos, usuarios, ventas, últimos pedidos)
- 👥 **Gestión de usuarios** — Alta, edición, baja lógica
- 📦 **Gestión de productos** — Alta con validación de duplicados, edición, activar/desactivar
- 📂 **Gestión de categorías** — Alta, edición, baja lógica (protegida si tiene productos)
- 📋 **Gestión de órdenes** — Visualización y cambio de estado

---

## 📌 Casos de Uso Implementados

El sistema implementa los 20 casos de uso (CU001-CU020) especificados en los requerimientos funcionales, incluyendo todos los cursos normales y alternativos.

### RF01 — Administrar Usuarios

| CU    | Nombre            | Descripción                                            |
| ----- | ----------------- | ------------------------------------------------------ |
| CU001 | Alta de Usuario   | Admin crea un usuario validando email y DNI duplicados |
| CU002 | Modificar Usuario | Admin edita datos con validación de email duplicado    |
| CU003 | Baja de Usuario   | Baja lógica + eliminación de carrito pendiente         |

### RF02 — Administrar Productos

| CU    | Nombre             | Descripción                                            |
| ----- | ------------------ | ------------------------------------------------------ |
| CU007 | Alta de Producto   | Validación de duplicado marca+modelo, slug automático  |
| CU008 | Eliminar Producto  | Baja lógica + eliminación de carritos con ese producto |
| CU009 | Modificar Producto | Validación de duplicado excluyendo el propio           |

### RF03 — Administrar Categorías

| CU    | Nombre              | Descripción                                         |
| ----- | ------------------- | --------------------------------------------------- |
| CU004 | Alta de Categoría   | Validación de nombre duplicado, slug automático     |
| CU005 | Eliminar Categoría  | Baja lógica protegida si tiene productos asociados  |
| CU006 | Modificar Categoría | Validación de nombre duplicado excluyendo la propia |

### RF04 — Visualización de Catálogos

| CU    | Nombre              | Descripción                                                                 |
| ----- | ------------------- | --------------------------------------------------------------------------- |
| CU012 | Visualizar Catálogo | Home con más vendidos, catálogo con filtros, precios solo para autenticados |

### RF05 — Manejar Carrito de Compras

| CU    | Nombre             | Descripción                                                    |
| ----- | ------------------ | -------------------------------------------------------------- |
| CU014 | Agregar al Carrito | Valida stock, acumula cantidad si ya existe                    |
| CU016 | Visualizar Carrito | Verifica stock, elimina items inválidos, notifica cambios      |
| CU017 | Eliminar ítem      | Elimina producto del carrito con confirmación                  |
| CU018 | Finalizar Compra   | Transacción atómica: decrementa stock, crea orden, envía email |

### RF06 — Historial de Compras

| CU    | Nombre              | Descripción                                     |
| ----- | ------------------- | ----------------------------------------------- |
| CU013 | Consultar Historial | Lista de compras con filtro por rango de fechas |

### RF07 — Búsqueda de Productos

| CU    | Nombre          | Descripción                                                 |
| ----- | --------------- | ----------------------------------------------------------- |
| CU015 | Buscar Producto | Búsqueda por texto (marca, modelo, descripción) con filtros |

### RF08 — Registro de Cliente

| CU    | Nombre            | Descripción                                        |
| ----- | ----------------- | -------------------------------------------------- |
| CU019 | Registrar Cliente | Registro con validaciones completas y auto-login   |
| CU020 | Actualizar Cuenta | Edición de datos personales y cambio de contraseña |

> 📄 Ver la especificación completa de cada caso de uso en [`docs/Archivo_de_Requerimientos.md`](docs/Archivo_de_Requerimientos.md).

---

## 🔧 Requisitos No Funcionales

Todos los RNFs especificados están implementados:

| RNF                                 | Implementación                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Manejo de sesiones**              | NextAuth v5 con estrategia JWT. Cada usuario tiene un carrito persistente asociado a su sesión |
| **Contraseñas encriptadas**         | `bcrypt.hash()` con salt de 10 rondas. Las contraseñas nunca se exponen al cliente             |
| **Precios solo autenticados**       | Los precios se ocultan condicionalmente en el catálogo y detalle del producto                  |
| **Menú y carrito accesibles**       | El header con navegación y badge del carrito está presente en todas las páginas                |
| **Logout desde cualquier página**   | El botón de cerrar sesión está en el dropdown del header global                                |
| **Confirmación en edición/borrado** | Todos los formularios de edición y botones de eliminación usan diálogos de confirmación        |
| **Fechas con calendario**           | El historial de compras usa `react-day-picker` para selección de rango de fechas               |
| **Registro desde cualquier página** | El botón "Registrarse" está en el header global para visitantes                                |
| **Cuenta desde cualquier página**   | El dropdown del usuario autenticado incluye enlace a configuración de cuenta                   |

---

## ✅ Validaciones de Datos

Todas las validaciones se implementan con **Zod** y se aplican tanto en el frontend (formularios) como en el backend (server actions):

| Campo                   | Regla de Validación                                                    |
| ----------------------- | ---------------------------------------------------------------------- |
| **DNI**                 | 7-8 dígitos numéricos                                                  |
| **Contraseña**          | Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número |
| **Nombre / Apellido**   | 2-50 caracteres, solo letras (incluyendo acentos y ñ)                  |
| **Email**               | Formato de email válido                                                |
| **Teléfono**            | 10-15 dígitos numéricos                                                |
| **Precio**              | Mayor a 0                                                              |
| **Stock**               | Mayor o igual a 0                                                      |
| **Código de producto**  | Obligatorio                                                            |
| **Marca / Modelo**      | Obligatorios, combinación única en el sistema                          |
| **Nombre de categoría** | 2-50 caracteres, único en el sistema                                   |

---

## 🗺️ Rutas de la Aplicación

### Públicas (sin autenticación)

| Ruta               | Descripción                       |
| ------------------ | --------------------------------- |
| `/`                | Página de inicio                  |
| `/catalogo`        | Catálogo de productos con filtros |
| `/producto/[slug]` | Detalle de un producto            |
| `/busqueda`        | Búsqueda de productos             |
| `/auth/login`      | Inicio de sesión                  |
| `/auth/registro`   | Registro de nuevo cliente         |

### Protegidas (requieren sesión de Cliente)

| Ruta                | Descripción                |
| ------------------- | -------------------------- |
| `/carrito`          | Carrito de compras         |
| `/historial`        | Historial de compras       |
| `/cuenta`           | Configuración de la cuenta |
| `/checkout/success` | Compra exitosa             |
| `/checkout/failure` | Error en la compra         |
| `/checkout/pending` | Compra pendiente           |

### Admin (requieren rol ADMIN)

| Ruta                | Descripción                |
| ------------------- | -------------------------- |
| `/admin`            | Dashboard con estadísticas |
| `/admin/usuarios`   | Gestión de usuarios        |
| `/admin/productos`  | Gestión de productos       |
| `/admin/categorias` | Gestión de categorías      |
| `/admin/ordenes`    | Gestión de órdenes         |

---

## 🔒 Seguridad

- **Autenticación:** NextAuth v5 con Credentials provider y JWT
- **Autorización:** Middleware + guard en server actions verifican rol antes de cada operación
- **Contraseñas:** Hasheadas con bcrypt (10 salt rounds), nunca expuestas al cliente
- **Sesiones:** JWT firmado con `AUTH_SECRET`, sin almacenamiento en DB
- **Protección de rutas:** Middleware redirige a `/auth/login` si no hay sesión válida
- **Validación double-layer:** Zod valida en frontend (UX) y backend (seguridad)
- **Propiedad del carrito:** Cada operación verifica que el item pertenece al usuario autenticado
- **Transacciones atómicas:** El checkout usa transacciones Prisma para evitar condiciones de carrera en el stock

---

## 📄 Documentación Adicional

| Documento                  | Ubicación                                                                | Descripción                                                  |
| -------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| Estructura del proyecto    | [`docs/STRUCTURE.md`](docs/STRUCTURE.md)                                 | Descripción detallada de cada capa, archivo y flujo de datos |
| Requerimientos funcionales | [`docs/Archivo_de_Requerimientos.md`](docs/Archivo_de_Requerimientos.md) | Especificación completa de CU001-CU020 y RNFs                |
| Diagrama ERD               | [`docs/ERD.svg`](docs/ERD.svg)                                           | Diagrama entidad-relación de la base de datos                |
| Variables de entorno       | Sección en este README                                                   | Tabla con las variables necesarias                           |
