import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '@/config/site';

export async function GET(context: { site: URL | undefined }) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

  return rss({
    title: `${SITE_CONFIG.name} — Blog de Ingeniería y Soluciones Digitales`,
    description:
      'Artículos sobre sistemas web a medida, digitalización SSOMA en Perú, aplicaciones móviles y SEO técnico.',
    site: context.site ?? SITE_CONFIG.domain,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>es-pe</language>',
  });
}
