# AGENTS.md — personal-website

## Proyecto
Pagina web sobre mi portafolio profesional y proyectos personales. Se habalara sobre mis cualidades, dominios y habilidades, así como de mis proyectos personales y profesionales. Se mostrara mi experiencia laboral y educativa, así como mis logros y reconocimientos. Se buscara transmitir una imagen profesional y confiable a los visitantes del sitio web.

<!-- ## Comandos -->

## Estilo
- Se utilizara Bun como gestor de paquetes y entorno de ejecución para JavaScript y TypeScript.
- Astro se utilizara como framework para construir la pagina web, aprovechando su capacidad de generar sitios estáticos y su enfoque en el rendimiento.
- Se plnateara un diseño dirigido ahcia el mundo del desarrollo de software, con un enfoque en la presentación de proyectos y habilidades técnicas, ademas de una estructura clara y fácil de navegar.
- Se pretende que la pagina web sea responsiva y se adapte a diferentes dispositivos y tamaños de pantalla, garantizando una experiencia de usuario óptima en todo momento.
- Se buscara optimizar el rendimiento de la pagina web, minimizando el tiempo de carga y mejorando la velocidad de navegación, para ofrecer una experiencia fluida y agradable a los visitantes.
- Se pretende que predominen las tonalidades de azul y negro, transmitiendo una sensación de profesionalismo y confianza, ademas de utilizar tipografías modernas y legibles para mejorar la experiencia de lectura.
- Estética tech premium con animaciones creativas (hero código → UI, efectos de texto, bordes luminosos, View Transitions), evitando portafolios genéricos. Detalle en `.claude/skills/design-spec/creative-direction.md`.

## Reglas
- Lee `docs/constitution.md` y la spec activa en `specs/` antes de tocar código.
- Todas las especificaciones se crean dentro de `specs/` usando la skill `/spec`.
- El diseño visual y de movimiento se genera exclusivamente con la skill `/design-spec` (que usa `/design`) y se guarda en `designs/`.
- Los planes de tareas se crean en `plans/` con la skill `/plan-spec`, usando el mismo nombre de carpeta que la spec.
- Flujo completo documentado en `docs/workflow.md`.
- Lee `docs/cv.md` para conocer mi experiencia y educación y en base a ello, desarrollar el contenido de la pagina web.
- No modifiques archivos dentro de `specs/` salvo petición explícita.

## Al terminar cualquier tarea
- Ejecuta `bun run test` (Vitest) y `bun run build`