'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'lm.cookie.v1';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  function accept(level: 'all' | 'essential') {
    localStorage.setItem(KEY, level);
    setShow(false);
  }

  if (!show) return null;
  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie consent" className="fixed bottom-0 left-0 right-0 z-40 md:bottom-4 md:left-4 md:right-auto md:max-w-md">
      <div className="m-3 md:m-0 bg-navy-700 text-white rounded-lg shadow-xl border border-navy-600 p-5">
        <p className="font-head font-bold text-[15px] mb-1.5">We use minimal cookies</p>
        <p className="text-[13px] text-white/75 leading-relaxed mb-3">
          Essential cookies keep RFQ submissions and authorized portal sessions working. Optional analytics
          help us see what marine teams look for. No tracking ads. See <Link href="/cookie-policy" className="underline text-amber hover:text-amber-600">our cookie policy</Link>.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => accept('all')} className="btn-accent btn-sm">Accept all</button>
          <button onClick={() => accept('essential')} className="btn-ghost btn-sm !bg-transparent !text-white !border-white/30 hover:!bg-white/10">Essential only</button>
        </div>
      </div>
    </div>
  );
}
