'use client';

import { useState } from 'react';
import { CERTIFICATIONS, type CertBadge } from './CertBadges';

/**
 * CertMarquee — horizontal, right-to-left, auto-scrolling strip of every
 * credential. Each chip shows a small representative image of that document
 * (a look-alike example, NOT the real personal scan) when one exists in
 * /public/credentials, otherwise a generic certificate thumbnail. Not
 * clickable — nothing opens. Hover pauses. The list is duplicated once so the
 * CSS translateX(-50%) loops seamlessly.
 */
export default function CertMarquee(_props: { viewLabel?: string }) {
  const items = [...CERTIFICATIONS, ...CERTIFICATIONS];

  return (
    <div className="relative">
      {/* Soft edge fades so chips appear to come from / go off the page */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />

      <div className="overflow-hidden">
        <ul className="lm-marquee-rtl flex w-max gap-3 py-2">
          {items.map((c, i) => (
            <li key={`${c.abbr}-${i}`} className="shrink-0">
              <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-line/70">
                <CertThumb cert={c} />
                <div className="text-left">
                  <div className="font-head text-[13px] font-bold leading-tight text-navy-700">{c.abbr}</div>
                  <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-amber-700">{c.reg}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Per-credential thumbnail: the representative document image if present,
 * else a generic certificate look-alike (decorative). Same box for both so
 * the strip stays even.
 */
function CertThumb({ cert }: { cert: CertBadge }) {
  const [broken, setBroken] = useState(!cert.image);

  return (
    <span
      aria-hidden
      className="inline-flex h-11 w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-line/70 shadow-sm"
    >
      {cert.image && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cert.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <svg viewBox="0 0 58 44" className="h-full w-full" role="presentation">
          <rect x="0" y="0" width="58" height="44" fill="#FFFFFF" />
          <rect x="7" y="7" width="44" height="3.5" rx="1.75" fill="#0B1F3A" opacity="0.85" />
          <rect x="7" y="15" width="30" height="2.2" rx="1.1" fill="#0B1F3A" opacity="0.35" />
          <rect x="7" y="20.5" width="38" height="2.2" rx="1.1" fill="#0B1F3A" opacity="0.2" />
          <rect x="7" y="26" width="26" height="2.2" rx="1.1" fill="#0B1F3A" opacity="0.2" />
          <rect x="7" y="31.5" width="20" height="2.2" rx="1.1" fill="#0B1F3A" opacity="0.2" />
          <circle cx="46" cy="30" r="6.5" fill="#F5A524" />
          <circle cx="46" cy="30" r="6.5" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M43 35 l-1.6 6 l2.8 -2.2 l2.2 2.2 l-1.4 -6 z" fill="#F5A524" />
        </svg>
      )}
    </span>
  );
}
