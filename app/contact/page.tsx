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
          {/* USA HQ card */}
          <div className="card">
            <div className="kicker mb-3">{t('contact.usaHq')}</div>
            <h3 className="mb-2 text-[18px]">{t('contact.operationsCity')}</h3>
            <p className="text-[13px] text-ink-muted mb-4">{t('contact.registeredHq')}</p>
            <address className="not-italic text-ink-muted text-[14px] leading-relaxed mb-4">
              {SITE.address.street}<br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
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
            <h3 className="mb-2 text-[18px]">Service available at all US ports.</h3>
            <p className="text-ink-muted text-[13.5px] leading-relaxed mb-4">
              Florida operations · Wyoming LLC · 24/7 worldwide. We dispatch to any
              US port within hours and ship AOG spares the same day.
            </p>
            <div className="-mx-2">
              <USAMap />
            </div>
          </div>

          {/* Direct request CTAs */}
          <div className="card md:col-span-2">
            <div className="kicker mb-3">Fastest paths</div>
            <p className="text-ink-muted text-[14px] mb-4">
              For RFQs and service requests, the forms below capture vessel, port, urgency
              and technical context so we can quote the same day. Pure email is fine too.
            </p>
            <ul className="text-[14px] space-y-1 font-mono mb-5">
              <li>
                <a href={`mailto:${SITE.email}`} className="no-underline hover:text-amber-600">
                  {SITE.email}
                </a>{' '}— general & RFQ
              </li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <Link href="/service-wizard" className="btn-accent btn-md no-underline">
                Service request
              </Link>
              <Link href="/supply" className="btn-primary btn-md no-underline">
                Browse supply
              </Link>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener"
                className="rounded-md bg-[#25D366] px-4 py-2.5 text-white text-sm font-semibold no-underline hover:opacity-95"
              >
                💬 WhatsApp now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
