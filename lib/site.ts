/** Site-wide constants reused in metadata, header, schema.org */
export const SITE = {
  name: 'Levent Marine',
  legalName: 'Levent Marine Electro Technical Services LLC',
  tagline: 'Marine Electrical Service & Parts Supply',
  slogan: 'Marine Electrical Service & Parts Supply — 24/7 Worldwide',
  position: 'Florida-based operations · Wyoming LLC',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leventmarinetech.com',
  email: 'info@leventmarinetech.com',
  phone: '+1 619 384 04 03',
  phoneUS: '+1 619 384 04 03',
  whatsapp: 'https://wa.me/16193840403',
  whatsappUS: 'https://wa.me/16193840403',
  address: {
    street: '32 N Gould St',
    city: 'Sheridan',
    state: 'WY',
    zip: '82801',
    country: 'US'
  },
  addressUS: {
    street: '32 N Gould St',
    city: 'Sheridan',
    state: 'WY',
    zip: '82801',
    country: 'US'
  },
  trust: {
    vessels: '247+',
    years: '12',
    response: '4h',
    network: '60+'
  }
} as const;

export const NAV = [
  { label: 'Service',     href: '/service-wizard',    primary: true  },
  { label: 'Supply',      href: '/supply',            primary: true  },
  { label: 'Services',    href: '/services',          primary: false },
  { label: 'About',       href: '/about',             primary: false },
  { label: 'Contact',     href: '/contact',           primary: false }
] as const;

// SERVICE_SLUGS removed — services now drive off content/services.json via readServices()
// (see Agent B's lib/content.ts helpers).
// REGION_SLUGS removed — Q14 decision: no /usa regional pages, single "all US ports" message.
