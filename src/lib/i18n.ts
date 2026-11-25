export type Locale = 'es';

export const DEFAULT_LOCALE: Locale = 'es';

export const UI_STRINGS = {
  es: {
    skipToContent: 'Ir al contenido principal',
    ctaQuote: 'Solicitar cotización',
    ctaProjects: 'Ver proyectos',
    ctaWhatsapp: 'Escribir por WhatsApp',
    navLabel: 'Navegación principal',
    themeToggle: 'Cambiar tema visual',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    availableStatus: 'Disponible para nuevos proyectos',
    copyright: 'Todos los derechos reservados.',
  },
} as const;

export function t(key: keyof (typeof UI_STRINGS)['es'], locale: Locale = DEFAULT_LOCALE): string {
  return UI_STRINGS[locale][key];
}
