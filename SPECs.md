# Proyecto: MultiEnvíos GT

## Objetivo

Desarrollar una plataforma web para pequeños comercios de Guatemala que permita generar, administrar y dar seguimiento a guías de envío desde un único lugar.

El objetivo del MVP es reducir el tiempo que un vendedor invierte creando envíos manualmente para Cargo Expreso.

La plataforma debe ser modular para que en el futuro pueda soportar múltiples empresas de transporte (Cargo Expreso, Forza, Guatex, etc.).

---

# Stack Tecnológico

Frontend

* React 19
* Vite
* React Router DOM
* SCSS Modules
* Axios
* React Hook Form
* React Query (TanStack Query)
* Context API para autenticación
* ESLint + Prettier

Backend

* Node.js
* Express
* MySQL
* JWT Authentication
* bcrypt
* dotenv
* multer (para futuras cargas)
* axios
* cors

---

# Arquitectura

## Frontend

```
src/

components/
layouts/
pages/
hooks/
services/
contexts/
routes/
styles/
utils/
types/
assets/
```

Cada módulo tendrá su propia carpeta.

Ejemplo

```
pages/

Login/

Dashboard/

Shipments/

ShipmentCreate/

Profile/

Wallet/
```

---

## Backend

```
src/

config/
controllers/
middlewares/
models/
repositories/
routes/
services/
utils/
validators/
```

Separar completamente:

Controller

↓

Service

↓

Repository

↓

Database

No colocar lógica SQL dentro de los controllers.

---

# Estilos

Utilizar únicamente SCSS.

Estructura

```
styles/

_variables.scss

_mixins.scss

_globals.scss
```

Cada componente tendrá su propio

```
Component.module.scss
```

No utilizar Tailwind.

---

# Base de datos

Crear migraciones iniciales.

Tablas:

Users

WalletTransactions

Shipments

ShipmentStatusHistory

Couriers

UserSettings

---

# Autenticación

JWT

Access Token

Refresh Token

Persistencia mediante HttpOnly Cookies.

---

# Funcionalidades MVP

## Login

Correo

Contraseña

Cerrar sesión

---

## Dashboard

Mostrar

Total de envíos

Saldo disponible

Envíos entregados

En tránsito

Devueltos

Pendientes

Actividad reciente

---

## Crear guía

Formulario

Cliente

Nombre

Teléfono

Departamento

Municipio

Dirección

Referencia

Pedido

Descripción

Cantidad

Valor contra entrega

Peso

Tipo de envío

Botón

Generar guía

Por ahora crear una implementación simulada del proveedor (Mock Courier Service).

La integración real con Cargo Expreso se hará posteriormente mediante un Adapter.

---

## Historial

Listado

Buscar

Filtrar

Estado

Fecha

Número de guía

Cliente

Monto

Acciones

Ver

Imprimir

---

## Detalle del envío

Información completa

Historial de estados

Datos del cliente

Datos del pedido

Datos del courier

---

## Saldo

Mostrar saldo actual.

Mostrar movimientos.

Recargas (simuladas por ahora).

Cada guía descontará saldo.

---

# Arquitectura para Couriers

Diseñar desde el inicio utilizando un patrón Adapter.

Ejemplo

```
CourierProvider

CargoExpresoProvider

GuatexProvider

ForzaProvider
```

Todos implementarán la misma interfaz.

Ejemplo

```
createShipment()

cancelShipment()

trackShipment()

downloadLabel()
```

De esta forma agregar un nuevo courier no requerirá modificar el resto del sistema.

---

# Convenciones

Utilizar TypeScript tanto en frontend como backend.

No utilizar "any".

Todos los componentes funcionales.

Hooks personalizados cuando sea necesario.

Código limpio.

Nombres en inglés para variables, funciones y archivos.

Comentarios únicamente cuando agreguen valor.

---

# Diseño

Interfaz moderna.

Minimalista.

Inspirada en:

Stripe

Linear

Notion

Mucho espacio en blanco.

Tarjetas.

Sidebar izquierda.

Header superior.

Colores neutros.

Responsive.

---

# Escalabilidad

Diseñar pensando en futuras funcionalidades:

Integración con múltiples couriers.

Generación masiva mediante Excel.

Importación desde Shopify.

Importación desde WooCommerce.

Importación desde Tiendanube.

Integración con WhatsApp.

Notificaciones.

API pública.

Sistema de créditos.

Facturación.

Usuarios con roles.

Auditoría.

---

# Objetivo del primer hito

Tener una aplicación funcional donde un usuario pueda:

* Registrarse.
* Iniciar sesión.
* Ver un Dashboard.
* Consultar saldo.
* Crear una guía simulada.
* Ver el historial de guías.
* Consultar el detalle de una guía.

Todo el código debe ser limpio, modular, escalable y preparado para integrar proveedores reales sin modificar la lógica principal del sistema.
