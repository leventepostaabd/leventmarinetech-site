'use client';

import { useEffect, useState } from 'react';
import ListRfqModal from './ListRfqModal';

/**
 * Three sourcing-channel tiles surfaced above the live search.
 *
 * Also registers a window-level drag-drop interceptor: if the visitor
 * drags ANY file onto the page (even before opening the upload modal),
 * we catch it, open ListRfqModal, and pre-load the file so they just
 * have to add company + contact info.
 */
export default function SourcingChannelTabs({ locale }: { locale: 'en' | 'tr' }) {
  const [listOpen, setListOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [showDropOverlay, setShowDropOverlay] = useState(false);
  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  // Window-level drag-drop: a file dragged onto the page anywhere opens the
  // upload modal with the file already attached. Prevents the browser's
  // default "view file in tab" behaviour.
  useEffect(() => {
    let dragCounter = 0;
    function hasFiles(e: DragEvent) {
      return Boolean(e.dataTransfer && Array.from(e.dataTransfer.types ?? []).includes('Files'));
    }
    function onDragEnter(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragCounter += 1;
      setShowDropOverlay(true);
    }
    function onDragLeave(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragCounter -= 1;
      if (dragCounter <= 0) {
        dragCounter = 0;
        setShowDropOverlay(false);
      }
    }
    function onDragOver(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
    }
    function onDrop(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragCounter = 0;
      setShowDropOverlay(false);
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        setPendingFiles(Array.from(files));
        setListOpen(true);
      }
    }
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  const mailSubject = encodeURIComponent('RFQ — Levent Marine');
  const mailBody = encodeURIComponent(
    locale === 'tr'
      ? 'Merhaba,\n\nAşağıdaki parçalar için teklif rica ediyorum:\n\n— \n\nGemi:\nIMO:\nLiman:\nAciliyet:\n\nİyi çalışmalar.'
      : 'Hi Levent Marine,\n\nPlease quote the following parts:\n\n— \n\nVessel:\nIMO:\nPort:\nUrgency:\n\nThank you.'
  );
  const mailHref = `mailto:rfq@leventmarinetech.com?subject=${mailSubject}&body=${mailBody}`;

  return (
    <>
      {/* Tiles: soft pill cards, Amazon-style. Three columns. */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {/* Upload list */}
        <button
          type="button"
          onClick={() => { setPendingFiles(null); setListOpen(true); }}
          className="text-left rounded-2xl bg-amber/10 ring-1 ring-amber/40 hover:bg-amber/15 hover:ring-amber transition px-3 py-3 sm:px-4 sm:py-3.5 group shadow-sm hover:shadow-md"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-2 sm:gap-3">
            <div className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber text-navy-700 shadow-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-head font-bold text-[12px] sm:text-[13.5px] text-navy-700 leading-tight">
                {t('Upload list', 'Liste yükle')}
              </div>
              <div className="hidden sm:block text-[10.5px] text-amber-700 mt-0.5">
                Excel · PDF · {t('drop anywhere', 'her yere bırak')}
              </div>
            </div>
          </div>
        </button>

        {/* Email */}
        <a
          href={mailHref}
          className="text-left rounded-2xl bg-navy-50/60 ring-1 ring-line hover:bg-navy-50 hover:ring-navy-300 transition px-3 py-3 sm:px-4 sm:py-3.5 group no-underline block shadow-sm hover:shadow-md"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-2 sm:gap-3">
            <div className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-white shadow-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22 6 12 13 2 6" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-head font-bold text-[12px] sm:text-[13.5px] text-navy-700 leading-tight">
                {t('Email RFQ', 'E-posta')}
              </div>
              <div className="hidden sm:block text-[10.5px] text-ink-subtle mt-0.5 truncate">
                rfq@leventmarinetech.com
              </div>
            </div>
          </div>
        </a>

        {/* WhatsApp / Call */}
        <a
          href="https://wa.me/16193840403"
          target="_blank"
          rel="noreferrer noopener"
          className="text-left rounded-2xl bg-[#25D366]/10 ring-1 ring-[#25D366]/35 hover:bg-[#25D366]/15 hover:ring-[#25D366]/60 transition px-3 py-3 sm:px-4 sm:py-3.5 group no-underline block shadow-sm hover:shadow-md"
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-2 sm:gap-3">
            <div className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.5 3.5A11 11 0 0 0 12 0a11 11 0 0 0-9.5 16.5L0 24l7.7-2.5A11 11 0 1 0 20.5 3.5zM12 21.6a9.6 9.6 0 0 1-4.9-1.4l-.4-.2-4.6 1.5 1.5-4.5-.2-.3a9.6 9.6 0 1 1 8.6 5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-head font-bold text-[12px] sm:text-[13.5px] text-navy-700 leading-tight">
                {t('Call / WhatsApp', 'Ara / WhatsApp')}
              </div>
              <div className="hidden sm:block text-[10.5px] text-ink-subtle mt-0.5">
                +1 619 384 04 03
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Drag-drop overlay — visible while a file hovers over the page */}
      {showDropOverlay && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-amber/20 backdrop-blur-sm pointer-events-none">
          <div className="rounded-2xl border-4 border-dashed border-amber-700 bg-white px-10 py-8 text-center shadow-2xl">
            <svg className="mx-auto mb-3 text-amber-700" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div className="font-head font-bold text-[18px] text-navy-700">
              {t('Drop your list anywhere', 'Listeni nereye bıraksan al')}
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber-700 mt-1">
              Excel · Word · PDF · CSV
            </div>
          </div>
        </div>
      )}

      <ListRfqModal
        open={listOpen}
        onClose={() => { setListOpen(false); setPendingFiles(null); }}
        locale={locale}
        initialFiles={pendingFiles}
      />
    </>
  );
}
