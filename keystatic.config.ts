import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'WSAICO CMS' },
  },
  collections: {
    blog: collection({
      label: 'Artículos del Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descripción SEO', multiline: true }),
        category: fields.select({
          label: 'Categoría',
          options: [
            { label: 'Sistemas a Medida', value: 'Sistemas a Medida' },
            { label: 'SSOMA y SST Perú', value: 'SSOMA y SST Perú' },
            { label: 'Arquitectura Web', value: 'Arquitectura Web' },
            { label: 'SEO y Rendimiento', value: 'SEO y Rendimiento' },
          ],
          defaultValue: 'Sistemas a Medida',
        }),
        tags: fields.array(fields.text({ label: 'Etiqueta' }), {
          label: 'Etiquetas',
          itemLabel: (props) => props.value,
        }),
        author: fields.text({ label: 'Autor', defaultValue: 'Wilber Saico' }),
        pubDate: fields.date({ label: 'Fecha de publicación' }),
        featured: fields.checkbox({ label: 'Destacado', defaultValue: false }),
        relatedServiceSlug: fields.text({ label: 'Slug de servicio relacionado (opcional)' }),
        content: fields.mdx({ label: 'Contenido del artículo' }),
      },
    }),
    projects: collection({
      label: 'Proyectos y Casos de Estudio',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nombre del sistema' } }),
        subtitle: fields.text({ label: 'Subtítulo' }),
        summary: fields.text({ label: 'Resumen', multiline: true }),
        problem: fields.text({ label: 'Problema', multiline: true }),
        solution: fields.text({ label: 'Solución', multiline: true }),
        result: fields.text({ label: 'Resultado', multiline: true }),
        category: fields.select({
          label: 'Categoría',
          options: [
            { label: 'Sistemas Web', value: 'Sistemas Web' },
            { label: 'SSOMA y Campo', value: 'SSOMA y Campo' },
            { label: 'Operaciones', value: 'Operaciones' },
            { label: 'Finanzas', value: 'Finanzas' },
            { label: 'SEO y Medios', value: 'SEO y Medios' },
          ],
          defaultValue: 'Sistemas Web',
        }),
        liveUrl: fields.url({ label: 'URL en vivo (editable, ej. inspector360.vercel.app)' }),
        liveCtaQuestion: fields.text({ label: 'Pregunta CTA (opcional)' }),
        liveCtaLabel: fields.text({ label: 'Texto del botón (opcional)' }),
        stack: fields.array(fields.text({ label: 'Tecnología' }), {
          label: 'Stack tecnológico',
          itemLabel: (props) => props.value,
        }),
        featured: fields.checkbox({ label: 'Mostrar en inicio', defaultValue: false }),
        order: fields.integer({ label: 'Orden', defaultValue: 99 }),
        date: fields.date({ label: 'Fecha' }),
        content: fields.mdx({ label: 'Detalle técnico' }),
      },
    }),
  },
});
