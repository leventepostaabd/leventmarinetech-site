import Link from 'next/link';
import { SITE } from '@/lib/site';
import { getLocale, getTranslator } from '@/lib/i18n';

export default function Footer() {
  const year = new Date().getFullYear();
  const locale = getLocale();
  const t = getTranslator(locale);
  return (
    <footer className="bg-navy-700 text-white/85 mt-24">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span aria-hidden="true" className="w-10 h-10 grid place-items-center text-white">
              <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path fill="currentColor" d="M12 8v34h22v6H6V8z" />
                <circle cx="46" cy="14" r="4" fill="#F5A524" />
              </svg>
            </span>
            <span className="font-head font-bold text-white">Levent Marine</span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-white/65 max-w-xs">
            {t('footer.tagline')}
          </p>
          <p className="mt-3 text-[12px] font-mono uppercase tracking-[0.06em] text-amber/90">
            {t('footer.worldwideServiceTag')}
          </p>
        </div>

        <div>
          <h5 className="font-head font-semibold text-white text-[14px] mb-3">{t('footer.service')}</h5>
          <ul className="space-y-1.5 text-[13px] text-white/70">
            <li><Link href="/service-wizard" className="hover:text-amber no-underline">{t('footer.requestService')}</Link></li>
            <li><Link href="/services" className="hover:text-amber no-underline">{t('footer.serviceCatalog')}</Link></li>
            <li><Link href="/ports" className="hover:text-amber no-underline">{t('footer.usPorts')}</Link></li>
            <li><Link href="/knowledge" className="hover:text-amber no-underline">{t('footer.knowledge')}</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-head font-semibold text-white text-[14px] mb-3">{t('footer.supply')}</h5>
          <ul className="space-y-1.5 text-[13px] text-white/70">
            <li><Link href="/supply-wizard" className="hover:text-amber no-underline">{t('footer.requestQuote')}</Link></li>
            <li><Link href="/supply" className="hover:text-amber no-underline">{t('footer.browseCatalog')}</Link></li>
            <li><Link href="/supply/unlisted-request" className="hover:text-amber no-underline">{t('footer.unlistedPart')}</Link></li>
            <li><Link href="/supply/equivalent-part-finder" className="hover:text-amber no-underline">{t('footer.findEquivalent')}</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-head font-semibold text-white text-[14px] mb-3">{t('footer.contact')}</h5>
          <address className="not-italic text-[13px] text-white/70 leading-relaxed mb-3">
            {SITE.address.street}<br />
            {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
          </address>
          <ul className="space-y-1.5 text-[13px] text-white/70 font-mono">
            <li><a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-amber no-underline">{SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-amber no-underline">{SITE.email}</a></li>
            <li><a href={SITE.whatsapp} target="_blank" rel="noopener" className="hover:text-amber no-underline">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-4 flex flex-col md:flex-row md:items-center justify-between gap-2 text-[11px] font-mono text-white/55">
          <div className="flex flex-col gap-1">
            <span>{t('footer.rights').replace('{year}', String(year))}</span>
            <span className="text-white/40">{t('footer.wyomingLlcFinePrint')}</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber no-underline">{t('footer.privacy')}</Link>
            <Link href="/terms" className="hover:text-amber no-underline">{t('footer.terms')}</Link>
            <Link href="/cookie-policy" className="hover:text-amber no-underline">{t('footer.cookies')}</Link>
            <Link href="/accessibility-statement" className="hover:text-amber no-underline">{t('footer.accessibility')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
