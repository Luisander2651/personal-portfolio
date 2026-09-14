import { describe, expect, it } from 'vitest';
import cvSource from '../../docs/cv.md?raw';
import {
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillSchema,
} from '../../src/content/schemas';

type MarkdownEntry = {
  frontmatter: Record<string, unknown>;
  rawContent: () => string;
};

type Frontmatter = Record<string, any>;

const cv = cvSource.replace(/\r\n/g, '\n');

const entriesOf = (modules: Record<string, unknown>) =>
  Object.entries(modules as Record<string, MarkdownEntry>).map(([path, module]) => ({
    path,
    data: module.frontmatter as Frontmatter,
    body: module.rawContent().replace(/\r\n/g, '\n').trim(),
  }));

const collections = {
  profile: {
    schema: profileSchema,
    count: 1,
    entries: entriesOf(import.meta.glob('/src/content/profile/*.md', { eager: true })),
  },
  skills: {
    schema: skillSchema,
    count: 9,
    entries: entriesOf(import.meta.glob('/src/content/skills/*.md', { eager: true })),
  },
  projects: {
    schema: projectSchema,
    count: 5,
    entries: entriesOf(import.meta.glob('/src/content/projects/*.md', { eager: true })),
  },
  experience: {
    schema: experienceSchema,
    count: 1,
    entries: entriesOf(import.meta.glob('/src/content/experience/*.md', { eager: true })),
  },
  education: {
    schema: educationSchema,
    count: 2,
    entries: entriesOf(import.meta.glob('/src/content/education/*.md', { eager: true })),
  },
};

/** Section of cv.md between a level-2 heading and the next one. */
const cvSection = (heading: string) => {
  const start = cv.indexOf(`## ${heading}\n`);
  const end = cv.indexOf('\n## ', start + 1);
  return cv.slice(start, end === -1 ? undefined : end);
};

const byOrder = (a: { data: Frontmatter }, b: { data: Frontmatter }) => a.data.order - b.data.order;

const bodyLinesAppearIn = (body: string, source: string) => {
  const lines = body.split('\n').filter((line) => line.trim() !== '');
  expect(lines.length).toBeGreaterThan(0);
  for (const line of lines) expect(source).toContain(line);
};

describe('content entries', () => {
  describe.each(Object.entries(collections))('%s', (_name, { schema, count, entries }) => {
    it(`has ${count} entries`, () => {
      expect(entries).toHaveLength(count);
    });

    it('validates every entry against its schema', () => {
      for (const entry of entries) {
        expect(schema.safeParse(entry.data).success, entry.path).toBe(true);
      }
    });
  });

  describe('profile', () => {
    const profile = collections.profile.entries[0]?.data ?? {};

    it('matches the header and summary of cv.md', () => {
      expect(cv).toContain(`# ${profile.name}\n`);
      expect(cv).toContain(`**Rol:** ${profile.role}\n`);
      expect(cv).toContain(`**Ubicación:** ${profile.location}\n`);
      expect(cv).toContain(`**Correo:** ${profile.email}\n`);
      expect(cv).toContain(`**GitHub:** ${profile.github}\n`);
      expect(cv).toContain(`**LinkedIn:** ${profile.linkedin}\n`);
      expect(cvSection('Resumen profesional')).toContain(`\n${profile.summary}\n`);
    });

    it('matches every language of cv.md', () => {
      const section = cvSection('Idiomas');
      const listed = section.match(/^- \*\*/gm) ?? [];

      expect(profile.languages).toHaveLength(listed.length);
      for (const { language, level } of profile.languages ?? []) {
        expect(section).toContain(`- **${language}:** ${level}\n`);
      }
    });

    it('features exactly the stack highlighted in cv.md, in order', () => {
      expect(profile.featuredStack).toEqual(['TypeScript', 'Node.js', 'Laravel 12', 'Spring Boot']);
      for (const technology of profile.featuredStack ?? []) {
        expect(cv, technology).toContain(technology);
      }
    });
  });

  describe('skills', () => {
    const section = cvSection('Habilidades técnicas');
    const skills = [...collections.skills.entries].sort(byOrder);

    it('matches every category and its items in cv.md', () => {
      for (const { data } of skills) {
        expect(section).toContain(`### ${data.category}\n${data.items.join(', ')}\n`);
      }
    });

    it('follows the order of cv.md', () => {
      const positions = skills.map(({ data }) => section.indexOf(`### ${data.category}\n`));
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
    });
  });

  describe('projects', () => {
    const section = cvSection('Proyectos destacados');
    const projects = [...collections.projects.entries].sort(byOrder);

    it('matches every name, stack and achievement in cv.md', () => {
      for (const { data, body } of projects) {
        expect(section).toContain(`### ${data.name}`);
        expect(section).toContain(`**Stack:** ${data.stack.join(', ')}\n`);
        bodyLinesAppearIn(body, section);
      }
    });

    it('follows the order of cv.md', () => {
      const positions = projects.map(({ data }) => section.indexOf(`### ${data.name}`));
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
    });

    it('marks only the Auth Microservice as in progress', () => {
      const statuses = Object.fromEntries(projects.map(({ data }) => [data.name, data.status]));

      expect(statuses['DentissaApp — Auth Microservice']).toBe('in-progress');
      for (const [name, status] of Object.entries(statuses)) {
        if (name !== 'DentissaApp — Auth Microservice') expect(status, name).toBe('completed');
      }
    });
  });

  describe('experience', () => {
    const section = cvSection('Experiencia');

    it('matches company, position, duration and achievements in cv.md', () => {
      for (const { data, body } of collections.experience.entries) {
        expect(section).toContain(`### ${data.company} — ${data.position}\n`);
        expect(section).toContain(`**Duración:** ${data.duration}\n`);
        bodyLinesAppearIn(body, section);
      }
    });
  });

  describe('education', () => {
    const section = cvSection('Formación');
    const byDegree = (degree: string) =>
      collections.education.entries.find(({ data }) => data.degree === degree)?.data;

    it('matches degree, specialization and institution in cv.md', () => {
      for (const { data } of collections.education.entries) {
        expect(section).toContain(`- **${data.degree}** (${data.specialization})\n  ${data.institution} — `);
      }
    });

    it('marks the TSU as completed and the Engineering as in progress, expected in 2026', () => {
      expect(byDegree('TSU en Tecnologías de la Información')?.status).toBe('completed');
      expect(byDegree('Ingeniería en Tecnologías de la Información')).toMatchObject({
        status: 'in-progress',
        expectedYear: 2026,
      });
    });
  });
});
