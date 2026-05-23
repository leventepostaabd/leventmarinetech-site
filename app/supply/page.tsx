import type { Metadata } from 'next';
import { getLocale } from '@/lib/i18n';
import EbayCatalogGrid from './EbayCatalogGrid';
import SourcingChannelTabs from './SourcingChannelTabs';

export const metadata: Metadata = {
  title: 'Marine Technical Supply — Live Quote-Only Catalog',
  description:
    'Find any marine electrical or mechanical part — live supplier-network search. Quote-only, no public prices. Marine Electric, General Electric, General Marine.',
  alternates: { canonical: '/supply' }
};

/**
 * /supply — live supplier catalog.
 *
 * Layout (2026-05-21 part 4):
 *   - Fixed top region: heading + 3 sourcing-channel tabs (sticky as the
 *     user scrolls the grid below).
 *   - Scrolling body: live eBay catalog grid.
 *   - SourcingChannelTabs registers a window-level drag-drop listener so
 *     a file dropped anywhere on the page opens the Upload-List modal
 *     with the file already attached.
 */
export default function SupplyIndex() {
  const locale = getLocale();
  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  return (
    <div className="lm-screen bg-navy-50">
      {/* Fixed top — compact on phone, fuller on desktop.
          Heading hides on phone (TopBar already says "Marine Electrotechnical
          Service") so the 3 channel tiles + search rise into view faster. */}
      <div className="shrink-0 bg-white border-b border-line px-3 pt-3 pb-2 md:px-8 md:pt-5 md:pb-4">
        <div className="hidden md:block">
          <div className="kicker mb-1">
            {t('Marine technical supply', 'Marine teknik tedarik')}
          </div>
          <h1 className="text-[20px] md:text-[24px] leading-tight font-bold mb-2">
            {t(
              'Find any marine part — live supplier search.',
              'Her marine parça — canlı tedarik araması.'
            )}
          </h1>
        </div>

        <SourcingChannelTabs locale={locale} />
      </div>

      {/* Live grid (scrolls inside) */}
      <div className="lm-screen-body px-3 py-3 md:px-8 md:py-5">
        <EbayCatalogGrid locale={locale} />
      </div>
    </div>
  );
}
