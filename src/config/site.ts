export interface NavItem {
  label: string;
  href: string;
}

export const SITE_CONFIG = {
  name: 'WSAICO',
  legalName: 'WSAICO — Tecnología y Soluciones Digitales',
  tagline: 'Tecnología y Soluciones Digitales',
  domain: 'https://wsaico.com',
  locale: 'es_PE',
  lang: 'es',
  author: {
    name: 'Wilber Saico',
    role: 'Arquitecto de Software Full-Stack',
    experienceYears: '+10',
    headline: 'Más de 10 años desarrollando software a medida con código limpio y tecnología actual.',
  },
  contact: {
    email: 'wilber@wsaico.com',
    phone: '+5190289521',
    phoneDisplay: '+51 902 895 21',
    whatsappUrl:
      'https://wa.me/5190289521?text=Hola%20Wilber%2C%20vengo%20de%20wsaico.com%20y%20quiero%20conversar%20sobre%20un%20proyecto.',
    location: {
      city: 'Lima',
      region: 'Perú',
      country: 'Perú',
      countryCode: 'PE',
    },
  },
  flagshipSystems: {
    gestor360: {
      name: 'Gestor 360°',
      url: 'https://gestor360.lat',
      ctaQuestion: '¿Quieres probar Gestor 360°?',
      ctaAction: 'Explorar plataforma',
    },
    inspector360: {
      name: 'Inspector 360°',
      url: 'https://inspector360.vercel.app',
      ctaQuestion: '¿Quieres probar Inspector 360° para inspecciones de campo y equipos?',
      ctaAction: 'Probar plataforma',
    },
  },
  nav: [
    { label: 'Servicios', href: '/servicios' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Proceso', href: '/proceso' },
    { label: 'Sobre mí', href: '/sobre-mi' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/contacto' },
  ] satisfies NavItem[],
  social: {
    github: 'https://github.com/wsaico',
    linkedin: 'https://www.linkedin.com/in/wsaico',
  },
} as const;
