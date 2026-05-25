import { SITE } from '@/lib/site';

/**
 * TrustStats — single source of truth for the four headline numbers that
 * appear across the site. Lives off SITE.trust in lib/site.ts so the
 * homepage hero, About page, footer ticker etc. can never drift.
 *
 * Variants:
 *   - 'inline'  (default) — one row, soft tinted cards, dark text
 *   - 'overlay' — for placement on dark hero backgrounds, white text
 *   - 'mono'    — compact monospace strip, for footers / ribbons
 */

type Variant = 'inline' | 'overlay' | 'mono';

const LABELS = {
  vessels:  { en: 'Vessels served', tr: 'Servis verilen gemi' },
  years:    { en: 'Years on the deckplate', tr: 'Gemi tecrübesi' },
  response: { en: 'Median dispatch time', tr: 'Ortalama müdahale' },
  network:  { en: 'Engineer network', tr: 'Mühendis ağı' }
} as const;

const SUFFIX = {
  vessels:  '',
  years:    { en: ' yr', tr: ' yıl' },
  response: '',
  network:  { en: ' ports', tr: ' liman' }
} as const;

export default function TrustStats({
  variant = 'inline',
  locale = 'en',
  className = ''
}: {
  variant?: Variant;
  locale?: Locale;
  className?: string;
}) {
  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  const items: Array<{ value: string; suffix: string; label: string }> = [
    {
      value: SITE.trust.vessels,
      suffix: '',
      label: t(LABELS.vessels.en, LABELS.vessels.tr)
    },
    {
      value: SITE.trust.years,
      suffix: locale === 'tr' ? SUFFIX.years.tr : SUFFIX.years.en,
      label: t(LABELS.years.en, LABELS.years.tr)
    },
    {
      value: SITE.trust.response,
      suffix: '',
      label: t(LABELS.response.en, LABELS.response.tr)
    },
    {
      value: SITE.trust.network,
      suffix: locale === 'tr' ? SUFFIX.network.tr : SUFFIX.network.en,
      label: t(LABELS.network.en, LABELS.network.tr)
    }
  ];

  if (variant === 'mono') {
    return (
      <ul
        aria-label={t('Trust stats', 'Güven göstergeleri')}
        className={`flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/60 ${className}`}
      >
        {items.map((it, i) => (
          <li key={i} className="inline-flex items-center gap-1.5">
            <span className="font-head font-bold text-white/85">{it.value}{it.suffix}</span>
            <span>· {it.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === 'overlay') {
    return (
      <ul
        aria-label={t('Trust stats', 'Güven göstergeleri')}
        className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}
      >
        {items.map((it, i) => (
          <li key={i} className="rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-3.5 text-white">
            <div className="font-head font-extrabold text-[22px] sm:text-[26px] leading-none">
              {it.value}<span className="text-white/70 font-bold">{it.suffix}</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/65 mt-1.5">
              {it.label}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  // default 'inline'
  return (
    <ul
      aria-label={t('Trust stats', 'Güven göstergeleri')}
      className={`grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 ${className}`}
    >
      {items.map((it, i) => (
        <li key={i} className="rounded-2xl bg-navy-50/70 ring-1 ring-line/60 px-4 py-3.5">
          <div className="font-head font-extrabold text-[22px] sm:text-[26px] leading-none text-navy-700">
            {it.value}<span className="text-ink-muted font-bold">{it.suffix}</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-subtle mt-1.5">
            {it.label}
          </div>
        </li>
      ))}
    </ul>
  );
}
