'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LocaleToggle({ current }: { current: 'en' | 'tr' }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const next = current === 'en' ? 'tr' : 'en';

  async function flip() {
    setPending(true);
    try {
      await fetch('/api/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: next })
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={flip}
      disabled={pending}
      aria-label={`Switch to ${next === 'tr' ? 'Türkçe' : 'English'}`}
      className="px-2 py-1.5 rounded-md border border-line bg-white hover:border-line-strong hover:bg-navy-50 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted disabled:opacity-50"
    >
      {next.toUpperCase()}
    </button>
  );
}
