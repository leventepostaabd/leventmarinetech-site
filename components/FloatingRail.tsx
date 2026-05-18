import { SITE } from '@/lib/site';

/** Right-side floating action buttons — desktop only (hidden on mobile). */
export default function FloatingRail() {
  return (
    <aside aria-label="Quick contact" className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2">
      <a href={`tel:${SITE.phoneUS.replace(/\s/g, '')}`} aria-label="Call 24/7" className="w-12 h-12 grid place-items-center rounded-full bg-amber text-navy-700 shadow-lg hover:scale-105 transition no-underline">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
      <a href={SITE.whatsappUS} target="_blank" rel="noopener" aria-label="WhatsApp US" className="w-12 h-12 grid place-items-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition no-underline">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.78 11.78 0 0 0 12.06 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.93 11.93 0 0 0 5.78 1.47h.01c6.6 0 11.96-5.36 11.96-11.95a11.86 11.86 0 0 0-3.5-8.4zM12.06 21.8h-.01a9.93 9.93 0 0 1-5.06-1.39l-.36-.21-3.72.97 1-3.62-.24-.37a9.9 9.9 0 0 1-1.52-5.23c0-5.48 4.46-9.93 9.94-9.93 2.66 0 5.15 1.03 7.03 2.91a9.86 9.86 0 0 1 2.91 7.03c0 5.48-4.45 9.93-9.97 9.84z" /></svg>
      </a>
    </aside>
  );
}
