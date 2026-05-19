import Link from 'next/link';
import type { Metadata } from 'next';
import { SERVICE_SLUGS } from '@/lib/site';
import { readServices } from '@/lib/content';
import ServiceTile from '@/components/ServiceTile';

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
        Eleven lanes from main switchboard to deck crane. Click any tile to see typical symptoms, what we check, the
        tools we bring, and a real case — all in an overlay (no page jump). Open the dedicated page from the corner
        link if you want a shareable URL.
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
          return <ServiceTile key={slug} s={s} />;
        })}
      </div>
    </div>
  );
}
