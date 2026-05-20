import Hero from '@/components/Hero';
import MobileLanding from '@/components/MobileLanding';
import { SITE } from '@/lib/site';
import { getLocale, getTranslator } from '@/lib/i18n';
import { organizationSchema } from '@/lib/schema-org';

export const dynamic = 'force-static';

const FALLBACK_SLOGAN = 'Marine Electrical Service & Parts Supply — 24/7 Worldwide';

/**
 * Levent Marine — entrance page.
 *
 * Wave 0 (Agent E): three doors — Service / Supply / Emergency.
 * Desktop = split-screen 100vh (no scroll, F1). Mobile = stacked buttons (F4).
 * Slogan & CTA labels come from i18n; safe fallback to the P4 literal.
 */
export default function HomePage() {
  const locale = getLocale();
  const t = getTranslator(locale);

  // Prefer i18n if Agent A has shipped the key; otherwise fall back to SITE.tagline
  // (which already exists today) and finally to the P4 literal.
  const i18nSlogan = t('home.slogan');
  const slogan =
    i18nSlogan && i18nSlogan !== 'home.slogan'
      ? i18nSlogan
      : SITE.tagline?.includes('24/7')
        ? SITE.tagline
        : FALLBACK_SLOGAN;

  const ld = organizationSchema();

  return (
    <>
      {/* Desktop split-screen */}
      <div className="hidden md:block">
        <Hero locale={locale} slogan={slogan} />
      </div>

      {/* Mobile stacked buttons */}
      <div className="block md:hidden">
        <MobileLanding locale={locale} slogan={slogan} />
      </div>

      {/* schema.org — LocalBusiness / ProfessionalService (root layout already
          emits the org schema; this is a page-local reinforcement for the
          landing route since it is the primary entity.) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
