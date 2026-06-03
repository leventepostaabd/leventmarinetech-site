import type { Metadata } from 'next';
import { readServices } from '@/lib/content';
import { getLocale, getTranslator } from '@/lib/i18n';
import { pick } from '@/lib/i18n-client';
import { SERVICE_IMAGE } from '@/lib/deck-images';
import CinematicStage, { type StageGroup } from '@/components/CinematicStage';

export const metadata: Metadata = {
  title: 'Marine Electrical Service — 19 Systems, 24/7 Worldwide | Levent Marine',
  description:
    'Pick the system that has the problem — generator, BWTS, fire alarm, bridge nav, PLC, crane, and 13 more. Three quick questions, then our next available technician calls you within 1 hour.',
  alternates: { canonical: '/services' }
};

/**
 * System taxonomy for the Cinematic Stage left-index. Bilingual group labels;
 * every non-"other" service slug appears exactly once.
 */
const CATEGORIES: { en: string; tr: string; slugs: string[] }[] = [
  {
    en: 'Power & Machinery',
    tr: 'Güç & Makine',
    slugs: ['generator', 'main-engine-electrical', 'switchboard', 'transformer', 'ac-dc-motor', 'shaft-earthing', 'battery-ups', 'shore-connection']
  },
  {
    en: 'Navigation & Comms',
    tr: 'Seyir & Haberleşme',
    slugs: ['bridge-navigation', 'gmdss-communication', 'cctv-vdr']
  },
  {
    en: 'Safety & Fire',
    tr: 'Emniyet & Yangın',
    slugs: ['fire-alarm', 'smoke-detection', 'water-mist-system', 'bilge-level']
  },
  {
    en: 'Automation & HVAC',
    tr: 'Otomasyon & HVAC',
    slugs: ['plc-automation', 'engine-room-alarm', 'hvac-automation']
  },
  {
    en: 'Deck, Lighting & BWTS',
    tr: 'Güverte, Aydınlatma & BWTS',
    slugs: ['crane-deck-machinery', 'lighting-nav-lights', 'bwts']
  }
];

export default function ServicesIndex() {
  const all = readServices();
  const locale = getLocale();
  const t = getTranslator(locale);

  const bySlug = new Map(all.map((s) => [s.slug, s]));

  const groups: StageGroup[] = CATEGORIES.map((c) => ({
    label: locale === 'tr' ? c.tr : c.en,
    items: c.slugs
      .map((slug) => bySlug.get(slug))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => ({
        slug: s.slug,
        name: pick(s, 'name', locale),
        kicker: pick(s, 'kicker', locale),
        summary: pick(s, 'summary', locale),
        href: `/service-wizard?system=${encodeURIComponent(s.slug)}`,
        // Final stage art (auto-fills when dropped in /public/services/stage/)
        // with the existing brochure image as a placeholder until then.
        imageSrcs: [`/services/stage/${s.slug}.webp`, SERVICE_IMAGE[s.slug]].filter(Boolean) as string[]
      }))
  }));

  return (
    <CinematicStage
      locale={locale}
      heading={t('services.heroLine')}
      sub={t('services.heroSub')}
      searchPlaceholder={t('services.searchPlaceholder')}
      ctaLabel={t('services.requestService')}
      noMatch={t('services.noMatches')}
      groups={groups}
    />
  );
}
