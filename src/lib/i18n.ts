import plCertifications from '../data/pl/certifications.json';
import plExpertise from '../data/pl/expertise.json';
import plMenu from '../data/pl/menu.json';
import plPersonal from '../data/pl/personal.json';
import plPortfolio from '../data/pl/portfolio.json';
import plProjects from '../data/pl/projects.json';
import plSite from '../data/pl/site.json';
import plSkills from '../data/pl/skills.json';
import plUi from '../data/pl/ui.json';

import enCertifications from '../data/en/certifications.json';
import enExpertise from '../data/en/expertise.json';
import enMenu from '../data/en/menu.json';
import enPersonal from '../data/en/personal.json';
import enPortfolio from '../data/en/portfolio.json';
import enProjects from '../data/en/projects.json';
import enSite from '../data/en/site.json';
import enSkills from '../data/en/skills.json';
import enUi from '../data/en/ui.json';

export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pl';

/** Value for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = { pl: 'pl', en: 'en' };
/** Value for og:locale. */
export const ogLocale: Record<Locale, string> = { pl: 'pl_PL', en: 'en_US' };

const data = {
  pl: {
    certifications: plCertifications,
    expertise: plExpertise,
    menu: plMenu,
    personal: plPersonal,
    portfolio: plPortfolio,
    projects: plProjects,
    site: plSite,
    skills: plSkills,
    ui: plUi,
  },
  en: {
    certifications: enCertifications,
    expertise: enExpertise,
    menu: enMenu,
    personal: enPersonal,
    portfolio: enPortfolio,
    projects: enProjects,
    site: enSite,
    skills: enSkills,
    ui: enUi,
  },
};

/** Narrow any string (e.g. Astro.currentLocale) to a supported locale. */
export function resolveLocale(locale?: string): Locale {
  return (locales as readonly string[]).includes(locale ?? '') ? (locale as Locale) : defaultLocale;
}

/** All content for a locale. Unknown or missing locale falls back to the default. */
export function getData(locale?: string) {
  return data[resolveLocale(locale)];
}

const stripSlashes = (s: string) => s.replace(/^\/+|\/+$/g, '');

/**
 * Build a URL for a page in a given locale, honouring `base` and `build.format: 'file'`.
 * page: '' (home), 'privacy', 'terms'.
 * Home: / (default) or /<locale>. Pages: /<page>.html or /<locale>/<page>.html
 */
export function localePath(locale: string | undefined, page = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const l = resolveLocale(locale);
  const prefix = l === defaultLocale ? '' : `${l}/`;
  const file = page ? `${stripSlashes(page)}.html` : '';
  // trailingSlash is 'never': the non-default home is `/en`, not `/en/`.
  if (!file) return l === defaultLocale ? base : `${base}${l}`;
  return `${base}${prefix}${file}`;
}

/** Other locale to offer in the language switcher. */
export function otherLocale(locale?: string): Locale {
  return resolveLocale(locale) === 'pl' ? 'en' : 'pl';
}
