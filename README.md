# App Trainer — Dashboard de Vídeos de Entrenamiento

Aplicación web para entrenadores que permite gestionar vídeos de entrenamientos, organizados por categoría, con un diseño de catálogo estilo Netflix (filas horizontales deslizables por categoría) y reproducción integrada en un modal.

## Descripción

La app muestra un listado de vídeos de entrenamiento agrupados por categoría (Fitness, Yoga, Cardio, Movilidad, etc.), presentados en filas horizontales con scroll, similar a Netflix. Al hacer clic en una miniatura, se abre un modal con el vídeo reproduciéndose a tamaño grande.

Cada vídeo tiene:

- Nombre del entrenamiento.
- Categoría.
- Fecha asociada.
- Nombre del archivo original.
- URL del vídeo (`blobUrl`) — el reproductor `<video>` HTML5 lo consume directamente.
- Fecha de creación del registro.

Los datos se persisten en una base de datos real a través de Prisma, a diferencia de versiones anteriores del proyecto (ver sección "Evolución del proyecto" más abajo).

## Tecnologías utilizadas

- **Next.js** (v16) — framework de React con App Router, Server Components para obtener los datos y Client Components para la parte interactiva (scroll del carrusel, modal de reproducción).
- **React** (v19) — librería de UI.
- **Prisma** (v5, con `@prisma/client`) — ORM para acceso a la base de datos.
- **SQLite** — base de datos de desarrollo (`prisma/dev.db`).
- **Tailwind CSS** (v4) — sistema de diseño basado en utilidades para todo el layout estilo Netflix (filas, hover, scale, modal, gradientes).
- **TypeScript** — tipado estático en todo el proyecto.
- **Zod** — validación de datos (pendiente de integrar en formularios/API routes).
- **Cloudinary** — pensado para almacenamiento de vídeos en la nube (pendiente de integrar; actualmente los vídeos se referencian por URL en `blobUrl`).
- **Jest** + **ts-jest** / **jest-environment-jsdom** — testing.
- **tsx** — ejecución de scripts TypeScript (usado para el seed de la base de datos).

## Estructura del proyecto

```
app-trainer/
├── app/
│   ├── page.tsx                  # Server Component: obtiene los vídeos de la DB y los agrupa por categoría
│   ├── layout.tsx                # Layout raíz de la aplicación
│   ├── globals.css               # Estilos globales (incluye ocultar scrollbar de las filas)
│   └── components/
│       └── NetflixGrid.tsx       # Client Component: filas por categoría, scroll horizontal y modal de reproducción
├── prisma/
│   ├── schema.prisma             # Definición del modelo de datos
│   ├── prisma.ts                 # Cliente Prisma singleton (evita múltiples conexiones en dev)
│   ├── seed.ts                   # Script de seed con vídeos de ejemplo para probar el layout
│   ├── dev.db                    # Base de datos SQLite local
│   └── migrations/               # Historial de migraciones
├── public/                       # Assets estáticos
├── package.json
└── tsconfig.json
```

## Esquema de la base de datos (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Video {
  id        String   @id @default(cuid())
  name      String
  category  String
  date      DateTime
  fileName  String
  blobUrl   String
  createdAt DateTime @default(now())

  @@map("videos")
}
```

**Notas sobre el modelo:**

- `id`: identificador único generado automáticamente con `cuid()`. Originalmente no tenía valor por defecto, lo que obligaba a pasarlo manualmente en cada inserción — se corrigió añadiendo `@default(cuid())`.
- `category`: actualmente es un `String` libre (no un enum ni una tabla relacionada). Esto es lo que permite agrupar dinámicamente por categoría en `page.tsx`, pero no valida que los valores sean consistentes (p. ej. "fitness" vs "Fitness" se tratarían como categorías distintas).
- `date`: fecha del entrenamiento (no la fecha de creación del registro).
- `fileName`: nombre original del archivo de vídeo subido.
- `blobUrl`: URL desde la que el navegador reproduce el vídeo. **Importante**: si esta URL proviene de `URL.createObjectURL()` (generada en el cliente desde un archivo local), solo es válida en memoria durante esa sesión del navegador y deja de funcionar al recargar la página. Para persistencia real entre sesiones, los vídeos deben subirse a un almacenamiento real (servidor o nube, p. ej. Cloudinary) y guardar aquí la URL pública resultante.
- `createdAt`: timestamp de creación del registro, con valor por defecto automático.

## Páginas y componentes principales

### `app/page.tsx` (Server Component)

Obtiene todos los vídeos de la base de datos mediante Prisma y los agrupa por categoría en un objeto `Record<string, Video[]>`. Si no hay vídeos, muestra un mensaje vacío; si hay, delega el renderizado interactivo a `NetflixGrid`.

### `app/components/NetflixGrid.tsx` (Client Component)

- Recibe las categorías ya agrupadas como prop.
- Renderiza una fila (`CategoryRow`) por cada categoría, con scroll horizontal suave y flechas de navegación que aparecen al pasar el ratón.
- Cada vídeo se muestra como una tarjeta (`VideoCard`) con efecto *hover* de escala y overlay con el nombre y categoría.
- Al hacer clic en una tarjeta, se abre un `VideoModal` con el vídeo reproduciéndose en grande (`controls`, `autoPlay`), con opción de cerrar haciendo clic fuera o en el botón ✕.

## Seed de datos de prueba (`prisma/seed.ts`)

Para verificar visualmente que el scroll horizontal y el agrupado por categorías funcionan correctamente, se incluye un script de seed que limpia la tabla `videos` y la rellena con 17 vídeos de ejemplo repartidos en 4 categorías (Fitness, Yoga, Cardio, Movilidad), usando vídeos de muestra públicos de `samplelib.com`.

Configuración necesaria en `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Ejecución:

```bash
npx prisma db seed
```

> **Nota técnica:** se eligió `tsx` en vez de `ts-node` para ejecutar el seed porque `ts-node` (v10) tiene un bug de compatibilidad conocido con versiones recientes de Node.js (v20+/22+/24) relacionado con la resolución interna de módulos (`require.resolve`), que provoca un error `MODULE_NOT_FOUND` falso. `tsx` usa `esbuild` por debajo y no presenta este problema.

## Cómo levantar el proyecto en local

```bash
# Instalar dependencias
npm install

# Generar el cliente de Prisma
npx prisma generate

# Aplicar migraciones (crea/actualiza dev.db según el schema)
npx prisma migrate dev

# (Opcional) Rellenar la base de datos con vídeos de prueba
npx prisma db seed

# Levantar el servidor de desarrollo
npm run dev
```

La app quedará disponible en `http://localhost:3000`.

## Evolución del proyecto

El proyecto comenzó como una **SPA estática sin backend** (HTML + Tailwind vía CDN + JavaScript vainilla), donde:

- Todo el estado vivía en memoria (`let database = {}`), sin persistencia.
- Los vídeos se cargaban localmente con `URL.createObjectURL()`, generando URLs *blob* válidas solo durante la sesión.
- No había base de datos ni backend real.

Se evolucionó hacia la versión actual con **Next.js + Prisma + SQLite**, lo que aporta:

- Persistencia real de los metadatos de los vídeos entre sesiones.
- Renderizado en servidor de la lista de vídeos (Server Components).
- Una arquitectura preparada para añadir autenticación, subida real de archivos y múltiples entrenadores/atletas en el futuro.

## Limitaciones conocidas

- `blobUrl` generado desde el navegador (`URL.createObjectURL()`) no persiste entre sesiones; para que los vídeos reales subidos por el entrenador sobrevivan a un reinicio del servidor o a otra sesión de navegador, es necesario subirlos a un almacenamiento permanente (servidor propio o servicio en la nube como Cloudinary, ya incluido como dependencia pero aún no integrado en el flujo de subida).
- `category` es un campo de texto libre, sin validación ni catálogo fijo de categorías — puede producir duplicados por inconsistencias de mayúsculas/minúsculas o tildes.
- No hay autenticación ni separación por entrenador/atleta: todos los vídeos se muestran juntos sin distinción de propietario.
- No hay validación de tamaño ni formato de los vídeos más allá de lo que imponga el propio input de archivo en el formulario de subida (a implementar).
- Las tarjetas de vídeo usan el elemento `<video>` directamente como miniatura (cargando el primer frame), en lugar de una imagen de portada (*poster*) optimizada — funcional, pero menos eficiente que generar miniaturas reales.

## Próximos pasos sugeridos

- Integrar Cloudinary (u otro proveedor) para la subida y almacenamiento real de los archivos de vídeo, sustituyendo las URLs *blob* temporales.
- Definir un catálogo fijo de categorías (enum en Prisma o tabla relacionada) en lugar de texto libre.
- Implementar el formulario de creación/edición de entrenamientos (nombre, categoría, fecha, archivo) con validación mediante Zod.
- Añadir autenticación y relación de cada vídeo con su entrenador y/o atleta.
- Generar miniaturas (*posters*) reales para las tarjetas del catálogo en lugar de usar el propio `<video>`.
- Actualizar `prisma` y `@prisma/client` a la versión 7 (hay un salto de versión mayor pendiente, de 5.22.0 a 7.8.0) siguiendo la guía oficial de migración antes de continuar añadiendo funcionalidades.
