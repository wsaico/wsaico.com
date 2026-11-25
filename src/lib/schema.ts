import { SITE_CONFIG } from '@/config/site';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    alternateName: 'WSAICO',
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/favicon.svg`,
    email: SITE_CONFIG.contact.email,
    telephone: SITE_CONFIG.contact.phone,
    founder: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
      jobTitle: SITE_CONFIG.author.role,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Huancayo',
      addressRegion: 'Junín',
      addressCountry: 'PE',
    },
    areaServed: [
      { '@type': 'Country', name: 'Perú' },
      { '@type': 'AdministrativeArea', name: 'Junín' },
      { '@type': 'City', name: 'Huancayo' },
      { '@type': 'City', name: 'Jauja' },
      { '@type': 'City', name: 'Lima' },
    ],
    sameAs: [SITE_CONFIG.social.github, SITE_CONFIG.social.linkedin],
    priceRange: '$$',
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.domain}/#website`,
    url: SITE_CONFIG.domain,
    name: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    inLanguage: 'es-PE',
    publisher: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.domain}${item.url}`,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildServiceSchema(params: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: params.name,
    description: params.description,
    serviceType: params.serviceType,
    url: params.url,
    provider: {
      '@id': `${SITE_CONFIG.domain}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Perú',
    },
  };
}
