'use client';
import { useSearchParams } from 'next/navigation';
import Wizard, { bind, type WizardStep } from '@/components/Wizard';
import PhotoUpload, { type UploadedFile } from '@/components/PhotoUpload';

const COMMON_BRANDS = [
  'ABB', 'Siemens', 'Schneider', 'Mitsubishi', 'Hitachi', 'Hyundai', 'Terasaki', 'Stork',
  'Allen-Bradley', 'Omron', 'Phoenix Contact', 'Weidmuller', 'Stamford', 'Leroy-Somer',
  'Furuno', 'JRC', 'Sailor', 'Consilium', 'Autronica', 'Vacon', 'Danfoss', 'Yaskawa'
];

const URGENCIES = [
  { id: 'aog',     label: 'AOG (< 24h)',     hint: 'Vessel waiting / cargo blocked' },
  { id: 'urgent',  label: 'Urgent (3 days)', hint: 'Need at next port' },
  { id: 'planned', label: 'Planned',         hint: 'Stocking up / retrofit' }
] as const;

const TOP_CATEGORIES = [
  { id: 'marine-electric',  label: 'Marine Electric',  hint: 'Radar, GMDSS, BWTS, alarm panels, navigation lights' },
  { id: 'general-electric', label: 'General Electric', hint: 'Breakers, contactors, motors, cables, drives' },
  { id: 'general-marine',   label: 'General Marine',   hint: 'Valves, fans, gaskets, deck mechanical' },
  { id: 'unsure',           label: "I'm not sure",     hint: "We'll figure it out from the photo / description" }
];

export default function SupplyWizardClient() {
  const params = useSearchParams();
  const initial = {
    product: params.get('product') ?? '',
    region: params.get('region') ?? '',
    service: params.get('service') ?? '',
    category: '',
    brand: params.get('brand') ?? '',
    partNumber: params.get('part') ?? '',
    quantity: 1,
    description: params.get('q') ?? '',
    attachments: [] as UploadedFile[],
    vesselName: '',
    imo: '',
    currentPort: '',
    nextPort: '',
    eta: '',
    urgency: (params.get('urgency') as any) ?? 'planned',
    contactName: '',
    contactEmail: '',
    contactWhatsapp: '',
    company: ''
  };

  // ----- 6 steps -----
  const steps: WizardStep[] = [
    {
      id: 'category',
      title: 'What kind of part?',
      description: 'Helps us route to the right sourcing specialist. Skip if unsure — we infer from the rest.',
      fields: (s) => (
        <div className="grid gap-2 sm:grid-cols-2">
          {TOP_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => s._update({ category: c.id })}
              className={`text-left p-4 rounded-md border ${s.category === c.id ? 'bg-navy-700 text-white border-navy-700' : 'border-line bg-white text-ink hover:border-amber'}`}
            >
              <div className="font-bold">{c.label}</div>
              <div className={`text-[12.5px] mt-0.5 ${s.category === c.id ? 'text-white/70' : 'text-ink-muted'}`}>{c.hint}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'brand',
      title: 'Brand / OEM',
      description: 'Pick a known maker or type your own. Leave blank if you only have a photo.',
      fields: (s) => (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_BRANDS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => s._update({ brand: b })}
                className={`text-[12.5px] px-3 py-1.5 rounded-md border ${s.brand === b ? 'bg-navy-700 text-white border-navy-700' : 'border-line bg-white text-ink hover:border-amber'}`}
              >
                {b}
              </button>
            ))}
          </div>
          <div>
            <label className="field-label">Brand / OEM</label>
            <input className="field-input" placeholder="Type if not in list" {...bind(s, 'brand')} />
          </div>
          <p className="text-[12px] text-ink-subtle">No brand? No problem — step 3 lets you describe or upload a photo.</p>
        </>
      )
    },
    {
      id: 'part',
      title: 'Part number, description & photo',
      description: 'Even partial info helps. A nameplate photo is gold — we use it to verify maker, model, and serial.',
      fields: (s) => (
        <>
          <div className="grid sm:grid-cols-[2fr_1fr] gap-3">
            <div>
              <label className="field-label">Part number / model</label>
              <input className="field-input" placeholder="e.g. AF50-30-11 or MG5436" {...bind(s, 'partNumber')} />
            </div>
            <div>
              <label className="field-label">Quantity</label>
              <input
                className="field-input"
                type="number"
                min={1}
                value={s.quantity ?? 1}
                onChange={(e) => s._update({ quantity: parseInt(e.target.value, 10) || 1 })}
              />
            </div>
          </div>
          <div>
            <label className="field-label">Description / notes</label>
            <textarea
              className="field-input min-h-[100px]"
              placeholder="Voltage, application, where it sits on the vessel, what failed."
              {...bind(s, 'description')}
            />
          </div>
          <div>
            <label className="field-label">Photos (nameplate, panel, drawing) — up to 5</label>
            <PhotoUpload
              prefix="supply-wizard"
              onChange={(files: UploadedFile[]) => s._update({ attachments: files })}
            />
          </div>
        </>
      ),
      validate: (s) =>
        s.partNumber || s.description || (s.attachments && s.attachments.length)
          ? null
          : 'Add a part number, description, or photo.'
    },
    {
      id: 'vessel',
      title: 'Vessel & ports',
      description: 'So we can plan freight to the right port at the right time.',
      fields: (s) => (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="field-label">Vessel name</label><input className="field-input" {...bind(s, 'vesselName')} /></div>
            <div><label className="field-label">IMO number</label><input className="field-input" {...bind(s, 'imo')} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="field-label">Current port</label><input className="field-input" {...bind(s, 'currentPort')} /></div>
            <div><label className="field-label">Next port</label><input className="field-input" {...bind(s, 'nextPort')} /></div>
          </div>
          <div>
            <label className="field-label">ETA at next port (optional)</label>
            <input className="field-input" type="datetime-local" {...bind(s, 'eta')} />
          </div>
        </>
      )
    },
    {
      id: 'urgency',
      title: 'Urgency',
      fields: (s) => (
        <div className="grid gap-2">
          {URGENCIES.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => s._update({ urgency: u.id })}
              className={`text-left p-4 rounded-md border ${s.urgency === u.id ? 'bg-navy-700 text-white border-navy-700' : 'border-line bg-white text-ink hover:border-amber'}`}
            >
              <div className="font-bold">{u.label}</div>
              <div className={`text-[13px] ${s.urgency === u.id ? 'text-white/70' : 'text-ink-muted'}`}>{u.hint}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact & submit',
      description:
        '"Request received. We will check supplier availability, equivalent options, and port delivery feasibility." — that\'s our auto-reply.',
      fields: (s) => (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="field-label">Your name *</label><input className="field-input" {...bind(s, 'contactName')} /></div>
            <div><label className="field-label">Company / fleet</label><input className="field-input" {...bind(s, 'company')} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="field-label">Email *</label><input className="field-input" type="email" {...bind(s, 'contactEmail')} /></div>
            <div><label className="field-label">WhatsApp</label><input className="field-input" placeholder="+1 ..." {...bind(s, 'contactWhatsapp')} /></div>
          </div>

          {/* Inline preview */}
          <div className="mt-4 p-4 rounded-md bg-navy-50 border border-line">
            <div className="kicker mb-2 text-[10.5px]">Preview</div>
            <dl className="grid gap-1 text-[13px]">
              {[
                ['Category', s.category || '—'],
                ['Brand', s.brand || '—'],
                ['Part number', s.partNumber || '—'],
                ['Qty', s.quantity],
                ['Vessel', `${s.vesselName || '—'}${s.imo ? ` (IMO ${s.imo})` : ''}`],
                ['Port', s.currentPort || '—'],
                ['Urgency', (s.urgency || '').toUpperCase()],
                ['Photos', s.attachments?.length ? `${s.attachments.length} attached` : '—']
              ].map(([k, v]) => (
                <div key={k as string} className="grid grid-cols-[120px_1fr] gap-3 py-1 border-b border-line last:border-0">
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-subtle">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      ),
      validate: (s) => {
        if (!s.contactName) return 'Name is required.';
        if (!s.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.contactEmail)) return 'Valid email required.';
        return null;
      }
    }
  ];

  return <Wizard steps={steps} initial={initial} endpoint="/api/quote-request" whatsappFallback="16193840403" />;
}
