import { z } from 'astro/zod';

const text = z.string().min(1);
const nonEmptyList = <T extends z.ZodType>(item: T) => z.array(item).min(1);
const position = z.int().positive();
const status = z.enum(['completed', 'in-progress']);
/** How a skill category is shown in the tech stack section. */
const presentation = z.enum(['icons', 'tags', 'text']);

export const profileSchema = z.object({
  name: text,
  role: text,
  location: text,
  email: z.email(),
  github: z.url(),
  linkedin: z.url(),
  summary: text,
  languages: nonEmptyList(z.object({ language: text, level: text, tag: text.optional() })),
  featuredStack: nonEmptyList(text),
  practicalExperience: nonEmptyList(text),
  focusAreas: nonEmptyList(text),
});

export const skillSchema = z.object({
  category: text,
  order: position,
  presentation,
  items: nonEmptyList(text),
});

/** The entry body holds the project achievements. */
export const projectSchema = z.object({
  name: text,
  order: position,
  status,
  /** Part of the featured block of the projects section. */
  featured: z.boolean(),
  stack: nonEmptyList(text),
});

/** The entry body holds the achievements in the role. */
export const experienceSchema = z.object({
  company: text,
  position: text,
  /** Months and year of the role, as written in the CV. */
  period: text,
  duration: text,
});

export const educationSchema = z.object({
  degree: text,
  specialization: text,
  institution: text,
  /** Short name of the institution, shown next to the full one. */
  institutionShort: text,
  status,
  order: position,
  startYear: z.int(),
  /** Year the studies ended or are expected to end. */
  endYear: z.int(),
});
