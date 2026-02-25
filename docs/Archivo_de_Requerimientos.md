# 📋 Archivo de Requerimientos — 23Tech E-commerce

---

## Requerimientos Funcionales

### RF01 — Administrar Usuarios

**Descripción:** El sistema deberá permitir el alta, baja lógica y modificación de Usuarios, registrando los datos correspondientes.

**Especificación:** CU001, CU002, CU003

---

### RF02 — Administrar Productos

**Descripción:** El sistema deberá permitir el alta, baja y modificación de Productos, registrando los datos correspondientes.

**Especificación:** CU007, CU008, CU009

---

### RF03 — Administrar Categorías

**Descripción:** El sistema deberá permitir el alta, baja y modificación de Categorías, registrando los datos correspondientes.

**Especificación:** CU004, CU005, CU006

---

### RF04 — Visualización de Catálogos

**Descripción:** Se debe permitir visualizar el catálogo de productos, pudiendo seleccionar uno con el fin de ver el detalle de este. Si el usuario está autenticado puede agregarlo al Carrito de Compras, indicando la cantidad del producto a comprar.

**Especificación:** CU012

---

### RF05 — Manejar Carrito de Compras

**Descripción:** Se debe poder mantener un Carrito de Compras para un usuario autenticado, agregando o modificando productos a comprar y sus cantidades.

**Especificación:** CU014, CU016, CU017, CU018

---

### RF06 — Consultar Historial de Compras

**Descripción:** El sistema debe permitir a los usuarios que efectuaron compras poder visualizar un listado de los productos que compraron.

**Especificación:** CU013

---

### RF07 — Búsqueda de Productos (opcional)

**Descripción:** El sistema debe permitir, en cualquier momento, la búsqueda de productos por diferentes atributos, así como el filtrado de estos según la información que se ingrese. Se pueden realizar las mismas acciones que cuando se muestra el catálogo completo.

**Especificación:** CU015

---

### RF08 — Registro de Cliente

**Descripción:** El sistema debe permitir a cualquier persona poder registrarse en el sistema, para poder obtener su cuenta con perfil de Cliente.

**Especificación:** CU019, CU020

---

## Listado de Casos de Uso

### CU001 — Realizar el alta de un Usuario

| Campo                | Detalle                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| **Actores**          | Usuario Administrador                                                                              |
| **Descripción**      | El CU comienza cuando el usuario con Rol administrador quiere dar de alta un usuario en el sistema |
| **Post-condiciones** | Se registra el usuario en el sistema                                                               |

**Curso Normal:**

1. El usuario selecciona la opción **Nueva Cuenta de Usuario**
2. El sistema muestra un formulario solicitando: documento, nombre, apellido, email, dirección, teléfono, contraseña y perfil (Administrador o Cliente)
3. El usuario ingresa los datos
4. El usuario confirma la operación
5. El sistema registra la cuenta en el sistema
6. El sistema despliega mensaje de confirmación

**Curso Alternativo:**

- El sistema notifica que el correo electrónico ya se encuentra en uso por otra cuenta
- El sistema notifica si no se cumple algún criterio de validación (DNI 7-8 números, Password 8+ caracteres con Mayúscula y Número)
- El usuario ingresa nuevamente los datos o corrige los errores

---

### CU002 — Realizar la modificación de un Usuario

| Campo               | Detalle                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------- |
| **Actores**         | Usuario Administrador                                                                   |
| **Descripción**     | El CU comienza cuando el usuario Administrador quiere modificar los datos de una cuenta |
| **Precondiciones**  | La cuenta de usuario debe existir                                                       |
| **Postcondiciones** | Se registran las modificaciones del usuario en el sistema                               |

**Curso Normal:**

1. El usuario accede al módulo **Usuarios**
2. El sistema presenta un mecanismo de búsqueda o listado
3. El usuario selecciona un usuario y elige la opción de modificación
4. El sistema muestra un formulario con los datos actuales de la cuenta
5. El usuario realiza la modificación
6. El usuario confirma la operación
7. El sistema despliega mensaje de confirmación

**Curso Alternativo:**

- El sistema notifica que el correo electrónico modificado ya existe para otra cuenta
- El sistema notifica si no se cumple algún criterio de validación (DNI 7-8 números, Password 8+ caracteres con Mayúscula y Número)
- El usuario ingresa nuevamente los datos o corrige los errores

---

### CU003 — Realizar la baja de un usuario

| Campo               | Detalle                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| **Actores**         | Usuario Administrador                                                     |
| **Descripción**     | El CU comienza cuando el usuario quiere dar de baja una cuenta de usuario |
| **Precondiciones**  | La cuenta de usuario debe existir en el sistema                           |
| **Postcondiciones** | Se elimina (baja lógica) al usuario del sistema                           |

**Curso Normal:**

1. El usuario accede al módulo **Usuarios**
2. El sistema presenta un mecanismo de búsqueda o listado
3. El usuario selecciona el usuario y elige la opción de eliminación o baja
4. El usuario confirma la operación
5. El sistema realiza la baja de las compras pendientes (elimina el carrito de compras, si existe)
6. El sistema realiza la baja lógica de la cuenta del usuario
7. El sistema despliega mensaje de confirmación

---

### CU004 — Dar de alta una categoría

| Campo               | Detalle                                                           |
| ------------------- | ----------------------------------------------------------------- |
| **Actores**         | Usuario Administrador                                             |
| **Descripción**     | El CU comienza cuando el usuario quiere dar de alta una categoría |
| **Precondiciones**  | La categoría no existe en el sistema                              |
| **Postcondiciones** | Se registra una nueva categoría                                   |

**Curso Normal:**

1. El usuario selecciona la opción **Nueva Categoría**
2. El sistema muestra un formulario para la carga de datos
3. El usuario ingresa los datos de la categoría: nombre y descripción
4. El usuario confirma la operación
5. El sistema registra la categoría en el sistema
6. El sistema despliega mensaje de confirmación

**Curso Alternativo:**

- El sistema notifica que el nombre de la categoría ya existe en el sistema
- El sistema notifica si no se cumple algún criterio de validación (Nombre de 2 a 50 caracteres)
- El usuario ingresa o corrige los datos

---

### CU005 — Eliminar una categoría

| Campo               | Detalle                                                          |
| ------------------- | ---------------------------------------------------------------- |
| **Actores**         | Usuario Administrador                                            |
| **Descripción**     | El usuario elimina una categoría del sistema                     |
| **Precondiciones**  | La categoría existe en el sistema y no posee productos asociados |
| **Postcondiciones** | Se elimina la categoría del sistema                              |

**Curso Normal:**

1. El usuario ingresa al módulo **Categorías**
2. El sistema presenta un mecanismo de búsqueda o listado
3. El usuario selecciona la categoría y elige la opción de eliminación o baja
4. El usuario confirma la operación
5. El sistema realiza la baja lógica de la categoría
6. El sistema despliega mensaje de confirmación

**Curso Alternativo:**

- El sistema notifica que la categoría seleccionada es referenciada por uno o más productos
- El usuario aborta o cancela la operación de baja

---

### CU006 — Modificar una categoría

| Campo               | Detalle                                                                      |
| ------------------- | ---------------------------------------------------------------------------- |
| **Actores**         | Usuario Administrador                                                        |
| **Descripción**     | El CU comienza cuando el usuario quiere modificar los datos de una categoría |
| **Precondiciones**  | La categoría existe en el sistema                                            |
| **Postcondiciones** | Se modifican los datos de la categoría                                       |

**Curso Normal:**

1. El usuario ingresa al módulo **Categorías**
2. El sistema presenta un mecanismo de búsqueda o listado
3. El usuario selecciona la categoría y elige la opción de modificación
4. El sistema muestra un formulario con los datos actuales de la categoría
5. El usuario modifica los datos de la categoría
6. El usuario confirma la operación
7. El sistema realiza la modificación
8. El sistema despliega mensaje de confirmación

**Curso Alternativo:**

- El sistema notifica que el nombre (modificado) de la categoría ya existe en el sistema
- El sistema notifica si no se cumple algún criterio de validación (Nombre de 2 a 50 caracteres)
- El usuario ingresa o corrige los datos

---

### CU007 — Dar de alta un producto

| Campo               | Detalle                                                               |
| ------------------- | --------------------------------------------------------------------- |
| **Actores**         | Usuario Administrador                                                 |
| **Descripción**     | El CU comienza cuando el usuario quiere dar de alta un producto nuevo |
| **Precondiciones**  | El producto no existe en el sistema                                   |
| **Postcondiciones** | Se registra un nuevo producto                                         |

**Curso Normal:**

1. El usuario selecciona la opción **Nuevo Producto**
2. El sistema muestra un formulario para la carga de datos
3. El usuario ingresa los datos: código, marca, modelo, descripción, fabricante, precio, imágenes, estado (activo/inactivo), categoría y stock
4. El usuario confirma la operación
5. El sistema registra el producto en el sistema
6. El sistema despliega mensaje de confirmación

**Curso Alternativo:**

- El sistema notifica que ya existe otro producto con la misma marca y modelo
- El sistema notifica si no se cumple algún criterio de validación (Precio > 0, Stock ≥ 0, campos obligatorios)
- El usuario ingresa o corrige los datos

---

### CU008 — Eliminar un producto

| Campo               | Detalle                                             |
| ------------------- | --------------------------------------------------- |
| **Actores**         | Usuario Administrador                               |
| **Descripción**     | Dar de baja un producto en el sistema (baja lógica) |
| **Precondiciones**  | El producto existe en el sistema                    |
| **Postcondiciones** | Se elimina el producto del sistema                  |

**Curso Normal:**

1. El usuario ingresa al módulo **Productos**
2. El sistema presenta un mecanismo de búsqueda o listado
3. El usuario selecciona el producto y elige la opción de eliminación
4. El usuario confirma la operación
5. El sistema elimina el producto de todos los carritos de compras pendientes
6. El sistema realiza la baja lógica del producto
7. El sistema despliega mensaje de confirmación

---

### CU009 — Modificar un producto

| Campo               | Detalle                                                                    |
| ------------------- | -------------------------------------------------------------------------- |
| **Actores**         | Usuario Administrador                                                      |
| **Descripción**     | El CU comienza cuando el usuario quiere modificar los datos de un producto |
| **Precondiciones**  | El producto existe en el sistema                                           |
| **Postcondiciones** | Se modifica el producto en el sistema                                      |

**Curso Normal:**

1. El usuario ingresa al módulo **Productos**
2. El sistema presenta un mecanismo de búsqueda o listado
3. El usuario selecciona el producto y elige la opción de modificación
4. El sistema muestra un formulario con los datos actuales
5. El usuario modifica o actualiza los datos
6. El usuario confirma la operación
7. El sistema realiza la modificación
8. El sistema despliega mensaje de confirmación

**Curso Alternativo:**

- El sistema notifica que ya existe otro producto con la misma marca y modelo
- El sistema notifica si no se cumple algún criterio de validación (Precio > 0, Stock ≥ 0, campos obligatorios)
- El usuario ingresa o corrige los datos

---

### CU012 — Visualizar catálogo

| Campo              | Detalle                                                          |
| ------------------ | ---------------------------------------------------------------- |
| **Actores**        | Usuario (autenticado o visitante)                                |
| **Descripción**    | Se muestran los productos del sistema con una descripción básica |
| **Precondiciones** | Los productos deben existir en el sistema                        |

**Curso Normal:**

1. El usuario selecciona la opción **Inicio** o una **Categoría** del menú
2. Si accede desde el inicio, el sistema muestra los productos más vendidos
3. Si selecciona una categoría, el sistema muestra los productos de esa categoría
4. Los precios solo se muestran si el usuario ha iniciado sesión

---

### CU013 — Consultar historial de compras

| Campo              | Detalle                                                  |
| ------------------ | -------------------------------------------------------- |
| **Actores**        | Usuario Logueado                                         |
| **Descripción**    | El usuario puede consultar su historial de compras       |
| **Precondiciones** | El usuario debe estar logueado y haber realizado compras |

**Curso Normal:**

1. El usuario selecciona **Consultar historial de compras**
2. El usuario ingresa un rango de fechas para filtrar las compras
3. El sistema muestra un listado con las compras realizadas por el usuario

---

### CU014 — Agregar un producto al carrito

| Campo              | Detalle                                            |
| ------------------ | -------------------------------------------------- |
| **Actores**        | Usuario Logueado                                   |
| **Descripción**    | El usuario añade un producto al Carrito de Compras |
| **Precondiciones** | El usuario debe estar logueado                     |

**Curso Normal:**

1. El usuario selecciona un producto desde el catálogo para ver su detalle
2. El usuario selecciona la opción **"Agregar al Carrito de Compras"**
3. El usuario ingresa o actualiza la cantidad de unidades a comprar
4. El sistema actualiza el Carrito de Compras del usuario

**Curso Alternativo:**

- El sistema notifica que el producto ha sido eliminado de la tienda
- El sistema notifica que no hay stock disponible

---

### CU015 — Buscar producto

| Campo              | Detalle                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **Actores**        | Usuario (autenticado o visitante)                                                                   |
| **Descripción**    | El usuario selecciona criterios de búsqueda y se muestran los productos que cumplen las condiciones |
| **Precondiciones** | No tiene                                                                                            |

**Curso Normal:**

1. El usuario selecciona uno o varios filtros
2. El sistema retorna los productos que cumplen con los criterios ingresados

---

### CU016 — Visualizar carrito de compra

| Campo              | Detalle                                                                        |
| ------------------ | ------------------------------------------------------------------------------ |
| **Actores**        | Usuario Logueado                                                               |
| **Descripción**    | El sistema muestra los productos que el usuario tiene en el Carrito de Compras |
| **Precondiciones** | El usuario debe estar logueado                                                 |

**Curso Normal:**

1. El usuario selecciona **Visualizar Lista de Compra**
2. El sistema verifica el estado de los productos y su disponibilidad en stock
3. El sistema retorna una lista con los productos del carrito: cantidad, precio unitario y precio total
4. El sistema permite actualizar la cantidad de unidades
5. El sistema notifica si algún producto fue removido por falta de stock o baja del producto

---

### CU017 — Eliminar ítem de compra

| Campo              | Detalle                                                   |
| ------------------ | --------------------------------------------------------- |
| **Actores**        | Usuario Logueado                                          |
| **Descripción**    | El usuario elimina un producto de su Carrito de Compras   |
| **Precondiciones** | El usuario debe estar logueado y haber ejecutado el CU016 |

**Curso Normal:**

1. El usuario elige el producto a eliminar
2. El sistema solicita confirmación
3. El sistema elimina el producto y actualiza la vista del Carrito de Compras

---

### CU018 — Finalizar compra

| Campo              | Detalle                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **Actores**        | Usuario Logueado                                                                               |
| **Descripción**    | El usuario efectúa la compra, vaciando el carrito y realizando el pago                         |
| **Precondiciones** | El usuario debe estar logueado, haber ejecutado CU016, y deben existir productos en el Carrito |

**Curso Normal:**

1. El usuario elige la opción **Finalizar Compra**
2. El sistema elimina los productos del Carrito de Compras y genera un histórico de la compra
3. El sistema envía un e-mail notificando de la compra realizada

**Curso Alternativo:**

- El sistema solicita ingresar la dirección y teléfono del usuario, si no estuviera registrada la información

---

### CU019 — Registrar nuevo cliente

| Campo               | Detalle                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| **Actores**         | Usuarios sin autenticación, visitantes                                  |
| **Descripción**     | El CU comienza cuando un cliente desea registrarse en la Tienda Virtual |
| **Postcondiciones** | Se registra el cliente con una nueva cuenta de usuario                  |

**Curso Normal:**

1. El usuario selecciona la opción **Registrarse**
2. El sistema despliega una pantalla solicitando: nombre, apellido, documento, email, dirección, teléfono y contraseña
3. El sistema asume que el perfil es del tipo **Cliente**
4. El usuario ingresa los datos
5. El usuario confirma la operación
6. El sistema despliega mensaje de confirmación

**Curso Alternativo:**

- El sistema notifica que ya existe una cuenta con el correo electrónico ingresado
- El sistema notifica si no se cumple algún criterio de validación (DNI 7-8 números, teléfono 10-15 dígitos, Password 8+ con Mayúscula/Número, nombre y apellido sin números)
- El usuario ingresa o corrige los datos

---

### CU020 — Actualizar datos de la cuenta

| Campo               | Detalle                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| **Actores**         | Usuarios autenticados con perfil Cliente                                 |
| **Descripción**     | El CU comienza cuando un cliente desea actualizar los datos de su cuenta |
| **Postcondiciones** | El cliente actualizó los datos de su cuenta                              |

**Curso Normal:**

1. El cliente accede a consultar los datos de su cuenta
2. El sistema muestra un formulario con los datos actuales (la contraseña no se muestra)
3. Si desea cambiar la contraseña, se solicita la nueva contraseña y su confirmación
4. El usuario actualiza los datos
5. El sistema solicita confirmación de la operación
6. El sistema despliega mensaje de confirmación

**Curso Alternativo:**

- El sistema notifica que ya existe una cuenta con el correo electrónico ingresado (si fue modificado)
- El sistema notifica que la nueva contraseña es igual a la anterior
- El sistema notifica si no se cumple algún criterio de validación (DNI 7-8 números, teléfono 10-15 dígitos, Password 8+ con Mayúscula/Número, nombre y apellido sin números)
- El usuario ingresa o corrige los datos

---

## Requerimientos No Funcionales

| #   | Requerimiento                                                                                           | Estado                               |
| --- | ------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 1   | Manejo de sesiones u otra técnica de autenticación para manipular Carritos de Compras pendientes        | ✅ Implementado (NextAuth JWT)       |
| 2   | Contraseña de acceso encriptada en la base de datos mediante algoritmo de encriptación conocido         | ✅ Implementado (bcrypt)             |
| 3   | La compra y visualización de precios solo se podrá realizar si el usuario está registrado y autenticado | ✅ Implementado                      |
| 4   | El menú principal y el carrito deberán ser accesibles desde cualquier página                            | ✅ Implementado (Header global)      |
| 5   | Se podrá finalizar la sesión actual desde cualquier página                                              | ✅ Implementado (Dropdown en Header) |
| 6   | Cualquier operación de edición o borrado deberá solicitar confirmación al usuario                       | ✅ Implementado (Diálogos)           |
| 7   | La introducción de datos tipo fecha deberá hacerse mediante un calendario                               | ✅ Implementado (react-day-picker)   |
| 8   | Los visitantes podrán registrarse desde cualquier página                                                | ✅ Implementado (Botón en Header)    |
| 9   | Los clientes autenticados podrán acceder a su cuenta desde cualquier página                             | ✅ Implementado (Dropdown en Header) |

---

## Validaciones de Datos

Para cualquier operación que implique alta, baja o modificación de datos en el sistema, se definen los siguientes criterios de validación:

| Campo                   | Regla                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| **DNI**                 | 7-8 dígitos numéricos                                                  |
| **Contraseña**          | Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número |
| **Nombre / Apellido**   | 2-50 caracteres, solo letras (incluyendo acentos y ñ)                  |
| **Email**               | Formato de email válido                                                |
| **Teléfono**            | 10-15 dígitos numéricos                                                |
| **Precio**              | Mayor a 0                                                              |
| **Stock**               | Mayor o igual a 0                                                      |
| **Código de producto**  | Obligatorio                                                            |
| **Marca / Modelo**      | Obligatorios, combinación única                                        |
| **Nombre de categoría** | 2-50 caracteres, único                                                 |
