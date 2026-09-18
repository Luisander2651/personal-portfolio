---
id: 011
title: Footer
status: active
created: 2026-09-18
updated: 2026-09-18
depends_on: [001, 002, 003, 004, 005, 006, 007, 008, 009, 010]
---

# Footer

## Objetivo

Cerrar la home con un footer que deje el contacto a mano: correo, GitHub y LinkedIn, cada uno
con su icono y su dato visible, firmado con el nombre y el rol del autor y una línea de
copyright con el año. Sustituye a una sección de contacto (sin formularios). El objetivo es que
un reclutador que llega al final de la página pueda leer, copiar o abrir el contacto sin volver
arriba.

## Historias de usuario

- **HU-1**: Como reclutador, quiero ver y usar los datos de contacto al terminar de leer, para
  escribir al autor o revisar sus perfiles sin volver al inicio.
- **HU-2**: Como visitante que usa teclado o lector de pantalla, quiero recorrer los enlaces de
  contacto con un orden, un foco y unos nombres claros.
- **HU-3**: Como visitante, quiero que el footer sea ligero y accesible, sin depender de
  JavaScript ni de animaciones para leerlo.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html` sin ejecutar JavaScript
  - **Entonces** existe un único `<footer>` situado después de `main` y fuera de él, sin `id` de
    ancla, y la navegación (spec 010) no lo enlaza
- **CA-1.2**
  - **Dado** el footer y la colección `profile`
  - **Cuando** inspecciono sus enlaces
  - **Entonces** tiene exactamente tres, en este orden: correo con `href` `mailto:` +
    `profile.email` y texto visible igual a `profile.email`; GitHub con `href` igual a
    `profile.github` y texto visible igual a esa URL sin el protocolo ni `www.`
    (`github.com/Luisander2651`); y LinkedIn con `href` igual a `profile.linkedin` y texto
    visible derivado del mismo modo
    (`linkedin.com/in/luis-mario-gutierrez-valdovinos-6998a6357`); cada uno lleva un icono
    decorativo, se abre en la misma pestaña (sin `target`) y su nombre accesible incluye el
    nombre del servicio ("Correo", "GitHub" o "LinkedIn"); ningún dato de contacto está
    incrustado en componentes
- **CA-1.3**
  - **Dado** el footer
  - **Cuando** inspecciono su texto
  - **Entonces** muestra `profile.name` y `profile.role`, y una línea de copyright con el
    formato `© {año} {profile.name}`, donde el año es el de la fecha de la build
- **CA-1.4**
  - **Dado** el footer
  - **Cuando** inspecciono su HTML
  - **Entonces** no contiene formularios, campos ni botones

### HU-2

- **CA-2.1**
  - **Dado** un visitante que navega con teclado
  - **Cuando** recorre la página con Tab después del contenido de `main`
  - **Entonces** alcanza los tres enlaces del footer en el orden de CA-1.2, y cada uno muestra
    un indicador de foco visible con los tokens de foco del sistema de diseño
- **CA-2.2**
  - **Dado** el footer
  - **Cuando** inspecciono su HTML
  - **Entonces** la lista de enlaces de contacto tiene la etiqueta accesible "Contacto"

### HU-3

- **CA-3.1**
  - **Dado** un visitante sin JavaScript o con `prefers-reduced-motion: reduce`
  - **Cuando** llega al final de la home
  - **Entonces** todo el contenido del footer está en el HTML y es visible; y el JavaScript de
    cliente de la home sigue siendo ≤ 3 kB con gzip, sin scripts nuevos ni paquetes
- **CA-3.2**
  - **Dado** un visitante con JavaScript activo y sin `prefers-reduced-motion: reduce`
  - **Cuando** el footer entra en pantalla al hacer scroll
  - **Entonces** se revela con el revelado común de las secciones, y vuelve a revelarse cada vez
    que entra de nuevo tras haber salido de pantalla (verificación: estructura por test y
    revisión manual)
- **CA-3.3**
  - **Dado** los estilos del footer
  - **Cuando** se ejecutan los tests
  - **Entonces** solo usan tokens del sistema de diseño (ningún color, tamaño, espaciado o
    duración literal)
- **CA-3.4**
  - **Dado** la home servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO

## Contenido

Fuente: colección `profile` (derivada de la cabecera de `docs/cv.md`).

| Elemento | Campo | Texto visible | Destino |
|----------|-------|---------------|---------|
| Correo | `email` | `luisander.dev@gmail.com` | `mailto:luisander.dev@gmail.com` |
| GitHub | `github` | `github.com/Luisander2651` | `https://github.com/Luisander2651` |
| LinkedIn | `linkedin` | `linkedin.com/in/luis-mario-gutierrez-valdovinos-6998a6357` | `https://www.linkedin.com/in/luis-mario-gutierrez-valdovinos-6998a6357` |
| Firma | `name`, `role` | Luis Mario Gutiérrez Valdovinos · Ingeniero de Software Backend / Full Stack | — |
| Copyright | `name` + año de la build | © 2026 Luis Mario Gutiérrez Valdovinos | — |

Texto de interfaz: la etiqueta accesible "Contacto" de la lista de enlaces.

## Diseño

Diseño aprobado: [designs/011-footer/design.md](../../designs/011-footer/design.md)
· [canvas](https://claude.ai/artifact/Tkzxq9p5z3gDyMZpfYUe2N) (dirección A · Firma).

Qué debe sentirse: un cierre sobrio de la página, con el contacto legible y fácil de usar, que
no compita con las secciones. Revelado sutil al entrar en pantalla, como el resto. La
composición, los estados de los enlaces y los tiempos se definen en `/design-spec`.

## Fuera de alcance

- Formularios, botón de copiar el correo y sección de contacto aparte.
- Enlace "volver arriba": lo cubre la marca "LMGV" de la navegación (spec 010).
- Enlaces a las secciones dentro del footer.
- Otros datos o redes que no están en `docs/cv.md` (teléfono, descarga del CV…); la ubicación
  no se muestra en el footer.
- Spotlight: el footer no tiene cards.
- Metadatos SEO (spec 012) y página 404 (spec 013).

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-18 | Implícita | Número, slug y contenido | `011-footer`: correo, GitHub y LinkedIn de `profile`; sustituye a una sección de contacto, sin formularios | docs/workflow.md |
| 2026-09-18 | Implícita | Comportamiento de los enlaces | Misma pestaña, correo con `mailto:` y nombre accesible en español, como en el hero | specs/003-home-hero |
| 2026-09-18 | Brecha | Formato de los enlaces | Icono decorativo + dato visible (correo; URL de GitHub y LinkedIn sin protocolo ni `www.`, derivada de `profile`) | usuario |
| 2026-09-18 | Brecha | Contenido adicional | Nombre y rol de `profile` como firma y `© {año de la build} {nombre}`; sin frases que no estén en el CV | usuario |
| 2026-09-18 | Brecha | Botón para copiar el correo | No: el correo visible y el enlace `mailto:` bastan; sin JavaScript nuevo | usuario |
| 2026-09-18 | Brecha | Movimiento | Revelado común al entrar en pantalla, cada vez; visible sin JavaScript y con reduced motion | usuario |
| 2026-09-18 | Implícita | Estructura | `footer` después de `main`, sin ancla ni enlace en la navegación; lista de enlaces con etiqueta accesible "Contacto" | specs/010-navigation, constitution.md §7 |
| 2026-09-18 | Implícita | JavaScript | Presupuesto compartido de la home ≤ 3 kB con gzip sin scripts nuevos | constitution.md §3, specs/010-navigation |
| 2026-09-18 | Diseño | Composición del footer | A · Firma: nombre (tamaño `h2`, como párrafo) y rol a la izquierda, lista de contacto (icono, servicio y dato mono en color de enlace) a la derecha desde 768px, copyright mono al pie; revelado común como un único bloque; sin tokens nuevos | /design-spec |
