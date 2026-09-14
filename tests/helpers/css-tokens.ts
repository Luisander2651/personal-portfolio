export type CssTokenContexts = {
  /** `:root` declarations outside media queries. */
  root: Record<string, string>;
  /** `:root` declarations inside `@media (min-width: 768px)`. */
  desktop: Record<string, string>;
  /** `:root` declarations inside `@media (prefers-reduced-motion: reduce)`. */
  reducedMotion: Record<string, string>;
};

type Block = { prelude: string; body: string };

const DESKTOP_QUERY = /^@media\s*\(\s*min-width:\s*768px\s*\)$/;
const REDUCED_MOTION_QUERY = /^@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)$/;

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

/** Splits CSS into its top-level `prelude { body }` blocks. */
function topLevelBlocks(css: string): Block[] {
  const blocks: Block[] = [];
  let depth = 0;
  let preludeStart = 0;
  let bodyStart = 0;

  for (let index = 0; index < css.length; index++) {
    const char = css[index];
    if (char === '{') {
      if (depth === 0) bodyStart = index + 1;
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        blocks.push({
          prelude: normalize(css.slice(preludeStart, bodyStart - 1)),
          body: css.slice(bodyStart, index),
        });
        preludeStart = index + 1;
      }
    }
  }

  return blocks;
}

function declarations(body: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const [, name = '', value = ''] = match;
    result[name] = normalize(value);
  }
  return result;
}

function rootDeclarations(blocks: Block[]): Record<string, string> {
  return Object.assign({}, ...blocks.filter(({ prelude }) => prelude === ':root').map(({ body }) => declarations(body)));
}

function mediaRootDeclarations(blocks: Block[], query: RegExp): Record<string, string> {
  return Object.assign(
    {},
    ...blocks.filter(({ prelude }) => query.test(prelude)).map(({ body }) => rootDeclarations(topLevelBlocks(body))),
  );
}

/** Reads the custom properties declared on `:root` in each supported context. */
export function parseCssTokens(css: string): CssTokenContexts {
  const blocks = topLevelBlocks(css.replace(/\/\*[\s\S]*?\*\//g, ''));
  return {
    root: rootDeclarations(blocks),
    desktop: mediaRootDeclarations(blocks, DESKTOP_QUERY),
    reducedMotion: mediaRootDeclarations(blocks, REDUCED_MOTION_QUERY),
  };
}

/** Returns the minimum and maximum arguments of a `clamp()` value, or null. */
export function parseClamp(value: string): { min: string; max: string } | null {
  const match = normalize(value).match(/^clamp\((.*)\)$/);
  if (!match) return null;

  const args: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of match[1] ?? '') {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  args.push(current.trim());

  const [min, , max] = args;
  return args.length === 3 && min && max ? { min, max } : null;
}
