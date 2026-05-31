'use client';

import { useState } from 'react';
import { CERTIFICATIONS, type CertBadge } from './CertBadges';
import CertModal from './CertModal';

/**
 * CertMarquee — horizontal, right-to-left, auto-scrolling strip of every
 * credential. Tapping a chip opens CertModal with the full scan plus an
 * industry-jargon description. Hover pauses the animation.
 *
 * The list is duplicated once so the CSS translateX(-50%) loops seamlessly.
 */
export default function CertMarquee({ viewLabel }: { viewLabel: string }) {
  const [picked, setPicked] = useState<CertBadge | null>(null);
  const items = [...CERTIFICATIONS, ...CERTIFICATIONS];

  return (
    <>
      <div className="relative">
        {/* Soft edge fades so chips appear to come from / go off the page */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />

        <div className="overflow-hidden">
          <ul className="lm-marquee-rtl flex w-max gap-3 py-2">
            {items.map((c, i) => (
              <li key={`${c.abbr}-${i}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setPicked(c)}
                  aria-label={c.full}
                  className="group flex items-center gap-3 rounded-xl bg-white ring-1 ring-line/70 hover:ring-amber/60 hover:shadow-md transition px-3 py-2"
                >
                  <CredentialThumb cert={c} />
                  <div className="text-left">
                    <div className="font-head font-bold text-[13px] text-navy-700 leading-tight">
                      {c.abbr}
                    </div>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-amber-700 mt-0.5">
                      {c.reg}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CertModal cert={picked} onClose={() => setPicked(null)} viewLabel={viewLabel} />
    </>
  );
}

function CredentialThumb({ cert }: { cert: CertBadge }) {
  const [hasImage, setHasImage] = useState<boolean>(Boolean(cert.image));
  const aspectClass = cert.aspect === 'card' ? 'aspect-[85/54]' : 'aspect-[4/3]';
  if (!hasImage || !cert.image) {
    return (
      <span
        aria-hidden
        className="inline-flex h-10 w-12 items-center justify-center rounded-md bg-navy-50 font-mono text-[10px] font-bold text-navy-700/70"
      >
        {cert.abbr.split(' ')[0].slice(0, 4)}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cert.image}
      alt={cert.full}
      loading="lazy"
      className={`block h-10 w-auto ${aspectClass} object-cover rounded-md bg-navy-50 ring-1 ring-line/60`}
      onError={() => setHasImage(false)}
    />
  );
}
