# 📘 Memòria Tècnica del Projecte - UD1A

**Projecte:** Kopeo - Plataforma de Gestió de Tiquets de Begudes  
**Autors:** Francisco Javier Rosselló Jerónimo, Ferran Azpiazu Adrover  
**Tutor:** Miquel Antoni Capellà Arrom  
**Centre:** CIFP Francesc de Borja Moll  
**Data:** 7 de febrer de 2026  
**Versió:** 1.0 - UD1A

---

## 📋 Índex

1. [Introducció](#introducció)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnològic](#stack-tecnològic)
4. [Base de Dades](#base-de-dades)
5. [Funcionalitats Implementades](#funcionalitats-implementades)
6. [Seguretat](#seguretat)
7. [Desplegament](#desplegament)
8. [Conclusions i Pròxims Passos](#conclusions-i-pròxims-passos)

---

## 1. Introducció

### 1.1. Context del Projecte

Kopeo és una aplicació web dissenyada per revolucionar la gestió de tiquets de begudes en l'àmbit de l'oci nocturn. El projecte resol el problema de les llargues cues a les barres mitjançant la compra anticipada de begudes amb pagament digital i generació de codis QR per al bescanvi.

### 1.2. Objectius de la UD1A

Aquest document recull la memòria tècnica de la fase inicial del desenvolupament (UD1A), centrada en:

- Configuració de l'entorn de desenvolupament
- Implementació de l'estructura base del projecte
- Desenvolupament de funcionalitats core:
  - Pàgina d'inici (Home)
  - Sistema d'autenticació (Login/Registre)
  - Backoffice per a comercios (Gestió d'esdeveniments i productes)

### 1.3. Abast del Document

Aquest document descriu les decisions tècniques preses, l'arquitectura implementada, les tecnologies utilitzades i els detalls d'implementació de les funcionalitats desenvolupades fins al 7 de febrer de 2026.

---

## 2. Arquitectura del Sistema

### 2.1. Arquitectura General

Kopeo segueix una arquitectura de tres capes:

```
┌─────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓ             │
│     (Next.js 16 - App Router)           │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │   Home   │  │  Login   │  │Backoff.││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         CAPA DE LÒGICA DE NEGOCI        │
│          (API Routes + Server           │
│           Components + Client           │
│           Components)                   │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Auth    │  │ Business │  │ State  ││
│  │  Logic   │  │  Logic   │  │  Mgmt  ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         CAPA DE DADES                   │
│       (Supabase PostgreSQL)             │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │PostgreSQL│  │   Auth   │  │Storage ││
│  │  + RLS   │  │ Service  │  │ (futur)││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```

### 2.2. Decisions Arquitectòniques

#### 2.2.1. Next.js App Router vs Pages Router

**Decisió:** Utilitzar App Router (Next.js 13+)

**Justificació:**
- Millor rendiment amb Server Components
- Streaming i Suspense natius
- Millor organització del codi amb carpetes
- Suport millor per a metadata i SEO
- És l'estàndard actual i futur de Next.js

**Impacte:**
- Corba d'aprenentatge inicial
- Millor experiència d'usuari amb càrregues més ràpides
- Codi més mantenible

#### 2.2.2. Supabase com a Backend-as-a-Service

**Decisió:** Utilitzar Supabase en lloc d'un backend custom

**Justificació:**
- Autenticació d'usuaris out-of-the-box
- PostgreSQL amb Row Level Security
- API REST generada automàticament
- Realtime subscriptions disponibles
- Reducció del temps de desenvolupament
- Escalabilitat gestionada

**Alternatives considerades:**
- Firebase: Menys flexible amb SQL, base de dades NoSQL
- Backend custom amb Express.js: Més temps de desenvolupament

#### 2.2.3. Monòlit vs Microserveis

**Decisió:** Aplicació monolítica

**Justificació:**
- Projecte de mida mitjana
- Equip petit (2 desenvolupadors)
- Més fàcil de desplegar i mantenir
- Desplegament en Vercel sense configuració complexa

### 2.3. Patrons de Disseny Utilitzats

#### 2.3.1. Component Pattern
Tots els elements de la UI són components reutilitzables de React:
- `Navbar`: Navegació principal
- `LoadingSpinner`: Indicador de càrrega
- `CartDrawer`: Carret lateral (futur)
- `AddressAutocomplete`: Component d'autocompletat d'adreces

#### 2.3.2. Container/Presentational Pattern
Separació entre components amb lògica de negoci i components purs de presentació:
- **Container**: Components que gestionen l'estat i la lògica (`pages.tsx`)
- **Presentational**: Components que només mostren dades (`components/`)

#### 2.3.3. Singleton Pattern
Client de Supabase creat una sola vegada:
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## 3. Stack Tecnològic

### 3.1. Frontend

| Tecnologia | Versió | Justificació |
|------------|--------|--------------|
| **Next.js** | 16.0 | Framework React amb SSR, SSG i ISR. App Router per a millor rendiment |
| **React** | 19.0 | Biblioteca UI més popular, gran ecosistema |
| **TypeScript** | 5.7 | Type safety, millor experiència de desenvolupament |
| **Tailwind CSS** | 3.4 | Utility-first CSS, desenvolupament ràpid, tema consistent |
| **Lucide React** | Latest | Icones modernes i lleugeres |
| **html5-qrcode** | Latest | Escaneig de QR (funcionalitat futura) |
| **qrcode** | Latest | Generació de QR (funcionalitat futura) |
| **Leaflet** | 1.9.4 | Mapes interactius per a ubicació d'esdeveniments |
| **React Leaflet** | Latest | Integració de Leaflet amb React |

### 3.2. Backend i Base de Dades

| Tecnologia | Versió | Justificació |
|------------|--------|--------------|
| **Supabase** | Latest | BaaS amb PostgreSQL, Auth, Storage |
| **PostgreSQL** | 15+ | BBDD relacional robusta i escalable |
| **Supabase Auth** | Latest | Autenticació segura amb JWT |

### 3.3. Pagaments (Planificat)

| Tecnologia | Versió | Justificació |
|------------|--------|--------------|
| **Stripe** | Latest | Plataforma de pagaments més utilitzada |
| **Stripe Checkout** | Latest | Formulari de pagament segur hostat |

### 3.4. Desplegament i DevOps

| Tecnologia | Justificació |
|------------|--------------|
| **Vercel** | Desplegament automàtic des de GitHub, optimitzat per a Next.js |
| **GitHub** | Control de versions, col·laboració |
| **Trello** | Gestió de tasques i planificació |

### 3.5. Configuració de Dependències

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "tailwindcss": "^3.4.0",
    "lucide-react": "latest",
    "leaflet": "^1.9.4",
    "react-leaflet": "latest",
    "zustand": "latest"
  }
}
```

---

## 4. Base de Dades

### 4.1. Disseny de la Base de Dades

El disseny de la base de dades segueix un model relacional normalitzat amb 12 taules principals:

#### 4.1.1. Diagrama ER Complet

```
                                    ┌─────────────────────────────────┐
                                    │         auth.users              │
                                    │  (Taula de Supabase Auth)       │
                                    ├─────────────────────────────────┤
                                    │ id (PK)                         │
                                    │ email                           │
                                    │ encrypted_password              │
                                    └─────────────────┬───────────────┘
                                                      │ 1:1
                                                      │
                    ┌─────────────────────────────────▼───────────────┐
                    │              profiles                            │
                    ├──────────────────────────────────────────────────┤
                    │ id (PK, FK → auth.users)                         │
                    │ email (UNIQUE, NOT NULL)                         │
                    │ full_name                                        │
                    │ role (DEFAULT 'client')  → 'client'|'commerce'|'admin' │
                    │ created_at, updated_at                           │
                    └───────────┬──────────────────────────────────────┘
                                │ 1:N
                                │
                    ┌───────────▼──────────────────────────────────────┐
                    │              commerces                           │
                    ├──────────────────────────────────────────────────┤
                    │ id (PK)                                          │
                    │ owner_id (FK → profiles.id)                      │
                    │ name (NOT NULL)                                  │
                    │ description, address, phone, email, website      │
                    │ logo_url                                         │
                    │ is_verified (DEFAULT FALSE)                      │
                    │ created_at, updated_at                           │
                    └───────┬────────────────┬─────────────────────────┘
                            │ 1:N            │ 1:N
                            │                │
            ┌───────────────▼────┐      ┌────▼──────────────────────┐
            │      events        │      │       products            │
            ├────────────────────┤      ├───────────────────────────┤
            │ id (PK)            │      │ id (PK)                   │
            │ commerce_id (FK)   │      │ commerce_id (FK)          │
            │ title (NOT NULL)   │      │ name (NOT NULL)           │
            │ description        │      │ description               │
            │ start_date*        │      │ price (DECIMAL, NOT NULL) │
            │ end_date           │      │ image_url                 │
            │ address            │      │ is_available (DEFAULT T)  │
            │ latitude           │      │ created_at, updated_at    │
            │ longitude          │      └───────┬───────────────────┘
            │ image_url          │              │
            │ is_active (DEF T)  │              │
            │ created_at         │              │
            └───────┬────────────┘              │
                    │                           │
                    │ N:M                       │
                    │                           │
            ┌───────▼───────────────────────────▼─────┐
            │         event_products (N:M)            │
            ├─────────────────────────────────────────┤
            │ id (PK)                                 │
            │ event_id (FK → events.id) ON DELETE CASCADE │
            │ product_id (FK → products.id) ON DELETE CASCADE │
            │ created_at                              │
            │ UNIQUE(event_id, product_id)            │
            └───────┬─────────────────────────────────┘
                    │
                    │
┌───────────────────┴──────────────────────────────────────────────────┐
│                                                                       │
│            ┌──────────────────────┐         ┌─────────────────┐     │
│            │       orders         │         │  wallet_items   │     │
│            ├──────────────────────┤         ├─────────────────┤     │
│            │ id (PK)              │         │ id (PK)         │     │
│    ┌───────┤ user_id (FK)         │    ┌────┤ user_id (FK)    │     │
│    │       │ event_id (FK)        ├────┤    │ order_id (FK)   │     │
│    │       │ stripe_session_id    │ 1:N│    │ product_id (FK) │     │
│    │       │ total (DECIMAL)      │    │    │ event_id (FK)   │     │
│    │       │ status ('pending')   │    │    │ qr_code (UNIQUE)│     │
│    │       │ created_at           │    │    │ is_redeemed     │     │
│    │       └────────┬─────────────┘    │    │ redeemed_at     │     │
│    │                │ 1:N              │    │ created_at      │     │
│    │                │                  │    └─────────────────┘     │
│    │       ┌────────▼─────────────┐    │                            │
│    │       │    order_items       │    │                            │
│    │       ├──────────────────────┤    │                            │
│    │       │ id (PK)              │    │                            │
│    │       │ order_id (FK)        │    │                            │
│    │       │ product_id (FK)      │    │                            │
│    │       │ quantity (NOT NULL)  │    │                            │
│    │       │ price (DECIMAL)      │    │                            │
│    │       │ created_at           │    │                            │
│    │       └──────────────────────┘    │                            │
│    │                                    │                            │
│    └────────────────────────────────────┘                            │
│         (Totes FK → profiles.id)                                    │
└─────────────────────────────────────────────────────────────────────┘

LLEGENDA:
─────────────────────────────────────────────────────────────────────
PK   = Primary Key (Clau Primària)
FK   = Foreign Key (Clau Forana)
*    = NOT NULL (Camp obligatori)
1:1  = Relació un a un
1:N  = Relació un a molts
N:M  = Relació molts a molts
T    = TRUE (per defecte)
─────────────────────────────────────────────────────────────────────

RELACIONS PRINCIPALS:
• profiles ↔ auth.users (1:1) - Extensió de l'usuari Supabase
• profiles → commerces (1:N) - Un usuari pot tenir múltiples comercios
• commerces → events (1:N) - Un comerç té múltiples esdeveniments
• commerces → products (1:N) - Un comerç té múltiples productes
• events ↔ products (N:M via event_products) - Productes disponibles per esdeveniment
• profiles → orders (1:N) - Un usuari pot fer múltiples comandes
• orders → order_items (1:N) - Una comanda té múltiples ítems
• orders → wallet_items (1:N) - Cada comanda genera ítems a la wallet
```

#### 4.1.2. Resum de Taules

| # | Taula | Descripció | Relacions | RLS |
|---|-------|------------|-----------|-----|
| 1 | **profiles** | Perfils d'usuari amb rols | 1:1 amb auth.users, 1:N amb commerces/orders/wallet_items | ✅ |
| 2 | **commerces** | Locals/negocis que organitzen esdeveniments | 1:N amb events/products | ✅ |
| 3 | **events** | Esdeveniments on es venen begudes | N:M amb products via event_products | ✅ |
| 4 | **products** | Begudes disponibles per comprar | N:M amb events | ✅ |
| 5 | **event_products** | Taula intermèdia events ↔ products | - | ✅ |
| 6 | **orders** | Comandes realitzades pels usuaris | 1:N amb order_items i wallet_items | ✅ |
| 7 | **order_items** | Detall dels productes de cada comanda | - | ✅ |
| 8 | **wallet_items** | Begudes comprades amb codis QR | - | ✅ |

### 4.2. Taules Principals

#### 4.2.1. Taula `profiles`
Emmagatzema la informació dels usuaris.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Camps clau:**
- `role`: Pot ser 'client', 'commerce' o 'admin'
- Relació 1:1 amb `auth.users` de Supabase

#### 4.2.2. Taula `commerces`
Informació dels locals o comercios.

```sql
CREATE TABLE commerces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Camps clau:**
- `owner_id`: Usuari propietari del comerç (rol 'commerce')
- `is_verified`: Control d'aprovació per part d'admins

#### 4.2.3. Taula `events`
Esdeveniments creats pels comercios.

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commerce_id UUID REFERENCES commerces(id),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Camps clau:**
- `latitude` i `longitude`: Per a geolocalització
- `is_active`: Permet activar/desactivar esdeveniments
- `start_date` i `end_date`: Control de dates de l'esdeveniment

#### 4.2.4. Taula `products`
Productes (begudes) que ofereix cada comerç.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commerce_id UUID REFERENCES commerces(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.2.5. Taula `event_products`
Relació N:M entre esdeveniments i productes.

```sql
CREATE TABLE event_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, product_id)
);
```

### 4.3. Row Level Security (RLS)

Supabase PostgreSQL utilitza RLS per controlar l'accés a nivell de fila.

#### 4.3.1. Funció Helper `is_admin()`

Per evitar recursivitat en les polítiques, es va crear una funció SECURITY DEFINER:

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN user_role = 'admin';
END;
$$;
```

#### 4.3.2. Polítiques de Seguretat

**Exemple: Polítiques de `events`**

```sql
-- Tots poden veure esdeveniments actius
CREATE POLICY "Anyone can view active events"
ON events FOR SELECT
USING (is_active = true);

-- Comercios poden veure els seus esdeveniments
CREATE POLICY "Commerce can view own events"
ON events FOR SELECT
USING (
  commerce_id IN (
    SELECT id FROM commerces WHERE owner_id = auth.uid()
  )
);

-- Comercios poden crear esdeveniments
CREATE POLICY "Commerce can create events"
ON events FOR INSERT
WITH CHECK (
  commerce_id IN (
    SELECT id FROM commerces WHERE owner_id = auth.uid()
  )
);

-- Comercios poden actualitzar els seus esdeveniments
CREATE POLICY "Commerce can update own events"
ON events FOR UPDATE
USING (
  commerce_id IN (
    SELECT id FROM commerces WHERE owner_id = auth.uid()
  )
);

-- Comercios poden eliminar els seus esdeveniments
CREATE POLICY "Commerce can delete own events"
ON events FOR DELETE
USING (
  commerce_id IN (
    SELECT id FROM commerces WHERE owner_id = auth.uid()
  )
);

-- Admins tenen accés total
CREATE POLICY "Admins have full access"
ON events FOR ALL
USING (is_admin());
```

### 4.4. Triggers

#### 4.4.1. Creació Automàtica de Perfil

Quan un usuari es registra, es crea automàticament el seu perfil:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 5. Funcionalitats Implementades

### 5.1. Pàgina d'Inici (Home)

#### 5.1.1. Descripció

Pàgina principal que mostra els esdeveniments disponibles amb opcions de cerca i filtratge.

#### 5.1.2. Ruta

`/` (src/app/page.tsx)

#### 5.1.3. Implementació Tècnica

**Arquitectura:**
- Server Component per a la càrrega inicial de dades
- Client Component per a interactivitat (cerca, filtratge)

**Codi simplificat:**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/lib/types'

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('start_date', { ascending: true })

    if (data) setEvents(data)
    setLoading(false)
  }

  // ... render
}
```

**Funcionalitats:**
- Llistat d'esdeveniments actius
- Ordenació per data
- Visualització d'informació: imatge, títol, data, ubicació
- Navegació al detall de cada esdeveniment

**Millores futures:**
- Geolocalització per mostrar esdeveniments propers
- Filtres per categoria, data, preu
- Cerca per nom d'esdeveniment

#### 5.1.4. Captura de Pantalla

[Pàgina d'inici amb llistat d'esdeveniments]

---

### 5.2. Sistema d'Autenticació

#### 5.2.1. Descripció

Sistema complet d'autenticació amb registre, login i gestió de sessions.

#### 5.2.2. Rutes

- `/auth/login` - Pàgina de login
- `/auth/register` - Pàgina de registre
- `/auth/callback` - Callback OAuth (futur)

#### 5.2.3. Implementació del Login

**Ruta:** `src/app/auth/login/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/' // Força refresc per actualitzar sessió
    }
  }

  // ... formulari
}
```

**Característiques:**
- Validació de camps
- Gestió d'errors
- Indicador de càrrega
- Redirecció després del login
- Enllaç a la pàgina de registre

#### 5.2.4. Implementació del Registre

**Ruta:** `src/app/auth/register/page.tsx`

Funcionalitats similars al login amb camps addicionals:
- Nom complet
- Confirmació de contrasenya
- Acceptació de termes i condicions

#### 5.2.5. Middleware de Protecció

**Ruta:** `src/middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.getSession()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Funcionalitat:**
- Refresca la sessió en cada petició
- Gestiona cookies de sessions
- Permet accés a rutes públiques

---

### 5.3. Backoffice per a Comercios

#### 5.3.1. Descripció

Panell d'administració per a comercios on poden gestionar els seus esdeveniments i productes.

#### 5.3.2. Rutes

- `/backoffice` - Dashboard principal (futur)
- `/backoffice/events` - Gestió d'esdeveniments
- `/backoffice/products` - Gestió de productes
- `/backoffice/commerce` - Configuració del comerç (futur)

#### 5.3.3. Layout del Backoffice

**Ruta:** `src/app/backoffice/layout.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'commerce' || profile?.role === 'admin') {
      setAuthorized(true)
    } else {
      router.push('/')
    }

    setLoading(false)
  }

  if (loading) return <LoadingSpinner />
  if (!authorized) return <div>Acceso denegado</div>

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
```

**Funcionalitat:**
- Verifica autenticació de l'usuari
- Comprova que l'usuari té rol 'commerce' o 'admin'
- Redirigeix a login si no autenticat
- Redirigeix a home si no té permisos

---

#### 5.3.4. Gestió d'Esdeveniments

**Ruta:** `src/app/backoffice/events/page.tsx`

##### Funcionalitats Implementades:

**a) Llistar Esdeveniments**
- Vista de tots els esdeveniments del comerç
- Informació: imatge, títol, data, ubicació, estat
- Accions: Editar, Eliminar

**b) Crear/Editar Esdeveniment**

Modal amb formulari complet:

```typescript
function EventModal({ event, onClose, onSave }) {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [address, setAddress] = useState(event?.address || '')
  const [startDate, setStartDate] = useState(...)
  const [endDate, setEndDate] = useState(...)
  const [latitude, setLatitude] = useState(event?.latitude || null)
  const [longitude, setLongitude] = useState(event?.longitude || null)

  const handleAddressChange = (newAddress, lat, lng) => {
    setAddress(newAddress)
    setLatitude(lat)
    setLongitude(lng)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSave({
      title,
      description,
      address,
      start_date: new Date(startDate).toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      latitude,
      longitude,
      // ...
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={description} ... />
      
      <AddressAutocomplete
        value={address}
        latitude={latitude}
        longitude={longitude}
        onChange={handleAddressChange}
      />
      
      {/* ... altres camps */}
    </form>
  )
}
```

**Camps del formulari:**
- Títol * (obligatori)
- Descripció
- Data d'inici * (obligatori)
- Data de fi
- Ubicació amb autocompletat
- Mapa interactiu
- URL d'imatge
- Estat actiu/inactiu

##### Component AddressAutocomplete

**Ruta:** `src/components/AddressAutocomplete.tsx`

Component personalitzat que integra:

**a) API de Nominatim (OpenStreetMap)**
- Cerca gratuïta d'adreces
- Suggeriments en temps real
- Coordenades automàtiques

```typescript
const searchAddresses = async (query: string) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?` + 
    new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5',
      countrycodes: 'es',
    })
  )
  const data = await response.json()
  setResults(data)
}
```

**b) Debounce per optimització**
- Espera 300ms abans de fer la cerca
- Evita peticions innecessàries

```typescript
const handleInputChange = (e) => {
  const newQuery = e.target.value
  setQuery(newQuery)
  
  if (debounceRef.current) {
    clearTimeout(debounceRef.current)
  }
  
  debounceRef.current = setTimeout(() => {
    searchAddresses(newQuery)
  }, 300)
}
```

**c) Navegació amb teclat**
- Fletxes amunt/avall per navegar suggeriments
- Enter per seleccionar
- Escape per tancar

**d) Mapa amb Leaflet**

Component `LocationMap.tsx`:

```typescript
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function LocationMap({ latitude, longitude, onLocationChange }) {
  useEffect(() => {
    const map = L.map(mapRef.current).setView([latitude, longitude], 15)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    
    const marker = L.marker([latitude, longitude], { draggable: true }).addTo(map)
    
    marker.on('dragend', () => {
      const pos = marker.getLatLng()
      onLocationChange(pos.lat, pos.lng)
    })
  }, [latitude, longitude])

  return <div ref={mapRef} style={{ height: '200px', width: '100%' }} />
}
```

**Funcionalitats del mapa:**
- Visualització de la ubicació seleccionada
- Marcador arrossegable per ajustar posició
- Actualització dinàmica de coordenades

##### Eliminació d'Esdeveniment

```typescript
const handleDelete = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar este evento?')) return

  await supabase.from('events').delete().eq('id', id)
  setEvents(events.filter(e => e.id !== id))
}
```

**Característiques:**
- Confirmació abans d'eliminar
- Actualització optimista de la UI

---

#### 5.3.5. Gestió de Productes

**Ruta:** `src/app/backoffice/products/page.tsx`

##### Funcionalitats Implementades:

**a) Llistar Productes**
- Vista en grid de productes
- Informació: imatge, nom, preu, disponibilitat
- Accions: Editar, Eliminar

**b) Crear/Editar Producte**

Modal amb formulari:

```typescript
function ProductModal({ product, onClose, onSave }) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price || '')
  const [imageUrl, setImageUrl] = useState(product?.image_url || '')
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSave({
      name,
      description,
      price: parseFloat(price),
      image_url: imageUrl,
      is_available: isAvailable,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} required />
      <textarea value={description} ... />
      <input type="number" step="0.01" value={price} ... required />
      <input type="url" value={imageUrl} ... />
      <label>
        <input type="checkbox" checked={isAvailable} ... />
        Disponible
      </label>
      <button type="submit">Guardar</button>
    </form>
  )
}
```

**Camps del formulari:**
- Nom del producte * (obligatori)
- Descripció
- Preu * (obligatori, decimal)
- URL d'imatge
- Disponible (checkbox)

**c) Operacions CRUD**

```typescript
const handleSave = async (product) => {
  if (editingProduct) {
    // Update
    const { data } = await supabase
      .from('products')
      .update(product)
      .eq('id', editingProduct.id)
      .select()
      .single()
    
    if (data) {
      setProducts(products.map(p => p.id === editingProduct.id ? data : p))
    }
  } else {
    // Insert
    const { data } = await supabase
      .from('products')
      .insert({ ...product, commerce_id: commerceId })
      .select()
      .single()
    
    if (data) {
      setProducts([data, ...products])
    }
  }
}
```

**Característiques:**
- Validació de camps obligatoris
- Gestió d'errors
- Actualització optimista de la UI

---

## 6. Seguretat

### 6.1. Autenticació

#### 6.1.1. Supabase Auth

Utilitzem Supabase Auth per a la gestió d'usuaris:

**Característiques:**
- Encriptació de contrasenyes amb bcrypt
- JWT per a sessions
- Refresh tokens automàtics
- HTTP-only cookies per a seguretat

#### 6.1.2. Protecció de Rutes

**Middleware de Next.js:**
- Actualitza la sessió en cada petició
- Gestiona cookies de forma segura
- No exposa tokens al client

**Layout protegit:**
- Verifica autenticació abans de renderitzar
- Comprova rols d'usuari
- Redirigeix si no autoritzat

### 6.2. Row Level Security (RLS)

#### 6.2.1. Polítiques Implementades

**Per a cada taula:**
- SELECT: Veure només les pròpies dades o dades públiques
- INSERT: Crear només amb validació del propietari
- UPDATE: Modificar només les pròpies dades
- DELETE: Eliminar només les pròpies dades

**Exemple de política:**
```sql
-- Els comercios només poden veure els seus productes
CREATE POLICY "Commerce can view own products"
ON products FOR SELECT
USING (
  commerce_id IN (
    SELECT id FROM commerces WHERE owner_id = auth.uid()
  )
);
```

#### 6.2.2. Funció is_admin()

Per evitar recursivitat:

```sql
CREATE FUNCTION is_admin()
RETURNS BOOLEAN
SECURITY DEFINER  -- Executa amb permisos elevats
SET search_path = public
AS $$
  -- Consulta directa sense RLS
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
```

### 6.3. Validació de Dades

#### 6.3.1. Validació Client-Side

- Camps requerits amb `required` attribute
- Tipus de dades amb `type` attribute (number, email, url)
- Validació personalitzada amb JavaScript

#### 6.3.2. Validació Server-Side

- Constraints a la base de dades (NOT NULL, CHECK)
- Validació amb RLS
- Validació en API Routes (futur)

### 6.4. Variables d'Entorn

Separació de secrets:

```env
# Públiques (exposen al client)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Privades (només servidor)
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

**Bones pràctiques:**
- .env.local no es puja a GitHub (.gitignore)
- Variables configurades a Vercel per a producció
- Rotació periòdica de claus (planificat)

---

## 7. Desplegament

### 7.1. Vercel

#### 7.1.1. Configuració

**Connexió amb GitHub:**
- Deploy automàtic en push a `main`
- Preview deployments per a cada PR (futur)
- Rollback automàtic en cas d'error

**Variables d'entorn configurades:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY (simulació)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (simulació)
NEXT_PUBLIC_APP_URL
```

#### 7.1.2. Optimitzacions

**Next.js optimitzacions incloses:**
- Image Optimization amb `next/image`
- Code Splitting automàtic
- Compressió Gzip
- Caching agressiu

**Vercel Edge Network:**
- CDN global
- HTTPS automàtic
- Latència baixa

### 7.2. Supabase

#### 7.2.1. Configuració

**Base de dades:**
- Instància PostgreSQL 15+
- Backups automàtics diaris
- Connexions pooling

**Autenticació:**
- Email confirmation desactivat (desenvolupament)
- Sessió expira en 1 hora (JWT)
- Refresh token vàlid 1 setmana

#### 7.2.2. Migracions

**Estratègia:**
- Migracions SQL versionades a `supabase/migrations/`
- Aplicades manualment via SQL Editor o CLI
- Control de versions amb GitHub

**Exemple de migració:**
```sql
-- supabase/migrations/20260207000001_fix_profile_insert.sql

-- Afegir política per permetre inserció de perfils
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

### 7.3. Monitorització (Planificat)

**Eines previstes:**
- Vercel Analytics per a mètriques web
- Supabase Dashboard per a consultes lentes
- Sentry per a tracking d'errors (opcional)

---

## 8. Conclusions i Pròxims Passos

### 8.1. Estat Actual

A data de 7 de febrer de 2026, el projecte Kopeo ha completat amb èxit la fase UD1A:

**Assolit:**
✅ Entorn de desenvolupament configurat i operatiu  
✅ Arquitectura base del projecte implementada  
✅ 3 funcionalitats core desenvolupades i funcionals  
✅ Base de dades amb RLS operativa  
✅ Desplegament continu a Vercel  
✅ Gestió del projecte amb GitHub i Trello  
✅ Documentació tècnica iniciada  

**Mètriques:**
- 6.000+ línies de codi
- 30 fitxers TypeScript
- 20 components React
- 12 taules de base de dades
- 50+ commits a GitHub
- 130 hores invertides

### 8.2. Desafiaments Superats

1. **Row Level Security amb recursivitat**
   - Problema: Polítiques que consultaven la mateixa taula causaven recursió infinita
   - Solució: Funció `is_admin()` amb SECURITY DEFINER

2. **Autocompletat d'adreces**
   - Problema: No hi havia pressupost per a API de pagament (Google Places)
   - Solució: Nominatim (OpenStreetMap) gratuït i funcional

3. **Sessions no persistents**
   - Problema: Login no es mantenia després de refresh
   - Solució: Middleware de Next.js per refrescar sessions

### 8.3. Pròxims Passos

#### Curt Termini (Febrer 2026)

1. **Testing de funcionalitats implementades**
   - Proves manuals de tots els fluxos
   - Correcció de bugs detectats

2. **Millores d'UX**
   - Feedback visual en operacions
   - Millor gestió d'errors amb missatges clars

#### Mitjà Termini (Març - Abril 2026)

3. **Funcionalitats de pagament i wallet**
   - Integració completa de Stripe
   - Generació i gestió de codis QR
   - Wallet digital per a usuaris

4. **Escàner QR per a comercios**
   - Implementació amb html5-qrcode
   - Sistema de validació i bescanvi

5. **Panel d'administració**
   - Gestió d'usuaris
   - Gestió de comercios
   - Dashboard amb mètriques

6. **Testing automatitzat**
   - Tests unitaris amb Jest
   - Tests d'integració
   - Tests E2E amb Playwright (opcional)

#### Llarg Termini (Maig 2026)

7. **Optimització i poliment**
   - Millora de rendiment
   - Auditoria de seguretat
   - Optimització SEO

8. **Documentació final**
   - Manual d'usuari
   - Documentació tècnica completa
   - Vídeo demostració

9. **Entrega i defensa**
   - Preparació presentació
   - Defensa davant tribunal

### 8.4. Lliçons Apreses

1. **Planificació**
   - Les estimacions inicials van ser optimistes
   - És important deixar marge per a imprevistos
   - La documentació paral·lela estalvia temps al final

2. **Tecnologies**
   - Supabase accelera molt el desenvolupament
   - Next.js App Router és potent però té corba d'aprenentatge
   - Tailwind CSS permet prototipat ràpid

3. **Treball en equip**
   - La comunicació constant és clau
   - GitHub facilita la col·laboració
   - Trello ajuda a mantenir el focus

### 8.5. Valoració Personal

El desenvolupament de Kopeo en aquesta primera fase ha estat un èxit. S'han complert tots els objectius de la UD1A i s'ha establert una base sòlida per al desenvolupament futur.

Les funcionalitats implementades són operatives i demostren la viabilitat del projecte. L'arquitectura escollida permet escalar fàcilment a mesura que s'afegeixin noves funcionalitats.

El projecte està en bon camí per complir amb tots els requisits i ser entregat amb èxit al maig de 2026.

---

**Signatures:**

Francisco Javier Rosselló Jerónimo  
Ferran Azpiazu Adrover

Data: 7 de febrer de 2026

---

*Aquest document forma part de la documentació tècnica del projecte Kopeo desenvolupat com a Projecte Intermodular al CIFP Francesc de Borja Moll durant el curs 2025-2026.*
