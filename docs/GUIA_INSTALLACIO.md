# 🚀 Guia d'Instal·lació i Configuració - Kopeo

**Projecte:** Kopeo - Plataforma de Gestió de Tiquets de Begudes  
**Autors:** Francisco Javier Rosselló Jerónimo, Ferran Azpiazu Adrover  
**Data:** 7 de febrer de 2026  
**Versió:** 1.0 - UD1A

---

## 📋 Taula de Continguts

1. [Requisits Previs](#requisits-previs)
2. [Instal·lació Local](#installació-local)
3. [Configuració de Supabase](#configuració-de-supabase)
4. [Configuració de Stripe (Opcional)](#configuració-de-stripe-opcional)
5. [Execució del Projecte](#execució-del-projecte)
6. [Desplegament a Producció](#desplegament-a-producció)
7. [Solució de Problemes](#solució-de-problemes)

---

## 1. Requisits Previs

Abans de començar, assegura't de tenir instal·lat:

### Software Necessari

| Software | Versió Mínima | Verificació | Descàrrega |
|----------|---------------|-------------|------------|
| **Node.js** | 18.17.0+ | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm** | 9.0.0+ | `npm --version` | Inclòs amb Node.js |
| **Git** | 2.0+ | `git --version` | [git-scm.com](https://git-scm.com) |

### Comptes Necessaris

- [ ] Compte de GitHub (per clonar el repositori)
- [ ] Compte de Supabase (gratuït) - [supabase.com](https://supabase.com)
- [ ] Compte de Stripe (opcional, només per pagaments reals) - [stripe.com](https://stripe.com)

### Verificació de l'Entorn

```bash
# Verificar Node.js
node --version
# Sortida esperada: v18.17.0 o superior

# Verificar npm
npm --version
# Sortida esperada: 9.0.0 o superior

# Verificar Git
git --version
# Sortida esperada: git version 2.x.x o superior
```

---

## 2. Instal·lació Local

### Pas 1: Clonar el Repositori

```bash
# Clonar el repositori
git clone https://github.com/XiscoRossello/Kopeo.git

# Entrar a la carpeta del projecte
cd Kopeo
```

### Pas 2: Instal·lar Dependències

```bash
# Instal·lar totes les dependències del projecte
npm install
```

Aquest procés pot trigar entre 2-5 minuts depenent de la velocitat de la connexió a internet.

**Sortida esperada:**
```
added 423 packages, and audited 424 packages in 2m

148 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Pas 3: Crear Fitxer d'Entorn

Crea un fitxer `.env.local` a l'arrel del projecte:

```bash
# Crear fitxer .env.local
touch .env.local
```

Obre el fitxer amb el teu editor preferit i afegeix les següents variables (les omplirem en els següents passos):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe (Opcional - deixar buit per mode simulació)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. Configuració de Supabase

### Pas 1: Crear Projecte a Supabase

1. Ves a [supabase.com](https://supabase.com)
2. Fes clic a "Start your project"
3. Inicia sessió amb GitHub o un compte de correu
4. Crea una nova organització (si és la primera vegada)
5. Crea un nou projecte:
   - **Name:** kopeo (o el nom que prefereixis)
   - **Database Password:** (guarda-la, la necessitaràs)
   - **Region:** Europe West (London) o Europe Central (Frankfurt)
   - Fes clic a "Create new project"

⏱️ La creació del projecte triga aproximadament 2 minuts.

### Pas 2: Obtenir les Claus de l'API

Un cop creat el projecte:

1. Ves a **Settings** (icona d'engranatge a la barra lateral)
2. Navega a **API**
3. Copia les següents claus:

   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ No compartir mai!

4. Enganxa-les al fitxer `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Pas 3: Executar Migracions de Base de Dades

1. Ves al **SQL Editor** a Supabase Dashboard
2. Crea una nova query
3. Copia i enganxa el contingut del fitxer `supabase/migrations/20260207000000_initial_schema.sql`
4. Fes clic a **Run** per executar la migració

**Contingut de la migració inicial:**

```sql
-- Crear taula profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear taula commerces
CREATE TABLE IF NOT EXISTS public.commerces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- Crear taula events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commerce_id UUID REFERENCES public.commerces(id) ON DELETE CASCADE,
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

-- Crear taula products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commerce_id UUID REFERENCES public.commerces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear taula event_products
CREATE TABLE IF NOT EXISTS public.event_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, product_id)
);

-- Crear taula orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear taula order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear taula wallet_items
CREATE TABLE IF NOT EXISTS public.wallet_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  event_id UUID REFERENCES public.events(id),
  qr_code TEXT UNIQUE NOT NULL,
  is_redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índexs per a millor rendiment
CREATE INDEX IF NOT EXISTS idx_events_commerce_id ON public.events(commerce_id);
CREATE INDEX IF NOT EXISTS idx_products_commerce_id ON public.products(commerce_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_items_user_id ON public.wallet_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_items_qr_code ON public.wallet_items(qr_code);
```

5. Executa les migracions addicionals en ordre:
   - `20260207000001_fix_profile_insert.sql`
   - `20260207000002_fix_trigger.sql`
   - `20260207000005_fix_rls_recursion.sql`
   - `20260207000006_fix_order_policies.sql`

### Pas 4: Configurar Row Level Security (RLS)

Les polítiques de RLS ja estan incloses en les migracions. Per verificar que estan actives:

1. Ves a **Database** → **Tables**
2. Selecciona cada taula
3. Fes clic a **Policies**
4. Verifica que RLS està habilitat (toggle en **enabled**)

### Pas 5: Desactivar Confirmació d'Email (Desenvolupament)

Per facilitar el testing en desenvolupament:

1. Ves a **Authentication** → **Providers**
2. Selecciona **Email**
3. Desactiva **Confirm email** 
4. Guarda els canvis

⚠️ **Important:** En producció, deixa aquesta opció activada per seguretat.

### Pas 6: Crear el Primer Usuari Administrador

1. Ves a **SQL Editor**
2. Executa la següent query (canvia l'email pel teu):

```sql
-- Crear usuari admin manualment
INSERT INTO auth.users (
  id,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'el_teu_email@gmail.com',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  'authenticated',
  'authenticated',
  NOW(),
  NOW(),
  NOW()
);

-- Assignar rol admin al perfil
UPDATE profiles
SET role = 'admin'
WHERE email = 'el_teu_email@gmail.com';
```

3. Recupera la contrasenya temporal des de **Authentication** → **Users**
4. O estableix una contrasenya manualment:

```sql
-- Establir contrasenya (canvia l'email i la contrasenya)
UPDATE auth.users
SET encrypted_password = crypt('la_teva_contrasenya', gen_salt('bf'))
WHERE email = 'el_teu_email@gmail.com';
```

---

## 4. Configuració de Stripe (Opcional)

⚠️ **Nota:** Si deixes les variables de Stripe buides, l'aplicació funcionarà en **mode simulació** (pagaments automàtics sense Stripe).

### Pas 1: Crear Compte de Stripe

1. Ves a [stripe.com](https://stripe.com)
2. Crea un compte
3. Activa el **Test Mode** (toggle a la part superior dreta)

### Pas 2: Obtenir les Claus de l'API

1. Ves a **Developers** → **API keys**
2. Copia les claus de test:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

3. Afegeix-les al `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

### Pas 3: Configurar Webhooks (Opcional)

Per a desenvolupament local amb webhooks:

1. Instal·la Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Altres sistemes: https://stripe.com/docs/stripe-cli
```

2. Autentica't:
```bash
stripe login
```

3. Escolta webhooks:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

4. Copia el **webhook signing secret** que es mostra i afegeix-lo al `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 5. Execució del Projecte

### Iniciar el Servidor de Desenvolupament

```bash
npm run dev
```

**Sortida esperada:**
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

### Accedir a l'Aplicació

Obre el navegador i ves a:
```
http://localhost:3000
```

### Verificar la Instal·lació

1. **Home Page** (`/`):
   - Hauria de mostrar la pàgina d'inici
   - Si no hi ha esdeveniments, mostrarà un missatge "sense esdeveniments"

2. **Login** (`/auth/login`):
   - Prova crear un compte nou
   - O inicia sessió amb l'admin creat

3. **Backoffice** (`/backoffice/events`):
   - Inicia sessió amb l'usuari admin o commerce
   - Hauria de mostrar la pàgina de gestió d'esdeveniments

### Comandos Disponibles

```bash
# Desenvolupament
npm run dev           # Inicia servidor de desenvolupament

# Build
npm run build         # Crea build de producció
npm start             # Inicia servidor de producció

# Linting i Format
npm run lint          # Executa ESLint
npm run format        # Formata codi amb Prettier (si està configurat)

# Testing (futur)
npm run test          # Executa tests
npm run test:watch    # Tests en mode watch
```

---

## 6. Desplegament a Producció

### Opció 1: Vercel (Recomanat)

Vercel és la plataforma recomanada per a projectes Next.js.

#### Pas 1: Crear Compte i Connectar GitHub

1. Ves a [vercel.com](https://vercel.com)
2. Crea un compte amb GitHub
3. Autoritza Vercel a accedir als teus repositoris

#### Pas 2: Importar Projecte

1. Fes clic a **New Project**
2. Selecciona el repositori `Kopeo`
3. Configura les variables d'entorn:
   - Afegeix totes les variables del `.env.local`
   - ⚠️ Assegura't d'afegir `SUPABASE_SERVICE_ROLE_KEY`
4. Fes clic a **Deploy**

#### Pas 3: Configurar Domini Personalitzat (Opcional)

1. Ves a **Settings** → **Domains**
2. Afegeix el teu domini personalitzat
3. Configura els registres DNS segons les instruccions

### Opció 2: Altres Plataformes

**Netlify:**
- Similar a Vercel
- Crea un `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**AWS, Google Cloud, Azure:**
- Requereix configuració més avançada
- Consulta documentació oficial de Next.js

---

## 7. Solució de Problemes

### Problema: `npm install` Falla

**Símptoma:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solució:**
```bash
# Neteja cache
npm cache clean --force

# Instal·la amb flag legacy
npm install --legacy-peer-deps
```

---

### Problema: No es Pot Connectar a Supabase

**Símptoma:**
```
Error: fetch failed
    at node:internal/deps/undici/...
```

**Causes i Solucions:**

1. **Claus incorrectes:**
   - Verifica que les claus al `.env.local` són correctes
   - No hi ha d'haver espais extra

2. **Projecte no inicialitzat:**
   - Espera uns minuts si acabes de crear el projecte
   - Verifica que el projecte estigui actiu a Supabase Dashboard

3. **Problema de xarxa:**
   - Comprova la connexió a internet
   - Desactiva VPN o proxy si en tens

---

### Problema: RLS Bloqueja les Consultes

**Símptoma:**
```
Error: new row violates row-level security policy for table "profiles"
```

**Solució:**

1. Verifica que les polítiques estan habilitades:
```sql
-- Mostrar polítiques
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

2. Executa novament les migracions de polítiques

3. Verifica que el trigger `handle_new_user` està actiu:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

---

### Problema: Error "Cannot find module"

**Símptoma:**
```
Error: Cannot find module '@/lib/supabase/client'
```

**Solució:**

1. Verifica que el fitxer existeix
2. Comprova el `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

3. Reinicia el servidor de desenvolupament

---

### Problema: Leaflet no es Mostra Correctament

**Símptoma:**
- El mapa apareix buit o amb icones trencades

**Solució:**

Afegeix el CSS de Leaflet a l'arrel del teu component:

```typescript
import 'leaflet/dist/leaflet.css'
```

O al `layout.tsx` global:

```typescript
import 'leaflet/dist/leaflet.css'
```

---

### Problema: Port 3000 ja en Ús

**Símptoma:**
```
Error: Port 3000 is already in use
```

**Solució:**

1. **Canviar de port:**
```bash
npx next dev -p 3001
```

2. **Matar el procés:**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Problema: Build Falla a Vercel

**Símptoma:**
```
Error: Missing environment variables:
  - SUPABASE_SERVICE_ROLE_KEY
```

**Solució:**

1. Ves a Vercel Dashboard → Project Settings → Environment Variables
2. Afegeix totes les variables del `.env.local`
3. Redesplega el projecte

---

### Problema: Autenticació no Funciona

**Símptoma:**
- L'usuari no es pot registrar o iniciar sessió

**Solucions:**

1. **Verifica el callback URL:**
   - Supabase Dashboard → Authentication → URL Configuration
   - Afegeix `http://localhost:3000/auth/callback` per local
   - Afegeix `https://your-domain.vercel.app/auth/callback` per producció

2. **Comprova les cookies:**
   - Obre Devtools → Application → Cookies
   - Hauria d'haver-hi cookies de Supabase (`sb-*`)

3. **Desactiva blocadors de cookies:**
   - Alguns navegadors bloquegen cookies de tercers

---

## 📞 Suport Addicional

Si tens qualsevol problema no resolt en aquesta guia:

1. **Consulta la documentació oficial:**
   - [Next.js](https://nextjs.org/docs)
   - [Supabase](https://supabase.com/docs)
   - [Stripe](https://stripe.com/docs)

2. **Contacta amb l'equip:**
   - Francisco Javier Rosselló: [f.javierrossello@gmail.com](mailto:f.javierrossello@gmail.com)
   - Ferran Azpiazu

3. **Revisa els Issues a GitHub:**
   - [github.com/XiscoRossello/Kopeo/issues](https://github.com/XiscoRossello/Kopeo/issues)

---

## ✅ Checklist de Verificació

Abans de començar a desenvolupar, assegura't que:

- [ ] Node.js 18+ instal·lat i verificat
- [ ] Repositori clonat correctament
- [ ] Dependències instal·lades (`npm install`)
- [ ] Fitxer `.env.local` creat amb totes les variables
- [ ] Projecte de Supabase creat
- [ ] Claus de Supabase configurades al `.env.local`
- [ ] Migracions de base de dades executades
- [ ] RLS habilitat a totes les taules
- [ ] Usuari admin creat
- [ ] Servidor de desenvolupament iniciat (`npm run dev`)
- [ ] Aplicació accessible a http://localhost:3000
- [ ] Login funcional
- [ ] Backoffice accessible

Si tots els punts estan marcats, estàs llest per començar a desenvolupar! 🎉

---

*Document actualitzat: 7 de febrer de 2026*  
*Versió: 1.0 - UD1A*
