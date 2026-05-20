'use client';
import Link from 'next/link';
import type { ServiceContent } from '@/lib/content';

/**
 * Service system tile — used in the /services grid + the "see all" modal.
 *
 * Click on the CTA → kicks off the 3-step service-wizard with the system
 * pre-selected. The "Details" corner link → /services/[slug] SEO landing
 * for deep linking and Google.
 *
 * Bilingual: defaults to EN; pass `locale="tr"` for TR. i18n keys for the
 * core wizard strings live in `content/services.json` (Wave 1 / Agent B
 * scope) so we don't touch content/i18n-*.json which is Agent A's.
 */
export default function ServiceTile({
  s,
  locale = 'en',
  variant = 'tile'
}: {
  s: ServiceContent;
  locale?: 'en' | 'tr';
  variant?: 'tile' | 'compact';
}) {
  const name = locale === 'tr' ? s.name_tr : s.name_en;
  const kicker = locale === 'tr' ? s.kicker_tr : s.kicker_en;
  const summary = locale === 'tr' ? s.summary_tr : s.summary_en;
  const ctaLabel = locale === 'tr' ? 'Servis talep et' : 'Request service';
  const detailLabel = locale === 'tr' ? 'Detay' : 'Details';
  const requestHref = `/service-wizard?system=${encodeURIComponent(s.slug)}`;
  const detailHref = `/services/${s.slug}`;

  if (variant === 'compact') {
    return (
      <Link
        href={requestHref}
        className="group flex items-center gap-3 rounded-md border border-line bg-white px-3 py-2.5 text-left no-underline hover:border-amber hover:bg-amber/5 transition"
      >
        <span
          aria-hidden
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-md bg-navy-50 text-navy-700 group-hover:bg-amber group-hover:text-navy-700 transition"
        >
          <SystemGlyph icon={s.icon} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold text-[13.5px] text-ink">{name}</span>
          <span className="block truncate text-[11.5px] text-ink-subtle">{kicker}</span>
        </span>
      </Link>
    );
  }

  return (
    <article className="card flex flex-col hover:border-amber transition group">
      <header className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-md bg-navy-50 text-navy-700 group-hover:bg-amber group-hover:text-navy-700 transition"
        >
          <SystemGlyph icon={s.icon} />
        </span>
        <div className="min-w-0">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-amber-600">{kicker}</div>
          <h3 className="mt-0.5 text-[18px] leading-tight">{name}</h3>
        </div>
      </header>

      <p className="mt-3 text-ink-muted text-[13.5px] leading-relaxed line-clamp-3">{summary}</p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <Link
          href={requestHref}
          className="btn-accent btn-sm no-underline"
          aria-label={`${ctaLabel} — ${name}`}
        >
          {ctaLabel} →
        </Link>
        <Link
          href={detailHref}
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-subtle hover:text-amber-600 no-underline"
        >
          {detailLabel}
        </Link>
      </div>
    </article>
  );
}

/**
 * Inline SVG glyph for a system. Keeps tiles vector-only (no asset deps).
 * Falls back to a generic node icon if the icon key isn't recognised.
 */
function SystemGlyph({ icon }: { icon?: string }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };
  switch (icon) {
    case 'generator':
      return <svg {...props}><circle cx="12" cy="12" r="7" /><path d="M9 12h6M12 9v6" /></svg>;
    case 'engine':
      return <svg {...props}><rect x="4" y="8" width="16" height="9" rx="1.5" /><path d="M8 8V6m8 2V6M6 17v2m12-2v2" /></svg>;
    case 'switchboard':
      return <svg {...props}><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01" /></svg>;
    case 'fire':
      return <svg {...props}><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-3 2-3 4-8Z" /></svg>;
    case 'alarm':
      return <svg {...props}><path d="M12 4a6 6 0 0 1 6 6v4l1.5 2H4.5L6 14v-4a6 6 0 0 1 6-6Z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>;
    case 'radar':
      return <svg {...props}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 4v8l5 3" /></svg>;
    case 'radio':
      return <svg {...props}><path d="M6 9c2-2 4-3 6-3s4 1 6 3M8 11c1-1 2-2 4-2s3 1 4 2" /><circle cx="12" cy="15" r="2" /></svg>;
    case 'bwts':
      return <svg {...props}><path d="M5 12c2 2 4-2 7 0s4-2 7 0" /><path d="M5 17c2 2 4-2 7 0s4-2 7 0" /><path d="M9 6c1 1 1 2 0 3" /><path d="M15 6c1 1 1 2 0 3" /></svg>;
    case 'crane':
      return <svg {...props}><path d="M4 20V6h12l4 4" /><path d="M16 6v3" /><path d="M16 9v4l-3 3" /></svg>;
    case 'level':
      return <svg {...props}><rect x="5" y="5" width="14" height="14" rx="1.5" /><path d="M5 14h14" /><path d="M9 14v-2m6 2v-2" /></svg>;
    case 'shaft':
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M4 12h5m6 0h5" /></svg>;
    case 'plc':
      return <svg {...props}><rect x="3" y="6" width="18" height="12" rx="1.5" /><path d="M7 6v12m4-12v12m4-12v12" /></svg>;
    case 'light':
      return <svg {...props}><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 1 4 10c-1 1-1 2-1 3H9c0-1 0-2-1-3a6 6 0 0 1 4-10Z" /></svg>;
    case 'battery':
      return <svg {...props}><rect x="3" y="8" width="16" height="9" rx="1.5" /><path d="M19 11v3" /><path d="M7 12h2m3 0h2" /></svg>;
    case 'shore':
      return <svg {...props}><path d="M5 18h14" /><path d="M7 14V8h10v6" /><path d="M12 14v-3" /><path d="M10 21h4" /></svg>;
    case 'transformer':
      return <svg {...props}><path d="M7 4v6a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V4" /><path d="M12 13v7" /><path d="M9 20h6" /></svg>;
    case 'motor':
      return <svg {...props}><circle cx="12" cy="12" r="5" /><path d="M12 7V4m0 16v-3M7 12H4m16 0h-3" /></svg>;
    case 'hvac':
      return <svg {...props}><path d="M12 4v16" /><path d="M4 12h16" /><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case 'vdr':
      return <svg {...props}><rect x="3" y="6" width="18" height="11" rx="1.5" /><circle cx="9" cy="11.5" r="1.5" /><path d="M14 9h4m-4 3h4m-4 3h2" /></svg>;
    case 'other':
    default:
      return <svg {...props}><circle cx="12" cy="12" r="8" /><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" /><path d="M12 16.5h.01" /></svg>;
  }
}
