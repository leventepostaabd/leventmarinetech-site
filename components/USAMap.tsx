import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import statesTopo from 'us-atlas/states-10m.json';

/**
 * USAMap — light-theme US coverage map.
 *
 * Real state geometry (us-atlas 10m TopoJSON) projected with d3 geoAlbersUsa.
 * All geometry is computed server-side, so d3-geo never ships to the
 * browser — only the static SVG + a small CSS animation block.
 *
 * Visual hierarchy:
 *  - Light, corporate palette (pale ocean, white land, dark navy outlines).
 *  - Florida is the operations base — peninsula filled amber + HQ star.
 *  - **Gulf Coast is highlighted as the primary work area** (soft amber
 *    halo behind the Gulf states, brighter / larger port dots there, and
 *    a "PRIMARY AREA" label).
 *  - East / West / Lakes ports rendered with the same chip but smaller.
 */

const W = 960;
const H = 600;

const SKIP_FIPS = new Set(['60', '66', '69', '72', '78']);
const FL_FIPS = '12';
// Gulf-coast US states to shade with the primary-area halo
const GULF_FIPS = new Set([
  '12', // Florida (panhandle is the most worked corner)
  '01', // Alabama
  '28', // Mississippi
  '22', // Louisiana
  '48'  // Texas
]);

type StateFeature = {
  id: string;
  properties: { name: string };
  type: 'Feature';
  geometry: unknown;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fc = feature(statesTopo as any, (statesTopo as any).objects.states) as unknown as {
  features: StateFeature[];
};
const states = fc.features.filter((f) => !SKIP_FIPS.has(f.id));

const projection = geoAlbersUsa().fitExtent(
  [
    [16, 28],
    [W - 16, H - 40]
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { type: 'FeatureCollection', features: states } as any
);
const pathGen = geoPath(projection);

const STATE_PATHS = states.map((f) => ({
  id: f.id,
  name: f.properties.name,
  isFL: f.id === FL_FIPS,
  isGulf: GULF_FIPS.has(f.id),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  d: pathGen(f as any) || ''
}));

const project = (lng: number, lat: number): [number, number] | null => {
  const r = projection([lng, lat]);
  return r ? [r[0], r[1]] : null;
};

const ACCENT = '#F5A524';
const NAVY = '#0B1F3A';

type Port = {
  id: string;
  name: string;
  lng: number;
  lat: number;
  region: 'gulf' | 'east' | 'west' | 'lakes' | 'noncontig';
  /** Major hub — gets a permanently visible label with a leader line. */
  major?: boolean;
  /** Hand-tuned label offset (in SVG px) so leader lines don't collide. */
  lx?: number;
  ly?: number;
};

const PORTS: Port[] = [
  // East Coast
  { id: 'nynj',       name: 'New York / NJ',      lng: -74.04, lat: 40.67, region: 'east', major: true,  lx:  22, ly:  -4 },
  { id: 'boston',     name: 'Boston',             lng: -71.05, lat: 42.36, region: 'east', major: true,  lx:  22, ly: -10 },
  { id: 'norfolk',    name: 'Norfolk',            lng: -76.30, lat: 36.92, region: 'east', major: true,  lx:  22, ly:   6 },
  { id: 'charleston', name: 'Charleston',         lng: -79.93, lat: 32.78, region: 'east' },
  { id: 'savannah',   name: 'Savannah',           lng: -81.10, lat: 32.08, region: 'east', major: true,  lx:  22, ly:   6 },
  { id: 'jax',        name: 'Jacksonville',       lng: -81.66, lat: 30.33, region: 'east' },
  { id: 'miami',      name: 'Miami / Port Everglades', lng: -80.16, lat: 25.95, region: 'east', major: true, lx:  22, ly:   6 },
  // Gulf Coast (primary work area)
  { id: 'tampa',      name: 'Tampa',              lng: -82.46, lat: 27.95, region: 'gulf' },
  { id: 'pensacola',  name: 'Pensacola',          lng: -87.21, lat: 30.42, region: 'gulf' },
  { id: 'mobile',     name: 'Mobile',             lng: -88.04, lat: 30.69, region: 'gulf', major: true,  lx: -130, ly: -20 },
  { id: 'pascagoula', name: 'Pascagoula',         lng: -88.56, lat: 30.36, region: 'gulf' },
  { id: 'nola',       name: 'New Orleans',        lng: -90.07, lat: 29.95, region: 'gulf', major: true,  lx: -130, ly:  22 },
  { id: 'houston',    name: 'Houston',            lng: -95.30, lat: 29.76, region: 'gulf', major: true,  lx: -110, ly:  22 },
  { id: 'galveston',  name: 'Galveston',          lng: -94.80, lat: 29.30, region: 'gulf' },
  { id: 'corpus',     name: 'Corpus Christi',     lng: -97.40, lat: 27.80, region: 'gulf', major: true,  lx: -150, ly:  18 },
  // West Coast
  { id: 'longbeach',  name: 'Long Beach / LA',    lng: -118.19, lat: 33.75, region: 'west', major: true, lx: -150, ly:  10 },
  { id: 'la',         name: 'Los Angeles',        lng: -118.27, lat: 33.74, region: 'west' },
  { id: 'oakland',    name: 'Oakland',            lng: -122.27, lat: 37.80, region: 'west', major: true,  lx: -100, ly:   6 },
  { id: 'seattle',    name: 'Seattle',            lng: -122.34, lat: 47.60, region: 'west', major: true,  lx: -100, ly:  -6 },
  { id: 'tacoma',     name: 'Tacoma',             lng: -122.44, lat: 47.25, region: 'west' },
  { id: 'portland',   name: 'Portland',           lng: -122.68, lat: 45.52, region: 'west' },
  // Great Lakes
  // Alaska / Hawaii (Albers USA insets)
  { id: 'anchorage',  name: 'Anchorage (AK)',     lng: -149.90, lat: 61.22, region: 'noncontig' },
  { id: 'honolulu',   name: 'Honolulu (HI)',      lng: -157.86, lat: 21.31, region: 'noncontig' }
];

const PORT_POINTS = PORTS.map((p) => {
  const xy = project(p.lng, p.lat);
  return xy ? { ...p, x: xy[0], y: xy[1] } : null;
}).filter((p): p is Port & { x: number; y: number } => p !== null);

// Florida operations HQ — central peninsula
const HQ_XY = project(-81.4, 28.1);

// Soft amber halo for the Gulf primary area — placed under the Gulf coast
const GULF_HALO_XY = project(-91.0, 27.5);

export default function USAMap({ className = '', transparent = false, fit = false }: { className?: string; transparent?: boolean; fit?: boolean }) {
  return (
    <figure
      className={`relative ${fit ? 'h-full w-full' : 'w-full aspect-[16/10]'} ${className}`}
      aria-label="Map of the United States showing Levent Marine's Florida operations base and the major US ports served 24/7, with the Gulf Coast highlighted as the primary work area"
    >
      <style>{`
        @keyframes lm-port-pulse {
          0%   { transform: scale(1);   opacity: .85; }
          70%  { transform: scale(2.8); opacity: 0;  }
          100% { transform: scale(2.8); opacity: 0;  }
        }
        @keyframes lm-hq-pulse {
          0%   { transform: scale(1);   opacity: .65; }
          70%  { transform: scale(3.2); opacity: 0;  }
          100% { transform: scale(3.2); opacity: 0;  }
        }
        .lm-port .lm-port-ring {
          transform-box: fill-box; transform-origin: center;
          animation: lm-port-pulse 2.6s cubic-bezier(.4,0,.2,1) infinite;
        }
        .lm-port:nth-child(3n)   .lm-port-ring { animation-delay: .5s; }
        .lm-port:nth-child(3n+1) .lm-port-ring { animation-delay: 1s; }
        .lm-port:nth-child(3n+2) .lm-port-ring { animation-delay: 1.5s; }
        .lm-hq-ring {
          transform-box: fill-box; transform-origin: center;
          animation: lm-hq-pulse 2.6s cubic-bezier(.4,0,.2,1) infinite;
        }
        .lm-port .lm-port-label { opacity: 0; transition: opacity .15s ease-in; pointer-events: none; }
        .lm-port:hover .lm-port-label, .lm-port:focus .lm-port-label { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .lm-port-ring, .lm-hq-ring { animation: none; opacity: 0; }
        }
      `}</style>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="usa-map-title usa-map-desc"
        className={fit ? 'h-full w-full' : 'w-full h-auto'}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="usa-map-title">US Port Coverage Map</title>
        <desc id="usa-map-desc">
          Levent Marine operates from Florida and dispatches to major US ports on every coast. The Gulf Coast — Houston, Galveston, Corpus Christi, New Orleans, Pascagoula, Mobile, Pensacola, Tampa — is the primary work area and is highlighted on the map.
        </desc>

        <defs>
          <linearGradient id="lm-ocean-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="lm-land-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
          <linearGradient id="lm-gulf-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF4DE" />
            <stop offset="100%" stopColor="#FFE9BD" />
          </linearGradient>
          <linearGradient id="lm-fl-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245,165,36,0.55)" />
            <stop offset="100%" stopColor="rgba(245,165,36,0.30)" />
          </linearGradient>
          <radialGradient id="lm-gulf-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(245,165,36,0.40)" />
            <stop offset="60%" stopColor="rgba(245,165,36,0.18)" />
            <stop offset="100%" stopColor="rgba(245,165,36,0.00)" />
          </radialGradient>
        </defs>

        {/* Ocean background (omitted when transparent — map sits on the page) */}
        {!transparent && <rect x="0" y="0" width={W} height={H} fill="url(#lm-ocean-light)" />}

        {/* Gulf primary-area halo — below states, soft amber radial */}
        {GULF_HALO_XY && (
          <ellipse
            cx={GULF_HALO_XY[0]}
            cy={GULF_HALO_XY[1]}
            rx="240"
            ry="120"
            fill="url(#lm-gulf-halo)"
          />
        )}

        {/* States — real geometry, light fills */}
        <g strokeLinejoin="round">
          {STATE_PATHS.map((s) => {
            const fill = s.isFL ? 'url(#lm-fl-light)' : s.isGulf ? 'url(#lm-gulf-land)' : 'url(#lm-land-light)';
            const stroke = s.isFL ? ACCENT : s.isGulf ? 'rgba(245,165,36,0.55)' : 'rgba(11,31,58,0.25)';
            const sw = s.isFL ? 1.6 : s.isGulf ? 1 : 0.7;
            return (
              <path key={s.id} d={s.d} fill={fill} stroke={stroke} strokeWidth={sw}>
                <title>{s.name}</title>
              </path>
            );
          })}
        </g>

        {/* Coast labels — dark on light */}
        <text x="40" y="92" fill="rgba(11,31,58,0.45)" fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="2">PACIFIC</text>
        <text x={W - 40} y="92" fill="rgba(11,31,58,0.45)" fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="2" textAnchor="end">ATLANTIC</text>
        <text x={W / 2 + 40} y={H - 24} fill="rgba(180,120,0,0.85)" fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="2" textAnchor="middle">GULF OF MEXICO · PRIMARY AREA</text>

        {/* Always-on labels for major hubs — leader line + name chip. Drawn
            below the port dots so the dots sit on top of the leader. */}
        <g aria-hidden>
          {PORT_POINTS.filter((p) => p.major).map((p) => {
            const lx = p.lx ?? 22;
            const ly = p.ly ?? -6;
            const labelW = Math.max(80, p.name.length * 6.4 + 14);
            const labelH = 18;
            // Anchor of the label chip
            const ax = p.x + lx;
            const ay = p.y + ly;
            const isGulf = p.region === 'gulf';
            const chipFill = isGulf ? '#FFF7E6' : '#FFFFFF';
            const chipStroke = isGulf ? ACCENT : NAVY;
            return (
              <g key={`lbl-${p.id}`}>
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={ax + (lx < 0 ? labelW : 0)}
                  y2={ay}
                  stroke={isGulf ? 'rgba(179,101,0,0.8)' : 'rgba(11,31,58,0.55)'}
                  strokeWidth="0.9"
                />
                <rect
                  x={ax}
                  y={ay - labelH / 2}
                  width={labelW}
                  height={labelH}
                  rx="3"
                  fill={chipFill}
                  stroke={chipStroke}
                  strokeWidth="0.9"
                />
                <text
                  x={ax + 6}
                  y={ay + 4}
                  fill={isGulf ? '#7A4500' : NAVY}
                  fontSize="10.5"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontWeight="600"
                >
                  {p.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Ports */}
        <g>
          {PORT_POINTS.map((p) => {
            const isGulf = p.region === 'gulf';
            const r  = isGulf ? 4.4 : p.major ? 3.6 : 3;
            const rRing = isGulf ? 5 : p.major ? 4.2 : 3.6;
            return (
              <g
                key={p.id}
                className="lm-port"
                transform={`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`}
                tabIndex={0}
                role="button"
                aria-label={`${p.name} port marker`}
              >
                <circle className="lm-port-ring" cx="0" cy="0" r={rRing} fill={ACCENT} opacity={isGulf ? 0.65 : 0.4} />
                <circle className="lm-port-core" cx="0" cy="0" r={r} fill={ACCENT} stroke={NAVY} strokeWidth="1.2" />
                {/* Hover label — only for non-major ports (majors are already labelled) */}
                {!p.major && (
                  <g className="lm-port-label" transform="translate(9, -9)">
                    <rect x="0" y="-12" width={Math.max(70, p.name.length * 6.2 + 12)} height="18" rx="3" fill="#FFFFFF" stroke={NAVY} strokeWidth="0.8" />
                    <text x="6" y="0" fill={NAVY} fontSize="10.5" fontFamily="Inter, system-ui, sans-serif" fontWeight="600">{p.name}</text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Florida operations HQ — prominent, always labelled */}
        {HQ_XY && (
          <g transform={`translate(${HQ_XY[0].toFixed(1)},${HQ_XY[1].toFixed(1)})`} aria-label="Florida operations headquarters">
            <circle className="lm-hq-ring" cx="0" cy="0" r="7" fill={ACCENT} opacity="0.45" />
            <circle cx="0" cy="0" r="8.5" fill="none" stroke={ACCENT} strokeWidth="1.4" opacity="0.85" />
            <path
              d="M0,-7 L1.9,-2.3 L7,-2.2 L2.9,1 L4.4,6 L0,3 L-4.4,6 L-2.9,1 L-7,-2.2 L-1.9,-2.3 Z"
              fill={ACCENT}
              stroke={NAVY}
              strokeWidth="0.8"
            />
            <g transform="translate(13, -6)">
              <rect x="0" y="-13" width="118" height="32" rx="4" fill="#FFFFFF" stroke={ACCENT} strokeWidth="1" />
              <text x="9" y="-1" fill="#B36500" fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" fontWeight="700" letterSpacing="1">FLORIDA</text>
              <text x="9" y="12" fill={NAVY} fontSize="9" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1">OPERATIONS HQ</text>
            </g>
          </g>
        )}

        {/* Legend */}
        <g transform="translate(24, 36)">
          <path d="M0,-4 L1.4,-1.1 L4.6,-1 L2.1,0.9 L3,4 L0,2.1 L-3,4 L-2.1,0.9 L-4.6,-1 L-1.4,-1.1 Z" fill={ACCENT} />
          <text x="12" y="0" fill={NAVY} fontSize="10.5" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1">FLORIDA BASE</text>
          <circle cx="3.2" cy="16" r="3.2" fill={ACCENT} stroke={NAVY} strokeWidth="1" />
          <text x="12" y="20" fill={NAVY} fontSize="10.5" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1" opacity="0.85">25 PORTS · 24/7 RESPONSE</text>
          <circle cx="3.2" cy="32" r="3.8" fill={ACCENT} stroke={NAVY} strokeWidth="1" />
          <text x="12" y="36" fill="#B36500" fontSize="10.5" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1" fontWeight="700">GULF — PRIMARY AREA</text>
        </g>
      </svg>

      <figcaption className="sr-only">
        Levent Marine is based in Florida and routinely dispatches an engineer or ships AOG parts to 25 US
        ports: New York/NJ, Boston, Norfolk, Charleston, Savannah, Jacksonville, Miami/Port Everglades, Tampa,
        Pensacola, Mobile, Pascagoula, New Orleans, Houston, Galveston, Corpus Christi, Long Beach, Los Angeles,
        Oakland, Seattle, Tacoma, Portland, Duluth, Cleveland, Anchorage and Honolulu. The Gulf Coast is the
        primary work area.
      </figcaption>
    </figure>
  );
}
