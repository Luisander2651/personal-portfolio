import { describe, expect, it } from 'vitest';
import { initialsOf, NAV_LINKS, pickActiveSection } from '../../src/lib/navigation';

describe('NAV_LINKS', () => {
  it('lists the six sections in order with their labels and anchors', () => {
    expect(NAV_LINKS).toEqual([
      { label: 'Sobre mí', anchor: 'sobre-mi' },
      { label: 'Tecnologías', anchor: 'tecnologias' },
      { label: 'Proyectos', anchor: 'proyectos' },
      { label: 'Experiencia', anchor: 'experiencia' },
      { label: 'Formación', anchor: 'formacion' },
      { label: 'Idiomas', anchor: 'idiomas' },
    ]);
  });
});

describe('initialsOf', () => {
  it('takes the first letter of each word', () => {
    expect(initialsOf('Luis Mario Gutiérrez Valdovinos')).toBe('LMGV');
  });

  it('ignores repeated and surrounding spaces', () => {
    expect(initialsOf('  Luis   Mario  ')).toBe('LM');
  });

  it('uppercases, keeping accents', () => {
    expect(initialsOf('álvaro ñúñez')).toBe('ÁÑ');
  });

  it('handles a single word', () => {
    expect(initialsOf('Luis')).toBe('L');
  });
});

describe('pickActiveSection', () => {
  // Viewport of 900px: the reading line sits at 300px.
  const height = 900;
  const section = (anchor: string, top: number, bottom: number) => ({ anchor, top, bottom });

  it('picks none while the line is over the hero', () => {
    const sections = [section('sobre-mi', 700, 1500), section('tecnologias', 1500, 2400)];
    expect(pickActiveSection(sections, height)).toBeNull();
  });

  it('picks the section that crosses the line', () => {
    const sections = [section('sobre-mi', -600, 200), section('tecnologias', 200, 1100), section('proyectos', 1100, 2000)];
    expect(pickActiveSection(sections, height)).toBe('tecnologias');
  });

  it('picks exactly one at the boundary between two sections', () => {
    const sections = [section('sobre-mi', -500, 300), section('tecnologias', 300, 1200)];
    expect(pickActiveSection(sections, height)).toBe('tecnologias');
  });

  it('picks the last section once the end of the page is in view, even if it never reaches the line', () => {
    const sections = [section('formacion', -400, 500), section('idiomas', 500, 900)];
    expect(pickActiveSection(sections, height)).toBe('idiomas');
  });

  it('picks the last section at the end of the page even when it overflows by a fraction of a pixel', () => {
    // Real case at 730px: the page is 5980.25px tall but scrolling stops at a whole pixel.
    const sections = [section('formacion', -193, 336.2), section('idiomas', 336.2, 730.25)];
    expect(pickActiveSection(sections, 730)).toBe('idiomas');
  });

  it('picks none without sections', () => {
    expect(pickActiveSection([], height)).toBeNull();
  });
});
