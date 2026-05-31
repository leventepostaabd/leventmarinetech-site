'use client';

import { useState } from 'react';
import { CERTIFICATIONS } from './CertBadges';

const TWIC = CERTIFICATIONS.find((c) => c.abbr === 'TWIC');

/**
 * TWIC verification badge for the /ports hero — surfaces the engineer's
 * Transportation Worker Identification Credential as proof of US-port
 * access. Renders a landscape ID-card thumbnail with a short label; the
 * full scan opens on tap. Falls back silently to text only when the JPEG
 * isn't uploaded yet.
 */
export default function TwicBadge({
  title,
  sub,
  viewLabel
}: {
  title: string;
  sub: string;
  viewLabel: string;
}) {
  const [hasImage, setHasImage] = useState<boolean>(Boolean(TWIC?.image));
  if (!TWIC) return null;

  const body = (
    <div className="flex items-center gap-3 sm:gap-4 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/25 hover:bg-white/15 hover:ring-amber/60 transition p-2.5 sm:p-3 max-w-md">
      {hasImage && TWIC.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={TWIC.image}
          alt={TWIC.full}
          loading="lazy"
          className="block h-16 sm:h-20 w-auto aspect-[85/54] object-cover rounded-md shadow-md ring-1 ring-white/30"
          onError={() => setHasImage(false)}
        />
      )}
      <div className="min-w-0">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber-300">
          {title}
        </div>
        <div className="text-white font-head font-bold text-[15px] sm:text-[16px] leading-tight mt-0.5">
          {TWIC.full}
        </div>
        <div className="text-white/70 text-[12px] mt-0.5">
          {sub} · {TWIC.reg}
        </div>
        {hasImage && TWIC.image && (
          <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-amber-300">
            {viewLabel} ↗
          </div>
        )}
      </div>
    </div>
  );

  return hasImage && TWIC.image ? (
    <a
      href={TWIC.image}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${viewLabel} — ${TWIC.full}`}
      className="no-underline block"
    >
      {body}
    </a>
  ) : (
    body
  );
}
