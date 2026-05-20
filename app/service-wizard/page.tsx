import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import ServiceWizardClient from './ServiceWizardClient';
import { readServices, readServicesFile } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Request Marine Electrical Service — 1-Hour Callback | Levent Marine',
  description:
    'Three quick questions — port, when, contact. Our next available technician will contact you within 1 hour. 24/7 worldwide.',
  alternates: { canonical: '/service-wizard' }
};

/**
 * Service intake wizard wrapper (Wave 1 / Agent B).
 *
 * Per DECISIONS.md S4, S5:
 *   System (preselected from /services or picked here) → Port → When → Contact
 *   then customer sees the literal 1-hour promise.
 */
export default function Page() {
  const file = readServicesFile();
  const services = readServices();

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

  return (
    <div className="container-x py-10 md:py-14">
      <nav className="text-[12px] font-mono text-ink-subtle mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-amber-600 no-underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/services" className="hover:text-amber-600 no-underline">Services</Link>
        <span className="mx-2">/</span>
        <span>Request service</span>
      </nav>

      <div className="kicker mb-3">Service intake</div>
      <h1 className="mb-3 text-balance">Request marine electrical service.</h1>
      <p className="text-ink-muted max-w-2xl mb-8 text-[15px] leading-relaxed">
        Three quick questions — port, when, contact. Our next available technician will contact you within 1 hour.
      </p>

      <Suspense fallback={<div className="text-ink-subtle font-mono text-sm">Loading wizard…</div>}>
        <ServiceWizardClient
          services={services}
          usPorts={file.us_ports}
          copy={copy}
          locale="en"
        />
      </Suspense>
    </div>
  );
}
