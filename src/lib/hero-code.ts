export type CodeSegmentKind = 'keyword' | 'string' | 'function' | 'plain';

export type CodeSegment = { text: string; kind: CodeSegmentKind };

export type CodeLine = CodeSegment[];

type ProfileCodeSource = { name: string; role: string; featuredStack: readonly string[] };

const plain = (text: string): CodeSegment => ({ text, kind: 'plain' });
const quoted = (value: string): CodeSegment => ({ text: JSON.stringify(value), kind: 'string' });

/** Joins string segments with a plain separator between them. */
function listOf(values: readonly string[]): CodeSegment[] {
  return values.flatMap((value, index) => (index === 0 ? [quoted(value)] : [plain(', '), quoted(value)]));
}

/** Builds the decorative hero code (`const profile = { … }; render(profile);`) from profile data. */
export function buildProfileCodeLines({ name, role, featuredStack }: ProfileCodeSource): CodeLine[] {
  return [
    [{ text: 'const', kind: 'keyword' }, plain(' profile = {')],
    [plain('  name: '), quoted(name), plain(',')],
    [plain('  role: '), quoted(role), plain(',')],
    [plain('  stack: ['), ...listOf(featuredStack), plain('],')],
    [plain('};')],
    [{ text: 'render', kind: 'function' }, plain('(profile);')],
  ];
}
