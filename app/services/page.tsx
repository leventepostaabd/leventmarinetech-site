import Link from 'next/link';
import type { Metadata } from 'next';
import { SERVICE_SLUGS } from '@/lib/site';
import { readServices } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Services — Marine Electrical Service Catalog',
  description: 'Eleven service lanes covering every electrical system on a commercial vessel: power, propulsion, navigation, automation, safety, deck machinery, testing, retrofit, emergency, survey prep, and hidden-fault diagnostics.'
};

export default function ServicesIndex() {
  const services = readServices();
  return (
    <div className="container-x py-16">
      <div className="kicker mb-3">Service catalog</div>
      <h1 className="mb-3">Every electrical system aboard. One number.</h1>
      <p className="text-ink-muted max-w-2xl text-[16px] leading-relaxed">
        Eleven lanes from main switchboard to deck crane. Click into any service to see typical symptoms, what we
        check, the tools we bring, a real case from the field, and the supply items most often requested with it.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICE_SLUGS.map((slug) => {
          const s = services[slug];
          if (!s) {
            return (
              <Link key={slug} href={`/services/${slug}`} className="card hover:border-amber no-underline">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber mb-2">{slug.replace(/-/g, ' ')}</div>
                <h3 className="mb-2 capitalize">{slug.replace(/-/g, ' ')}</h3>
                <p className="text-ink-muted text-[13.5px]">Service detail page</p>
              </Link>
            );
          }
          return (
            <Link key={slug} href={`/services/${slug}`} className="card hover:border-amber group no-underline">
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber mb-2">{s.kicker}</div>
              <h3 className="mb-2 group-hover:text-amber-600">{s.title}</h3>
              <p className="text-ink-muted text-[14px] leading-relaxed line-clamp-3">{s.intro}</p>
              <span className="mt-3 inline-flex items-center text-[13px] font-mono text-amber-600 group-hover:translate-x-0.5 transition">View details →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
