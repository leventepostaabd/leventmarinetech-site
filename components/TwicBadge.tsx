import { CERTIFICATIONS } from './CertBadges';

const TWIC = CERTIFICATIONS.find((c) => c.abbr === 'TWIC');
const OSHA = CERTIFICATIONS.find((c) => c.abbr === 'OSHA');
type Cred = NonNullable<typeof TWIC>;

/**
 * US port-access credentials for the /ports hero — text only, no document
 * images. Two cards (TWIC + OSHA), both about getting onto US maritime
 * facilities: TWIC for unescorted secure-area access, OSHA for the
 * shipyard / port-facility safety baseline.
 */
const ACCESS: { cert?: Cred; en: string; tr: string }[] = [
  {
    cert: TWIC,
    en: 'TSA biometric credential for unescorted access to US maritime facilities, vessels and secure port areas.',
    tr: 'ABD liman tesislerine, gemilere ve güvenli liman bölgelerine refakatsiz erişim için TSA biyometrik kimliği.'
  },
  {
    cert: OSHA,
    en: 'US Department of Labor recognised workplace-safety baseline — the minimum for shipyard and port-facility work.',
    tr: 'ABD Çalışma Bakanlığı onaylı iş güvenliği temeli — tersane ve liman tesisi çalışmaları için asgari koşul.'
  }
];

export default function TwicBadge({
  title,
  sub,
  locale
}: {
  title: string;
  sub?: string;
  viewLabel?: string;
  locale: Locale;
}) {
  const tr = locale === 'tr';
  const items = ACCESS.filter((a) => a.cert);
  if (!items.length) return null;

  return (
    <div className="max-w-md">
      <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-300">
        {sub || title}
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map(({ cert, en, tr: trBlurb }) => (
          <div
            key={cert!.abbr}
            className="rounded-xl bg-white/10 p-3 ring-1 ring-white/25 backdrop-blur-sm"
          >
            <div className="font-head text-[15px] font-bold leading-tight text-white">
              {cert!.full}
            </div>
            <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-amber-300">
              {cert!.reg}
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/75">
              {tr ? trBlurb : en}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
