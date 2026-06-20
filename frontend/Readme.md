Trainer App — README (TDD + DDD Hexagonal)
Aplicación web SPA estilo Netflix para entrenadores
Frontend puro (sin backend), arquitectura hexagonal por capas.
TDD estricto: NO se toca lógica sin test RED previo.

:warning: REGLAS OBLIGATORIAS
Antes de tocar código, leer SIEMPRE:
TDD strict — los 6 pasos del workflow:
ANÁLISIS (≤5 min, pattern compliance)
RED — escribir SOLO tests, parar y esperar verificación
GREEN — implementación mínima, parar y esperar verificación
VERIFICAR INTEGRACIÓN
DEBUG LOGS si hace falta
PROBAR EN REAL


NUNCA escribir test + implementación en el mismo turno
NUNCA saltar RED → GREEN sin confirmación del usuario
NUNCA auto-commit

DDD hexagonal — domain no importa de application ni infrastructure. NUNCA. Tests de domain SOLO importan domain.
NO se toca lógica sin test previo.
Coding standards (frontend TS):

camelCase+ suffixes (*List,*Map,is*,*Message,*Config)
English en domain (noentrenamientos, sítrainingList)
NO optional chaining (?.) en.vue/HTML — usar(obj && obj.prop)
NOvar— soloconst/let
NOany(excepto mocks en tests)
Result objects, NUNCA dicts:result.isValidnoresult['isValid']
NO spread en parsers — mapeo explícito campo a campo
Tests AAA:// arrange / // act / // assert
Un test = un comportamiento


Stack

HTML5+<video>nativo
Tailwind CSSvía CDN (cdn.tailwindcss.com) — solo utilidades, sin build
TypeScript— domain + application; transpilado a JS
Jest— tests unitarios de domain y application
DOM API + File API + URL.createObjectURL()— infrastructure
NO hay framework. NO hay backend. NO hay localStorage en MVP.

Arquitectura hexagonal
Ttrainer-app/
├── index.html                    # solo wiring + Tailwind CDN — sin lógica
├── src/
│   ├── domain/                   # ENTITIES + PORTS, cero dependencias externas
│   │   ├── Video.ts              # entity (id, athleteName, category, date, fileName, blobUrl)
│   │   ├── Category.ts           # value object (Fuerza | Cardio | Técnica | Movilidad | Recuperación)
│   │   ├── VideoRepository.ts    # interface (port): saveVideo, findByDate, findAll
│   │   └── functions/
│   │       ├── filterByDate.ts        # función pura
│   │       ├── groupByCategory.ts     # función pura
│   │       └── formatDate.ts          # función pura
│   │
│   ├── application/              # USE CASES, importa solo domain
│   │   ├── AddVideoCommand.ts
│   │   ├── LoadVideosByDateQuery.ts
│   │   └── TrainerApplication.ts # constructor(repo)
│   │
│   ├── infrastructure/           # ADAPTERS, implementa ports + DOM
│   │   ├── InMemoryVideoRepository.ts   # implementa VideoRepository
│   │   ├── BlobUrlVideoStorage.ts       # URL.createObjectURL adapter
│   │   └── ThumbnailGenerator.ts        # extrae frame del vídeo
│   │
│   └── components/               # UI — DOM puro, importa application + domain
│       ├── HomeComponent.ts             # hero + filas Netflix-style
│       ├── CalendarPopupComponent.ts    # modal calendar
│       ├── UploadModalComponent.ts      # form add video
│       └── VideoPlayerComponent.ts
│
└── tests/
    ├── domain/
    │   ├── Video.test.ts
    │   ├── Category.test.ts
    │   ├── functions/
    │   │   ├── filterByDate.test.ts
    │   │   ├── groupByCategory.test.ts
    │   │   └── formatDate.test.ts
    ├── application/
    │   ├── AddVideoCommand.test.ts
    │   ├── LoadVideosByDateQuery.test.ts
    │   └── TrainerApplication.test.ts
    └── infrastructure/
        ├── InMemoryVideoRepository.test.ts
        └── BlobUrlVideoStorage.test.tsReglas de imports
CapaPuede importardomainNADA externo (solo otros archivos de domain)applicationdomaininfrastructuredomain (implementa ports)componentsapplication + domain
PROHIBIDO: domain importar infrastructure o application. NUNCA.

Roadmap por fases TDD
Cada fase: RED → user verifica → GREEN → user verifica.Fase 1 — Domain (entities + functions puras)

RED 1Video.test.ts— entity validación, factory,toPrimitive/fromPrimitive
GREEN 1Video.ts
RED 2Category.test.ts— value object inmutable, valores válidos
GREEN 2Category.ts
RED 3filterByDate.test.ts— función pura: filtra videos por fecha (compara año/mes/día)
GREEN 3filterByDate.ts
RED 4groupByCategory.test.ts— función pura: agrupa videos en{categoria: Video[]}
GREEN 4groupByCategory.ts
RED 5formatDate.test.ts— función pura: format largo y corto en español
Fase 2 — Application (use cases con MemoryRepo)

REDAddVideoCommand.test.ts— handler persiste video en repo
REDLoadVideosByDateQuery.test.ts— handler devuelve videos agrupados por categoría para una fecha
GREENimplementación de handlers
Fase 3 — Infrastructure

REDInMemoryVideoRepository.test.ts— implementaVideoRepository, in-memory
REDBlobUrlVideoStorage.test.ts— wrapper deURL.createObjectURL
GREENimplementaciones
Fase 4 — UI / index.html

Hero + filas horizontales (Tailwind)
Hardcoded data inicial (sin upload aún)
Wiringapplication:left_right_arrow: DOM
Fase 5 — Calendario popup

REDtests del componente popup (sin DOM real, mocks)
GREENCalendarPopupComponent.ts
Wiring: click día → emit fecha → re-render catálogo
Fase 6 — Upload modal

REDtestsUploadModalComponentconFilemock
GREENcomponente
Generación miniatura del primer frame del vídeo


Funcionalidades del MVP
FeatureDescripciónCatálogo Netflix-styleHero + filas horizontales por categoríaFiltro por fechaClick icono calendario → popup → seleccionar día → catálogo se actualizaIndicador de fecha activaTexto en header: "Mostrando: Sábado, 20 de junio de 2026"Upload de vídeo localModal con form (atleta, categoría, ejercicio, archivo). Genera miniatura del primer frameReproductor integrado<video> nativo con blob URLEstado vacíoSi no hay vídeos en la fecha → invitación a añadir el primero
Limitaciones MVP

Vídeos NO persisten (blob URL muere al recargar)
Categorías hardcoded (5 fijas)
Sin búsqueda global
Sin autenticación
Solo desktop (responsive en fase posterior)


Decisiones técnicas
DecisiónPor quéTypeScript en domainTipado fuerte de entities y portsTailwind CDNCero build, prototipado rápidoIn-memory repoMVP sin backend; refactor a S3/IndexedDB en fase 2Hexagonal desde día 1Refactor a backend real solo cambia 1 adapterFunciones puras en domain/functions/Testables sin mocks ni DOM
Comandos
r# Setup
npm init -y
npm install --save-dev jest typescript ts-jest @types/jest

# Run tests
npm test

# Run tests watch
npm test -- --watch

# Coverage
npm test -- --coverage

# Servir (cualquier static server)
npx serve .

Próximos pasos (después MVP)

Persistencia real (IndexedDB para metadata + S3/local storage para vídeos)
Backend con autenticación de entrenadores
Subida real al servidor
Categorías editables (CRUD)
Búsqueda/filtros adicionales (atleta, categoría, rango de fechas)
Soporte mobile / responsive


Notas para retomar

Antes de tocar código → leer este README entero
Empezar siempre por la fase TDD donde quedaste
Si saltas RED→GREEN sin verificación → STOP y replantea
NO commitear sin permiso del usuario