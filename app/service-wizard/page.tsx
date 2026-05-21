import type { Metadata } from 'next';
import { Suspense } from 'react';
import ServiceWizardClient from './ServiceWizardClient';
import ServiceImageDeck from '@/components/ServiceImageDeck';
import { readServices, readServicesFile } from '@/lib/content';
import { getLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Request Marine Electrical Service — 1-Hour Callback | Levent Marine',
  description:
    'Three quick questions — port, when, contact. Our next available technician will contact you within 1 hour. 24/7 worldwide.',
  alternates: { canonical: '/service-wizard' }
};

const SERVICE_IMAGE: Record<string, string> = {
  generator: '/services/01-generator.jpg',
  'main-engine-electrical': '/services/02-main-engine.jpg',
  'fire-alarm': '/services/04-fire-alarm.jpg',
  'engine-room-alarm': '/services/05-er-alarm.jpg',
  'bridge-navigation': '/services/06-bridge-nav.jpg',
  'gmdss-communication': '/services/07-gmdss.jpg',
  'crane-deck-machinery': '/services/09-crane.jpg',
  'shaft-earthing': '/services/11-shaft-earthing.jpg',
  'plc-automation': '/services/12-plc-automation.jpg',
  'lighting-nav-lights': '/services/13-lighting.jpg',
  'ac-dc-motor': '/services/17-ac-dc-motor.jpg',
  'hvac-automation': '/services/18-hvac-automation.jpg'
};

export default function Page() {
  const file = readServicesFile();
  const services = readServices();
  const locale = getLocale();

  const copy = {
    step_port: {
      title_en: file.wizard.step_port.en,
      title_tr: file.wizard.step_port.tr,
      hint_en: file.wizard.step_port.hint_en,
      hint_tr: file.wizard.step_port.hint_tr
    },
    step_when: {
      title_en: file.wizard.step_when.en,
      title_tr: file.wizard.step_when.tr,
      options: file.wizard.step_when.options.map((o) => ({
        id: o.id,
        label_en: o.en,
        label_tr: o.tr
      }))
    },
    step_contact: {
      title_en: file.wizard.step_contact.en,
      title_tr: file.wizard.step_contact.tr,
      name_en: file.wizard.step_contact.name_en,
      name_tr: file.wizard.step_contact.name_tr,
      email_en: file.wizard.step_contact.email_en,
      email_tr: file.wizard.step_contact.email_tr,
      phone_en: file.wizard.step_contact.phone_en,
      phone_tr: file.wizard.step_contact.phone_tr,
      vessel_en: file.wizard.step_contact.vessel_en,
      vessel_tr: file.wizard.step_contact.vessel_tr,
      imo_en: file.wizard.step_contact.imo_en,
      imo_tr: file.wizard.step_contact.imo_tr
    },
    submit_en: file.wizard.submit_en,
    submit_tr: file.wizard.submit_tr,
    promise_en: file.wizard.promise_en,
    promise_tr: file.wizard.promise_tr,
    received_en: file.wizard.received_en,
    received_tr: file.wizard.received_tr,
    ref_en: file.wizard.ref_en,
    ref_tr: file.wizard.ref_tr
  };

  const deckItems = services
    .filter((s) => SERVICE_IMAGE[s.slug])
    .map((s) => ({
      slug: s.slug,
      image: SERVICE_IMAGE[s.slug],
      name_en: s.name_en,
      name_tr: s.name_tr,
      kicker_en: s.kicker_en,
      kicker_tr: s.kicker_tr
    }));

  return (
    <div className="lm-screen bg-white">
      {/* No page heading — TopBar already shows the brand.
          Body fills the entire remaining viewport. */}
      <div className="lm-screen-body grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)]">
        {/* Left — request form, internal scroll only if the form really exceeds the panel */}
        <div className="min-w-0 overflow-y-auto px-5 py-5 md:px-8 md:py-7">
          <Suspense fallback={<div className="text-ink-subtle font-mono text-sm">Loading wizard…</div>}>
            <ServiceWizardClient
              services={services}
              usPorts={file.us_ports}
              copy={copy}
              locale={locale}
            />
          </Suspense>
        </div>

        {/* Right — cycling service photos, top to bottom edge (lg+) */}
        <aside className="hidden lg:block">
          <ServiceImageDeck items={deckItems} locale={locale} fillParent />
        </aside>
      </div>
    </div>
  );
}
