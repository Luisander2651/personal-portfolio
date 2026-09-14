export type TokenMode = 'fijo' | 'fluido' | '768';

export type DesignToken = {
  token: string;
  mode: TokenMode;
  mobile: string;
  desktop: string | null;
};

const MODES: readonly string[] = ['fijo', 'fluido', '768'];
const ABSENT = '—';

const unwrapCode = (cell: string) => cell.trim().replace(/^`(.*)`$/, '$1');

/**
 * Reads the token rows of design.md tables (`Token | Modo | Móvil | Escritorio | Uso`).
 * Rows whose first cell is not a custom property are ignored.
 */
export function parseDesignTokens(markdown: string): DesignToken[] {
  return markdown
    .split(/\r?\n/)
    .filter((line) => /^\|\s*`--/.test(line))
    .map((line) => {
      const [, tokenCell = '', modeCell = '', mobileCell = '', desktopCell = ''] = line.split(/(?<!\\)\|/);
      const token = unwrapCode(tokenCell);
      const mode = modeCell.trim();

      if (!MODES.includes(mode)) {
        throw new Error(`Unknown mode "${mode}" for token ${token}`);
      }

      const desktop = unwrapCode(desktopCell);
      return {
        token,
        mode: mode as TokenMode,
        mobile: unwrapCode(mobileCell),
        desktop: desktop === ABSENT || desktop === '' ? null : desktop,
      };
    });
}
