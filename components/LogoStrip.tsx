/**
 * LogoStrip — horizontal greyscale strip of repeat-customer brands.
 *
 * Per decision P5 (DECISIONS.md), all six known repeat customers stay visible
 * regardless of TR/EN positioning. No image deps — uses styled text marks so
 * the strip always renders, even before brand-supplied SVG logos exist.
 */

const CUSTOMERS: Array<{ key: string; mark: string; sub?: string; href?: string }> = [
  { key: 'msc',     mark: 'MEDLOG',     sub: 'MSC GROUP' },
  { key: 'tp',      mark: 'TP OFFSHORE' },
  { key: 'polaris', mark: 'POLARIS',    sub: 'DENIZCILIK' },
  { key: 'bright',  mark: 'BRIGHT',     sub: 'DENIZCILIK' },
  { key: 'cebi',    mark: 'CEBI KAPTAN' },
  { key: 'nord',    mark: 'REEDEREI',   sub: 'NORD' }
];

export default function LogoStrip({
  label = 'Trusted by recurring fleets',
  className = ''
}: {
  label?: string;
  className?: string;
}) {
  return (
    <section
      aria-label="Repeat customers"
      className={`w-full border-y border-line bg-navy-50 ${className}`}
    >
      <div className="container-x py-8 md:py-10">
        <div className="kicker mb-4">{label}</div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5 items-center">
          {CUSTOMERS.map((c) => (
            <li
              key={c.key}
              className="flex items-center justify-center"
            >
              <span
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
