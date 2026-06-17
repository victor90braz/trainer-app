# Trainer App — Dashboard con Video Real

Aplicación web de página única (SPA) para entrenadores que permite asignar entrenamientos a atletas en un calendario mensual y adjuntar un vídeo real (desde el propio ordenador) a cada entrenamiento, reproduciéndolo después en un reproductor integrado.

## Descripción

La app muestra un calendario navegable por mes y año. Al seleccionar un día, el entrenador puede:

- Asignar un entrenamiento a un atleta (nombre, ejercicio/notas).
- Subir un archivo de vídeo local (`.mp4`, `.mov`) asociado a ese entrenamiento.
- Ver el listado de entrenamientos del día seleccionado, con acceso directo a reproducir el vídeo cargado.
- Reproducir el vídeo en un reproductor `<video>` integrado en la propia página, sin necesidad de subirlo a ningún servidor.

Todo el estado (entrenamientos, archivos, fecha seleccionada) vive en memoria en el navegador durante la sesión; no hay backend ni base de datos persistente en esta versión.

## Tecnologías utilizadas

- **HTML5** — estructura de la página y elemento `<video>` nativo para la reproducción de los clips.
- **Tailwind CSS** (vía CDN, `cdn.tailwindcss.com`) — todo el sistema de diseño (colores, espaciados, grid, estados hover/focus, modal, etc.) usando exclusivamente clases utilitarias, sin hojas de estilo propias.
- **JavaScript (vainilla, ES6+)** — toda la lógica de la aplicación: renderizado dinámico del calendario, gestión de estado, manejo de eventos y validaciones, sin frameworks (no usa React, Vue, etc.).
- **File API / `URL.createObjectURL()`** — mecanismo clave de la app: convierte el archivo de vídeo seleccionado localmente en una URL de tipo *blob* que el navegador puede reproducir directamente, sin subir el archivo a ningún servidor.
- **DOM API** — creación y actualización dinámica de los elementos del calendario, la lista de entrenamientos y el modal, mediante manipulación directa del DOM (`innerHTML`, `createElement`, etc.).

No se utiliza ningún framework de frontend, ningún backend, ni almacenamiento persistente (localStorage/sessionStorage/base de datos); todo el "guardado" es una simulación en memoria (`let database = {}`) que se pierde al recargar la página.

## Estructura de archivos

```
.
└── index.html   # Aplicación completa (HTML + Tailwind vía CDN + JS embebido)
```

## Funcionalidades principales

| Funcionalidad | Descripción |
|---|---|
| Calendario mensual | Navegación por mes/año (2025–2027) con resaltado del día seleccionado |
| Asignación de entrenos | Modal para introducir atleta, ejercicio y vídeo asociado |
| Carga de vídeo local | Selector de archivo con barra de progreso simulada |
| Reproductor integrado | Reproduce el vídeo subido directamente desde el navegador (blob URL) |
| Listado diario | Muestra todos los entrenamientos asignados al día activo |

## Limitaciones conocidas

- Los datos y los vídeos cargados **no persisten**: al recargar la página se pierden, ya que `URL.createObjectURL()` genera una referencia temporal válida solo durante la sesión del navegador.
- Existe un pequeño error en `cerrarReproductor()`: llama a `.add('hidden')` sobre `classList` en lugar de `classList.add('hidden')`, por lo que el reproductor no se oculta correctamente al pulsar "Cerrar Player".
- No hay validación de tamaño/formato de archivo más allá del filtro `accept="video/*"` del input.
- No existe backend: para producción sería necesario implementar subida real de archivos y persistencia (por ejemplo, una base de datos y almacenamiento de vídeos en servidor o en la nube).

## Próximos pasos sugeridos

- Corregir el bug en `cerrarReproductor()`.
- Añadir persistencia real (backend + base de datos, o almacenamiento en la nube).
- Validar tipo y tamaño máximo de los vídeos antes de aceptarlos.
- Soporte multiusuario / autenticación de entrenadores y atletas.