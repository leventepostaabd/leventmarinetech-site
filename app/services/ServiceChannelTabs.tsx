'use client';

import Link from 'next/link';
import { SITE } from '@/lib/site';

/**
 * Three contact-channel tiles under the /services search — mirrors the
 * /supply SourcingChannelTabs theme, but tuned for service intake:
 * Contact form · Email · Call / WhatsApp (no file upload).
 */
export default function ServiceChannelTabs({ locale }: { locale: Locale }) {
  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  const mailSubject = encodeURIComponent('Service request — Levent Marine');
  const mailBody = encodeURIComponent(
    locale === 'tr'
      ? 'Merhaba,\n\nAşağıdaki sistem için servis talep ediyorum:\n\nSistem:\nArıza:\nGemi:\nIMO:\nLiman:\nAciliyet:\n\nİyi çalışmalar.'
      : 'Hi Levent Marine,\n\nWe need service on the following system:\n\nSystem:\nFault:\nVessel:\nIMO:\nPort:\nUrgency:\n\nThank you.'
  );
  const mailHref = `mailto:${SITE.email}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
      {/* Contact form */}
      <Link
        href="/contact"
        className="group block rounded-2xl bg-amber/10 px-3 py-3 text-left no-underline shadow-sm ring-1 ring-amber/40 transition hover:bg-amber/15 hover:shadow-md hover:ring-amber sm:px-4 sm:py-3.5"
      >
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-navy-700 shadow-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-4" />
              <path d="M9 7h6M9 11h6M12 3v8" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="font-head text-[12px] font-bold leading-tight text-navy-700 sm:text-[13.5px]">
              {t('Contact form', 'İletişim formu')}
            </div>
            <div className="mt-0.5 hidden text-[10.5px] text-amber-700 sm:block">
              {t('Reach our desk', 'Bize ulaşın')}
            </div>
          </div>
        </div>
      </Link>

      {/* Email */}
      <a
        href={mailHref}
        className="group block rounded-2xl bg-navy-50/60 px-3 py-3 text-left no-underline shadow-sm ring-1 ring-line transition hover:bg-navy-50 hover:shadow-md hover:ring-navy-300 sm:px-4 sm:py-3.5"
      >
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-700 text-white shadow-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22 6 12 13 2 6" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="font-head text-[12px] font-bold leading-tight text-navy-700 sm:text-[13.5px]">
              {t('Email', 'E-posta')}
            </div>
            <div className="mt-0.5 hidden truncate text-[10.5px] text-ink-subtle sm:block">
              {SITE.email}
            </div>
          </div>
        </div>
      </a>

      {/* Call / WhatsApp */}
      <a
        href={SITE.whatsapp}
        target="_blank"
        rel="noreferrer noopener"
        className="group block rounded-2xl bg-[#25D366]/10 px-3 py-3 text-left no-underline shadow-sm ring-1 ring-[#25D366]/35 transition hover:bg-[#25D366]/15 hover:shadow-md hover:ring-[#25D366]/60 sm:px-4 sm:py-3.5"
      >
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.5 3.5A11 11 0 0 0 12 0a11 11 0 0 0-9.5 16.5L0 24l7.7-2.5A11 11 0 1 0 20.5 3.5zM12 21.6a9.6 9.6 0 0 1-4.9-1.4l-.4-.2-4.6 1.5 1.5-4.5-.2-.3a9.6 9.6 0 1 1 8.6 5z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="font-head text-[12px] font-bold leading-tight text-navy-700 sm:text-[13.5px]">
              {t('Call / WhatsApp', 'Ara / WhatsApp')}
            </div>
            <div className="mt-0.5 hidden text-[10.5px] text-ink-subtle sm:block">
              +1 619 384 04 03
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
