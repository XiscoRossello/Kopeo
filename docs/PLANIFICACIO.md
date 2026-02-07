# 📅 Revisió i Ajust de la Planificació Inicial

**Projecte Intermodular - UD1A**  
**Autors:** Francisco Javier Rosselló Jerónimo, Ferran Azpiazu Adrover  
**Tutor:** Miquel Antoni Capellà Arrom  
**Centre:** CIFP Francesc de Borja Moll  
**Curs:** 2025-2026  
**Data:** 7 de febrer de 2026

---

## 📊 Resum Executiu

Aquest document presenta la revisió i ajust de la planificació inicial del projecte Kopeo, així com l'estat actual del desenvolupament en la fase UD1A. Kopeo és una plataforma web per a la gestió i compra de tiquets de begudes en esdeveniments i locals d'oci nocturn.

---

## 🎯 Objectius de la UD1A

Segons els requisits de la unitat, els objectius específics són:

- ✅ Arrencar el desenvolupament del projecte amb l'estructura definitiva
- ✅ Configurar correctament l'entorn de desenvolupament
- ✅ Implementar almenys una funcionalitat bàsica i funcional del projecte
- ✅ Gestió del projecte mitjançant GitHub
- ✅ Ús actiu de Trello per a la planificació i seguiment
- ✅ Revisió i ajust de la planificació inicial
- ✅ Inici de la documentació tècnica del projecte

---

## � Planificació Inicial del Projecte

### Fase 1: Anàlisi i Disseny (Octubre – Primera setmana de desembre 2025)
**Estat:** ✅ Completada

**Tasques realitzades:**
- Definició de requisits i funcionalitats obligatòries i opcionals
- Disseny de l'arquitectura de l'app i estructura de la base de dades
- Elaboració de prototipos d'interfície i experiència d'usuari (UI/UX)

**Fites assolides:**
- ✅ Document de requisits complet
- ✅ Prototips inicials de la interfície
- ✅ Disseny d'arquitectura amb Next.js, Supabase i Stripe
- ✅ Esquema de base de dades PostgreSQL

---

### Fase 2: Desenvolupament Inicial (Vacances de Nadal, ~2-3 setmanes)
**Estat:** ✅ Completada

**Tasques planificades:**
- Configuració del projecte amb Next.js i Tailwind CSS
- Implementació de funcionalitats bàsiques: registre, login, compra de tickets i generació de codis QR
- Integració inicial de la base de dades amb Supabase

**Fites planificades:**
- Primera versió funcional amb pago i QR

**RESULTAT REAL:**
Les vacances de Nadal van permetre avançar significativament en la configuració del projecte i l'estructura base, però les funcionalitats completes es van desenvolupar durant gener i febrer.

---

### Fase 3: Desenvolupament Avançat i Proves (Gener – Abril 2026)
**Estat:** 🔄 En Progrés (Febrer 2026)

**Tasques planificades:**
- Optimització de la interfície, usabilitat i seguretat
- Integració completa del sistema de pagament segur i gestió de tickets
- Proves de funcionament, rendiment i protecció de dades

**Fites planificades:**
- Versió final llesta per a demostració interna i ajustos finals

**ESTAT ACTUAL (07/02/2026):**
Durant gener i febrer s'ha treballat intensivament en les funcionalitats core del projecte. Es detalla a la secció "Estat Actual del Desenvolupament".

---

### Fase 4: Entrega i Defensa Final (Principis de maig 2026)
**Estat:** ⏳ Planificada

**Tasques planificades:**
- Preparació de documentació, presentació i defensa del projecte
- Resolució d'incidències menors detectades durant les proves

**Fites planificades:**
- Entrega de l'aplicació final i defensa davant l'equip docent

---

## 🔄 Revisió i Ajustos de la Planificació

### Desviacions Detectades

#### 1. Desenvolupament més llarg del previst
**Previsió inicial:** Funcionalitats bàsiques completes en vacances de Nadal  
**Realitat:** El desenvolupament s'ha estès fins a febrer

**Motius:**
- La configuració de Supabase amb Row Level Security va requerir més temps del previst
- La integració de Stripe va tenir complicacions tècniques
- Es van afegir funcionalitats no previstes inicialment (autocompletat d'adreces, sistema de rols més complex)

**Impacte:** 
- Retard de ~2-3 setmanes respecte la planificació inicial
- No afecta la data d'entrega final (maig 2026)

#### 2. Gestió del projecte
**Previsió inicial:** Tauler Kanban tipus Jira  
**Realitat:** Combinació de Trello

**Motiu:**
- Trello resulta més visual i accessible per al seguiment setmanal

**Impacte:** Positiu, millora la gestió

#### 3. Desplegament continu
**Previsió inicial:** No especificat  
**Realitat:** Desplegament automàtic a Vercel configurat des del inici

**Motiu:**
- Facilita les proves i demostracions al tutor
- Permet detectar problemes de producció aviat

**Impacte:** Molt positiu

### Ajustos Aplicats

| Aspecte | Ajust Realitzat | Justificació |
|---------|-----------------|--------------|
| Calendari desenvolupament | +2-3 setmanes per fase inicial | Major complexitat tècnica |
| Eines de gestió | Trello + GitHub | Millor adaptació a les necessitats |
| Desplegament | Vercel des de l'inici | Facilitar testing i demostracions |
| Documentació | Inici en paral·lel al desenvolupament | Evitar acumulació al final |

---

## 📅 Calendari Ajustat

### Gener - Febrer 2026 (UD1A) - Desenvolupament Core
**Estat:** 🔄 En Progrés

| Setmana | Dates | Tasques | Estat |
|---------|-------|---------|-------|
| 1 | 06-12 Gen | Configuració entorn i estructura base | ✅ Fet |
| 2 | 13-19 Gen | Sistema d'autenticació + Home page | ✅ Fet |
| 3 | 20-26 Gen | Backoffice: Gestió d'esdeveniments | ✅ Fet |
| 4 | 27-02 Feb | Backoffice: Gestió de productes | ✅ Fet |
| 5 | 03-09 Feb | Millores UI i autocompletat adreces | ✅ Fet |

### Febrer - Març 2026 - Integració i Proves
**Estat:** ⏳ Planificat

| Setmana | Dates | Tasques Planificades |
|---------|-------|---------------------|
| 6 | 10-16 Feb | Testing funcionalitats bàsiques |
| 7 | 17-23 Feb | Correccions i optimitzacions |
| 8 | 24-02 Mar | Inici proves d'usuari |
| 9 | 03-09 Mar | Implementació feedback |

### Març - Abril 2026 - Optimització
**Estat:** ⏳ Planificat

- Proves de rendiment
- Auditoria de seguretat
- Optimització de l'experiència d'usuari
- Documentació tècnica completa

### Maig 2026 - Entrega Final
**Estat:** ⏳ Planificat

- Preparació documentació final
- Elaboració presentació
- Defensa del projecte

---

## 🛠️ Estat Actual del Desenvolupament (07/02/2026)

### 1. Configuració de l'Entorn de Desenvolupament ✅

**Tecnologies configurades:**
- **Next.js 16** amb App Router i TypeScript
- **Tailwind CSS** amb tema fosc personalitzat (colors corporatius)
- **Supabase** per a base de dades i autenticació
- **Stripe** per a pagaments (mode simulació per desenvolupament)
- **GitHub** per a control de versions
- **Vercel** per a desplegament automàtic

**Estructura del projecte:**
```
kopeo/
├── src/
│   ├── app/              # Pàgines (Next.js App Router)
│   ├── components/       # Components reutilitzables
│   ├── lib/              # Utilitats i configuració
│   └── store/            # Gestió d'estat
├── supabase/
│   └── migrations/       # Migracions de base de dades
├── public/               # Recursos estàtics
└── docs/                 # Documentació
```

**Configuració completada:**
- Variables d'entorn per a Supabase i Stripe
- Base de dades PostgreSQL amb 12 taules
- Row Level Security (RLS) configurat
- Sistema de rols (client, commerce, admin)
- Desplegament continu a Vercel

---

### 2. Funcionalitats Bàsiques Implementades

#### 2.1. Pàgina d'Inici (Home) ✅

**Descripció:**
Pàgina principal que mostra els esdeveniments disponibles amb opcions de cerca i filtratge.

**Funcionalitats:**
- Llistat d'esdeveniments actius
- Cerca per nom d'esdeveniment
- Geolocalització per mostrar esdeveniments propers
- Visualització d'informació bàsica (imatge, títol, data, ubicació)
- Navegació a la pàgina de detall de cada esdeveniment

**Tecnologies utilitzades:**
- Next.js Server Components per a millor rendiment
- Supabase per a consultes a la base de dades
- Geolocation API del navegador

**Estat:** Completada i funcional

---

#### 2.2. Sistema d'Autenticació (Login/Registre) ✅

**Descripció:**
Sistema complet d'autenticació d'usuaris amb gestió de sessions.

**Funcionalitats:**
- **Registre:** Creació de compte amb email i contrasenya
- **Login:** Inici de sessió amb validació de credencials
- **Gestió de sessions:** Sessions persistents amb cookies segures
- **Perfils d'usuari:** Assignació automàtica de rol (client per defecte)
- **Protecció de rutes:** Middleware que protegeix pàgines privades

**Tecnologies utilitzades:**
- Supabase Auth per a gestió d'usuaris
- Next.js Middleware per a protecció de rutes
- Cookies HTTP-only per a seguretat

**Estat:** Completada i funcional

---

#### 2.3. Backoffice per a Comercios ✅

**Descripció:**
Panell d'administració per a comercios on poden gestionar els seus esdeveniments i productes.

**Funcionalitats implementades:**

##### a) Gestió d'Esdeveniments
- **Crear esdeveniments:** Formulari complet amb:
  - Títol i descripció
  - Dates d'inici i fi
  - Ubicació amb autocompletat d'adreces (API Nominatim)
  - Mapa interactiu amb Leaflet per visualitzar ubicació
  - Coordenades automàtiques a partir de l'adreça seleccionada
  - URL d'imatge
  - Estat actiu/inactiu

- **Llistar esdeveniments:** Vista de tots els esdeveniments del comerç
- **Editar esdeveniments:** Modificació de qualsevol camp
- **Eliminar esdeveniments:** Amb confirmació prèvia

**Tecnologies utilitzades:**
- React Hook Form per a gestió de formularis (planificat)
- Leaflet per al mapa interactiu
- Nominatim (OpenStreetMap) per a autocompletat d'adreces
- Supabase per a persistència de dades

**Característiques destacades:**
- Autocompletat d'adreces que mostra suggeriments en temps real
- Mapa que actualitza la posició automàticament
- Interfície intuïtiva i responsive

---

##### b) Gestió de Productes
- **Crear productes:** Formulari amb:
  - Nom del producte
  - Descripció
  - Preu
  - URL d'imatge
  - Estat disponible/no disponible

- **Llistar productes:** Vista amb tots els productes del comerç
- **Editar productes:** Modificació de dades
- **Eliminar productes:** Amb confirmació prèvia
- **Associar productes a esdeveniments:** Sistema de vinculació

**Tecnologies utilitzades:**
- React Hooks per a gestió d'estat
- Supabase per a CRUD operations
- Tailwind CSS per a estils

**Estat:** Completada i funcional

---

### 3. Base de Dades

**Taules principals implementades:**
- `profiles` - Perfils d'usuari amb rols
- `commerces` - Informació de comercios
- `events` - Esdeveniments
- `products` - Productes
- `event_products` - Relació entre esdeveniments i productes
- `orders` - Comandes
- `order_items` - Ítems de cada comanda
- `wallet_items` - Begudes comprades pels usuaris

**Seguretat:**
- Row Level Security (RLS) actiu en totes les taules
- Polítiques per a lectura, inserció, actualització i eliminació
- Funció `is_admin()` per evitar recursivitat en polítiques
- Triggers per a creació automàtica de perfils

**Estat:** Base de dades operativa amb totes les taules i relacions necessàries

---

### 4. GitHub i Control de Versions

**Repositori:** [https://github.com/XiscoRossello/Kopeo](https://github.com/XiscoRossello/Kopeo)

**Estadístiques:**
- Commits realitzats: 50+
- Branques utilitzades: `main` (producció)
- README complet en català
- Fitxer .gitignore configurat
- Migracions de base de dades versionades

**Estratègia de commits:**
- Missatges descriptius en català
- Commits freqüents i atòmics
- Prefixos: `feat:`, `fix:`, `docs:`, `refactor:`

**Estat:** Repositori actiu i ben gestionat

---

### 5. Gestió del Projecte amb Trello

**Organització del tauler:**
- **Backlog:** Tasques pendents de prioritzar
- **To Do:** Tasques planificades per a la setmana
- **In Progress:** Tasques en curs
- **Testing:** Funcionalitats en proves
- **Done:** Tasques completades

**Targetes creades:** 40+

**Gestió:**
- Assignació clara de responsables
- Etiquetes per prioritat (Alta, Mitjana, Baixa)
- Dates límit definides
- Checklist per a tasques complexes

**Estat:** Tauler operatiu amb seguiment diari

---

## 📊 Resum de Compliment UD1A

| Requisit | Estat | Observacions |
|----------|-------|--------------|
| Arrencada del desenvolupament | ✅ Completat | Projecte Next.js configurat i operatiu |
| Configuració entorn | ✅ Completat | Supabase, Stripe, Vercel configurats |
| Funcionalitat bàsica | ✅ Completat | Home, Login, Backoffice operatius |
| Gestió GitHub | ✅ Completat | 50+ commits, repositori ben estructurat |
| Ús de Trello | ✅ Completat | Tauler actiu amb 40+ targetes |
| Revisió planificació | ✅ Completat | Document amb ajustos identificats |
| Documentació tècnica | ✅ Completat | Documentació iniciada i en progrés |

---

## 📈 Mètriques del Projecte

### Codi Produït
- Línies de codi: ~6.000
- Fitxers TypeScript: ~30
- Components React: ~20
- Pàgines: 10
- Taules de BD: 12

### Temps Invertit
| Fase | Hores Previstes | Hores Reals | Desviació |
|------|----------------|-------------|-----------|
| Anàlisi i Disseny | 80h | 75h | -6% |
| Desenvolupament Inicial | 40h | 55h | +37% |
| **Total UD1A** | **120h** | **130h** | **+8%** |

**Anàlisi de desviació:**
La desviació del +8% és acceptable i es deu principalment a:
- Configuració de Row Level Security més complexa del previst
- Implementació del sistema d'autocompletat d'adreces (no planificat inicialment)
- Correcció de problemes d'autenticació i permisos

---

## ⚠️ Riscos Detectats i Accions

| Risc | Impacte | Probabilitat | Acció de Mitigació | Estat |
|------|---------|--------------|-------------------|-------|
| Retard en desenvolupament | Alt | Baixa | Prioritzar funcionalitats core | ✅ Mitigat |
| Complexitat de Stripe | Mitjà | Alta | Mode simulació implementat | ✅ Mitigat |
| Problemes amb RLS | Alt | Mitjana | Funcions SECURITY DEFINER | ✅ Resolt |
| Gestió del temps | Alt | Mitjana | Seguiment setmanal amb tutor | 🔄 En seguiment |

---

## 🎯 Pròxims Passos

### Curt Termini (Setmana del 10-16 Febrer)
1. Testing exhaustiu de les funcionalitats implementades
2. Correcció de bugs detectats
3. Millores d'usabilitat basades en proves

### Mitjà Termini (Febrer - Març)
1. Implementar sistema de compra i checkout
2. Desenvolupar wallet amb codis QR
3. Crear escàner QR per a comercios
4. Panel d'administració complet

### Preparació Entrega Final (Abril - Maig)
1. Testing complet de l'aplicació
2. Optimitzacions de rendiment
3. Documentació tècnica completa
4. Preparació presentació i defensa

---

## 📞 Contacte i Enllaços

**Equip de Desenvolupament:**
- Francisco Javier Rosselló Jerónimo - [f.javierrossello@gmail.com](mailto:f.javierrossello@gmail.com)
- Ferran Azpiazu Adrover

**Tutor:**
- Miquel Antoni Capellà Arrom - CIFP Francesc de Borja Moll

**Enllaços del Projecte:**
- 🌐 Aplicació: [https://kopeo.vercel.app](https://kopeo.vercel.app)
- 💻 GitHub: [https://github.com/XiscoRossello/Kopeo](https://github.com/XiscoRossello/Kopeo)
- 📋 Trello: [Enllaç al tauler compartit amb el tutor]

---

**Conclusió:**

El projecte Kopeo es troba en bon estat de desenvolupament per a la fase UD1A. S'han complert tots els requisits establerts: arrencada del desenvolupament, configuració de l'entorn, implementació de funcionalitats bàsiques, gestió adequada del projecte i inici de la documentació tècnica.

Les desviacions detectades respecte la planificació inicial són lleus (+8% en temps) i no comprometen la data d'entrega final. Els ajustos realitzats han millorat la qualitat del projecte i la gestió del mateix.

El següent pas és continuar amb el desenvolupament de les funcionalitats avançades planificades per als propers mesos.

---

*Document actualitzat: 7 de febrer de 2026*  
*Versió: 1.0 - UD1A*
