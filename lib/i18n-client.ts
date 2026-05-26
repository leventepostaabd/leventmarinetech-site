import en from '@/content/i18n-en.json';
import tr from '@/content/i18n-tr.json';
import el from '@/content/i18n-el.json';
import es from '@/content/i18n-es.json';
import de from '@/content/i18n-de.json';

/**
 * Client-safe translator. `getTranslator` in lib/i18n.ts relies on
 * next/headers (server only), so client components ('use client') use this
 * instead. The dictionaries are static JSON imports, bundled once. Falls
 * back to English, then the key — so untranslated strings degrade gracefully.
 */
const DICT: Record<Locale, any> = { en, tr, el, es, de };

export function ct(locale: Locale, key: string): string {
  const walk = (o: any, k: string) =>
    k.split('.').reduce((a, kk) => (a && typeof a === 'object' ? a[kk] : undefined), o);
  const v = walk(DICT[locale], key) ?? walk(DICT.en, key) ?? key;
  return typeof v === 'string' ? v : key;
}

/**
 * Pick a localised field off a content object that uses the `<base>_<locale>`
 * convention (e.g. name_en / name_tr / name_el). Falls back to the English
 * field so locales without a translation degrade gracefully.
 */
export function pick(obj: Record<string, any> | undefined, base: string, locale: Locale): string {
  if (!obj) return '';
  return obj[`${base}_${locale}`] ?? obj[`${base}_en`] ?? '';
}
