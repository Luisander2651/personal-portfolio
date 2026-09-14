# Constitución — personal-website

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **Simplicidad primero**: Astro con TypeScript en modo `strict`, Bun como
   gestor de paquetes y runtime (prohibido npm, yarn o pnpm). Cada dependencia
   nueva debe estar justificada en la spec activa. Dependencias de desarrollo
   base: Vitest. Única librería de animación permitida: Motion (`motion`).
2. **La spec manda**: todas las especificaciones se crean y viven dentro de
   `specs/`; no se admiten specs en otra ubicación. Ningún comportamiento,
   sección o contenido se implementa si no está en la spec activa de `specs/`.
   Si falta una decisión, se detiene el trabajo y se pregunta.
3. **Estático y cero JS por defecto**: el sitio se genera como estático
   (`output: 'static'`). Los componentes son `.astro`. Solo se permiten islas
   de un único framework UI cuando la spec lo requiera, con la directiva
   `client:*` menos agresiva posible (`client:visible` / `client:idle`).
   Las animaciones siguen este orden de preferencia: CSS → View Transitions de
   Astro → Web Animations API → Motion, este último solo en `<script>` de Astro
   y cuando el diseño aprobado justifique que lo anterior no basta.
4. **Contenido separado de presentación**: la información del CV, proyectos,
   experiencia y logros vive en Content Collections (`src/content/`) con
   esquema validado, derivada de `docs/cv.md`. Nada de datos personales
   incrustados en componentes. La lógica (formateo, orden, filtrado) vive en
   `src/lib/` como funciones puras testeables sin renderizar.
5. **Tests como puerta**: cada tarea termina con `bun run test` (Vitest) y
   `bun run build` en verde. Prohibido avanzar con tests o build en rojo.
   Toda función de `src/lib/` y todo esquema de contenido tiene tests.
6. **Estilos con CSS nativo**: estilos scoped de Astro y variables CSS
   globales para la paleta (azules y negro) y la tipografía. Sin frameworks
   CSS ni librerías de componentes. Diseño mobile-first y responsivo.
   El diseño visual y de movimiento se genera exclusivamente con la skill
   `/design-spec` (que usa internamente `/design`) y se documenta en `designs/`.
   Ninguna spec se diseña sin el sistema de diseño global aprobado
   (`designs/000-design-system/`). La implementación debe seguir el diseño aprobado.
7. **Rendimiento y accesibilidad no negociables**: imágenes con `astro:assets`,
   fuentes autoalojadas o con `font-display: swap`, HTML semántico, contraste
   WCAG AA y navegación por teclado. Objetivo Lighthouse ≥ 90 en todas las
   categorías. Toda animación respeta `prefers-reduced-motion` con una versión
   estática equivalente. Ante conflicto, rendimiento y accesibilidad prevalecen
   sobre cualquier efecto visual.
8. **Datos veraces**: todo contenido profesional proviene de `docs/cv.md`.
   Prohibido inventar experiencia, logros, métricas o tecnologías.
9. **Idioma**: código, identificadores y commits en inglés; contenido del
   sitio y documentación en español.
