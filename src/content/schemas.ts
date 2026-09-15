import { z } from 'astro/zod';

const text = z.string().min(1);
const nonEmptyList = <T extends z.ZodType>(item: T) => z.array(item).min(1);
const position = z.int().positive();
const status = z.enum(['completed', 'in-progress']);

export const profileSchema = z.object({
  name: text,
  role: text,
  location: text,
  email: z.email(),
  github: z.url(),
  linkedin: z.url(),
  summary: text,
  languages: nonEmptyList(z.object({ language: text, level: text })),
  featuredStack: nonEmptyList(text),
  practicalExperience: nonEmptyList(text),
  focusAreas: nonEmptyList(text),
});

export const skillSchema = z.object({
  category: text,
  order: position,
  items: nonEmptyList(text),
});

/** The entry body holds the project achievements. */
export const projectSchema = z.object({
  name: text,
  order: position,
  status,
  stack: nonEmptyList(text),
});

/** The entry body holds the achievements in the role. */
export const experienceSchema = z.object({
  company: text,
  position: text,
  duration: text,
});

export const educationSchema = z.object({
  degree: text,
  specialization: text,
  institution: text,
  status,
  expectedYear: z.int().optional(),
});
