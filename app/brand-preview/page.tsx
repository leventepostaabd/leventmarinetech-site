import type { Metadata } from 'next';
import Link from 'next/link';
import LogoLockup from '@/components/LogoLockup';

export const metadata: Metadata = {
  title: 'Brand lockup options',
  robots: { index: false, follow: false }
};

/**
 * Hidden preview route for picking the brand lockup. Not linked from the
 * site and excluded from indexing. Visit /brand-preview, look at all
 * three options on both light + dark backgrounds, then tell which
 * variant should ship (A / B / C).
 */
export default function BrandPreview() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-600 mb-2">
            Brand · Preview
          </p>
          <h1 className="text-[28px] font-black mb-2">Pick the brand lockup.</h1>
          <p className="text-ink-muted">
            Three composition options for the mark + wordmark + tagline. Whichever you
            pick will be wired into the TopBar across the site and used on cards,
            email signatures, and any future printed material.
          </p>
        </div>

        {(['A', 'B', 'C'] as const).map((v) => (
          <section key={v} className="mb-12 rounded-2xl border border-line overflow-hidden">
            <div className="flex items-center justify-between bg-navy-50 border-b border-line px-6 py-3">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-600 mr-3">
                  Option {v}
                </span>
                <span className="font-head text-[15px] font-bold text-navy-700">
                  {v === 'A' && 'Stacked monogram — crest feel'}
                  {v === 'B' && 'Horizontal classic — business-card friendly'}
                  {v === 'C' && 'Badge — strongest visual presence'}
                </span>
              </div>
              <Link
                href={`/?lockup=${v}`}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-subtle no-underline hover:text-ink"
              >
                Preview on home →
              </Link>
            </div>

            <div className="grid md:grid-cols-2">
              {/* On white */}
              <div className="bg-white p-10 flex items-center justify-center border-b md:border-b-0 md:border-r border-line">
                <LogoLockup variant={v} tone="dark" scale={1.4} />
              </div>
              {/* On navy */}
              <div className="bg-navy-700 p-10 flex items-center justify-center">
                <LogoLockup variant={v} tone="light" scale={1.4} />
              </div>
            </div>

            {/* Real-world sizes */}
            <div className="bg-navy-50 border-t border-line px-6 py-5">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle mb-3">
                Actual sizes
              </div>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
                <div>
                  <div className="text-[10.5px] font-mono uppercase tracking-wider text-ink-subtle mb-1.5">
                    TopBar size
                  </div>
                  <LogoLockup variant={v} tone="dark" scale={0.85} />
                </div>
                <div>
                  <div className="text-[10.5px] font-mono uppercase tracking-wider text-ink-subtle mb-1.5">
                    Business card
                  </div>
                  <LogoLockup variant={v} tone="dark" scale={1.6} />
                </div>
                <div>
                  <div className="text-[10.5px] font-mono uppercase tracking-wider text-ink-subtle mb-1.5">
                    Email signature
                  </div>
                  <LogoLockup variant={v} tone="dark" scale={1} />
                </div>
              </div>
            </div>
          </section>
        ))}

        <div className="rounded-xl border border-amber/30 bg-amber/5 p-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-700 mb-1.5">
            Next step
          </div>
          <p className="text-ink mb-2">
            Tell me which option (A, B, or C) and I&apos;ll pin it across the site.
            Anything you want to tweak — wider tracking, different kicker line,
            different mark size — say so and I&apos;ll iterate.
          </p>
        </div>
      </div>
    </div>
  );
}
