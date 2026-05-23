/**
 * LogoStrip — horizontal greyscale strip of repeat-customer brands.
 *
 * Per decision P5 (DECISIONS.md), all six known repeat customers stay visible
 * regardless of TR/EN positioning. Falls back to a styled wordmark when no
 * permission-cleared SVG has been dropped under /public/logos/<key>.svg yet;
 * once the SVG exists at build time the component picks it up automatically.
 *
 * To upgrade a placeholder to a real logo: see /public/logos/README.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';

type Customer = {
  key: string;
  mark: string;
  sub?: string;
  href?: string;
  alt: string;
};

const CUSTOMERS: Customer[] = [
  { key: 'msc',     mark: 'MEDLOG',     sub: 'MSC GROUP',   alt: 'MEDLOG (MSC Group)' },
  { key: 'tp',      mark: 'TP OFFSHORE',                    alt: 'TP Offshore' },
  { key: 'polaris', mark: 'POLARIS',    sub: 'DENIZCILIK',  alt: 'Polaris Denizcilik' },
  { key: 'bright',  mark: 'BRIGHT',     sub: 'DENIZCILIK',  alt: 'Bright Denizcilik' },
  { key: 'cebi',    mark: 'CEBI KAPTAN',                    alt: 'Çebi Kaptan' },
  { key: 'nord',    mark: 'REEDEREI',   sub: 'NORD',        alt: 'Reederei NORD' }
];

const LOGO_DIR = path.join(process.cwd(), 'public', 'logos');

function logoSvgPath(key: string): string | null {
  try {
    const candidate = path.join(LOGO_DIR, `${key}.svg`);
    if (fs.existsSync(candidate)) return `/logos/${key}.svg`;
  } catch {
    // ignore — fall through to wordmark fallback
  }
  return null;
}

export default function LogoStrip({
  label = 'Trusted by recurring fleets',
  className = ''
}: {
  label?: string;
  className?: string;
}) {
  const items = CUSTOMERS.map((c) => ({ ...c, svg: logoSvgPath(c.key) }));

  return (
    <section
      aria-label="Repeat customers"
      className={`w-full border-y border-line bg-navy-50 ${className}`}
    >
      <div className="container-x py-8 md:py-10">
        <div className="kicker mb-4">{label}</div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5 items-center">
          {items.map((c) => (
            <li key={c.key} className="flex items-center justify-center">
              {c.svg ? (
                <Image
                  src={c.svg}
                  alt={c.alt}
                  width={140}
                  height={42}
                  className="h-9 md:h-10 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-200 select-none"
                  loading="lazy"
                />
              ) : (
                <span
                  aria-label={c.alt}
                  className="inline-flex flex-col items-center justify-center leading-tight text-ink-subtle hover:text-navy-700 transition-colors duration-200 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 select-none text-center"
                >
                  <span className="font-mono text-[13px] md:text-[14px] font-bold tracking-[0.12em]">
                    {c.mark}
                  </span>
                  {c.sub && (
                    <span className="font-mono text-[9.5px] tracking-[0.18em] opacity-70 mt-0.5">
                      {c.sub}
                    </span>
                  )}
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">
          Names shown with each fleet&apos;s permission. Worldwide attendance.
        </p>
      </div>
    </section>
  );
}
