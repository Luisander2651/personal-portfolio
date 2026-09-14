import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillSchema,
} from './content/schemas';

const markdownIn = (collection: string) =>
  glob({ pattern: '**/*.md', base: `./src/content/${collection}` });

export const collections = {
  profile: defineCollection({ loader: markdownIn('profile'), schema: profileSchema }),
  skills: defineCollection({ loader: markdownIn('skills'), schema: skillSchema }),
  projects: defineCollection({ loader: markdownIn('projects'), schema: projectSchema }),
  experience: defineCollection({ loader: markdownIn('experience'), schema: experienceSchema }),
  education: defineCollection({ loader: markdownIn('education'), schema: educationSchema }),
};
