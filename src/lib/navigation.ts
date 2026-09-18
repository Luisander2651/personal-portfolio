/** A link of the main navigation: its visible label and the id of the section it leads to. */
export type NavLink = {
  label: string;
  anchor: string;
};

/** The sections of the home in page order (specs/010-navigation, "Contenido"). */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Sobre mí', anchor: 'sobre-mi' },
  { label: 'Tecnologías', anchor: 'tecnologias' },
  { label: 'Proyectos', anchor: 'proyectos' },
  { label: 'Experiencia', anchor: 'experiencia' },
  { label: 'Formación', anchor: 'formacion' },
  { label: 'Idiomas', anchor: 'idiomas' },
];

/** First letter of each word of a name, uppercased ("Luis Mario Gutiérrez Valdovinos" → "LMGV"). */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word !== '')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/** A navigable section measured against the viewport (like `getBoundingClientRect`). */
export type MeasuredSection = {
  anchor: string;
  top: number;
  bottom: number;
};

/** The reading line sits at this fraction of the viewport height (designs/010-navigation). */
const READING_LINE = 1 / 3;

/**
 * Anchor of the section that crosses the reading line, or `null` when the line falls outside
 * every section (the hero). Once the end of the last section is in view, that section is the
 * active one even if it is too short to reach the line. Sections are in page order.
 */
export function pickActiveSection(sections: readonly MeasuredSection[], viewportHeight: number): string | null {
  const last = sections.at(-1);
  if (last && last.bottom <= viewportHeight && last.bottom > 0) return last.anchor;

  const line = viewportHeight * READING_LINE;
  return sections.find(({ top, bottom }) => top <= line && bottom > line)?.anchor ?? null;
}
