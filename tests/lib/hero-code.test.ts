import { describe, expect, it } from 'vitest';
import { buildProfileCodeLines, type CodeLine } from '../../src/lib/hero-code';

const profile = {
  name: 'Persona de Prueba',
  role: 'Rol de Prueba',
  featuredStack: ['Tech A', 'Tech B', 'Tech C'],
};

const lineText = (line: CodeLine) => line.map(({ text }) => text).join('');
const segmentsOfKind = (lines: CodeLine[], kind: string) =>
  lines.flat().filter((segment) => segment.kind === kind).map(({ text }) => text);

describe('buildProfileCodeLines', () => {
  const lines = buildProfileCodeLines(profile);

  it('builds the decorative profile code line by line', () => {
    expect(lines.map(lineText)).toEqual([
      'const profile = {',
      '  name: "Persona de Prueba",',
      '  role: "Rol de Prueba",',
      '  stack: ["Tech A", "Tech B", "Tech C"],',
      '};',
      'render(profile);',
    ]);
  });

  it('marks const as keyword and render as function', () => {
    expect(segmentsOfKind(lines, 'keyword')).toEqual(['const']);
    expect(segmentsOfKind(lines, 'function')).toEqual(['render']);
  });

  it('marks every quoted value as string, keeping the stack order', () => {
    expect(segmentsOfKind(lines, 'string')).toEqual([
      '"Persona de Prueba"',
      '"Rol de Prueba"',
      '"Tech A"',
      '"Tech B"',
      '"Tech C"',
    ]);
  });

  it('uses the data it receives', () => {
    const other = buildProfileCodeLines({ name: 'Otra', role: 'Otro rol', featuredStack: ['Solo'] });

    expect(other.map(lineText)).toContain('  name: "Otra",');
    expect(other.map(lineText)).toContain('  role: "Otro rol",');
    expect(other.map(lineText)).toContain('  stack: ["Solo"],');
  });

  it('keeps accents and escapes quotes inside values', () => {
    const other = buildProfileCodeLines({ name: 'Gutiérrez "Dev"', role: 'Rol', featuredStack: ['X'] });

    expect(other.map(lineText)).toContain('  name: "Gutiérrez \\"Dev\\"",');
  });
});
