import { SITE_CONFIG } from '@/config/site';

export interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function resolveCanonical(pathname: string, customCanonical?: string): string {
  if (customCanonical) return customCanonical;
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return new URL(cleanPath, SITE_CONFIG.domain).toString();
}

export function resolveTitle(pageTitle: string): string {
  if (pageTitle.includes(SITE_CONFIG.name)) return pageTitle;
  return `${pageTitle} | ${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;
}

export function resolveOgImage(pathname: string, customImage?: string): string {
  if (customImage) {
    return customImage.startsWith('http') ? customImage : new URL(customImage, SITE_CONFIG.domain).toString();
  }
  const slug = pathname === '/' ? 'inicio' : pathname.replace(/^\/|\/$/g, '');
  return new URL(`/og/${slug}.png`, SITE_CONFIG.domain).toString();
}
