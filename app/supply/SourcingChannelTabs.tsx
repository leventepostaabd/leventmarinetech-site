'use client';

import { useState } from 'react';
import ListRfqModal from './ListRfqModal';

/**
 * Three big sourcing-channel tiles surfaced above the live search.
 * Marine procurement runs on relationships + email, not just e-commerce
 * — these tiles let an ETO/superintendent skip straight to the channel
 * that fits their workflow.
 */
export default function SourcingChannelTabs({ locale }: { locale: 'en' | 'tr' }) {
  const [listOpen, setListOpen] = useState(false);
  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  const mailSubject = encodeURIComponent('RFQ — Levent Marine');
  const mailBody = encodeURIComponent(
    locale === 'tr'
      ? 'Merhaba,\n\nAşağıdaki parçalar için teklif rica ediyorum:\n\n— \n\nGemi:\nIMO:\nLiman:\nAciliyet:\n\nİyi çalışmalar.'
      : 'Hi Levent Marine,\n\nPlease quote the following parts:\n\n— \n\nVessel:\nIMO:\nPort:\nUrgency:\n\nThank you.'
  );
  const mailHref = `mailto:rfq@leventmarinetech.com?subject=${mailSubject}&body=${mailBody}`;

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-3 mb-4">
        {/* Upload list */}
        <button
          type="button"
          onClick={() => setListOpen(true)}
          className="text-left rounded-xl border border-amber bg-amber/10 hover:bg-amber/20 transition p-3.5 group"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber text-navy-700">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-amber-700 mb-0.5">
                {t('Recommended for lists', 'Listeler için önerilir')}
              </div>
              <div className="font-head font-bold text-[14.5px] text-navy-700 leading-tight">
                {t('Upload your list', 'Listeni yükle')}
              </div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-muted mt-1">
                Excel · Word · PDF
              </div>
            </div>
          </div>
        </button>

        {/* Email */}
        <a
          href={mailHref}
          className="text-left rounded-xl border border-line bg-white hover:border-navy-700 transition p-3.5 group no-underline block"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-700 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22 6 12 13 2 6" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-subtle mb-0.5">
                {t('Existing fleet client', 'Mevcut filo müşterisi')}
              </div>
              <div className="font-head font-bold text-[14.5px] text-navy-700 leading-tight">
                {t('Email RFQ', 'E-posta RFQ')}
              </div>
              <div className="font-mono text-[10.5px] text-ink-muted mt-1 truncate">
                rfq@leventmarinetech.com
              </div>
            </div>
          </div>
        </a>

        {/* Call / WhatsApp */}
        <a
          href="https://wa.me/16193840403"
          target="_blank"
          rel="noreferrer noopener"
          className="text-left rounded-xl border border-line bg-white hover:border-green-600 transition p-3.5 group no-underline block"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#25D366] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.5 3.5A11 11 0 0 0 12 0a11 11 0 0 0-9.5 16.5L0 24l7.7-2.5A11 11 0 1 0 20.5 3.5zM12 21.6a9.6 9.6 0 0 1-4.9-1.4l-.4-.2-4.6 1.5 1.5-4.5-.2-.3a9.6 9.6 0 1 1 8.6 5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-subtle mb-0.5">
                {t('24/7 · vessel on call', '24/7 · gemi acil')}
              </div>
              <div className="font-head font-bold text-[14.5px] text-navy-700 leading-tight">
                {t('Call or WhatsApp', 'Ara veya WhatsApp')}
              </div>
              <div className="font-mono text-[10.5px] text-ink-muted mt-1">
                +1 619 384 04 03
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Divider tag — "or search & add to RFQ" */}
      <div className="relative mb-3 text-center">
        <span className="relative bg-white px-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-subtle">
          {t('— or search & build an RFQ below —', '— veya aşağıdan ara ve RFQ oluştur —')}
        </span>
        <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-line -z-10" aria-hidden />
      </div>

      <ListRfqModal open={listOpen} onClose={() => setListOpen(false)} locale={locale} />
    </>
  );
}
