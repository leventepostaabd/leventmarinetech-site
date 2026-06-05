import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { readServices } from '@/lib/content';
import { getLocale, getTranslator } from '@/lib/i18n';
import { pick } from '@/lib/i18n-client';
import CinematicStage, { type StageGroup } from '@/components/CinematicStage';

export const metadata: Metadata = {
  title: 'Marine Electrical Service — 19 Systems, 24/7 Worldwide | Levent Marine',
  description:
    'Pick the system that has the problem — generator, BWTS, fire alarm, bridge nav, PLC, crane, and 13 more. Three quick questions, then our next available technician calls you within 1 hour.',
  alternates: { canonical: '/services' }
};

/** System taxonomy for the Cinematic Stage. Bilingual group labels. */
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

/** Slugs that actually have a stage photo committed in /public/services/stage. */
function stageSlugs(): Set<string> {
  try {
    const files = fs.readdirSync(path.join(process.cwd(), 'public', 'services', 'stage'));
    const set = new Set<string>();
    for (const f of files) {
      const m = f.match(/^(.+)\.(webp|png|jpe?g)$/i);
      if (m) set.add(m[1].toLowerCase());
    }
    return set;
  } catch {
    return new Set();
  }
}

export default function ServicesIndex() {
  const all = readServices();
  const locale = getLocale();
  const t = getTranslator(locale);

  const have = stageSlugs();
  const bySlug = new Map(all.map((s) => [s.slug, s]));

  // Only surface systems that have artwork; drop empty groups.
  const groups: StageGroup[] = CATEGORIES.map((c) => ({
    label: locale === 'tr' ? c.tr : c.en,
    items: c.slugs
      .filter((slug) => have.has(slug))
      .map((slug) => bySlug.get(slug))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => ({
        slug: s.slug,
        name: pick(s, 'name', locale),
        kicker: pick(s, 'kicker', locale),
        summary: pick(s, 'summary', locale),
        href: `/service-wizard?system=${encodeURIComponent(s.slug)}`,
        imageSrcs: [
          `/services/stage/${s.slug}.webp`,
          `/services/stage/${s.slug}.png`,
          `/services/stage/${s.slug}.jpg`
        ]
      }))
  })).filter((g) => g.items.length > 0);

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
