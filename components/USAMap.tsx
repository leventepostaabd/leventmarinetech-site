import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import statesTopo from 'us-atlas/states-10m.json';

/**
 * USAMap — professional US coverage map.
 *
 * Real state geometry (us-atlas 10m TopoJSON) projected with d3 geoAlbersUsa.
 * All geometry is computed at render time on the server (this is a server
 * component — no hooks, no client JS), so d3-geo never ships to the browser;
 * only the resulting static SVG + CSS animations do.
 *
 * Florida is the operations base, so its state shape is filled amber and
 * carries a prominent HQ marker. Major US ports are projected from real
 * lat/long and shown as pulsing amber dots with hover labels.
 */

const W = 960;
const H = 600;

// Territory FIPS to drop (Albers USA only lays out the 50 states + DC).
const SKIP_FIPS = new Set(['60', '66', '69', '72', '78']);
const FL_FIPS = '12';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  d: pathGen(f as any) || ''
}));

const project = (lng: number, lat: number): [number, number] | null => {
  const r = projection([lng, lat]);
  return r ? [r[0], r[1]] : null;
};

const ACCENT = '#F5A524';

type Port = { id: string; name: string; lng: number; lat: number; fl?: boolean };

const PORTS: Port[] = [
  // East Coast
  { id: 'nynj', name: 'New York / NJ', lng: -74.04, lat: 40.67 },
  { id: 'boston', name: 'Boston', lng: -71.05, lat: 42.36 },
  { id: 'norfolk', name: 'Norfolk', lng: -76.3, lat: 36.92 },
  { id: 'charleston', name: 'Charleston', lng: -79.93, lat: 32.78 },
  { id: 'savannah', name: 'Savannah', lng: -81.1, lat: 32.08 },
  { id: 'jax', name: 'Jacksonville', lng: -81.66, lat: 30.33, fl: true },
  { id: 'tampa', name: 'Tampa', lng: -82.46, lat: 27.95, fl: true },
  { id: 'miami', name: 'Miami / Port Everglades', lng: -80.16, lat: 25.95, fl: true },
  // Gulf Coast
  { id: 'pensacola', name: 'Pensacola', lng: -87.21, lat: 30.42, fl: true },
  { id: 'mobile', name: 'Mobile', lng: -88.04, lat: 30.69 },
  { id: 'pascagoula', name: 'Pascagoula', lng: -88.56, lat: 30.36 },
  { id: 'nola', name: 'New Orleans', lng: -90.07, lat: 29.95 },
  { id: 'houston', name: 'Houston', lng: -95.3, lat: 29.76 },
  { id: 'galveston', name: 'Galveston', lng: -94.8, lat: 29.3 },
  { id: 'corpus', name: 'Corpus Christi', lng: -97.4, lat: 27.8 },
  // West Coast
  { id: 'longbeach', name: 'Long Beach', lng: -118.19, lat: 33.75 },
  { id: 'la', name: 'Los Angeles', lng: -118.27, lat: 33.74 },
  { id: 'oakland', name: 'Oakland', lng: -122.27, lat: 37.8 },
  { id: 'seattle', name: 'Seattle', lng: -122.34, lat: 47.6 },
  { id: 'tacoma', name: 'Tacoma', lng: -122.44, lat: 47.25 },
  { id: 'portland', name: 'Portland', lng: -122.68, lat: 45.52 },
  // Great Lakes
  { id: 'duluth', name: 'Duluth', lng: -92.1, lat: 46.79 },
  { id: 'cleveland', name: 'Cleveland', lng: -81.69, lat: 41.5 },
  // Alaska / Hawaii (Albers USA insets)
  { id: 'anchorage', name: 'Anchorage (AK)', lng: -149.9, lat: 61.22 },
  { id: 'honolulu', name: 'Honolulu (HI)', lng: -157.86, lat: 21.31 }
];

const PORT_POINTS = PORTS.map((p) => {
  const xy = project(p.lng, p.lat);
  return xy ? { ...p, x: xy[0], y: xy[1] } : null;
}).filter((p): p is Port & { x: number; y: number } => p !== null);

// Florida operations HQ — central peninsula. Exact street address TBD.
const HQ_XY = project(-81.4, 28.1);

export default function USAMap({ className = '' }: { className?: string }) {
  return (
    <figure
      className={`relative w-full max-h-[62vh] ${className}`}
      aria-label="Map of the United States showing Levent Marine's Florida operations base and the major US ports served 24/7"
    >
      <style>{`
        @keyframes lm-port-pulse {
          0%   { transform: scale(1);   opacity: .85; }
          70%  { transform: scale(2.8); opacity: 0;  }
          100% { transform: scale(2.8); opacity: 0;  }
        }
        @keyframes lm-hq-pulse {
          0%   { transform: scale(1);   opacity: .7; }
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
        .lm-port:hover .lm-port-core { fill: #fff; }
        @media (prefers-reduced-motion: reduce) {
          .lm-port-ring, .lm-hq-ring { animation: none; opacity: 0; }
        }
      `}</style>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="usa-map-title usa-map-desc"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="usa-map-title">US Port Coverage Map</title>
        <desc id="usa-map-desc">
          Levent Marine operates from Florida and dispatches to major US ports on every coast — East, Gulf, West, Great Lakes, plus Anchorage and Honolulu — 24/7.
        </desc>

        <defs>
          <linearGradient id="lm-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1F3A" />
            <stop offset="100%" stopColor="#0E2748" />
          </linearGradient>
          <linearGradient id="lm-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#21436E" />
            <stop offset="100%" stopColor="#18365C" />
          </linearGradient>
          <linearGradient id="lm-fl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245,165,36,0.42)" />
            <stop offset="100%" stopColor="rgba(245,165,36,0.22)" />
          </linearGradient>
        </defs>

        {/* Ocean */}
        <rect x="0" y="0" width={W} height={H} fill="url(#lm-ocean)" />

        {/* Subtle graticule */}
        <g stroke="rgba(255,255,255,0.035)" strokeWidth="1">
          {[80, 160, 240, 320, 400, 480, 560].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2={W} y2={y} />
          ))}
          {[120, 240, 360, 480, 600, 720, 840].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2={H} />
          ))}
        </g>

        {/* States — real geometry */}
        <g strokeLinejoin="round">
          {STATE_PATHS.map((s) => (
            <path
              key={s.id}
              d={s.d}
              fill={s.isFL ? 'url(#lm-fl)' : 'url(#lm-land)'}
              stroke={s.isFL ? ACCENT : 'rgba(255,255,255,0.16)'}
              strokeWidth={s.isFL ? 1.6 : 0.7}
            >
              <title>{s.name}</title>
            </path>
          ))}
        </g>

        {/* Coast labels */}
        <text x="40" y="92" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="2">PACIFIC</text>
        <text x={W - 40} y="92" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="2" textAnchor="end">ATLANTIC</text>
        <text x={W / 2 + 40} y={H - 24} fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="2" textAnchor="middle">GULF OF MEXICO</text>

        {/* Ports */}
        <g>
          {PORT_POINTS.map((p) => (
            <g
              key={p.id}
              className="lm-port"
              transform={`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`}
              tabIndex={0}
              role="button"
              aria-label={`${p.name} port marker`}
            >
              <circle className="lm-port-ring" cx="0" cy="0" r="3.6" fill={ACCENT} opacity="0.5" />
              <circle className="lm-port-core" cx="0" cy="0" r="3" fill={ACCENT} stroke="#0B1F3A" strokeWidth="1.1" />
              <g className="lm-port-label" transform="translate(9, -9)">
                <rect x="0" y="-12" width={Math.max(70, p.name.length * 6.2 + 12)} height="18" rx="3" fill="#0B1F3A" stroke={ACCENT} strokeWidth="0.8" />
                <text x="6" y="0" fill="#fff" fontSize="10.5" fontFamily="Inter, system-ui, sans-serif" fontWeight="600">{p.name}</text>
              </g>
            </g>
          ))}
        </g>

        {/* Florida operations HQ — prominent, always labelled */}
        {HQ_XY && (
          <g transform={`translate(${HQ_XY[0].toFixed(1)},${HQ_XY[1].toFixed(1)})`} aria-label="Florida operations headquarters">
            <circle className="lm-hq-ring" cx="0" cy="0" r="7" fill={ACCENT} opacity="0.45" />
            <circle cx="0" cy="0" r="8.5" fill="none" stroke={ACCENT} strokeWidth="1.4" opacity="0.7" />
            {/* Star */}
            <path
              d="M0,-7 L1.9,-2.3 L7,-2.2 L2.9,1 L4.4,6 L0,3 L-4.4,6 L-2.9,1 L-7,-2.2 L-1.9,-2.3 Z"
              fill={ACCENT}
              stroke="#0B1F3A"
              strokeWidth="0.8"
            />
            <g transform="translate(13, -6)">
              <rect x="0" y="-13" width="118" height="32" rx="4" fill="#0B1F3A" stroke={ACCENT} strokeWidth="1" />
              <text x="9" y="-1" fill={ACCENT} fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" fontWeight="700" letterSpacing="1">FLORIDA</text>
              <text x="9" y="12" fill="rgba(255,255,255,0.85)" fontSize="9" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1">OPERATIONS HQ</text>
            </g>
          </g>
        )}

        {/* Legend */}
        <g transform="translate(24, 36)">
          <path d="M0,-4 L1.4,-1.1 L4.6,-1 L2.1,0.9 L3,4 L0,2.1 L-3,4 L-2.1,0.9 L-4.6,-1 L-1.4,-1.1 Z" fill={ACCENT} />
          <text x="12" y="0" fill="rgba(255,255,255,0.75)" fontSize="10.5" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1">FLORIDA BASE</text>
          <circle cx="3.2" cy="16" r="3.2" fill={ACCENT} stroke="#0B1F3A" strokeWidth="1" />
          <text x="12" y="20" fill="rgba(255,255,255,0.6)" fontSize="10.5" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1">25 PORTS · 24/7 RESPONSE</text>
        </g>
      </svg>

      <figcaption className="sr-only">
        Levent Marine is based in Florida and routinely dispatches an engineer or ships AOG parts to 25 US
        ports: New York/NJ, Boston, Norfolk, Charleston, Savannah, Jacksonville, Tampa, Miami/Port Everglades,
        Pensacola, Mobile, Pascagoula, New Orleans, Houston, Galveston, Corpus Christi, Long Beach, Los Angeles,
        Oakland, Seattle, Tacoma, Portland, Duluth, Cleveland, Anchorage and Honolulu.
      </figcaption>
    </figure>
  );
}
