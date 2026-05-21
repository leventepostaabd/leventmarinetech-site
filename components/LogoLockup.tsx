'use client';

import LeventLogo from './LeventLogo';

/**
 * Brand lockup — full marketing composition that pairs the lightning-bolt
 * L mark with the wordmark and a small kicker line. The lockup is the
 * thing that goes on business cards, signage and the site top bar.
 *
 * Three variants on offer; pick one and we'll pin it as the brand mark.
 *
 *  A — STACKED MONOGRAM
 *      Square monogram (mark in a navy plate) over a 2-line wordmark
 *      "LEVENT / MARINE" with a hairline under and a uppercase mono
 *      kicker beneath that. Reads like a maritime crest.
 *
 *  B — HORIZONTAL CLASSIC
 *      Mark left, wordmark right (LEVENT MARINE on top line, the
 *      ELECTRO·TECHNICAL · SERVICES descriptor as a mono band below).
 *      Cleanest and most business-card friendly.
 *
 *  C — BADGE
 *      Navy rounded rectangle that holds the mark + wordmark + thin
 *      amber rule + kicker. Hardest visual presence — feels like a
 *      port badge.
 *
 * Tone:
 *   'dark'  → designed for light backgrounds (navy ink, amber accent)
 *   'light' → designed for dark backgrounds (white ink, amber accent)
 */
export type LogoLockupProps = {
  variant?: 'A' | 'B' | 'C';
  tone?: 'dark' | 'light';
  scale?: number;        // multiplies all sizes; default 1
  className?: string;
};

export default function LogoLockup({
  variant = 'B',
  tone = 'dark',
  scale = 1,
  className = ''
}: LogoLockupProps) {
  if (variant === 'A') return <StackedMonogram tone={tone} scale={scale} className={className} />;
  if (variant === 'C') return <Badge tone={tone} scale={scale} className={className} />;
  return <HorizontalClassic tone={tone} scale={scale} className={className} />;
}

/* ---------------------------------------------------------------- A */

function StackedMonogram({ tone, scale, className }: Required<Omit<LogoLockupProps, 'variant'>>) {
  const ink = tone === 'light' ? 'text-white' : 'text-navy-700';
  const sub = tone === 'light' ? 'text-amber-300' : 'text-amber-600';
  const rule = tone === 'light' ? 'bg-white/40' : 'bg-navy-700/30';
  const plate = tone === 'light' ? 'bg-white/15 ring-white/30' : 'bg-navy-700 ring-navy-700/40';

  return (
    <div className={`inline-flex flex-col items-center ${className}`} style={{ transform: `scale(${scale})` }}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ring-1 ${plate}`}>
        <LeventLogo size={28} tone={tone === 'light' ? 'light' : 'auto'} />
      </div>
      <div className={`mt-2 font-head text-[15px] font-black uppercase tracking-[0.32em] leading-[1] ${ink}`}>
        LEVENT
      </div>
      <div className={`font-head text-[15px] font-black uppercase tracking-[0.32em] leading-[1] mt-0.5 ${ink}`}>
        MARINE
      </div>
      <span className={`mt-2 h-px w-10 ${rule}`} aria-hidden />
      <div className={`mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.32em] ${sub}`}>
        Electro-Technical · 24/7
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- B */

function HorizontalClassic({ tone, scale, className }: Required<Omit<LogoLockupProps, 'variant'>>) {
  const ink = tone === 'light' ? 'text-white' : 'text-navy-700';
  const sub = tone === 'light' ? 'text-amber-300' : 'text-amber-600';
  const rule = tone === 'light' ? 'bg-amber-300' : 'bg-amber';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} style={{ transform: `scale(${scale})` }}>
      <LeventLogo size={38} tone={tone === 'light' ? 'light' : 'auto'} />
      <div className="flex flex-col leading-none">
        <div className={`font-head font-black uppercase tracking-[0.04em] text-[17px] ${ink}`}>
          LEVENT MARINE
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className={`h-[2px] w-6 ${rule}`} aria-hidden />
          <span className={`font-mono text-[9px] uppercase tracking-[0.26em] ${sub}`}>
            Electro-Technical Services · 24/7
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- C */

function Badge({ tone, scale, className }: Required<Omit<LogoLockupProps, 'variant'>>) {
  // Charcoal navy badge with a thin amber inner rule; designed to read
  // calm + corporate at any size (business card to billboard).
  const card =
    tone === 'light'
      ? 'bg-navy-900/65 ring-white/20 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_50px_-12px_rgba(0,0,0,0.55)]'
      : 'bg-navy-700 ring-navy-900/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_50px_-12px_rgba(11,31,58,0.45)]';
  const wordmark = 'text-white';
  const kicker = 'text-amber-300/90';
  const rule = tone === 'light' ? 'bg-amber-300/80' : 'bg-amber/90';

  return (
    <div
      className={`inline-flex items-center gap-3.5 rounded-[10px] px-3.5 py-2 ring-1 ${card} ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      <LeventLogo size={34} tone="light" />
      <div className="flex flex-col leading-none">
        <div className={`font-head font-black text-[17px] ${wordmark}`} style={{ letterSpacing: '0.02em' }}>
          LEVENT&thinsp;<span className="text-amber">MARINE</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`h-px w-5 ${rule}`} aria-hidden />
          <span
            className={`font-mono text-[9px] font-medium uppercase ${kicker}`}
            style={{ letterSpacing: '0.24em' }}
          >
            Electro-Technical · 24/7
          </span>
        </div>
      </div>
    </div>
  );
}
