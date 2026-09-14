const CSS_DURATION = /^(\d*\.?\d+)(ms|s)$/;

/** Converts a computed CSS duration (`400ms`, `.4s`, `0s`) to milliseconds. */
export function parseCssDuration(value: string): number {
  const match = value.trim().match(CSS_DURATION);
  if (!match) {
    throw new Error(`Invalid CSS duration "${value}"`);
  }

  const [, amount = '0', unit] = match;
  return Math.round(Number(amount) * (unit === 's' ? 1000 : 1));
}

/**
 * Returns `text` with the first `progress` share of its characters resolved (left to right)
 * and the rest replaced by glyphs from `randomGlyph`. Whitespace is always kept.
 */
export function scrambleText(text: string, progress: number, randomGlyph: () => string): string {
  const characters = [...text];
  const resolved = Math.floor(Math.min(Math.max(progress, 0), 1) * characters.length);

  return characters
    .map((character, index) => (index < resolved || /\s/.test(character) ? character : randomGlyph()))
    .join('');
}
