import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import ServiceWizardClient from './ServiceWizardClient';
import ServiceImageDeck from '@/components/ServiceImageDeck';
import { readServices, readServicesFile } from '@/lib/content';
import { getLocale } from '@/lib/i18n';

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

export const metadata: Metadata = {
  title: 'Request Marine Electrical Service — 1-Hour Callback | Levent Marine',
  description:
    'Three quick questions — port, when, contact. Our next available technician will contact you within 1 hour. 24/7 worldwide.',
  alternates: { canonical: '/service-wizard' }
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

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

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
      {/* Compact heading bar — no breadcrumb, no big H1 chrome */}
      <div className="shrink-0 border-b border-line px-6 pt-16 pb-4 md:px-12">
        <div className="kicker mb-1">{t('Service intake', 'Servis talebi')}</div>
        <h1 className="text-[22px] md:text-[26px] leading-tight font-bold">
          {t('Request marine electrical service.', 'Denizcilik elektrik servisi talep et.')}
        </h1>
        <p className="text-ink-muted text-[13.5px] mt-1">
          {t(
            'Three quick questions — port, when, contact. Callback within 1 hour.',
            'Üç hızlı soru — liman, ne zaman, iletişim. 1 saat içinde geri dönüş.'
          )}{' '}
          <Link href="/services" className="text-amber-600 no-underline hover:text-amber">
            {t('← All systems', '← Tüm sistemler')}
          </Link>
        </p>
      </div>

      {/* Wizard body — form on the left, cycling service photos on the right (lg+) */}
      <div className="lm-screen-body px-6 py-6 md:px-12 md:py-8">
        <div className="grid h-full gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <div className="min-w-0">
            <Suspense fallback={<div className="text-ink-subtle font-mono text-sm">Loading wizard…</div>}>
              <ServiceWizardClient
                services={services}
                usPorts={file.us_ports}
                copy={copy}
                locale={locale}
              />
            </Suspense>
          </div>

          <aside className="hidden lg:block">
            <ServiceImageDeck items={deckItems} locale={locale} />
          </aside>
        </div>
      </div>
    </div>
  );
}
