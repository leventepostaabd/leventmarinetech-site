import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-700 text-white/85 mt-24">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span aria-hidden="true" className="w-10 h-10 grid place-items-center text-white">
              <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path fill="currentColor" d="M12 8v34h22v6H6V8z" />
                <circle cx="46" cy="14" r="4" fill="#F5A524" />
              </svg>
            </span>
            <span className="font-head font-bold text-white">Levent Marine</span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-white/65 max-w-xs">
            Marine electrical service &amp; technical parts supply. Wyoming, USA + Tuzla, Türkiye.
            12 years onboard, 247+ vessels.
          </p>
        </div>

        <div>
          <h5 className="font-head font-semibold text-white text-[14px] mb-3">Service</h5>
          <ul className="space-y-1.5 text-[13px] text-white/70">
            <li><Link href="/service-wizard" className="hover:text-amber no-underline">Request service</Link></li>
            <li><Link href="/services" className="hover:text-amber no-underline">Service catalog</Link></li>
            <li><Link href="/services/insulation-diagnostics" className="hover:text-amber no-underline">Insulation diagnostics</Link></li>
            <li><Link href="/services/emergency-remote-eto" className="hover:text-amber no-underline">Emergency / AOG</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-head font-semibold text-white text-[14px] mb-3">Supply</h5>
          <ul className="space-y-1.5 text-[13px] text-white/70">
            <li><Link href="/supply-wizard" className="hover:text-amber no-underline">Request a quote</Link></li>
            <li><Link href="/supply" className="hover:text-amber no-underline">Browse catalog</Link></li>
            <li><Link href="/supply/unlisted-request" className="hover:text-amber no-underline">Unlisted part</Link></li>
            <li><Link href="/supply/equivalent-part-finder" className="hover:text-amber no-underline">Find equivalent</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-head font-semibold text-white text-[14px] mb-3">Contact</h5>
          <ul className="space-y-1.5 text-[13px] text-white/70 font-mono">
            <li><a href={`tel:${SITE.phoneUS.replace(/\s/g, '')}`} className="hover:text-amber no-underline">{SITE.phoneUS}  (US)</a></li>
            <li><a href={`tel:${SITE.phoneTR.replace(/\s/g, '')}`} className="hover:text-amber no-underline">{SITE.phoneTR}  (TR)</a></li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-amber no-underline">{SITE.email}</a></li>
            <li><a href={SITE.whatsappUS} target="_blank" rel="noopener" className="hover:text-amber no-underline">WhatsApp US</a></li>
            <li><a href={SITE.whatsappTR} target="_blank" rel="noopener" className="hover:text-amber no-underline">WhatsApp TR</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-4 flex flex-col md:flex-row md:items-center justify-between gap-2 text-[11px] font-mono text-white/55">
          <span>© {year} LEVENT MARINE LLC · Wyoming + Tuzla · ALL RIGHTS RESERVED</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber no-underline">Privacy</Link>
            <Link href="/terms" className="hover:text-amber no-underline">Terms</Link>
            <Link href="/cookie-policy" className="hover:text-amber no-underline">Cookies</Link>
            <Link href="/accessibility-statement" className="hover:text-amber no-underline">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
