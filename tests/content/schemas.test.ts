import { describe, expect, it } from 'vitest';
import {
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillSchema,
} from '../../src/content/schemas';

type Schema = {
  safeParse: (data: unknown) => {
    success: boolean;
    error?: { issues: { path: PropertyKey[] }[] };
  };
};

const failingPaths = (schema: Schema, data: unknown) => {
  const result = schema.safeParse(data);
  return result.success ? [] : (result.error?.issues ?? []).map((issue) => issue.path.join('.'));
};

const without = (data: Record<string, unknown>, field: string) => {
  const { [field]: _omitted, ...rest } = data;
  return rest;
};

const validProfile = {
  name: 'Test Person',
  role: 'Test Role',
  location: 'Test City',
  email: 'person@example.com',
  github: 'https://github.com/example',
  linkedin: 'https://www.linkedin.com/in/example',
  summary: 'Test summary.',
  languages: [{ language: 'Español', level: 'Nativo' }],
  featuredStack: ['Tech'],
  practicalExperience: ['Practice'],
  focusAreas: ['Focus'],
};

const validSkill = { category: 'Test category', order: 1, presentation: 'icons', items: ['Item'] };

const validProject = { name: 'Test project', order: 1, status: 'completed', featured: false, stack: ['Tech'] };

const validExperience = { company: 'Test company', position: 'Test position', duration: '4 meses' };

const validEducation = {
  degree: 'Test degree',
  specialization: 'Test specialization',
  institution: 'Test institution',
  status: 'in-progress',
  expectedYear: 2026,
};

const cases = [
  { name: 'profile', schema: profileSchema, valid: validProfile },
  { name: 'skills', schema: skillSchema, valid: validSkill },
  { name: 'projects', schema: projectSchema, valid: validProject },
  { name: 'experience', schema: experienceSchema, valid: validExperience },
  { name: 'education', schema: educationSchema, valid: validEducation },
];

const requiredFields: Record<string, string[]> = {
  profile: ['name', 'role', 'location', 'email', 'github', 'linkedin', 'summary', 'languages', 'featuredStack', 'practicalExperience', 'focusAreas'],
  skills: ['category', 'order', 'presentation', 'items'],
  projects: ['name', 'order', 'status', 'featured', 'stack'],
  experience: ['company', 'position', 'duration'],
  education: ['degree', 'specialization', 'institution', 'status'],
};

describe('content schemas', () => {
  describe.each(cases)('$name', ({ name, schema, valid }) => {
    it('accepts a valid entry', () => {
      expect(failingPaths(schema, valid)).toEqual([]);
    });

    it.each(requiredFields[name] ?? [])('rejects an entry without "%s"', (field) => {
      expect(failingPaths(schema, without(valid, field))).toContain(field);
    });
  });

  describe('profile', () => {
    it('rejects an invalid email', () => {
      expect(failingPaths(profileSchema, { ...validProfile, email: 'not-an-email' })).toContain('email');
    });

    it.each(['github', 'linkedin'])('rejects an invalid %s URL', (field) => {
      expect(failingPaths(profileSchema, { ...validProfile, [field]: 'not a url' })).toContain(field);
    });

    it('rejects an empty language list', () => {
      expect(failingPaths(profileSchema, { ...validProfile, languages: [] })).toContain('languages');
    });

    it.each(['practicalExperience', 'focusAreas'])('rejects an empty %s list', (field) => {
      expect(failingPaths(profileSchema, { ...validProfile, [field]: [] })).toContain(field);
    });

    it('rejects an empty featured stack', () => {
      expect(failingPaths(profileSchema, { ...validProfile, featuredStack: [] })).toContain('featuredStack');
    });

    it('rejects a language without level', () => {
      const languages = [{ language: 'Español' }];
      expect(failingPaths(profileSchema, { ...validProfile, languages })).toContain('languages.0.level');
    });
  });

  describe('skills', () => {
    it('rejects an empty item list', () => {
      expect(failingPaths(skillSchema, { ...validSkill, items: [] })).toContain('items');
    });

    it.each([0, -1, 1.5])('rejects order %s', (order) => {
      expect(failingPaths(skillSchema, { ...validSkill, order })).toContain('order');
    });

    it.each(['icons', 'tags', 'text'])('accepts the %s presentation', (presentation) => {
      expect(failingPaths(skillSchema, { ...validSkill, presentation })).toEqual([]);
    });

    it('rejects an unknown presentation', () => {
      expect(failingPaths(skillSchema, { ...validSkill, presentation: 'logos' })).toContain('presentation');
    });
  });

  describe('projects', () => {
    it('accepts the in-progress status', () => {
      expect(failingPaths(projectSchema, { ...validProject, status: 'in-progress' })).toEqual([]);
    });

    it('rejects an unknown status', () => {
      expect(failingPaths(projectSchema, { ...validProject, status: 'paused' })).toContain('status');
    });

    it('rejects an empty stack', () => {
      expect(failingPaths(projectSchema, { ...validProject, stack: [] })).toContain('stack');
    });

    it.each([true, false])('accepts featured %s', (featured) => {
      expect(failingPaths(projectSchema, { ...validProject, featured })).toEqual([]);
    });

    it.each(['true', 1, null])('rejects a non-boolean featured (%s)', (featured) => {
      expect(failingPaths(projectSchema, { ...validProject, featured })).toContain('featured');
    });

    it.each([0, -1, 1.5])('rejects order %s', (order) => {
      expect(failingPaths(projectSchema, { ...validProject, order })).toContain('order');
    });
  });

  describe('education', () => {
    it('accepts an entry without expectedYear', () => {
      expect(
        failingPaths(educationSchema, { ...without(validEducation, 'expectedYear'), status: 'completed' }),
      ).toEqual([]);
    });

    it('rejects an unknown status', () => {
      expect(failingPaths(educationSchema, { ...validEducation, status: 'dropped' })).toContain('status');
    });

    it('rejects a non-integer expectedYear', () => {
      expect(failingPaths(educationSchema, { ...validEducation, expectedYear: 2026.5 })).toContain(
        'expectedYear',
      );
    });
  });
});
