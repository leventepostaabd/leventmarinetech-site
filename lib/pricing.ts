/**
 * Estimated price + delivery calculator for supply RFQs.
 *
 * Per 2026-05-21 conversation:
 *   - eBay item price × 1.30 (30 % flat markup)
 *   - Outbound shipping baseline from Florida (varies by US coast)
 *   - AOG dispatch: +$150 flat per shipment + $45 per express package
 *
 * Every figure surfaces with a "Final price confirmed within 30 min"
 * disclaimer; we never sell off these numbers directly — they're an
 * estimate so the customer can decide whether to add to RFQ.
 */

export const MARKUP_RATE = 0.30;

export const SHIPPING_BASELINE = {
  east:          35,  // Miami, NY/NJ, Norfolk, Savannah, Houston, New Orleans
  west:          65,  // LA, Long Beach, Seattle, Oakland
  other:         95,  // Anchorage, Honolulu, Great Lakes
  international: null // quoted separately
} as const;

export const DEFAULT_SHIPPING = 45;

// AOG: rush handling fee + express courier per package
export const AOG_DISPATCH_FEE = 150;
export const AOG_EXPRESS_PER_PACKAGE = 45;

export type Coast = keyof typeof SHIPPING_BASELINE;

/** Map a US port name (free text) to a coast tier. Loose matching. */
export function portToCoast(port: string | undefined | null): Coast | null {
  if (!port) return null;
  const p = port.toLowerCase();
  // West-coast keywords
  if (/(los angeles|long beach|oakland|seattle|portland|san diego|san francisco|tacoma|hueneme)/i.test(p)) return 'west';
  // East / Gulf
  if (/(miami|new york|nyc|nj|newark|norfolk|savannah|houston|new orleans|charleston|jacksonville|tampa|baltimore|boston|philadelphia|mobile|galveston)/i.test(p)) return 'east';
  // Alaska / Hawaii / Great Lakes / overseas
  if (/(anchorage|alaska|honolulu|hawaii|duluth|chicago|guam)/i.test(p)) return 'other';
  if (/(rotterdam|hamburg|antwerp|singapore|piraeus|gibraltar|istanbul|izmir|fujairah|jebel ali)/i.test(p)) return 'international';
  return null;
}

export function shippingFor(coast: Coast | null): number | null {
  if (!coast) return DEFAULT_SHIPPING;
  const s = SHIPPING_BASELINE[coast];
  return s === null ? null : s;
}

export type Urgency = 'aog' | 'urgent' | 'planned';

export type LineEstimate = {
  unitPrice: number;     // eBay raw price (USD) — for transparency
  unitMarked: number;    // unitPrice × (1 + markup)
  quantity: number;
  itemTotal: number;     // unitMarked × quantity
  shipping: number;      // baseline by coast (or default)
  aogFee: number;        // 0 unless urgency = 'aog'
  total: number;
  coast: Coast | null;
  urgency: Urgency;
  shippingTextEn: string;
  shippingTextTr: string;
  deliveryEn: string;
  deliveryTr: string;
};

export function estimateLine(opts: {
  unitPrice: number;
  quantity?: number;
  port?: string;
  urgency?: Urgency;
  packagesForAog?: number;
}): LineEstimate {
  const quantity = Math.max(1, opts.quantity ?? 1);
  const urgency = opts.urgency ?? 'planned';
  const coast = portToCoast(opts.port);

  const unitMarked = round2(opts.unitPrice * (1 + MARKUP_RATE));
  const itemTotal = round2(unitMarked * quantity);
  const shipping = shippingFor(coast) ?? DEFAULT_SHIPPING;
  const aogFee =
    urgency === 'aog'
      ? AOG_DISPATCH_FEE + AOG_EXPRESS_PER_PACKAGE * Math.max(1, opts.packagesForAog ?? 1)
      : 0;
  const total = round2(itemTotal + shipping + aogFee);

  const deliveryEn =
    urgency === 'aog'
      ? coast === 'west' ? '2–4 days · AOG express' : '24–48 h · AOG express'
      : coast === 'west' ? '6–10 days to US West'
      : coast === 'other' ? '8–14 days'
      : coast === 'international' ? 'Quoted separately'
      : '4–7 days to US East / Gulf';
  const deliveryTr =
    urgency === 'aog'
      ? coast === 'west' ? '2–4 gün · AOG express' : '24–48 saat · AOG express'
      : coast === 'west' ? 'ABD Batı sahili 6–10 gün'
      : coast === 'other' ? '8–14 gün'
      : coast === 'international' ? 'Ayrı teklif edilir'
      : 'ABD Doğu / Körfez 4–7 gün';

  const shippingTextEn =
    coast === 'west' ? 'FL → US West'
    : coast === 'other' ? 'FL → US other'
    : coast === 'international' ? 'International'
    : 'FL → US East/Gulf';
  const shippingTextTr =
    coast === 'west' ? 'FL → ABD Batı'
    : coast === 'other' ? 'FL → ABD Diğer'
    : coast === 'international' ? 'Uluslararası'
    : 'FL → ABD Doğu/Körfez';

  return {
    unitPrice: round2(opts.unitPrice),
    unitMarked,
    quantity,
    itemTotal,
    shipping,
    aogFee,
    total,
    coast,
    urgency,
    shippingTextEn,
    shippingTextTr,
    deliveryEn,
    deliveryTr
  };
}

/**
 * Aggregate estimate across multiple lines (RFQ basket). AOG fee is
 * applied once per dispatch (not per item) — that's the whole point of
 * the hybrid model.
 */
export function estimateBasket(opts: {
  lines: { unitPrice: number; quantity: number }[];
  port?: string;
  urgency?: Urgency;
  packagesForAog?: number; // physical box count if AOG, default 1
}) {
  const urgency = opts.urgency ?? 'planned';
  const coast = portToCoast(opts.port);
  const itemTotal = round2(
    opts.lines.reduce((sum, l) => sum + l.unitPrice * (1 + MARKUP_RATE) * Math.max(1, l.quantity), 0)
  );
  const shipping = shippingFor(coast) ?? DEFAULT_SHIPPING;
  const aogFee =
    urgency === 'aog'
      ? AOG_DISPATCH_FEE + AOG_EXPRESS_PER_PACKAGE * Math.max(1, opts.packagesForAog ?? 1)
      : 0;
  const total = round2(itemTotal + shipping + aogFee);
  return { itemTotal, shipping, aogFee, total, coast, urgency };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** USD formatter, no rounding (figures already round2). */
export function fmt(n: number, locale: 'en' | 'tr' = 'en') {
  return new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n >= 100 ? 0 : 2
  }).format(n);
}
