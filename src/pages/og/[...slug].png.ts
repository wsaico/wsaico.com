import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapLines(text: string, maxChars = 34): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines.slice(0, 3);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const services = await getCollection('services');
  const projects = await getCollection('projects');
  const blog = await getCollection('blog');

  const staticPages = [
    { slug: 'inicio', title: 'Sistemas Web, Apps y Soluciones SSOMA en Perú', tag: 'WSAICO · +10 AÑOS' },
    { slug: 'servicios', title: 'Servicios de Ingeniería de Software', tag: 'CATÁLOGO DE SERVICIOS' },
    { slug: 'proyectos', title: 'Gestor 360°, Inspector 360° y Casos Reales', tag: 'PORTAFOLIO EN PRODUCCIÓN' },
    { slug: 'proceso', title: 'Metodología en 5 Etapas y Pagos por Hitos', tag: 'CÓMO TRABAJO' },
    { slug: 'sobre-mi', title: 'Wilber Saico — Arquitecto Full-Stack', tag: 'WSAICO · +10 AÑOS' },
    { slug: 'blog', title: 'Bitácora Técnica: Software, SSOMA y SEO', tag: 'BLOG WSAICO' },
    { slug: 'cotizar', title: 'Solicitar Cotización Guiada', tag: 'RESPUESTA EN < 24H' },
    { slug: 'contacto', title: 'Contacto Directo · WhatsApp y Correo', tag: 'WSAICO PERÚ' },
  ];

  return [
    ...staticPages.map((p) => ({
      params: { slug: p.slug },
      props: { title: p.title, tag: p.tag },
    })),
    ...services.map((s) => ({
      params: { slug: `servicios/${s.id}` },
      props: { title: s.data.title, tag: `SERVICIO · ${s.data.category.toUpperCase()}` },
    })),
    ...projects.map((p) => ({
      params: { slug: `proyectos/${p.id}` },
      props: { title: `${p.data.title} — ${p.data.subtitle}`, tag: `CASO DE ESTUDIO · ${p.data.category.toUpperCase()}` },
    })),
    ...blog.map((b) => ({
      params: { slug: `blog/${b.id}` },
      props: { title: b.data.title, tag: `ARTÍCULO · ${b.data.category.toUpperCase()}` },
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const { title, tag } = props as { title: string; tag: string };
  const lines = wrapLines(title, 32);

  const tspans = lines
    .map(
      (line, idx) =>
        `<tspan x="80" dy="${idx === 0 ? 0 : 66}">${escapeXml(line)}</tspan>`,
    )
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#050D21"/>
          <stop offset="100%" stop-color="#0B1B3F"/>
        </linearGradient>
        <radialGradient id="glow" cx="85%" cy="15%" r="55%">
          <stop offset="0%" stop-color="#2563EB" stop-opacity="0.38"/>
          <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <rect x="44" y="44" width="1112" height="542" rx="28" fill="none" stroke="#64748B" stroke-opacity="0.35" stroke-width="1.5"/>

      <!-- Isotipo WS -->
      <g transform="translate(80, 92) scale(1.05)">
        <path d="M4 8H17.5L28.5 33.5L34.5 24.5L39.5 31.5L31.5 43.5C29.6 46.3 25.5 46.1 24 43L4 8Z" fill="#F8FAFC"/>
        <path d="M31.5 8H79L72 17.5H45.5L59 35.5L51.5 45L32.5 20.5C29.5 16.6 29.8 11.2 31.5 8Z" fill="#2563EB"/>
        <path d="M62.5 24.5L75.5 37.5C77.8 39.8 77.6 43.5 75.1 45.6L69 50H54.5L63.5 41.5L56.5 33.5L62.5 24.5Z" fill="#F8FAFC"/>
      </g>
      <text x="182" y="128" font-family="sans-serif" font-size="28" font-weight="800" letter-spacing="4" fill="#F8FAFC">WSAICO</text>
      <text x="182" y="152" font-family="monospace" font-size="13" letter-spacing="2.5" fill="#94A3B8">TECNOLOGÍA Y SOLUCIONES DIGITALES</text>

      <!-- Tag -->
      <text x="80" y="242" font-family="monospace" font-size="18" font-weight="700" letter-spacing="2" fill="#60A5FA">${escapeXml(tag)}</text>

      <!-- Título -->
      <text x="80" y="316" font-family="sans-serif" font-size="52" font-weight="800" fill="#F8FAFC">
        ${tspans}
      </text>

      <!-- Pie -->
      <text x="80" y="540" font-family="monospace" font-size="20" fill="#94A3B8">wsaico.com · Tecnología y Soluciones Digitales · wilber@wsaico.com</text>
    </svg>
  `;

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const pngData = resvg.render().asPng();

  return new Response(new Uint8Array(pngData), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
