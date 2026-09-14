# Dirección creativa — personal-website

Decisiones fijadas con el usuario. Cambiarlas requiere petición explícita.

## Estética
- **Tech premium** (referencias de sensación: Linear, Vercel, Raycast).
- Fondo negro profundo, azules como color de marca y de luz.
- Grids finos, gradientes sutiles, **bordes luminosos** y glow azul.
- Tipografía moderna y legible: una sans para contenido y una monospace para detalles
  técnicos (código, etiquetas, metadatos).

## Intensidad de movimiento
- **Protagonista pero controlada**: el hero tiene una animación de impacto; el resto
  usa reveals y microinteracciones. El contenido siempre es lo principal.

## Hero
- **Código que se convierte en UI**: un bloque de código se escribe solo y se "compila",
  transformándose en la tarjeta de presentación con los datos reales de `docs/cv.md`.

## Recursos firma
- **Efectos de texto**: scramble/decode de caracteres, typing, revelado letra a letra.
- **Spotlight y bordes luminosos**: luz que sigue al cursor sobre cards, bordes con
  gradiente animado, tilt 3D sutil.
- **Easter egg**: mensaje ASCII en la consola del navegador para quien abra DevTools.

## Navegación y scroll
- **Reveals al hacer scroll** (fade / slide / blur al entrar en viewport).
- **View Transitions entre páginas** (p. ej. la card de un proyecto se transforma en la
  cabecera de su página de detalle).

## Tecnología de animación
- Prioridad: CSS (incl. scroll-driven animations) → View Transitions de Astro → Web
  Animations API → **Motion** (`motion`, motion.dev) solo para secuencias que lo
  justifiquen (p. ej. hero código → UI, scramble de texto).

## Prioridades ante conflicto
- **Rendimiento y accesibilidad ganan** sobre cualquier efecto. Lighthouse ≥ 90 se
  mantiene; el efecto se simplifica o se difiere.
- Con `prefers-reduced-motion: reduce` se muestra una versión estática igual de cuidada,
  nunca una versión rota o vacía.
- En dispositivos táctiles, los efectos dependientes del cursor tienen alternativa.
