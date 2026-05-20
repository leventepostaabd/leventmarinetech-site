import { cookies, headers } from 'next/headers';
import enData from '@/content/i18n-en.json';
import trData from '@/content/i18n-tr.json';

export type Locale = 'en' | 'tr';
export const LOCALES: Locale[] = ['en', 'tr'];
const DICT: Record<Locale, any> = { en: enData, tr: trData };

/**
 * Resolve active locale from (1) cookie `lm.locale`, (2) Accept-Language header, (3) default 'en'.
 */
export function getLocale(): Locale {
  try {
    const c = cookies().get('lm.locale')?.value;
    if (c === 'tr' || c === 'en') return c;
    const al = (headers().get('accept-language') ?? '').toLowerCase();
    if (al.startsWith('tr')) return 'tr';
  } catch {}
  return 'en';
}

/**
 * Server-side translator. `t('home.h1Pre')` walks dot-notation into the dict.
 * Falls back to English, then to the key itself, so missing translations are visible but non-breaking.
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
