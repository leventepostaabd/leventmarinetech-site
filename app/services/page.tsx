import type { Metadata } from 'next';
import { readPopularServices, readServices, readServicesFile } from '@/lib/content';
import ServicesBrowser from './ServicesBrowser';

export const metadata: Metadata = {
  title: 'Marine Electrical Service — 19 Systems, 24/7 Worldwide | Levent Marine',
  description:
    'Pick the system that has the problem — generator, BWTS, fire alarm, bridge nav, PLC, crane, and 13 more. Three quick questions, then our next available technician calls you within 1 hour.',
  alternates: { canonical: '/services' }
};

/**
 * Service catalog index (Wave 1 / Agent B).
 *
 * Flow per DECISIONS.md S1–S5 + F1:
 *   1. Search box: "Which system has the problem?"
 *   2. 6 most-requested tiles (Generator · BWTS · Fire Alarm · Bridge Nav · PLC · Crane)
 *   3. "See all 19 systems" → modal grid (no scroll on desktop background, F1)
 *   4. Pick a system → /service-wizard?system=<slug> (3-step flow)
 */
export default function ServicesIndex() {
  const file = readServicesFile();
  const all = readServices();
  const popular = readPopularServices();

  const ui = {
    search_placeholder: file.ui.search_placeholder_en ?? 'Which system has the problem?',
    popular: file.ui.popular_en ?? 'Most requested',
    see_all: file.ui.see_all_en ?? 'See all 19 systems',
    close: file.ui.close_en ?? 'Close',
    no_matches: file.ui.no_matches_en ?? 'No system matches that search.'
  };

  return (
    <div className="container-x py-12 md:py-16">
      <div className="kicker mb-3">Service catalog</div>
      <h1 className="mb-3 text-balance max-w-3xl">Marine electrical service — 19 systems, one call.</h1>
      <p className="text-ink-muted max-w-2xl text-[16px] leading-relaxed">
        Pick the system that has the problem. Three quick questions — port, when, contact —
        and our next available technician will call you within 1 hour.
      </p>

      <ServicesBrowser services={all} popular={popular} ui={ui} locale="en" />
    </div>
  );
}
