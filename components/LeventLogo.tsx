'use client';

import Image from 'next/image';

/**
 * Levent Marine brand mark — lightning-bolt L from public/assets/logo.png.
 * Wraps the PNG in a subtle electric pulse so the mark feels alive
 * (the bolt slightly brightens / glows). Honours prefers-reduced-motion.
 *
 * Variants:
 *  - tone="auto"  → uses the PNG as-is (navy on transparent)
 *  - tone="light" → inverts (PNG becomes white-ish for dark hero overlays)
 */
export default function LeventLogo({
  size = 32,
  tone = 'auto',
  className = ''
}: {
  size?: number;
  tone?: 'auto' | 'light';
  className?: string;
}) {
  const filter = tone === 'light' ? 'brightness(0) invert(1)' : undefined;

  return (
    <span
      className={`lm-logo relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src="/assets/logo.png"
        alt=""
        width={size}
        height={size}
        priority
        className="lm-logo-img"
        style={{ filter, width: size, height: size }}
      />
      <span className="lm-logo-glow" aria-hidden />
      <style jsx>{`
        .lm-logo-glow {
          position: absolute;
          inset: -10%;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(245, 165, 36, 0.45) 0%, rgba(245, 165, 36, 0) 60%);
          opacity: 0;
          animation: lm-logo-spark 4.5s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        @keyframes lm-logo-spark {
          0%, 70%, 100% { opacity: 0; transform: scale(0.85); }
          75%           { opacity: 0.9; transform: scale(1.05); }
          80%           { opacity: 0.25; transform: scale(1.1); }
          85%           { opacity: 0.7; transform: scale(1.0); }
          90%           { opacity: 0; transform: scale(0.9); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lm-logo-glow { animation: none; }
        }
      `}</style>
    </span>
  );
}
