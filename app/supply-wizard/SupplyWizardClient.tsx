'use client';
import { useSearchParams } from 'next/navigation';
import Wizard, { bind, type WizardStep } from '@/components/Wizard';

const COMMON_BRANDS = [
  'ABB', 'Siemens', 'Schneider', 'Mitsubishi', 'Hitachi', 'Hyundai', 'Terasaki', 'Stork',
  'Allen-Bradley', 'Omron', 'Phoenix Contact', 'Weidmuller', 'Stamford', 'Leroy-Somer',
  'Furuno', 'JRC', 'Consilium', 'Autronica', 'Vacon', 'Danfoss', 'Yaskawa'
];
const URGENCIES = [
  { id: 'aog',     label: 'AOG (< 24h)',     hint: 'Vessel waiting / cargo blocked' },
  { id: 'urgent',  label: 'Urgent (3 days)', hint: 'Need at next port' },
  { id: 'planned', label: 'Planned',         hint: 'Stocking up / retrofit' }
] as const;

export default function SupplyWizardClient() {
  const params = useSearchParams();
  const initial = {
    product: params.get('product') ?? '',
    region: params.get('region') ?? '',
    service: params.get('service') ?? '',
    brand: '',
    partNumber: '',
    quantity: 1,
    description: '',
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

  const steps: WizardStep[] = [
    {
      id: 'brand',
      title: 'Brand / OEM',
      description: 'Pick a known maker or type your own.',
      fields: (s) => (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_BRANDS.map((b) => (
              <button key={b} type="button" onClick={() => s._update({ brand: b })} className={`text-[12.5px] px-3 py-1.5 rounded-md border ${s.brand === b ? 'bg-navy-700 text-white border-navy-700' : 'border-line bg-white text-ink hover:border-amber'}`}>{b}</button>
            ))}
          </div>
          <div>
            <label className="field-label">Brand / OEM *</label>
            <input className="field-input" placeholder="Type if not in list" {...bind(s, 'brand')} />
          </div>
        </>
      ),
      validate: (s) => s.brand ? null : 'Brand is required.'
    },
    {
      id: 'part',
      title: 'Part number & quantity',
      description: 'Even partial part numbers help. Photo of the nameplate also works — upload below.',
      fields: (s) => (
        <>
          <div className="grid sm:grid-cols-[2fr_1fr] gap-3">
            <div>
              <label className="field-label">Part number / model *</label>
              <input className="field-input" placeholder="e.g. AF50-30-11" {...bind(s, 'partNumber')} />
            </div>
            <div>
              <label className="field-label">Quantity</label>
              <input className="field-input" type="number" min={1} {...bind(s, 'quantity')} />
            </div>
          </div>
          <div>
            <label className="field-label">Description / notes</label>
            <textarea className="field-input min-h-[100px]" placeholder="Anything that helps: voltage, application, photo of label, etc." {...bind(s, 'description')} />
          </div>
          <div className="text-[12px] text-ink-subtle">
            (Photo upload coming — for now, send the photo via WhatsApp +1 619 384 0403 after submission. Reference your request ID.)
          </div>
        </>
      ),
      validate: (s) => s.partNumber || s.description ? null : 'Add a part number or describe the part.'
    },
    {
      id: 'vessel',
      title: 'Vessel & port',
      fields: (s) => (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Vessel name</label>
              <input className="field-input" {...bind(s, 'vesselName')} />
            </div>
            <div>
              <label className="field-label">IMO number</label>
              <input className="field-input" {...bind(s, 'imo')} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Current port</label>
              <input className="field-input" {...bind(s, 'currentPort')} />
            </div>
            <div>
              <label className="field-label">Next port</label>
              <input className="field-input" {...bind(s, 'nextPort')} />
            </div>
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
            <button key={u.id} type="button" onClick={() => s._update({ urgency: u.id })} className={`text-left p-4 rounded-md border ${s.urgency === u.id ? 'bg-navy-700 text-white border-navy-700' : 'border-line bg-white text-ink hover:border-amber'}`}>
              <div className="font-bold">{u.label}</div>
              <div className={`text-[13px] ${s.urgency === u.id ? 'text-white/70' : 'text-ink-muted'}`}>{u.hint}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact',
      fields: (s) => (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Your name *</label>
              <input className="field-input" {...bind(s, 'contactName')} />
            </div>
            <div>
              <label className="field-label">Company / fleet</label>
              <input className="field-input" {...bind(s, 'company')} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Email *</label>
              <input className="field-input" type="email" {...bind(s, 'contactEmail')} />
            </div>
            <div>
              <label className="field-label">WhatsApp</label>
              <input className="field-input" placeholder="+1 ... or +90 ..." {...bind(s, 'contactWhatsapp')} />
            </div>
          </div>
        </>
      ),
      validate: (s) => {
        if (!s.contactName) return 'Name is required.';
        if (!s.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.contactEmail)) return 'Valid email required.';
        return null;
      }
    },
    {
      id: 'review',
      title: 'Preview & submit',
      description: '"Request received. We will check supplier availability, equivalent options, and port delivery feasibility." — that\'s our auto-reply when you submit.',
      fields: (s) => (
        <dl className="grid gap-2 text-[13.5px]">
          {[
            ['Brand', s.brand],
            ['Part number', s.partNumber || '—'],
            ['Quantity', s.quantity],
            ['Vessel', `${s.vesselName || '—'} ${s.imo ? `(IMO ${s.imo})` : ''}`.trim()],
            ['Current port', s.currentPort || '—'],
            ['Next port / ETA', `${s.nextPort || '—'} ${s.eta || ''}`.trim()],
            ['Urgency', s.urgency.toUpperCase()],
            ['Contact', `${s.contactName} · ${s.contactEmail}`]
          ].map(([k, v]) => (
            <div key={k as string} className="grid grid-cols-[140px_1fr] gap-3 py-2 border-b border-line">
              <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-subtle">{k}</dt>
              <dd className="text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      )
    }
  ];

  return <Wizard steps={steps} initial={initial} endpoint="/api/quote-request" whatsappFallback="16193840403" />;
}
