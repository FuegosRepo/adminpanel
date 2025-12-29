# PRD - Panel de Administración Fuegos d'Azur

## 📋 Información del Documento

| Propiedad | Valor |
|-----------|-------|
| **Proyecto** | Panel de Administración Fuegos d'Azur |
| **Versión** | 1.0.0 |
| **Fecha de Creación** | Diciembre 2025 |
| **Estado** | En Producción |
| **Plataforma** | Web Application (Next.js) |
| **Deployment** | Netlify |

---

## 🎯 Resumen Ejecutivo

El Panel de Administración de Fuegos d'Azur es una aplicación web completa diseñada para gestionar integralmente las operaciones de un servicio de catering premium. El sistema permite administrar pedidos, presupuestos, eventos, pagos, productos, y generar reportes financieros, todo centralizado en una única plataforma moderna y eficiente.

### Objetivos del Proyecto

1. **Centralizar la gestión operativa** del negocio de catering
2. **Automatizar procesos** de presupuestación y facturación
3. **Facilitar el seguimiento** de eventos y pagos
4. **Optimizar la gestión** de precios y productos
5. **Proporcionar análisis financieros** en tiempo real

---

## 👥 Stakeholders y Usuarios

### Usuarios Primarios
- **Administradores/Gerentes**: Acceso completo a todas las funcionalidades
- **Staff Administrativo**: Gestión de pedidos y presupuestos
- **Personal Financiero**: Seguimiento de pagos y reportes

### Stakeholders
- **Propietarios del negocio**: Requieren visibilidad de métricas financieras
- **Clientes finales**: Reciben presupuestos y comunicaciones generadas por el sistema

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

#### Frontend
- **Framework**: Next.js 14.2.15 (React 18.2.0)
- **Lenguaje**: TypeScript 5.0
- **Estilos**: CSS Modules
- **Gestión de Estado**: TanStack React Query 5.90.12
- **UI Components**: 
  - Lucide React (iconos)
  - React Calendar
  - Recharts (gráficos)
  - Sonner (notificaciones)

#### Backend
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth con SSR
- **APIs**: Next.js API Routes (App Router)
- **Generación de PDFs**: jsPDF + Puppeteer
- **Email Service**: Resend

#### Infraestructura
- **Hosting**: Netlify
- **Node Version**: 20 (LTS)
- **Port**: 3001 (desarrollo)

### Patrones de Arquitectura

1. **Server-Side Rendering (SSR)** para autenticación segura
2. **API Routes** para endpoints backend
3. **Row Level Security (RLS)** en Supabase
4. **Component-Based Architecture**
5. **Custom Hooks** para lógica de negocio reutilizable

---

## 🎨 Módulos y Funcionalidades

### 1. Módulo de Autenticación 🔐

**Ruta**: `/login`

#### Funcionalidades
- Login con email y contraseña
- Sesión persistente con cookies seguras
- Middleware para protección de rutas
- Auto-redirección según estado de sesión

#### Requisitos de Seguridad
- Autenticación via Supabase Auth
- Protección de todas las rutas administrativas
- Cookies seguras con httpOnly
- Row Level Security en base de datos

---

### 2. Módulo de Pedidos (Orders) 📦

**Ruta**: `/orders`

#### Funcionalidades Principales

##### Gestión de Pedidos
- **Visualización de pedidos** con filtros avanzados
- **Estados de pedido**:
  - `pending`: Pendiente
  - `sent`: Enviado
  - `approved`: Aprobado
  - `rejected`: Rechazado
  - `ENVIADO`: Enviado confirmado

##### Información del Pedido
```typescript
interface CateringOrder {
  id: string
  contact: ContactData
  menu: MenuSelection
  entrees: string[]
  viandes: string[]
  dessert: string | null
  extras: ExtraServices
  status: OrderStatus
  payment?: PaymentInfo
  hasBudget?: boolean
}
```

##### Filtros Disponibles
- Por estado
- Por rango de fechas
- Por búsqueda de texto
- Por cliente

##### Acciones sobre Pedidos
- Ver detalles completos
- Generar presupuesto
- Actualizar estado
- Ver historial de pagos
- Agregar notas internas

#### Componentes Clave
- `OrderCard`: Tarjeta resumen de pedido
- `OrderDetails`: Vista detallada del pedido
- `FilterBar`: Barra de filtros

---

### 3. Módulo de Presupuestos (Budgets) 💰

**Ruta**: `/budgets`

#### Estructura del Presupuesto

Un presupuesto se compone de múltiples secciones:

##### 3.1 Sección Menu
```typescript
interface BudgetMenuSection {
  pricePerPerson: number
  totalPersons: number
  entrees: BudgetMenuItem[]
  viandes: BudgetMenuItem[]
  dessert: BudgetMenuItem
  accompagnements: string[]
  totalHT: number
  tva: number
  tvaPct: number
  totalTTC: number
}
```

##### 3.2 Sección Material
- Items de material (mesas, sillas, vajilla)
- Fee de gestión
- Fee de entrega
- Seguro (porcentaje)

##### 3.3 Sección Desplazamiento
- Distancia en km
- Precio por km
- Cálculo automático

##### 3.4 Sección Servicio
- Número de mozos
- Horas de servicio
- Tarifa por hora

##### 3.5 Sección Delivery/Reprise
- Costo de entrega
- Costo de recogida

##### 3.6 Sección Bebidas
- Precio por persona
- Número de personas

#### Funcionalidades del Editor

##### BudgetEditor Component
- **Edición en tiempo real** de todas las secciones
- **Cálculos automáticos**:
  - Subtotales por sección
  - IVA por sección (configurable)
  - Total general HT/TTC
- **Selector de materiales** con precios de BD
- **Preservación de precios manuales** (flag `isManualPrice`)
- **Validación de datos**
- **Descuentos** con razón y porcentaje

##### Generación de Presupuestos
- **Generación automática** desde pedidos
- **Versionado** de presupuestos
- **Historial de cambios**
- **Estados**:
  - `draft`: Borrador
  - `pending_review`: Pendiente de revisión
  - `approved`: Aprobado
  - `sent`: Enviado
  - `rejected`: Rechazado

#### Generación de PDFs

##### Endpoint: `/api/generate-budget-pdf`
- Genera PDF profesional con branding
- Incluye todas las secciones del presupuesto
- Formato HTML convertido a PDF via Puppeteer
- Almacenamiento en Supabase Storage

##### Endpoint: `/api/preview-budget-html`
- Preview del presupuesto en HTML
- Vista previa antes de generar PDF

##### Template Personalizado
- Logo de la empresa
- Información de contacto
- Desglose detallado por secciones
- Términos y condiciones
- Validez del presupuesto

#### Envío de Presupuestos

##### Endpoint: `/api/approve-and-send-budget`
- Aprueba presupuesto
- Genera PDF
- Envía email al cliente con PDF adjunto
- Actualiza estado del pedido

---

### 4. Módulo de Calculadora de Eventos 🧮

**Ruta**: `/calculator`

#### Propósito
Herramienta interna para calcular costos reales de eventos, incluyendo ingredientes, materiales y mano de obra.

#### Funcionalidades

##### Gestión de Eventos
```typescript
interface EventCalculation {
  id: string
  name: string
  event_date: string | null
  guest_count: number
  order_id: string | null
  version_number: number
  is_active: boolean
  total_cost: number | null
  cost_per_guest: number | null
}
```

##### Cálculo de Ingredientes
- **Selección de productos** desde base de datos
- **Cálculo por persona** configurable
- **Cantidad total** automática según invitados
- **Precio unitario** y total por ingrediente
- **Cantidades fijas** (opcional, para items no escalables)

##### Versionado
- **Múltiples versiones** de un mismo evento
- **Comparación** entre versiones
- **Historial de cambios** con descripción
- **Restauración** de versiones anteriores

##### Notas y Observaciones
```typescript
interface EventCalculationNote {
  id: string
  note_type: 'general' | 'ingredient' | 'cost' | 'reminder'
  title: string | null
  content: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  is_resolved: boolean
}
```

##### Estadísticas
- Costo total del evento
- Costo por invitado
- Total de ingredientes
- Costos por categoría
- Ingrediente más caro
- Ingrediente más usado

##### Generación de PDF
- **Reporte completo** del evento
- **Desglose de ingredientes**
- **Análisis de costos**
- **Observaciones** incluidas

##### Integración con Pedidos
- Vincular evento a un pedido específico
- Generar presupuesto desde el evento calculado

---

### 5. Módulo de Gestión de Precios 💵

**Ruta**: `/prices`

#### Estructura de Productos

```typescript
interface Product {
  id: string
  name: string
  category: 'entrees' | 'viandes' | 'desserts' | 'verduras' | 'pan' | 'extras' | 'material'
  price_per_kg: number | null
  price_per_portion: number
  unit_type: 'kg' | 'unidad' | 'porcion'
  is_combo: boolean
  portion_per_person: string | null
  clarifications: string | null
  active: boolean
  subcategory?: string | null
  description?: string | null
}
```

#### Funcionalidades

##### Gestión de Productos
- **CRUD completo** de productos
- **Categorización** por tipo
- **Subcategorías** (ej: carnes premium)
- **Activar/Desactivar** productos
- **Búsqueda y filtrado**

##### Tipos de Precio
- **Precio por kg**: Para productos que se venden por peso
- **Precio por porción**: Para items individuales
- **Precio por unidad**: Para items countables

##### Productos Combo
- **Ingredientes componentes** con cantidades
- **Unidades de display** configurables (kg, gr, u, storage)
- **Cálculo automático** de precio de combo

```typescript
interface ComboIngredient {
  id: string
  combo_id: string
  ingredient_id: string
  quantity: number
  display_unit?: 'kg' | 'gr' | 'u' | 'storage'
  ingredient?: Product
}
```

##### Información Adicional
- **Porción por persona**: Ej: "1/4", "1/2", "30 gr"
- **Aclaraciones**: Ej: "Con 1 chorizo hago 4 choripanes"
- **Descripción**: Para items especiales

#### Componentes
- `PriceManager`: Gestor principal de precios
- `ProductListResolver`: Resolución de productos para admin

---

### 6. Módulo de Calendario 📅

**Ruta**: `/calendar`

#### Funcionalidades

##### Visualización de Eventos
```typescript
interface CalendarEvent {
  id: string
  orderId: string | null
  title: string
  date: string
  time?: string
  type: 'Casamiento' | 'Aniversario' | 'Bautismo' | 'Empresarial' | 'Otros' | 'Recordatorio' | 'Pago Pendiente'
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
  clientName: string
  location?: string
  notes?: string
}
```

##### Tipos de Eventos
- **Eventos de Catering**: Vinculados a pedidos
- **Recordatorios**: Tareas y follow-ups
- **Pagos Pendientes**: Alertas de pagos

##### Acciones
- **Crear evento** manual o desde pedido
- **Editar evento** con modal
- **Cambiar estado**
- **Ver detalles** completos
- **Eliminar** eventos

##### Vistas
- Vista mensual con React Calendar
- Indicadores visuales por tipo de evento
- Filtros por tipo y estado

#### Componentes
- `EventsCalendar`: Calendario principal
- `AddEventModal`: Modal para crear/editar eventos

---

### 7. Módulo de Recordatorios ⏰

**Ruta**: `/reminders`

#### Tipos de Recordatorios

```typescript
interface Reminder {
  id: string
  orderId: string
  type: 'event_upcoming' | 'payment_due' | 'follow_up' | 'custom'
  title: string
  message: string
  dueDate: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}
```

#### Funcionalidades
- **Creación automática** de recordatorios
  - Próximos eventos (7 días antes)
  - Pagos vencidos
  - Follow-ups pendientes
- **Creación manual** de recordatorios custom
- **Priorización** con niveles
- **Marcar como leído/no leído**
- **Notificaciones visuales**
- **Integración con pedidos**

#### Componente
- `EventReminders`: Gestor de recordatorios

---

### 8. Módulo de Pagos 💳

**Ruta**: `/payments`

#### Estructura de Pagos

```typescript
interface PaymentInfo {
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  paymentStatus: 'pending' | 'partial' | 'completed'
  paymentHistory: PaymentRecord[]
  dueDate?: string
}

interface PaymentRecord {
  id: string
  amount: number
  date: string
  method: 'cash' | 'card' | 'transfer' | 'check'
  paymentType?: 'blanco' | 'negro'
  reference?: string
  notes?: string
}
```

#### Funcionalidades

##### Seguimiento de Pagos
- **Pagos por pedido** con historial completo
- **Estados de pago**:
  - `pending`: Sin pagar
  - `partial`: Pago parcial
  - `completed`: Pagado completo
- **Cálculo automático** de montos pendientes

##### Registro de Pagos
- **Múltiples métodos** de pago
- **Tipo de pago** (blanco/negro) para contabilidad
- **Referencia** de transacción
- **Notas** adicionales
- **Fecha de vencimiento**

##### Reportes
- Pagos pendientes
- Pagos vencidos
- Historial de pagos por cliente
- Análisis de métodos de pago

#### Componente
- `PaymentTracker`: Seguimiento de pagos

---

### 9. Módulo de Reportes Financieros 📊

**Ruta**: `/reports`

#### Estructura de Reportes

```typescript
interface FinancialReport {
  period: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  paymentBreakdown: {
    completed: number
    partial: number
    pending: number
  }
  monthlyData: MonthlyFinancialData[]
  topServices: ServiceRevenue[]
}
```

#### Métricas y KPIs

##### Dashboard Financiero
- **Ingresos totales** por período
- **Número de pedidos**
- **Valor promedio** por pedido
- **Tasa de conversión**

##### Análisis de Pagos
- Desglose por estado de pago
- Distribución por método de pago
- Montos en blanco vs negro

##### Tendencias Mensuales
```typescript
interface MonthlyFinancialData {
  month: string
  revenue: number
  orders: number
  averageValue: number
}
```

##### Top Servicios
```typescript
interface ServiceRevenue {
  service: string
  revenue: number
  orders: number
  percentage: number
}
```

#### Visualizaciones
- **Gráficos de líneas**: Tendencias de ingresos
- **Gráficos de barras**: Comparativa mensual
- **Gráficos de torta**: Distribución por servicio
- **Tablas detalladas**: Datos completos

#### Exportación
- Exportar reportes a PDF
- Exportar datos a CSV
- Período personalizable

#### Componente
- `FinancialReports`: Dashboard de reportes con Recharts

---

## 🔌 APIs y Endpoints

### Endpoints de Presupuestos

#### POST `/api/generate-budget-from-order`
**Propósito**: Genera un presupuesto inicial desde un pedido

**Request Body**:
```typescript
{
  orderId: string
}
```

**Response**:
```typescript
{
  success: boolean
  budget: Budget
}
```

---

#### POST `/api/update-budget`
**Propósito**: Actualiza un presupuesto existente

**Request Body**:
```typescript
{
  budgetId: string
  budgetData: BudgetData
  adminNotes?: string
}
```

**Response**:
```typescript
{
  success: boolean
  budget: Budget
  version: number
}
```

---

#### POST `/api/generate-budget-pdf`
**Propósito**: Genera PDF del presupuesto con Puppeteer

**Request Body**:
```typescript
{
  budgetData: BudgetData
  budgetId: string
}
```

**Response**:
```typescript
{
  success: boolean
  pdfUrl: string
}
```

**Tecnología**:
- Puppeteer-core con @sparticuz/chromium
- Template HTML personalizado
- Almacenamiento en Supabase Storage

---

#### GET `/api/preview-budget-html`
**Propósito**: Vista previa HTML del presupuesto

**Query Params**:
- `budgetId`: ID del presupuesto

**Response**: HTML renderizado

---

#### POST `/api/approve-and-send-budget`
**Propósito**: Aprueba y envía presupuesto al cliente

**Request Body**:
```typescript
{
  budgetId: string
  orderId: string
  recipientEmail: string
  recipientName: string
  customMessage?: string
}
```

**Response**:
```typescript
{
  success: boolean
  emailSent: boolean
  pdfUrl: string
}
```

**Proceso**:
1. Valida presupuesto
2. Genera PDF
3. Actualiza estado a 'sent'
4. Envía email con PDF adjunto
5. Registra envío en logs

---

### Endpoints de Productos

#### GET `/api/products`
**Propósito**: Obtiene lista de productos con filtros

**Query Params**:
- `category?`: Filtrar por categoría
- `active?`: Filtrar por activos/inactivos
- `search?`: Búsqueda por nombre

**Response**:
```typescript
{
  products: Product[]
}
```

---

#### GET `/api/products/[id]`
**Propósito**: Obtiene un producto específico

**Response**:
```typescript
{
  product: Product
  comboIngredients?: ComboIngredient[]
}
```

---

#### POST `/api/products`
**Propósito**: Crea un nuevo producto

**Request Body**:
```typescript
{
  product: Omit<Product, 'id' | 'created_at' | 'updated_at'>
  comboIngredients?: Omit<ComboIngredient, 'id' | 'combo_id' | 'created_at'>[]
}
```

---

#### PUT `/api/products/[id]`
**Propósito**: Actualiza un producto

---

#### DELETE `/api/products/[id]`
**Propósito**: Elimina (desactiva) un producto

---

### Endpoints de Email

#### POST `/api/send-email`
**Propósito**: Envía emails con Resend

**Request Body**:
```typescript
{
  to: string
  subject: string
  html: string
  attachments?: {
    filename: string
    content: Buffer | string
  }[]
}
```

**Response**:
```typescript
{
  success: boolean
  messageId: string
}
```

---

## 🗄️ Modelo de Datos

### Tablas Principales

#### `catering_orders`
- Almacena todos los pedidos de catering
- Relación 1:N con budgets
- Relación 1:N con payment_records
- Relación 1:1 con event_calculations (opcional)

#### `budgets`
- Presupuestos generados
- JSONB para `budget_data`
- Versionado automático
- Estados de workflow

#### `products`
- Catálogo de productos
- Soporte para combos
- Múltiples tipos de precio

#### `combo_ingredients`
- Relación N:N entre combos y ingredientes
- Cantidades y unidades

#### `event_calculations`
- Cálculos de costos de eventos
- Versionado de cálculos
- Estadísticas calculadas

#### `event_calculation_ingredients`
- Ingredientes por evento
- Cantidades por persona y totales

#### `calendar_events`
- Eventos del calendario
- Vinculación opcional con pedidos

#### `payment_records`
- Historial de pagos
- Múltiples métodos de pago
- Trazabilidad completa

### Relaciones Clave

```
catering_orders (1) --- (N) budgets
catering_orders (1) --- (N) payment_records
catering_orders (1) --- (1) event_calculations
catering_orders (1) --- (N) calendar_events

event_calculations (1) --- (N) event_calculation_ingredients
event_calculations (1) --- (N) event_calculation_versions

products (1) --- (N) combo_ingredients (como combo)
products (1) --- (N) combo_ingredients (como ingrediente)
```

---

## 🔒 Seguridad

### Autenticación y Autorización

#### Supabase Auth
- **Email/Password** authentication
- **Session management** con cookies httpOnly
- **JWT tokens** para API requests
- **Middleware protection** en todas las rutas admin

#### Row Level Security (RLS)
Políticas de seguridad a nivel de base de datos:

```sql
-- Ejemplo: Solo usuarios autenticados pueden leer
CREATE POLICY "Authenticated users can read products"
ON products FOR SELECT
USING (auth.role() = 'authenticated');

-- Solo admins pueden modificar
CREATE POLICY "Only admins can modify products"
ON products FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');
```

### Protección de Rutas

#### Middleware
- Verifica sesión en cada request
- Redirección automática a `/login` si no autenticado
- Protección de API routes

#### Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

### Buenas Prácticas
- ✅ Secrets nunca en el código
- ✅ API keys en variables de entorno
- ✅ HTTPS en producción
- ✅ Validación de inputs
- ✅ Sanitización de datos
- ✅ Rate limiting en APIs críticas

---

## 🎨 UX/UI

### Diseño y Layout

#### Estructura Principal
```
┌─────────────────────────────────────┐
│          Header (Top Bar)           │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │   Main Content Area      │
│ (Nav)    │   (Page Component)       │
│          │                          │
└──────────┴──────────────────────────┘
```

#### Componentes de Layout
- **Header**: Logo, usuario, notificaciones
- **Sidebar**: Navegación principal
  - 📦 Pedidos
  - 💰 Presupuestos
  - 🧮 Calculadora
  - 💵 Precios
  - 📅 Calendario
  - ⏰ Recordatorios
  - 💳 Pagos
  - 📊 Reportes

### Sistema de Diseño

#### CSS Modules
- Estilos modulares por componente
- Evita conflictos de nombres
- Tree-shaking automático

#### Paleta de Colores
- Basada en branding de Fuegos d'Azur
- Tema claro optimizado para uso diario
- Contraste accesible

#### Tipografía
- Fuentes system por defecto
- Jerarquía clara de headings
- Legibilidad optimizada

### Componentes UI Reutilizables

#### `Loader`
- Spinner de carga
- Estados de loading consistentes

#### `ConfirmationModal`
- Modal genérico para confirmaciones
- Usado en acciones destructivas

#### `Toaster` (Sonner)
- Notificaciones toast
- Success, error, info, warning
- Auto-dismiss configurable

### Responsive Design
- Layout adaptable a tablets
- Sidebar colapsable
- Tablas con scroll horizontal en móvil

---

## 📱 Flujos de Usuario

### Flujo 1: Gestión de Pedido Nuevo

```
1. Cliente envía formulario de contacto (sitio web)
   ↓
2. Pedido aparece en /orders con estado 'pending'
   ↓
3. Admin revisa pedido y detalles del evento
   ↓
4. Admin genera presupuesto desde el pedido
   ↓
5. Editor de presupuesto se abre con datos pre-cargados
   ↓
6. Admin ajusta precios y secciones
   ↓
7. Admin guarda presupuesto (estado: draft)
   ↓
8. Admin revisa y aprueba presupuesto
   ↓
9. Sistema genera PDF y envía email al cliente
   ↓
10. Estado del pedido cambia a 'sent'
```

---

### Flujo 2: Cálculo de Costos de Evento

```
1. Admin va a /calculator
   ↓
2. Crea nuevo evento con nombre, fecha, y # invitados
   ↓
3. Agrega ingredientes uno por uno:
   - Selecciona producto
   - Define cantidad por persona
   - Sistema calcula total automáticamente
   ↓
4. Revisa estadísticas y costo total
   ↓
5. Agrega notas y observaciones
   ↓
6. Genera PDF del cálculo
   ↓
7. (Opcional) Vincula a un pedido específico
   ↓
8. (Opcional) Genera presupuesto desde el cálculo
```

---

### Flujo 3: Seguimiento de Pagos

```
1. Cliente aprueba presupuesto
   ↓
2. Admin registra primer pago:
   - Monto
   - Método (efectivo, tarjeta, transferencia)
   - Tipo (blanco/negro)
   - Fecha
   ↓
3. Sistema calcula monto pendiente
   ↓
4. Estado de pago cambia a 'partial'
   ↓
5. Sistema crea recordatorio para pago final
   ↓
6. Admin registra pagos subsecuentes
   ↓
7. Cuando total está pagado, estado cambia a 'completed'
```

---

### Flujo 4: Actualización de Precios

```
1. Admin va a /prices
   ↓
2. Busca o filtra producto
   ↓
3. Hace clic en "Editar"
   ↓
4. Modal de edición se abre
   ↓
5. Admin modifica:
   - Precio por kg/porción/unidad
   - Porción por persona
   - Aclaraciones
   - Estado activo/inactivo
   ↓
6. Guarda cambios
   ↓
7. Sistema actualiza producto en BD
   ↓
8. Cambio se refleja inmediatamente en:
   - Nuevos presupuestos
   - Calculadora de eventos
```

---

### Flujo 5: Generación de Reportes

```
1. Admin va a /reports
   ↓
2. Selecciona período (mes, trimestre, año)
   ↓
3. Sistema calcula métricas:
   - Ingresos totales
   - Número de pedidos
   - Valor promedio
   - Desglose de pagos
   ↓
4. Visualiza gráficos y tablas
   ↓
5. (Opcional) Exporta a PDF o CSV
```

---

## 🚀 Deployment

### Netlify Configuration

#### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
  NEXT_TELEMETRY_DISABLED = "1"
```

### Variables de Entorno en Producción

Configurar en Netlify Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

### Build Process

```bash
npm run build
```

### Optimizaciones

#### Next.js Config
```javascript
{
  images: {
    unoptimized: true, // Para Netlify
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@sparticuz/chromium',
      'puppeteer-core'
    ]
  }
}
```

---

## 🧪 Testing

### Estructura de Tests

El proyecto incluye soporte para TestSprite en:
```
testsprite_tests/
```

### Tipos de Tests Recomendados

#### Unit Tests
- Funciones de cálculo de presupuestos
- Utilidades de conversión de unidades
- Validaciones de datos

#### Integration Tests
- Flujos de generación de presupuestos
- Procesamiento de pagos
- Generación de PDFs

#### E2E Tests
- Flujo completo de pedido a presupuesto
- Autenticación y autorización
- Navegación entre módulos

---

## 📈 Métricas y KPIs

### Métricas del Sistema

#### Performance
- **Tiempo de carga** de página < 2s
- **Tiempo de generación de PDF** < 5s
- **Tiempo de respuesta API** < 500ms

#### Funcionales
- **Tasa de conversión** pedido → presupuesto aprobado
- **Tiempo promedio** de procesamiento de pedido
- **Número de presupuestos** generados por mes

#### Financieras
- **Ingresos totales** mensuales
- **Valor promedio** por pedido
- **Tasa de cobro** (pagos completados)

---

## 🔄 Roadmap Futuro

### Fase 2 - Q1 2026

#### Nuevas Funcionalidades
1. **Dashboard mejorado**
   - KPIs en tiempo real
   - Gráficos interactivos
   - Filtros avanzados

2. **Notificaciones push**
   - Alertas de nuevos pedidos
   - Recordatorios automáticos
   - Notificaciones de pagos

3. **Integración con WhatsApp**
   - Envío de presupuestos via WhatsApp
   - Recordatorios automáticos
   - Chat con clientes

4. **App móvil**
   - Versión nativa para iOS/Android
   - Gestión en tiempo real
   - Notificaciones móviles

### Fase 3 - Q2 2026

#### Optimizaciones
1. **IA para predicción de costos**
   - Sugerencias de precios
   - Optimización de ingredientes
   - Predicción de demanda

2. **Automatización**
   - Recordatorios automáticos
   - Follow-ups por email
   - Generación de reportes programados

3. **Integraciones**
   - Sistemas de contabilidad
   - Plataformas de pago online
   - CRM externo

---

## 📚 Documentación Adicional

### Para Desarrolladores

#### Setup Local
```bash
# Clonar repositorio
git clone [repo-url]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

#### Estructura de Directorios
```
src/
├── app/              # Next.js App Router
│   ├── (admin)/      # Rutas protegidas
│   ├── api/          # API Routes
│   └── login/        # Autenticación
├── components/       # Componentes React
├── hooks/            # Custom hooks
├── lib/              # Utilidades y servicios
├── services/         # Servicios de negocio
├── types/            # TypeScript types
└── utils/            # Funciones auxiliares
```

### Para Administradores

#### Guías de Usuario
- [Gestión de Pedidos](./docs/user-guides/orders.md)
- [Creación de Presupuestos](./docs/user-guides/budgets.md)
- [Calculadora de Eventos](./docs/user-guides/calculator.md)
- [Gestión de Precios](./docs/user-guides/prices.md)

#### Guías de Configuración
- [Configuración de Base de Datos](./database/README.md)
- [Configuración de Emails](./docs/setup/emails.md)
- [Configuración de PDFs](./docs/setup/pdfs.md)

---

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Error de conexión a Supabase
**Síntomas**: APIs fallan, login no funciona
**Solución**:
- Verificar variables de entorno
- Comprobar RLS policies
- Revisar logs de Supabase

#### 2. PDFs no se generan
**Síntomas**: Error al generar presupuesto
**Solución**:
- Verificar Puppeteer está instalado
- Comprobar permisos de Supabase Storage
- Revisar logs del API route

#### 3. Emails no se envían
**Síntomas**: Presupuestos no llegan a clientes
**Solución**:
- Verificar API key de Resend
- Comprobar dominio verificado
- Revisar logs de envío

---

## 📞 Soporte y Contacto

### Equipo de Desarrollo
- **Email**: dev@fuegosdazur.com
- **Documentación**: [docs.fuegosdazur.com]

### Recursos
- [Repositorio GitHub](repo-url)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Resend](https://resend.com/docs)

---

## 📝 Changelog

### Version 1.0.0 (Actual)
- ✅ Sistema completo de gestión de pedidos
- ✅ Editor de presupuestos multi-sección
- ✅ Calculadora de eventos con versionado
- ✅ Gestión de precios y productos
- ✅ Calendario de eventos
- ✅ Sistema de recordatorios
- ✅ Seguimiento de pagos
- ✅ Reportes financieros
- ✅ Generación de PDFs profesionales
- ✅ Envío automático de emails
- ✅ Autenticación y seguridad

---

## 📄 Licencia

Propietario: **Fuegos d'Azur**  
Uso: **Interno - Todos los derechos reservados**

---

**Documento creado**: Diciembre 2025  
**Última actualización**: Diciembre 2025  
**Versión del PRD**: 1.0  
**Estado**: Aprobado ✅

