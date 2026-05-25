'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import US from 'country-flag-icons/react/3x2/US';
import TR from 'country-flag-icons/react/3x2/TR';
import GR from 'country-flag-icons/react/3x2/GR';
import ES from 'country-flag-icons/react/3x2/ES';
import DE from 'country-flag-icons/react/3x2/DE';

type FlagComp = typeof US;

// English uses the US flag (per request). Greek (el) → Greece flag.
const LANGS: { code: Locale; title: string; Flag: FlagComp }[] = [
  { code: 'en', title: 'English',  Flag: US },
  { code: 'tr', title: 'Türkçe',   Flag: TR },
  { code: 'el', title: 'Ελληνικά', Flag: GR },
  { code: 'es', title: 'Español',  Flag: ES },
  { code: 'de', title: 'Deutsch',  Flag: DE }
];

export default function LocaleToggle({ current }: { current: Locale }) {
  const router = useRouter();
  const [pending, setPending] = useState<Locale | null>(null);

  async function choose(code: Locale) {
    if (code === current || pending) return;
    setPending(code);
    try {
      await fetch('/api/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: code, manual: true })
      });
      // Mirror the manual-override flag so middleware skips geo auto-detect.
      document.cookie = `lm.locale.manual=1; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language / Dil">
      {LANGS.map(({ code, title, Flag }) => {
        const active = code === current;
        return (
          <button
            key={code}
            type="button"
            onClick={() => choose(code)}
            disabled={!!pending}
            aria-label={title}
            aria-pressed={active}
            title={title}
            className={`inline-flex items-center justify-center overflow-hidden rounded-[3px] transition disabled:opacity-50 ${
              active
                ? 'ring-2 ring-amber'
                : 'opacity-55 ring-1 ring-black/10 hover:opacity-100'
            } ${pending === code ? 'animate-pulse' : ''}`}
            style={{ width: 26, height: 18 }}
          >
            <Flag title={title} className="h-full w-full object-cover" />
          </button>
        );
      })}
    </div>
  );
}
