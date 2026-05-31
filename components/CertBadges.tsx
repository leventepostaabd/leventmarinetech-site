/**
 * CertBadges — certification chips visible on About surfaces and the
 * trust band. Each chip exposes its full name on hover/focus via title +
 * aria-label so screen-readers receive the long form, sighted users see the
 * compact abbreviation.
 */

export type CertBadge = {
  abbr: string;
  full: string;
  reg: string;
  /** Issuer + year, surfaced under the title when present. */
  issued?: string;
  /** Public path to the credential scan, e.g. '/credentials/nfpa-70e.jpg'.
      When the matching JPEG exists in /public, the /about card shows a
      thumbnail and a "View certificate" link to the full-size image. */
  image?: string;
  /** Thumbnail aspect ratio. Defaults to a 4:3 paper-style scan; 'card'
      uses the ISO ID-1 landscape ratio (85×54 mm) for TWIC etc. */
  aspect?: 'paper' | 'card';
};

// Filename convention — drop the JPEG/PNG at the matching path under
// /public/credentials/ and the card auto-picks it up. (Owner-managed.)
export const CERTIFICATIONS: CertBadge[] = [
  {
    abbr: 'CSE',
    full: 'Control System Technology Engineer',
    reg: 'Engineering Diploma',
    image: '/credentials/control-system-engineer.jpg'
  },
  { abbr: 'ETO',           full: 'Electro-Technical Officer',                  reg: 'STCW Reg. III/6', image: '/credentials/eto-stcw-iii-6.jpg' },
  { abbr: 'HV ≤ 1000V', full: 'High Voltage Operations',                  reg: 'Up to 1000V',     image: '/credentials/hv-1000v.jpg'       },
  {
    abbr: 'NFPA 70E',
    full: 'Electrical Safety in the Workplace',
    reg: 'NFPA 70E',
    issued: 'NFPA · 2025',
    image: '/credentials/nfpa-70e.jpg'
  },
  {
    abbr: 'OSHA',
    full: 'Occupational Safety & Health — Outreach Training',
    reg: 'US OSHA',
    issued: 'OSHA Outreach · 2025',
    image: '/credentials/osha-outreach-training.jpg'
  },
  { abbr: 'TWIC',          full: 'Transportation Worker Identification Credential', reg: 'TSA · US', image: '/credentials/twic.jpg', aspect: 'card' },
  { abbr: 'AFF',           full: 'Advanced Fire Fighting',                     reg: 'STCW VI/3',       image: '/credentials/aff.jpg'            },
  { abbr: 'MFA',           full: 'Medical First Aid',                          reg: 'STCW VI/4-1',     image: '/credentials/mfa.jpg'            },
  { abbr: 'BST',           full: 'Basic Safety Training',                      reg: 'STCW VI/1',       image: '/credentials/bst.jpg'            },
  { abbr: 'Gas Tanker',    full: 'Gas Tanker Familiarization',                 reg: 'STCW V/1-2',      image: '/credentials/gas-tanker.jpg'     },
  { abbr: 'Oil/Chem',      full: 'Oil & Chemical Tanker Familiarization',      reg: 'STCW V/1-1',      image: '/credentials/oil-chem-tanker.jpg'}
];

export default function CertBadges({
  className = '',
  compact = false
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <ul
      className={`flex flex-wrap gap-2 ${className}`}
      aria-label="Certifications held by the engineer"
    >
      {CERTIFICATIONS.map((c) => {
        const long = `${c.full} (${c.reg})`;
        return (
          <li key={c.abbr}>
            <span
              tabIndex={0}
              title={long}
              aria-label={long}
              className={`group inline-flex items-center gap-1.5 rounded-full border border-navy-700/15 bg-navy-50 hover:bg-amber/15 hover:border-amber transition-colors duration-150 cursor-default focus:outline-none focus:ring-2 focus:ring-amber/40 ${
                compact ? 'px-2 py-1 text-[10.5px]' : 'px-3 py-1.5 text-[12px]'
              } font-mono tracking-wide text-navy-700`}
            >
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full bg-amber group-hover:bg-amber-600"
              />
              <span className="font-semibold">{c.abbr}</span>
              {!compact && (
                <span className="hidden md:inline text-ink-subtle font-normal">
                  · {c.reg}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
