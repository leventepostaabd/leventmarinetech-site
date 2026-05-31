'use client';

import { useEffect } from 'react';
import type { CertBadge } from './CertBadges';

/**
 * CertModal — full-bleed credential viewer.
 *
 * Opens when a chip in the credentials marquee is tapped. Shows the full
 * scan (if uploaded) plus a short industry-jargon description so the
 * visitor — and the auditor / superintendent who lands here from a
 * vetting check — can see exactly what the endorsement covers.
 */
export default function CertModal({
  cert,
  onClose,
  viewLabel
}: {
  cert: CertBadge | null;
  onClose: () => void;
  viewLabel: string;
}) {
  useEffect(() => {
    if (!cert) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [cert, onClose]);

  if (!cert) return null;
  const aspectClass = cert.aspect === 'card' ? 'aspect-[85/54]' : 'aspect-[4/3]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={cert.full}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-navy-900/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-line overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line bg-white">
          <div className="min-w-0">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-700">
              {cert.reg}
            </div>
            <h3 className="mt-0.5 font-head font-bold text-[18px] text-navy-700 leading-tight">
              {cert.full}
            </h3>
            {cert.issued && (
              <div className="mt-0.5 font-mono text-[11.5px] text-ink-subtle">{cert.issued}</div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 hover:bg-amber/15 text-navy-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Image */}
        {cert.image && (
          <div className="bg-navy-50/60 p-4 sm:p-6 flex items-center justify-center">
            <a
              href={cert.image}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${viewLabel} — ${cert.full}`}
              className="block w-full max-w-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cert.image}
                alt={cert.full}
                className={`block w-full ${aspectClass} object-contain rounded-md bg-white shadow-sm`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </a>
          </div>
        )}

        {/* Description */}
        {cert.description && (
          <div className="px-5 py-4 border-t border-line bg-white text-[14px] leading-relaxed text-ink-muted overflow-y-auto">
            {cert.description}
          </div>
        )}
      </div>
    </div>
  );
}
