import { z } from 'zod';

export const PROJECT_TYPES = [
  'Sistema Web a Medida',
  'Sistema SSOMA / Inspecciones (Ley SST Perú)',
  'Aplicación Móvil (Android / iOS)',
  'Automatización de Procesos',
  'Sitio Web o Tienda Online',
  'SEO Técnico, SEM y Rendimiento',
] as const;

export const TIMELINE_OPTIONS = [
  'Urgente (2 a 4 semanas)',
  'Mediano plazo (1 a 2 meses)',
  'Planificado (3 meses a más)',
  'Aún estoy evaluando tiempos',
] as const;

export const BUDGET_RANGES = [
  'Necesito orientación según el alcance',
  'S/ 2,500 – S/ 5,000',
  'S/ 5,000 – S/ 12,000',
  'Más de S/ 12,000',
] as const;

export const quoteFormSchema = z.object({
  projectType: z.string().min(2, 'Selecciona un tipo de proyecto'),
  features: z.array(z.string()).default([]),
  problemSummary: z
    .string()
    .trim()
    .min(10, 'Cuéntanos brevemente qué necesitas resolver (mínimo 10 caracteres)')
    .max(2000),
  timeline: z.string().min(2, 'Selecciona un plazo estimado'),
  budgetRange: z.string().optional().default('Necesito orientación según el alcance'),
  fullName: z.string().trim().min(2, 'Ingresa tu nombre completo').max(120),
  company: z.string().trim().max(120).optional().default(''),
  whatsapp: z.string().trim().min(6, 'Ingresa un número de WhatsApp válido').max(30),
  email: z.string().trim().email('Ingresa un correo electrónico válido'),
  turnstileToken: z.string().optional().default(''),
  sourceUrl: z.string().optional().default(''),
});

export type QuoteFormInput = z.infer<typeof quoteFormSchema>;
