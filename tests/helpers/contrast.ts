const HEX_COLOR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

const toLinear = (channel: number) => {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/** WCAG 2.x relative luminance of a 6-digit hex color. */
export function relativeLuminance(hex: string): number {
  const match = hex.match(HEX_COLOR);
  if (!match) throw new Error(`Expected a 6-digit hex color, got "${hex}"`);

  const [red, green, blue] = match.slice(1, 4).map((pair) => toLinear(parseInt(pair, 16)));
  return 0.2126 * (red ?? 0) + 0.7152 * (green ?? 0) + 0.0722 * (blue ?? 0);
}

/** WCAG 2.x contrast ratio between two 6-digit hex colors. */
export function contrastRatio(first: string, second: string): number {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
}
