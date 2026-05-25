import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { getLocale, getTranslator } from '@/lib/i18n';
import USAMap from '@/components/USAMap';

export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };

export default function Contact() {
  const locale = getLocale();
  const t = getTranslator(locale);
  return (
    <div className="lm-screen bg-white">
      <div className="shrink-0 px-5 pt-4 pb-3 md:px-12">
        <div className="kicker mb-1">{t('contact.kicker')}</div>
        <h1 className="text-[22px] md:text-[28px] leading-tight font-bold mb-1">
          {t('contact.title')}
        </h1>
        <p className="text-ink-muted text-[13.5px]">{t('contact.lead')}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-700 mt-1">
          {t('contact.tagline')}
        </p>
      </div>

      <div className="lm-screen-body px-5 pb-8 md:px-12">
        <div className="grid gap-4 md:grid-cols-2 max-w-5xl">
          {/* USA HQ card — Florida operations lead, Wyoming as registered office */}
          <div className="card">
            <div className="kicker mb-3">{t('contact.usaHq')}</div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-[20px] leading-none">{t('contact.operationsCity')}</h3>
              <span className="inline-flex items-center rounded-full bg-amber/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                {t('contact.opsBase')}
              </span>
            </div>
            <p className="text-[13.5px] text-ink-muted leading-relaxed mb-4">{t('contact.flAddressNote')}</p>
            <div className="border-t border-line pt-3 mb-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-subtle mb-1.5">
                {t('contact.registeredOffice')}
              </div>
              <address className="not-italic text-ink-muted text-[13.5px] leading-relaxed">
                {SITE.address.street}<br />
                {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
              </address>
            </div>
            <ul className="text-[14px] space-y-1.5">
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                  className="font-mono no-underline hover:text-amber-600"
                >
                  📞 {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener"
                  className="no-underline hover:text-amber-600"
                >
                  💬 WhatsApp · 24/7
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-mono no-underline hover:text-amber-600"
                >
                  ✉ {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          {/* US coverage card — real USAMap */}
          <div className="card relative overflow-hidden">
            <div className="kicker mb-3">{t('contact.operations')}</div>
            <h3 className="mb-2 text-[18px]">{t('contact.coverageH3')}</h3>
            <p className="text-ink-muted text-[13.5px] leading-relaxed mb-4">
              {t('contact.coverageLead')}
            </p>
            <div className="-mx-2">
              <USAMap />
            </div>
          </div>

          {/* Direct request CTAs */}
          <div className="card md:col-span-2">
            <div className="kicker mb-3">{t('contact.fastestPaths')}</div>
            <p className="text-ink-muted text-[14px] mb-4">
              {t('contact.fastestPathsLead')}
            </p>
            <ul className="text-[14px] space-y-1 font-mono mb-5">
              <li>
                <a href={`mailto:${SITE.email}`} className="no-underline hover:text-amber-600">
                  {SITE.email}
                </a>{' '}— {t('contact.emailGeneral')}
              </li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <Link href="/service-wizard" className="btn-accent btn-md no-underline">
                {t('contact.serviceRequest')}
              </Link>
              <Link href="/supply" className="btn-primary btn-md no-underline">
                {t('contact.browseSupply')}
              </Link>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener"
                className="rounded-md bg-[#25D366] px-4 py-2.5 text-white text-sm font-semibold no-underline hover:opacity-95"
              >
                💬 {t('contact.whatsappNow')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
