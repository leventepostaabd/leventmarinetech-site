import Link from 'next/link';
import { SITE } from '@/lib/site';

/** Sticky bottom bar — visible only on mobile (md:hidden). */
export default function MobileActionBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-line">
      <div className="grid grid-cols-3 divide-x divide-line">
        <a href={`tel:${SITE.phoneUS.replace(/\s/g, '')}`} aria-label="Call US" className="py-3 text-center text-[12px] font-semibold text-ink font-mono no-underline active:bg-navy-50">
          CALL US
        </a>
        <a href={SITE.whatsappUS} target="_blank" rel="noopener" className="py-3 text-center text-[12px] font-semibold text-ink font-mono no-underline active:bg-navy-50">
          WHATSAPP
        </a>
        <Link href="/service-wizard" className="py-3 text-center text-[12px] font-semibold bg-amber text-navy-700 font-mono no-underline">
          QUOTE
        </Link>
      </div>
    </div>
  );
}
