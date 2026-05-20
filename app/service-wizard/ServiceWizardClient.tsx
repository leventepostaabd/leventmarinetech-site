'use client';
import { useSearchParams } from 'next/navigation';
import Wizard, { bind, type WizardStep } from '@/components/Wizard';
import PhotoUpload, { type UploadedFile } from '@/components/PhotoUpload';

const VESSEL_TYPES = ['Bulker', 'Tanker', 'Container', 'OSV / Offshore', 'Ro-Ro', 'General Cargo', 'Other'];
const PROBLEM_CATEGORIES = [
  'Power & Distribution', 'Bridge & Automation', 'Safety & Deck', 'Testing',
  'Insulation / Hidden Fault', 'Survey / PSC Prep', 'Emergency / AOG'
];
const SYMPTOMS_BY_CAT: Record<string, string[]> = {
  'Power & Distribution': ['Generator will not sync', 'AVR fault', 'Breaker tripping', 'Voltage unstable', 'Shore power not engaging', 'Insulation low', 'Reverse power trip'],
  'Bridge & Automation': ['Radar magnetron weak', 'ECDIS chart update fail', 'Gyro deviation', 'PMS load-share off', 'AMS card fault', 'Alarm panel false alarms', 'PLC offline'],
  'Safety & Deck': ['Fire panel deficiency', 'Navigation light not working', 'CCTV camera offline', 'Deck crane VFD fault', 'Windlass not running', 'PA/GA inoperative', 'Gas detector trouble'],
  'Testing': ['ACB/MCCB retest required', 'Megger / insulation trend', 'Protection relay test', 'Thermography survey', 'HV switchboard test'],
  'Insulation / Hidden Fault': ['Insulation monitor alarm', 'Intermittent breaker trip', 'Unexplained burn smell', 'Earth fault wandering', 'Mid-voyage card failure'],
  'Survey / PSC Prep': ['Intermediate survey due', 'Special survey due', 'PSC deficiency rectification', 'CII rating support', 'SOLAS Ch. II-1 compliance check'],
  'Emergency / AOG': ['Engine room alarms blacked out', 'Main switchboard fault', 'Total loss of power', 'Vessel at port — needs immediate ETO', 'Survey blocking departure']
};
const URGENCIES = [
  { id: 'aog',     label: 'AOG (within 24h)',     hint: 'Vessel cannot sail / cargo at risk' },
  { id: 'urgent',  label: 'Urgent (3 days)',      hint: 'Must close before next port' },
  { id: 'planned', label: 'Planned',              hint: 'Scheduled retrofit / survey prep' }
] as const;

export default function ServiceWizardClient() {
  const params = useSearchParams();
  const initial = {
    service: params.get('service') ?? '',
    region: params.get('region') ?? '',
    vesselType: '',
    port: '',
    nextPort: '',
    eta: '',
    problemCategory: '',
    symptoms: [] as string[],
    notes: '',
    urgency: 'planned',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactWhatsapp: '',
    company: '',
    vesselName: '',
    imo: '',
    classSociety: ''
  };

  const steps: WizardStep[] = [
    {
      id: 'vessel',
      title: 'Vessel type',
      description: 'Pick the closest match — we can refine later.',
      fields: (s) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VESSEL_TYPES.map((v) => (
            <button key={v} type="button" onClick={() => s._update({ vesselType: v })} className={`text-[14px] py-3 px-3 rounded-md border ${s.vesselType === v ? 'bg-navy-700 text-white border-navy-700' : 'border-line bg-white text-ink hover:border-amber'}`}>{v}</button>
          ))}
        </div>
      ),
      validate: (s) => s.vesselType ? null : 'Pick a vessel type.'
    },
    {
      id: 'port',
      title: 'Port / location',
      description: 'Where is the vessel calling? Add ETA if known.',
      fields: (s) => (
        <>
          <div>
            <label className="field-label">Current port (city + country)</label>
            <input className="field-input" placeholder="e.g. Houston, TX, USA" {...bind(s, 'port')} />
          </div>
          <div>
            <label className="field-label">Next port (optional)</label>
            <input className="field-input" placeholder="e.g. New Orleans, LA, USA" {...bind(s, 'nextPort')} />
          </div>
          <div>
            <label className="field-label">ETA (optional)</label>
            <input className="field-input" type="datetime-local" {...bind(s, 'eta')} />
          </div>
        </>
      ),
      validate: (s) => s.port ? null : 'Add the port at minimum.'
    },
    {
      id: 'problem',
      title: 'Problem category',
      fields: (s) => (
        <div className="grid sm:grid-cols-2 gap-2">
          {PROBLEM_CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => s._update({ problemCategory: c, symptoms: [] })} className={`text-[14px] py-3 px-3 rounded-md border text-left ${s.problemCategory === c ? 'bg-navy-700 text-white border-navy-700' : 'border-line bg-white text-ink hover:border-amber'}`}>{c}</button>
          ))}
        </div>
      ),
      validate: (s) => s.problemCategory ? null : 'Pick a category.'
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      description: 'Tick anything matching. Add free notes below if your symptom is different.',
      fields: (s) => {
        const list = SYMPTOMS_BY_CAT[s.problemCategory] ?? [];
        function toggle(sym: string) {
          const cur: string[] = s.symptoms ?? [];
          s._update({ symptoms: cur.includes(sym) ? cur.filter((x) => x !== sym) : [...cur, sym] });
        }
        return (
          <>
            <div className="flex flex-wrap gap-2">
              {list.map((sym) => {
                const on = (s.symptoms ?? []).includes(sym);
                return (
                  <button key={sym} type="button" onClick={() => toggle(sym)} className={`text-[13px] px-3 py-1.5 rounded-md border ${on ? 'bg-amber text-navy-700 border-amber' : 'border-line bg-white text-ink hover:border-amber'}`}>{sym}</button>
                );
              })}
            </div>
            <div>
              <label className="field-label mt-4">Notes / what the bridge reported</label>
              <textarea className="field-input min-h-[100px]" placeholder="A few sentences from the chief engineer is perfect." {...bind(s, 'notes')} />
            </div>
            <div>
              <label className="field-label mt-4">Photos (alarm screen, switchboard, smoke, etc.)</label>
              <PhotoUpload prefix="service" onChange={(files: UploadedFile[]) => s._update({ attachments: files })} hint="Phone photo of the offending panel is enough." />
            </div>
          </>
        );
      }
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
      ),
      validate: (s) => s.urgency ? null : 'Pick urgency.'
    },
    {
      id: 'vessel-details',
      title: 'Vessel details',
      description: 'Optional but speeds up handling.',
      fields: (s) => (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Vessel name</label>
              <input className="field-input" placeholder="e.g. MV Aegean Trader" {...bind(s, 'vesselName')} />
            </div>
            <div>
              <label className="field-label">IMO number</label>
              <input className="field-input" placeholder="7 digits" {...bind(s, 'imo')} />
            </div>
          </div>
          <div>
            <label className="field-label">Class society</label>
            <select className="field-input" {...bind(s, 'classSociety')}>
              <option value="">—</option>
              <option>DNV</option><option>BV</option><option>ABS</option><option>Lloyd's Register</option>
              <option>RINA</option><option>ClassNK</option><option>Türk Loydu</option><option>IRS</option><option>Other</option>
            </select>
          </div>
        </>
      )
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'How should we reach you? WhatsApp works best for AOG.',
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
              <label className="field-label">Phone</label>
              <input className="field-input" type="tel" {...bind(s, 'contactPhone')} />
            </div>
          </div>
          <div>
            <label className="field-label">WhatsApp (best for AOG)</label>
            <input className="field-input" placeholder="+1 ... or +90 ..." {...bind(s, 'contactWhatsapp')} />
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
      id: 'summary',
      title: 'Review & submit',
      description: 'Quick check. Anything wrong — back to fix.',
      fields: (s) => (
        <dl className="grid gap-2 text-[13.5px]">
          {[
            ['Vessel type', s.vesselType],
            ['Vessel', `${s.vesselName ?? ''} ${s.imo ? `(IMO ${s.imo})` : ''}`.trim() || '—'],
            ['Class', s.classSociety || '—'],
            ['Port', s.port],
            ['Next port', s.nextPort || '—'],
            ['ETA', s.eta || '—'],
            ['Category', s.problemCategory],
            ['Symptoms', (s.symptoms ?? []).join(', ') || '—'],
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

  return <Wizard steps={steps} initial={initial} endpoint="/api/service-request" whatsappFallback="16193840403" />;
}
