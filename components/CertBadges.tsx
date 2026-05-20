/**
 * CertBadges — STCW certification chips visible on About surfaces and the
 * trust band. Each chip exposes its full name on hover/focus via title +
 * aria-label so screen-readers receive the long form, sighted users see the
 * compact abbreviation.
 */

export type CertBadge = {
  abbr: string;
  full: string;
  reg: string;
};

export const CERTIFICATIONS: CertBadge[] = [
  { abbr: 'ETO',           full: 'Electro-Technical Officer',                  reg: 'STCW Reg. III/6'  },
  { abbr: 'HV ≤ 1000V', full: 'High Voltage Operations',                  reg: 'Up to 1000V'      },
  { abbr: 'AFF',           full: 'Advanced Fire Fighting',                     reg: 'STCW VI/3'        },
  { abbr: 'MFA',           full: 'Medical First Aid',                          reg: 'STCW VI/4-1'      },
  { abbr: 'BST',           full: 'Basic Safety Training',                      reg: 'STCW VI/1'        },
  { abbr: 'Gas Tanker',    full: 'Gas Tanker Familiarization',                 reg: 'STCW V/1-2'       },
  { abbr: 'Oil/Chem',      full: 'Oil & Chemical Tanker Familiarization',      reg: 'STCW V/1-1'       }
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
      aria-label="STCW certifications held by the lead engineer"
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
