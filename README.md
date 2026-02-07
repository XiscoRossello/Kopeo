<div align="center">

# 🍸 Kopeo

### *Revolucionant la gestió de tiquets de begudes en l'oci nocturn*

[![Estat](https://img.shields.io/badge/Estat-En%20Desenvolupament-yellow)](https://github.com/XiscoRossello/Kopeo)
[![Versió](https://img.shields.io/badge/Versió-1.0.0-blue)](https://github.com/XiscoRossello/Kopeo)
[![Llicència](https://img.shields.io/badge/Llicència-MIT-green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)](https://supabase.com/)

</div>

---

## 📖 Descripció del Projecte

**Kopeo** és una aplicació web dissenyada per revolucionar la gestió de tiquets de begudes en l'àmbit de l'oci nocturn i els esdeveniments.

### 🎭 El Problema

En discoteques, festivals i festes privades, els assistents sovint s'enfronten a **llargues cues** per adquirir begudes, cosa que genera incomoditat i dificulta la gestió de l'estoc als organitzadors.

### 💡 La Solució

Kopeo soluciona aquest problema permetent la **compra anticipada de tiquets de begudes** directament des del mòbil. L'aplicació integra un sistema de pagament segur i genera un **codi QR únic** que es pot escanejar a la barra per bescanviar la beguda de forma ràpida i sense efectiu.

---

## 🚧 Estat Actual

> **Fase actual:** Desenvolupament Avançat (Febrer 2026)

| Aspecte | Detall |
|---------|--------|
| 📌 Versió | 1.0.0 - Febrer 2026 |
| ⚙️ Progrés | Plataforma funcional amb totes les característiques principals implementades |
| 🚀 Desplegament | Vercel + Supabase |
| 🧪 Mode Test | Simulació de pagaments sense Stripe configurat |

---

## ✨ Funcionalitats Implementades

### 👤 Gestió d'Usuaris
- ✅ Registre amb email i contrasenya
- ✅ Autenticació segura amb Supabase Auth
- ✅ Perfils d'usuari amb rols (client, commerce, admin)
- ✅ Historial de compres

### 🔍 Exploració d'Esdeveniments
- ✅ Pàgina principal amb descobriment d'esdeveniments
- ✅ Geolocalització per trobar esdeveniments propers
- ✅ Cerca i filtres d'esdeveniments
- ✅ Informació detallada de cada esdeveniment

### 🎟️ Compra de Tiquets
- ✅ Selecció de begudes amb quantitats
- ✅ Carret de compra persistent (Zustand)
- ✅ Checkout integrat amb Stripe (o mode simulació)
- ✅ Generació automàtica de codis QR

### 📱 Wallet Digital
- ✅ Visualització de begudes comprades
- ✅ Codis QR únics per cada beguda
- ✅ Agrupació per esdeveniments
- ✅ Estat de bescanvi (disponible/bescanviat)

### 🔍 Escàner QR per Comercis
- ✅ Escaneig de codis QR amb la càmera
- ✅ Validació de tiquets en temps real
- ✅ Bescanvi de begudes selectives
- ✅ Historial de bescanvis

### 🎛️ Panell per a Comercis (Backoffice)
- ✅ Gestió de productes (CRUD complet)
- ✅ Gestió d'esdeveniments
- ✅ Configuració del comerç
- ✅ Dashboard amb estadístiques

### 🛡️ Panell d'Administració
- ✅ Gestió d'usuaris i rols
- ✅ Gestió de comercis
- ✅ Gestió d'esdeveniments
- ✅ Gestió de productes
- ✅ Historial de comandes
- ✅ Dashboard amb mètriques globals

---

## 🛠️ Stack Tecnològic

### Frontend
| Tecnologia | Descripció |
|------------|------------|
| **Next.js 16** | Framework React amb App Router i TypeScript |
| **Tailwind CSS** | Estils amb tema fosc personalitzat |
| **Zustand** | Gestió d'estat del carret de compra |
| **Lucide React** | Biblioteca d'icones |
| **html5-qrcode** | Escaneig de codis QR |
| **qrcode** | Generació de codis QR |

### Backend
| Tecnologia | Descripció |
|------------|------------|
| **Supabase** | Backend-as-a-Service |
| **PostgreSQL** | Base de dades relacional |
| **Row Level Security** | Polítiques de seguretat a nivell de fila |
| **Auth** | Autenticació d'usuaris |
| **Stripe** | Processament de pagaments (opcional) |

### Infraestructura
| Servei | Ús |
|--------|-----|
| **Vercel** | Desplegament i hosting |
| **Supabase Cloud** | Base de dades i autenticació |
| **GitHub** | Control de versions |

---

## 📁 Estructura del Projecte

```
src/
├── app/
│   ├── admin/              # Panell d'administració
│   │   ├── users/          # Gestió d'usuaris
│   │   ├── commerces/      # Gestió de comercis
│   │   ├── events/         # Gestió d'esdeveniments
│   │   ├── products/       # Gestió de productes
│   │   └── orders/         # Historial de comandes
│   ├── api/
│   │   ├── checkout/       # API de checkout
│   │   └── webhook/        # Webhook de Stripe
│   ├── auth/
│   │   ├── login/          # Pàgina de login
│   │   ├── register/       # Pàgina de registre
│   │   └── callback/       # Callback OAuth
│   ├── backoffice/         # Panell de comerci
│   │   ├── products/       # CRUD productes
│   │   ├── events/         # CRUD esdeveniments
│   │   └── commerce/       # Configuració
│   ├── checkout/           # Procés de pagament
│   │   ├── success/        # Pagament exitós
│   │   └── cancel/         # Pagament cancel·lat
│   ├── event/[id]/         # Detall d'esdeveniment
│   ├── scanner/            # Escàner QR
│   ├── wallet/             # Cartera digital
│   └── page.tsx            # Home
├── components/
│   ├── Navbar.tsx          # Navegació
│   ├── CartDrawer.tsx      # Carret lateral
│   └── LoadingSpinner.tsx  # Spinner de càrrega
├── lib/
│   ├── supabase/           # Clients Supabase
│   ├── stripe.ts           # Configuració Stripe
│   └── types.ts            # Tipus TypeScript
├── store/
│   └── cart.ts             # Store Zustand
└── middleware.ts           # Middleware d'auth
```

---

## 🔧 Instal·lació

### Requisits Previs
- Node.js 18+
- Compte de Supabase
- Compte de Stripe (opcional, per pagaments reals)

### Passos

1. **Clona el repositori:**
```bash
git clone https://github.com/XiscoRossello/Kopeo.git
cd kopeo
npm install
```

2. **Configura les variables d'entorn** a `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (opcional - sense configurar s'activa mode simulació)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URL de l'aplicació
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Executa les migracions** a Supabase SQL Editor:
   - Copia el contingut de `supabase/migrations/` i executa'l

4. **Inicia el servidor de desenvolupament:**
```bash
npm run dev
```

5. **Obre** [http://localhost:3000](http://localhost:3000)

---

## 🧪 Mode Simulació (Sense Stripe)

Quan `STRIPE_SECRET_KEY` no està configurat o té el valor per defecte, l'aplicació funciona en **mode simulació**:

- Els pagaments es processen instantàniament
- No cal introduir dades de targeta
- Les begudes s'afegeixen directament a la wallet
- Perfecte per a proves i desenvolupament

---

## 🎨 Paleta de Colors

| Color | Hex | Ús |
|-------|-----|-----|
| **Primary** | `#8400D6` | Color principal (lila) |
| **Primary Light** | `#9341EA` | Variació clara |
| **Accent** | `#FF6600` | Color d'accent (taronja) |
| **Accent Light** | `#F5A300` | Variació clara |
| **Background** | `#0A0A0A` | Fons principal |
| **Surface** | `#1A1A1A` | Superfícies |
| **Border** | `#2A2A2A` | Vores |

---

## 👥 Rols d'Usuari

| Rol | Permisos |
|-----|----------|
| **client** | Veure esdeveniments, comprar begudes, usar wallet |
| **commerce** | Tot de client + gestionar productes, esdeveniments, escanejar QR |
| **admin** | Accés total al sistema |

---

## 📅 Full de Ruta (Roadmap)

| Període | Tasques | Estat |
|---------|---------|-------|
| 🍂 **Oct - Des 2025** | Anàlisi, disseny i prototips | ✅ Completat |
| 🎄 **Nadal 2025** | Configuració del projecte i funcionalitats bàsiques | ✅ Completat |
| 🌱 **Gen - Feb 2026** | Desenvolupament avançat, integració de pagaments | ✅ Completat |
| 🧪 **Mar - Abr 2026** | Proves, optimització i millores | 🔄 En progrés |
| 🎓 **Maig 2026** | Entrega final i defensa del projecte | ⏳ Pendent |

---

## 👥 Equip

<table>
  <tr>
    <td align="center">
      <strong>👨‍💻 Autors</strong><br/>
      Francisco Javier Rosselló Jerónimo<br/>
      Ferran Azpiazu Adrover
    </td>
    <td align="center">
      <strong>👨‍🏫 Tutor</strong><br/>
      Miquel Antoni Capellà Arrom
    </td>
    <td align="center">
      <strong>🏫 Centre</strong><br/>
      CIFP Francesc de Borja Moll
    </td>
  </tr>
</table>

---

## � Documentació del Projecte - UD1A

Documentació completa per a la primera fase del projecte intermodular:

### 📋 Documents Principals

| Document | Descripció | Enllaç |
|----------|------------|--------|
| 📅 **Planificació** | Revisió i ajust de la planificació inicial. Estat del projecte, fites assolides i calendari ajustat | [docs/PLANIFICACIO.md](docs/PLANIFICACIO.md) |
| 📘 **Memòria Tècnica** | Arquitectura del sistema, decisions tècniques, stack tecnològic i implementació detallada de funcionalitats | [docs/MEMORIA_TECNICA.md](docs/MEMORIA_TECNICA.md) |
| 🚀 **Guia d'Instal·lació** | Guia pas a pas per instal·lar i configurar el projecte en local i producció | [docs/GUIA_INSTALLACIO.md](docs/GUIA_INSTALLACIO.md) |

### 📖 Contingut de la Documentació

**Planificació:**
- Planificació inicial vs planificació real
- Desviacions i ajustos aplicats
- Estat actual del desenvolupament (07/02/2026)
- Funcionalitats implementades: Home, Login, Backoffice
- Calendari ajustat fins a maig 2026

**Memòria Tècnica:**
- Arquitectura de tres capes del sistema
- Decisions arquitectòniques (Next.js App Router, Supabase BaaS)
- Stack tecnològic complet
- Disseny de base de dades (12 taules + RLS)
- Implementació detallada de funcionalitats
- Seguretat i desplegament

**Guia d'Instal·lació:**
- Requisits previs i verificació
- Instal·lació local pas a pas
- Configuració de Supabase amb migracions SQL
- Configuració de Stripe (opcional)
- Execució i desplegament
- Solució de problemes comuns

---

## �📝 Llicència

Aquest projecte està sota la llicència MIT. Consulta l'arxiu [LICENSE](LICENSE) per a més detalls.

---

<div align="center">

**Fet amb ❤️ a les Illes Balears**

[Reportar un error](https://github.com/XiscoRossello/Kopeo/issues) · [Sol·licitar funcionalitat](https://github.com/XiscoRossello/Kopeo/issues)

</div>
