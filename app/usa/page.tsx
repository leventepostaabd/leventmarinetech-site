import Link from 'next/link';
import type { Metadata } from 'next';
import { readRegions } from '@/lib/content';
import { REGION_SLUGS, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'USA Coverage — Marine Electrical Service Coast-to-Coast',
  description: 'Wyoming-registered US marine electrical service. Houston, New York/NJ, Long Beach — engineer onboard within hours, parts within a day. USD invoicing.',
  alternates: { canonical: '/usa' }
};

export default function UsaIndex() {
  const regions = readRegions();
  return (
    <>
      <section className="bg-navy-700 text-white py-20">
        <div className="container-x">
          <div className="kicker text-white/70 mb-4">USA Coverage</div>
          <h1 className="text-white text-balance max-w-4xl">Coast-to-coast US marine electrical response.</h1>
          <p className="mt-5 text-[17px] text-white/75 max-w-3xl leading-relaxed">
            Wyoming-registered LLC for clean USD invoicing. Engineer on board within hours of any major US port; AOG parts shipped same day. Below are deep dives on our three top response zones — open the ones that match your vessel's call.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <div className="grid gap-5 lg:grid-cols-3">
            {REGION_SLUGS.map((slug) => {
              const r = regions[slug];
              if (!r) return null;
              return (
                <Link key={slug} href={`/usa/${slug}`} className="card hover:border-amber group no-underline">
                  <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber mb-2">{r.state} · USA</div>
                  <h3 className="mb-3 group-hover:text-amber-600">{r.city}</h3>
                  <p className="text-ink-muted text-[14px] leading-relaxed line-clamp-4">{r.intro}</p>
                  <span className="mt-4 inline-flex items-center text-[13px] font-mono text-amber-600">View region →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
