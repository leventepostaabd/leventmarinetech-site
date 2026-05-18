import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };

export default function Contact() {
  return (
    <div className="container-x py-16">
      <div className="kicker mb-3">Contact</div>
      <h1 className="mb-3">Reach us.</h1>
      <p className="text-ink-muted mb-12 max-w-2xl">For an AOG case, WhatsApp is fastest. For RFQs, the supply wizard captures everything we need. For everything else, email works.</p>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        <div className="card">
          <div className="kicker mb-3">USA HQ</div>
          <h3 className="mb-2">Sheridan · Wyoming</h3>
          <address className="not-italic text-ink-muted text-[14px] leading-relaxed mb-4">
            {SITE.addressUS.street}<br />
            {SITE.addressUS.city}, {SITE.addressUS.state} {SITE.addressUS.zip}
          </address>
          <ul className="text-[14px] space-y-1">
            <li><a href={`tel:${SITE.phoneUS.replace(/\s/g, '')}`} className="font-mono no-underline hover:text-amber-600">{SITE.phoneUS}</a></li>
            <li><a href={SITE.whatsappUS} target="_blank" rel="noopener" className="no-underline hover:text-amber-600">WhatsApp US</a></li>
          </ul>
        </div>

        <div className="card">
          <div className="kicker mb-3">Operational base</div>
          <h3 className="mb-2">Tuzla · Istanbul</h3>
          <address className="not-italic text-ink-muted text-[14px] leading-relaxed mb-4">
            {SITE.addressTR.street}<br />
            {SITE.addressTR.city} / {SITE.addressTR.region}, Türkiye
          </address>
          <ul className="text-[14px] space-y-1">
            <li><a href={`tel:${SITE.phoneTR.replace(/\s/g, '')}`} className="font-mono no-underline hover:text-amber-600">{SITE.phoneTR}</a></li>
            <li><a href={SITE.whatsappTR} target="_blank" rel="noopener" className="no-underline hover:text-amber-600">WhatsApp TR</a></li>
          </ul>
        </div>

        <div className="card md:col-span-2">
          <div className="kicker mb-3">Email</div>
          <p className="text-ink-muted mb-3">For RFQs and service requests, use the wizards — they capture vessel, port, urgency, and the technical context so we can quote same-day.</p>
          <ul className="text-[14px] space-y-1 font-mono">
            <li><a href={`mailto:${SITE.email}`} className="no-underline hover:text-amber-600">{SITE.email}</a> — general</li>
            <li><a href="mailto:rfq@leventmarinetech.com" className="no-underline hover:text-amber-600">rfq@leventmarinetech.com</a> — supply RFQ</li>
            <li><a href="mailto:service@leventmarinetech.com" className="no-underline hover:text-amber-600">service@leventmarinetech.com</a> — service requests</li>
            <li><a href="mailto:emergency@leventmarinetech.com" className="no-underline hover:text-amber-600">emergency@leventmarinetech.com</a> — AOG escalation</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/service-wizard" className="btn-accent btn-md">Service wizard</Link>
            <Link href="/supply-wizard" className="btn-primary btn-md">Supply wizard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
