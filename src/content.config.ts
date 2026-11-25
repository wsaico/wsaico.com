import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    order: z.number(),
    featured: z.boolean().default(true),
    bentoSpan: z.enum(['wide', 'tall', 'normal']).default('normal'),
    category: z.string(),
    targetAudience: z.array(z.string()),
    deliverables: z.array(z.string()),
    stack: z.array(z.string()),
    relatedProjectSlugs: z.array(z.string()).default([]),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    problem: z.string(),
    solution: z.string(),
    result: z.string(),
    metrics: z.array(z.string()).default([]),
    stack: z.array(z.string()),
    category: z.enum([
      'Sistemas Web',
      'SSOMA y Campo',
      'Operaciones',
      'Finanzas',
      'SEO y Medios',
    ]),
    liveUrl: z.string().url().optional(),
    liveCtaQuestion: z.string().optional(),
    liveCtaLabel: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    date: z.coerce.date(),
    anonymizedNotice: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'Sistemas a Medida',
      'SSOMA y SST Perú',
      'Arquitectura Web',
      'SEO y Rendimiento',
    ]),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Wilber Saico'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    relatedServiceSlug: z.string().optional(),
  }),
});

export const collections = { services, projects, blog };
