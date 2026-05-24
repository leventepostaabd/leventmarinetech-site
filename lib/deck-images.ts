/**
 * Deck image registry — central mapping from service / supply slug to the
 * vertical brochure image shipped in /public. Used by:
 *   - /services and /service-wizard right column deck
 *   - /supply right column deck
 *   - /services/[slug] detail page hero
 *   - /supply/category/[slug] detail page hero
 *
 * Keep this file in sync with the artwork in /public/services and /public/supply.
 */

export const SERVICE_IMAGE: Record<string, string> = {
  'bwts':                 '/services/bwts.webp',
  'engine-room-alarm':    '/services/condition.webp',
  'crane-deck-machinery': '/services/cranes.webp',
  'fire-alarm':           '/services/firealarm.webp',
  'generator':            '/services/gensyc.webp',
  'ac-dc-motor':          '/services/motor.webp',
  'plc-automation':       '/services/plc.webp',
  'switchboard':          '/services/thermal.webp'
};

export const SUPPLY_IMAGE: Record<string, string> = {
  'cables-glands':           '/supply/cableconnectsupply.webp',
  'deck-mechanical':         '/supply/cranesupply.webp',
  'engine-room-consumables': '/supply/enginesupply.webp',
  'msb-components':          '/supply/mainswitchboardcomp.webp',
  'motors-drives':           '/supply/motorsupply.webp',
  'radar-navigation':        '/supply/navisupply.webp',
  'automation-plc':          '/supply/plcsupply.webp',
  'marine-sensors':          '/supply/sensorsupply.webp'
};

export function serviceImage(slug: string): string | undefined {
  return SERVICE_IMAGE[slug];
}

export function supplyImage(slug: string): string | undefined {
  return SUPPLY_IMAGE[slug];
}
