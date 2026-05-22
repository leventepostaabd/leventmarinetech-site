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
 * Per user pivot 2026-05-21: the 47 seed products were a placeholder and
 * shouldn't be visible. The page is now exclusively a live search +
 * results grid pulling from the eBay Browse API. Every card routes to
 * /supply-wizard with brand + part pre-filled (prices are stripped).
 */
export default function SupplyIndex() {
  const locale = getLocale();
  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  return (
    <div className="lm-screen bg-navy-50">
      {/* Compact heading — TopBar already carries the brand */}
      <div className="shrink-0 bg-white border-b border-line px-5 py-5 md:px-8">
        <div className="kicker mb-1">
          {t('Marine technical supply', 'Marine teknik tedarik')}
        </div>
        <h1 className="text-[22px] md:text-[26px] leading-tight font-bold">
          {t(
            'Find any marine part — live supplier search.',
            'Her marine parça — canlı tedarik araması.'
          )}
        </h1>
        <p className="mt-1 text-ink-muted text-[13px] md:text-[13.5px] max-w-2xl">
          {t(
            'Type a brand + model, paste a part number, or pick a preset. We source from our supplier network and reply with a quote.',
            'Marka + model yaz, parça numarası yapıştır veya hazır filtre seç. Tedarikçi ağımızdan teklifimizle döneriz.'
          )}
        </p>
      </div>

      {/* Live grid */}
      <div className="lm-screen-body px-5 py-5 md:px-8 md:py-6">
        <SourcingChannelTabs locale={locale} />
        <EbayCatalogGrid locale={locale} />
      </div>
    </div>
  );
}
