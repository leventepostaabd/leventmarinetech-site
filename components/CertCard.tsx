'use client';

import { useState } from 'react';
import type { CertBadge } from './CertBadges';

/**
 * /about credentials card.
 *
 * If the certificate scan exists at the configured path it renders a
 * thumbnail at the top and a "View certificate ↗" link that opens the
 * full-size JPEG in a new tab. When the image fails to load (no scan
 * uploaded yet) the visual elements collapse silently and the card
 * remains text-only — same look as before the scan landed.
 */
export default function CertCard({
  cert,
  viewLabel
}: {
  cert: CertBadge;
  viewLabel: string;
}) {
  const [hasImage, setHasImage] = useState<boolean>(Boolean(cert.image));
  const aspectClass = cert.aspect === 'card' ? 'aspect-[85/54]' : 'aspect-[4/3]';

  return (
    <li className="card flex flex-col">
      {hasImage && cert.image && (
        <a
          href={cert.image}
          target="_blank"
          rel="noreferrer noopener"
          className="block mb-3 -mx-2 -mt-2 overflow-hidden rounded-md bg-navy-50"
          aria-label={`${viewLabel} — ${cert.full}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cert.image}
            alt={cert.full}
            loading="lazy"
            className={`block w-full ${aspectClass} object-cover transition-transform hover:scale-[1.03]`}
            onError={() => setHasImage(false)}
          />
        </a>
      )}
      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber mb-1">
        {cert.reg}
      </div>
      <h3 className="text-[17px] mb-0.5">{cert.full}</h3>
      <p className="text-ink-subtle text-[12.5px] font-mono">{cert.abbr}</p>
      {cert.issued && (
        <p className="mt-1 text-ink-subtle text-[11.5px] font-mono">{cert.issued}</p>
      )}
      {hasImage && cert.image && (
        <a
          href={cert.image}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex items-center gap-1.5 self-start rounded-md bg-navy-50 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-navy-700 ring-1 ring-line/60 hover:bg-amber/15 hover:text-amber-700 hover:ring-amber/40 transition no-underline"
        >
          {viewLabel} ↗
        </a>
      )}
    </li>
  );
}
