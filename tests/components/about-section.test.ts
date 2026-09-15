import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import AboutSection from '../../src/components/AboutSection.astro';
import aboutSource from '../../src/components/AboutSection.astro?raw';
import sectionHeaderSource from '../../src/components/SectionHeader.astro?raw';
import indexSource from '../../src/pages/index.astro?raw';

const props = {
  summary: 'Resumen de prueba con varias frases. Segunda frase del resumen.',
  practicalExperience: ['Experiencia A', 'Experiencia B', 'Experiencia C'],
  focusAreas: ['Enfoque A', 'Enfoque B', 'Enfoque C', 'Enfoque D'],
};

const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

describe('AboutSection', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(AboutSection, { props });
  });

  describe('section', () => {
    it('is a section with id "sobre-mi" labelled by the "Sobre mí" h2', () => {
      const section = html.match(/<section[^>]*>/)?.[0] ?? '';
      const labelledBy = attribute(section, 'aria-labelledby');
      const heading = [...html.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)];

      expect(attribute(section, 'id')).toBe('sobre-mi');
      expect(labelledBy).toBeTruthy();
      expect(heading).toHaveLength(1);
      expect(attribute(heading[0]?.[1] ?? '', 'id')).toBe(labelledBy);
      expect(textOf(heading[0]?.[2] ?? '')).toBe('Sobre mí');
    });

    it('contains the summary it receives in a paragraph', () => {
      const paragraphs = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)].map(([, content]) => textOf(content ?? ''));

      expect(paragraphs).toContain(props.summary);
    });
  });

  describe('key point groups', () => {
    const groups = () => [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)<\/ul>/g)];

    it('renders two h3 groups in order', () => {
      expect(groups().map(([, title]) => textOf(title ?? ''))).toEqual(['Experiencia práctica', 'Enfoque']);
    });

    it.each([
      [0, props.practicalExperience],
      [1, props.focusAreas],
    ])('follows group %i with a list of its points, in order', (index, points) => {
      const between = groups()[index]?.[2] ?? '';
      const list = between.slice(between.indexOf('<ul'));
      const items = [...list.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(([, content]) =>
        textOf((content ?? '').replace(/<(\w+)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g, '')),
      );

      expect(between).toMatch(/<ul[\s>]/);
      expect(items).toEqual(points);
    });
  });

  describe('decorative elements', () => {
    const hiddenTexts = () =>
      [...html.matchAll(/<(\w+)[^>]*aria-hidden="true"[^>]*>([\s\S]*?)<\/\1>/g)].map(([, , content]) =>
        textOf(content ?? ''),
      );

    it('hides the panel header from assistive technology', () => {
      expect(hiddenTexts().some((text) => text.includes('about.md') && text.includes('markdown'))).toBe(true);
    });

    it('hides the ## and - markers from assistive technology', () => {
      const visible = html.replace(/<(\w+)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g, '');

      expect(hiddenTexts().filter((text) => text === '##')).toHaveLength(2);
      expect(hiddenTexts().filter((text) => text === '-')).toHaveLength(
        props.practicalExperience.length + props.focusAreas.length,
      );
      expect(textOf(visible)).not.toMatch(/##|about\.md/);
    });
  });

  it('includes no client-side scripts', () => {
    expect(aboutSource).not.toMatch(/<script/i);
    expect(sectionHeaderSource).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<script/i);
  });
});

describe('home page', () => {
  it('renders AboutSection right after HomeHero inside main', () => {
    const main = indexSource.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';
    const components = [...main.matchAll(/<([A-Z]\w*)[\s/>]/g)].map(([, name]) => name);

    expect(components.slice(0, 2)).toEqual(['HomeHero', 'AboutSection']);
  });

  it('passes the profile summary and key points to AboutSection', () => {
    const about = indexSource.match(/<AboutSection[\s\S]*?\/>/)?.[0] ?? '';

    expect(about).toMatch(/summary=\{summary\}/);
    expect(about).toMatch(/practicalExperience=\{practicalExperience\}/);
    expect(about).toMatch(/focusAreas=\{focusAreas\}/);
  });
});
