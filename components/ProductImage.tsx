'use client';

import { useState } from 'react';

/**
 * Product image with a graceful brand-styled fallback.
 *
 * If the real image fails to load (file missing in public/, hotlink
 * blocked, etc.), an SVG placeholder is drawn with the brand name and
 * part number on the navy palette. Keeps catalog pages looking finished
 * while real product photos are still being sourced.
 */
export default function ProductImage({
  src,
  alt,
  brand,
  partNumber,
  className = ''
}: {
  src?: string;
  alt: string;
  brand?: string;
  partNumber?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-700 to-navy-900 text-white ${className}`}
      >
        {/* Subtle grid texture */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="lm-prod-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lm-prod-grid)" />
        </svg>

        <div className="relative z-10 px-6 text-center">
          {brand && (
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-amber-300/85 mb-2">
              {brand}
            </div>
          )}
          {partNumber && (
            <div className="font-head text-[20px] font-extrabold tracking-tight text-white leading-tight">
              {partNumber}
            </div>
          )}
          <div className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/45">
            Product image on request
          </div>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
