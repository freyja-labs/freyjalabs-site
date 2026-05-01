import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    tag: z.string(),
    order: z.number(),
    priceRange: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.enum(['Mike Borowczak', 'Andrea Burrows Borowczak', 'Freyja Labs']),
    tags: z.array(z.string()).optional(),
    excerpt: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, blog };
