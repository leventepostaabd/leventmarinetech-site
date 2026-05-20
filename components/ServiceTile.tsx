'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { ServiceContent } from '@/lib/content';

type TabKey = 'overview' | 'symptoms' | 'tools' | 'case';

const TABS: { id: TabKey; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'symptoms', label: 'Symptoms' },
  { id: 'tools',    label: 'Tools'    },
  { id: 'case',     label: 'Case'     }
];

/**
 * Service tile — clickable card that opens an overlay sheet (NOT a new page).
 * The "Open full page" link routes to /services/<slug> for deep linking / SEO.
 */
export default function ServiceTile({ s }: { s: ServiceContent }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('overview');

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setTab('overview'); }}
        className="text-left card hover:border-amber group transition w-full"
        aria-label={`Open ${s.title}`}
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 mb-2">{s.kicker}</div>
        <h3 className="mb-2 group-hover:text-amber-600">{s.title}</h3>
        <p className="text-ink-muted text-[14px] leading-relaxed line-clamp-3">{s.intro}</p>
        <span className="mt-3 inline-flex items-center text-[13px] font-mono text-amber-600 group-hover:translate-x-0.5 transition">Open →</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[150] bg-navy-900/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full md:w-[680px] bg-white shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={s.title}
            >
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-line bg-white">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600">{s.kicker}</div>
                <div className="flex items-center gap-2">
                  <Link href={`/services/${s.slug}`} className="font-mono text-[11px] text-ink-subtle hover:text-amber-600 no-underline">Full page ↗</Link>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="w-8 h-8 grid place-items-center rounded-md hover:bg-navy-50">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div className="px-6 pt-5 pb-3 border-b border-line">
                <h2 className="text-balance text-[26px]">{s.title}</h2>
                <p className="mt-2 text-ink-muted text-[14.5px] leading-relaxed">{s.intro}</p>
              </div>

              <nav role="tablist" aria-label="Service detail" className="flex gap-1 px-4 py-2 border-b border-line bg-navy-50">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-3.5 py-1.5 rounded-md font-mono text-[11.5px] uppercase tracking-[0.06em] transition ${tab === t.id ? 'bg-navy-700 text-white' : 'text-ink-muted hover:bg-white hover:text-ink'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {tab === 'overview' && (
                  <div>
                    <h3 className="text-[17px] mb-3">Root causes</h3>
                    <ul className="space-y-2 mb-6">
                      {s.rootCauses.map((c) => <li key={c} className="text-[14px] text-ink-muted leading-relaxed pl-4 relative"><span className="text-amber absolute left-0">›</span>{c}</li>)}
                    </ul>
                    <h3 className="text-[17px] mb-3">What we check</h3>
                    <ol className="space-y-2">
                      {s.whatWeCheck.map((step, i) => (
                        <li key={step} className="text-[14px] text-ink-muted flex gap-3"><span className="font-mono text-[12px] text-amber w-5">{String(i + 1).padStart(2, '0')}</span><span>{step}</span></li>
                      ))}
                    </ol>
                  </div>
                )}

                {tab === 'symptoms' && (
                  <div>
                    <h3 className="text-[17px] mb-3">Common symptoms</h3>
                    <ul className="space-y-2.5">
                      {s.symptoms.map((sym) => (
                        <li key={sym} className="text-[14.5px] text-ink-muted leading-relaxed pl-4 relative"><span className="text-amber absolute left-0">›</span>{sym}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === 'tools' && (
                  <div>
                    <h3 className="text-[17px] mb-3">Equipment we bring</h3>
                    <ul className="flex flex-wrap gap-2">
                      {s.tools.map((t) => <li key={t} className="chip">{t}</li>)}
                    </ul>
                  </div>
                )}

                {tab === 'case' && (
                  <div>
                    <div className="card border-l-4 border-l-amber bg-navy-50">
                      <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-subtle mb-3">
                        <span>{s.exampleCase.vesselType}</span>
                        <span>{s.exampleCase.port}</span>
                        <span>{s.exampleCase.year}</span>
                      </div>
                      <h4 className="text-[16px] mb-2">{s.exampleCase.headline}</h4>
                      <p className="text-[14px] text-ink leading-relaxed">{s.exampleCase.summary}</p>
                    </div>
                    {s.relatedSupply?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-[15px] mb-3">Parts often requested with this</h4>
                        <ul className="grid gap-2">
                          {s.relatedSupply.map((p) => <li key={p} className="card !p-3 text-[13.5px]">{p}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-line bg-white flex flex-wrap gap-2">
                <Link href={`/service-wizard?service=${s.slug}`} className="btn-accent btn-md">{s.ctaService}</Link>
                <Link href={`/supply-wizard?service=${s.slug}`} className="btn-ghost btn-md">{s.ctaSupply}</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
