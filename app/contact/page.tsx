import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { getLocale, getTranslator } from '@/lib/i18n';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };

export default function Contact() {
  const locale = getLocale();
  const t = getTranslator(locale);
  return (
    <div className="container-x py-16">
      <div className="kicker mb-3">{t('contact.kicker')}</div>
      <h1 className="mb-3">{t('contact.title')}</h1>
      <p className="text-ink-muted mb-2 max-w-2xl">{t('contact.lead')}</p>
      <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-amber-700 mb-12">{t('contact.tagline')}</p>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        <div className="card">
          <div className="kicker mb-3">{t('contact.usaHq')}</div>
          <h3 className="mb-2">{t('contact.operationsCity')}</h3>
          <p className="text-[13px] text-ink-muted mb-4">{t('contact.registeredHq')}</p>
          <address className="not-italic text-ink-muted text-[14px] leading-relaxed mb-4">
            {SITE.address.street}<br />
            {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
          </address>
          <ul className="text-[14px] space-y-1">
            <li><a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="font-mono no-underline hover:text-amber-600">{SITE.phone}</a></li>
            <li><a href={SITE.whatsapp} target="_blank" rel="noopener" className="no-underline hover:text-amber-600">WhatsApp</a></li>
            <li><a href={`mailto:${SITE.email}`} className="no-underline hover:text-amber-600">{SITE.email}</a></li>
          </ul>
        </div>

        <div className="card relative overflow-hidden">
          <div className="kicker mb-3">{t('contact.operations')}</div>
          <h3 className="mb-2">{t('contact.tagline')}</h3>
          <p className="text-ink-muted text-[14px] leading-relaxed mb-4">
            {/* Simple lightweight inline map placeholder — Agent D owns USAMap component */}
          </p>
          <div
            aria-label="USA map — Wyoming registered HQ, Florida operations"
            className="relative w-full aspect-[4/3] rounded-lg bg-navy-50 border border-line overflow-hidden flex items-center justify-center"
          >
            <svg viewBox="0 0 200 120" className="w-full h-full opacity-40">
              <rect width="200" height="120" fill="#E2E8F0" />
              <path
                d="M10 40 L40 30 L70 25 L100 30 L130 25 L160 30 L190 40 L190 80 L160 90 L130 95 L100 90 L70 95 L40 90 L10 80 Z"
                fill="#CBD5E1"
                stroke="#94A3B8"
                strokeWidth="0.5"
              />
            </svg>
            {/* Wyoming pin (registered HQ) */}
            <span
              className="absolute"
              style={{ left: '38%', top: '34%' }}
              title="Wyoming · Registered HQ"
            >
              <span className="block w-3 h-3 rounded-full bg-navy-700 ring-4 ring-navy-700/20 animate-pulse" />
              <span className="absolute left-4 top-0 text-[10px] font-mono uppercase tracking-[0.05em] text-navy-700 whitespace-nowrap">Wyoming</span>
            </span>
            {/* Florida pin (operations) */}
            <span
              className="absolute"
              style={{ left: '70%', top: '70%' }}
              title="Florida · Operations"
            >
              <span className="block w-3 h-3 rounded-full bg-amber ring-4 ring-amber/30 animate-pulse" />
              <span className="absolute left-4 top-0 text-[10px] font-mono uppercase tracking-[0.05em] text-amber-700 whitespace-nowrap">Florida ops</span>
            </span>
          </div>
        </div>

        <div className="card md:col-span-2">
          <div className="kicker mb-3">{t('contact.email')}</div>
          <p className="text-ink-muted mb-3">For RFQs and service requests, use the wizards — they capture vessel, port, urgency, and the technical context so we can quote same-day.</p>
          <ul className="text-[14px] space-y-1 font-mono">
            <li><a href={`mailto:${SITE.email}`} className="no-underline hover:text-amber-600">{SITE.email}</a> — general</li>
            <li><a href="mailto:rfq@leventmarinetech.com" className="no-underline hover:text-amber-600">rfq@leventmarinetech.com</a> — supply RFQ</li>
            <li><a href="mailto:service@leventmarinetech.com" className="no-underline hover:text-amber-600">service@leventmarinetech.com</a> — service requests</li>
            <li><a href="mailto:emergency@leventmarinetech.com" className="no-underline hover:text-amber-600">emergency@leventmarinetech.com</a> — AOG escalation</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/service-wizard" className="btn-accent btn-md">Service wizard</Link>
            <Link href="/supply-wizard" className="btn-primary btn-md">Supply wizard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
