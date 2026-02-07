# Kopeo - Event Drinks Ticketing Platform

Una plataforma web para la compra de tickets de bebidas en eventos con generación de códigos QR.

## 🚀 Características

- **Home Page**: Descubrimiento de eventos basado en geolocalización
- **Página de Evento**: Detalles del evento y compra de bebidas con carrito
- **Wallet**: Códigos QR para las bebidas compradas
- **Scanner**: Escaneo de QR para comercios y canje de bebidas
- **Backoffice**: CRUD de productos, eventos y configuración para comercios
- **Panel Admin**: Gestión completa de usuarios, comercios, eventos y pedidos
- **Pagos**: Integración con Stripe (modo test)

## 🛠️ Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** (tema oscuro con paleta personalizada)
- **Supabase** (Auth, PostgreSQL, Row Level Security)
- **Stripe** (Checkout Sessions, Webhooks)
- **Zustand** (gestión de estado del carrito)
- **html5-qrcode** (escaneo de QR)
- **qrcode** (generación de QR)
- **lucide-react** (iconos)

## 📋 Requisitos

- Node.js 18+
- Cuenta de Supabase
- Cuenta de Stripe (modo test)

## 🔧 Instalación

1. Clona el repositorio e instala dependencias:
```bash
npm install
```

2. Configura las variables de entorno en `.env.local`:
```env
# Supabase - https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe - https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Ejecuta las migraciones de Supabase:
   - Ve a tu proyecto en Supabase Dashboard
   - Navega a SQL Editor
   - Copia y ejecuta el contenido de `supabase/migrations/001_initial_schema.sql`

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🧪 Stripe Test Cards

Para probar pagos en modo test, usa estas tarjetas:

| Tarjeta | Número | Resultado |
|---------|--------|-----------|
| Visa    | 4242 4242 4242 4242 | Pago exitoso |
| Mastercard | 5555 5555 5555 4444 | Pago exitoso |
| Visa 3D Secure | 4000 0025 0000 3155 | Requiere autenticación |
| Rechazada | 4000 0000 0000 0002 | Tarjeta rechazada |

- Fecha: cualquier fecha futura
- CVC: cualquier 3 dígitos
- Código postal: cualquier 5 dígitos

## 🔒 Stripe Webhooks

Para desarrollo local con webhooks:

1. Instala Stripe CLI: https://stripe.com/docs/stripe-cli
2. Ejecuta el listener:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
3. Copia el webhook secret (`whsec_...`) a `.env.local`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/           # Panel de administración
│   ├── api/             # API Routes (checkout, webhook)
│   ├── auth/            # Autenticación (login, register)
│   ├── backoffice/      # Panel de comercio
│   ├── checkout/        # Proceso de pago
│   ├── event/[id]/      # Detalle de evento
│   ├── scanner/         # Escáner QR para comercios
│   ├── wallet/          # Wallet con códigos QR
│   └── page.tsx         # Home (eventos cercanos)
├── components/
│   ├── Navbar.tsx
│   ├── CartDrawer.tsx
│   └── LoadingSpinner.tsx
├── lib/
│   ├── supabase/        # Cliente Supabase
│   ├── stripe.ts        # Configuración Stripe
│   └── types.ts         # TypeScript types
├── store/
│   └── cart.ts          # Zustand cart store
└── middleware.ts        # Auth middleware
```

## 🎨 Paleta de Colores

- **Primary**: `#8400D6`, `#9341EA` (púrpura)
- **Accent/Orange**: `#FF6600`, `#F5A300` (naranja)
- **Background**: `#0A0A0A` (negro)
- **Surface**: `#1A1A1A` (gris oscuro)
- **Border**: `#2A2A2A` (borde)

## 👥 Roles de Usuario

- **client**: Usuario normal, puede comprar bebidas
- **commerce**: Dueño de comercio, puede crear eventos y escanear QR
- **admin**: Acceso total a todo el sistema

## 📝 Licencia

MIT
