import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    link: z.string().url().optional(),
    github: z.string().url().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
