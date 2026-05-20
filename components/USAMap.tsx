'use client';

/**
 * USA Map — Inline SVG with 25 major US port markers as pulsing dots.
 *
 * Uses the Albers USA approximation; coordinates are tuned to the simplified
 * outline below. Markers carry hover tooltip showing port name + region.
 *
 * Palette: amber pulse on navy gradient background. No external deps —
 * pure SVG + Tailwind. Responsive: 100% width, max-h-[60vh].
 */

const PORTS: Array<{ id: string; name: string; coast: 'east' | 'west' | 'gulf' | 'lakes' | 'noncontig'; x: number; y: number }> = [
  // East Coast
  { id: 'nynj',       name: 'New York / NJ',        coast: 'east', x: 815, y: 215 },
  { id: 'boston',     name: 'Boston',               coast: 'east', x: 845, y: 175 },
  { id: 'norfolk',    name: 'Norfolk',              coast: 'east', x: 800, y: 270 },
  { id: 'charleston', name: 'Charleston',           coast: 'east', x: 770, y: 360 },
  { id: 'savannah',   name: 'Savannah',             coast: 'east', x: 765, y: 380 },
  { id: 'jax',        name: 'Jacksonville',         coast: 'east', x: 770, y: 410 },
  { id: 'miami',      name: 'Miami',                coast: 'east', x: 795, y: 478 },
  { id: 'tampa',      name: 'Tampa',                coast: 'east', x: 755, y: 455 },
  // Gulf Coast
  { id: 'pensacola',  name: 'Pensacola',            coast: 'gulf', x: 660, y: 415 },
  { id: 'pascagoula', name: 'Pascagoula',           coast: 'gulf', x: 620, y: 420 },
  { id: 'mobile',     name: 'Mobile',               coast: 'gulf', x: 635, y: 415 },
  { id: 'nola',       name: 'New Orleans',          coast: 'gulf', x: 590, y: 425 },
  { id: 'houston',    name: 'Houston',              coast: 'gulf', x: 500, y: 440 },
  { id: 'galveston',  name: 'Galveston',            coast: 'gulf', x: 510, y: 450 },
  { id: 'corpus',     name: 'Corpus Christi',       coast: 'gulf', x: 475, y: 470 },
  // West Coast
  { id: 'longbeach',  name: 'Long Beach',           coast: 'west', x: 130, y: 350 },
  { id: 'la',         name: 'Los Angeles',          coast: 'west', x: 125, y: 345 },
  { id: 'oakland',    name: 'Oakland',              coast: 'west', x: 95,  y: 270 },
  { id: 'seattle',    name: 'Seattle',              coast: 'west', x: 165, y: 90  },
  { id: 'tacoma',     name: 'Tacoma',               coast: 'west', x: 165, y: 105 },
  { id: 'portland',   name: 'Portland',             coast: 'west', x: 145, y: 130 },
  // Great Lakes
  { id: 'duluth',     name: 'Duluth',               coast: 'lakes', x: 545, y: 130 },
  { id: 'cleveland',  name: 'Cleveland',            coast: 'lakes', x: 720, y: 200 },
  // Alaska / Hawaii callouts
  { id: 'anchorage',  name: 'Anchorage (AK)',       coast: 'noncontig', x: 90,  y: 510 },
  { id: 'honolulu',   name: 'Honolulu (HI)',        coast: 'noncontig', x: 195, y: 510 }
];

const ACCENT = '#F5A524';

export default function USAMap({ className = '' }: { className?: string }) {
  return (
    <figure
      className={`relative w-full max-h-[60vh] ${className}`}
      aria-label="Map showing 25 major US ports served by Levent Marine"
    >
      <style>{`
        @keyframes lm-port-pulse {
          0%   { transform: scale(1);   opacity: .9; }
          70%  { transform: scale(2.6); opacity: 0;  }
          100% { transform: scale(2.6); opacity: 0;  }
        }
        .lm-port .lm-port-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: lm-port-pulse 2.4s cubic-bezier(.4,0,.2,1) infinite;
        }
        .lm-port:nth-child(3n)   .lm-port-ring { animation-delay: .4s; }
        .lm-port:nth-child(3n+1) .lm-port-ring { animation-delay: .8s; }
        .lm-port:nth-child(3n+2) .lm-port-ring { animation-delay: 1.2s; }
        .lm-port .lm-port-label {
          opacity: 0;
          transition: opacity .15s ease-in;
          pointer-events: none;
        }
        .lm-port:hover .lm-port-label,
        .lm-port:focus .lm-port-label { opacity: 1; }
        .lm-port:hover .lm-port-core { fill: #fff; }
      `}</style>

      <svg
        viewBox="0 0 960 560"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="usa-map-title usa-map-desc"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="usa-map-title">US Port Coverage Map</title>
        <desc id="usa-map-desc">
          Twenty-five US ports — East Coast, West Coast, Gulf, Great Lakes, plus Anchorage and Honolulu — served 24/7 by Levent Marine.
        </desc>

        <defs>
          <linearGradient id="lm-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#0B1F3A" />
            <stop offset="100%" stopColor="#13345F" />
          </linearGradient>
          <linearGradient id="lm-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#13345F" />
          </linearGradient>
        </defs>

        {/* Ocean background */}
        <rect x="0" y="0" width="960" height="560" fill="url(#lm-ocean)" />

        {/* Subtle latitude/longitude grid */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
          {[80, 160, 240, 320, 400, 480].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="960" y2={y} />
          ))}
          {[120, 240, 360, 480, 600, 720, 840].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="560" />
          ))}
        </g>

        {/* Continental USA — stylised simplified outline */}
        <g fill="url(#lm-land)" stroke="rgba(245,165,36,0.35)" strokeWidth="1.2" strokeLinejoin="round">
          <path d="
            M 75 95
            L 170 80
            L 260 85
            L 340 95
            L 430 90
            L 540 95
            L 640 110
            L 740 130
            L 820 150
            L 870 180
            L 875 215
            L 850 240
            L 830 260
            L 815 280
            L 800 305
            L 800 340
            L 780 375
            L 760 405
            L 770 430
            L 800 460
            L 805 485
            L 780 482
            L 730 460
            L 685 440
            L 640 430
            L 580 435
            L 520 450
            L 465 470
            L 410 460
            L 355 440
            L 300 430
            L 245 420
            L 195 405
            L 155 380
            L 125 345
            L 105 305
            L 90 270
            L 80 235
            L 70 195
            L 60 155
            L 65 120
            Z
          "/>
          <path d="
            M 750 405
            L 765 425
            L 780 460
            L 795 485
            L 805 480
            L 800 450
            L 785 425
            L 770 408
            Z
          "/>
        </g>

        {/* Alaska callout */}
        <g fill="url(#lm-land)" stroke="rgba(245,165,36,0.35)" strokeWidth="1.2">
          <path d="
            M 30 475
            L 90 470
            L 145 480
            L 165 500
            L 150 525
            L 110 535
            L 65 530
            L 40 510
            Z
          "/>
          <text x="35" y="468" fill="#94A6BD" fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1">AK</text>
        </g>

        {/* Hawaii callout */}
        <g fill="url(#lm-land)" stroke="rgba(245,165,36,0.35)" strokeWidth="1.2">
          <circle cx="180" cy="500" r="4" />
          <circle cx="190" cy="510" r="5" />
          <circle cx="205" cy="515" r="6" />
          <circle cx="220" cy="520" r="4" />
          <text x="175" y="488" fill="#94A6BD" fontSize="11" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1">HI</text>
        </g>

        {/* Coast labels */}
        <text x="60"  y="60"  fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="2">PACIFIC</text>
        <text x="850" y="60"  fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="2" textAnchor="end">ATLANTIC</text>
        <text x="540" y="540" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="2" textAnchor="middle">GULF OF MEXICO</text>

        {/* Ports */}
        <g>
          {PORTS.map((p) => (
            <g
              key={p.id}
              className="lm-port"
              transform={`translate(${p.x},${p.y})`}
              tabIndex={0}
              role="button"
              aria-label={`${p.name} port marker`}
            >
              <circle
                className="lm-port-ring"
                cx="0"
                cy="0"
                r="4"
                fill={ACCENT}
                opacity="0.55"
              />
              <circle
                className="lm-port-core"
                cx="0"
                cy="0"
                r="3.2"
                fill={ACCENT}
                stroke="#0B1F3A"
                strokeWidth="1.2"
              />
              <g className="lm-port-label" transform="translate(8, -8)">
                <rect
                  x="0"
                  y="-12"
                  width={Math.max(70, p.name.length * 6.2 + 12)}
                  height="18"
                  rx="3"
                  fill="#0B1F3A"
                  stroke="#F5A524"
                  strokeWidth="0.8"
                />
                <text
                  x="6"
                  y="0"
                  fill="#fff"
                  fontSize="10"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontWeight="600"
                >
                  {p.name}
                </text>
              </g>
            </g>
          ))}
        </g>

        {/* Legend */}
        <g transform="translate(20, 540)">
          <circle cx="6" cy="-4" r="3.2" fill="#F5A524" stroke="#0B1F3A" strokeWidth="1" />
          <text x="16" y="0" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="ui-monospace, JetBrains Mono, monospace" letterSpacing="1">
            25 PORTS — 24/7 ENGINEER RESPONSE
          </text>
        </g>
      </svg>

      <figcaption className="sr-only">
        Pulsing markers indicate the 25 US ports where Levent Marine routinely dispatches an engineer or
        ships AOG parts: New York/NJ, Boston, Norfolk, Charleston, Savannah, Jacksonville, Miami, Tampa,
        Pensacola, Pascagoula, Mobile, New Orleans, Houston, Galveston, Corpus Christi, Long Beach, Los Angeles,
        Oakland, Seattle, Tacoma, Portland, Duluth, Cleveland, Anchorage, Honolulu.
      </figcaption>
    </figure>
  );
}
