import { cookies, headers } from 'next/headers';
import enData from '@/content/i18n-en.json';
import trData from '@/content/i18n-tr.json';
import elData from '@/content/i18n-el.json';
import esData from '@/content/i18n-es.json';
import deData from '@/content/i18n-de.json';

// `Locale` is a global ambient type (see types/i18n.d.ts).
export const LOCALES: Locale[] = ['en', 'tr', 'el', 'es', 'de'];
const DICT: Record<Locale, any> = { en: enData, tr: trData, el: elData, es: esData, de: deData };

function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (LOCALES as string[]).includes(v);
}

/**
 * Resolve active locale from (1) cookie `lm.locale`, (2) Accept-Language
 * header (tr/el/es/de prefixes), (3) default 'en'.
 */
export function getLocale(): Locale {
  try {
    const c = cookies().get('lm.locale')?.value;
    if (isLocale(c)) return c;
    const al = (headers().get('accept-language') ?? '').toLowerCase();
    for (const loc of ['tr', 'el', 'es', 'de'] as Locale[]) {
      if (al.startsWith(loc)) return loc;
    }
  } catch {}
  return 'en';
}

/**
 * Server-side translator. `t('home.h1Pre')` walks dot-notation into the dict.
 * Falls back to English, then to the key itself, so missing translations are
 * visible but non-breaking — this is what lets newly-added locales degrade
 * gracefully to English where a string has not been translated yet.
 */
export function getTranslator(locale: Locale = getLocale()) {
  function walk(obj: any, key: string): string | undefined {
    return key.split('.').reduce((acc, k) => (acc && typeof acc === 'object' ? acc[k] : undefined), obj);
  }
  return function t(key: string, vars?: Record<string, string | number>): string {
    let s = walk(DICT[locale], key) ?? walk(DICT.en, key) ?? key;
    if (typeof s !== 'string') s = key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    return s;
  };
}
