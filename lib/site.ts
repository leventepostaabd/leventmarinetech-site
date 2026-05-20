/** Site-wide constants reused in metadata, header, schema.org */
export const SITE = {
  name: 'Levent Marine',
  legalName: 'Levent Marine Electro Technical Services LLC',
  tagline: 'Marine Electrical Service & Parts Supply',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leventmarinetech.com',
  email: 'info@leventmarinetech.com',
  phoneUS: '+1 619 384 0403',
  phoneTR: '+90 537 650 7776',
  whatsappUS: 'https://wa.me/16193840403',
  whatsappTR: 'https://wa.me/905376507776',
  addressUS: {
    street: '32 N Gould St',
    city: 'Sheridan',
    state: 'WY',
    zip: '82801',
    country: 'US'
  },
  addressTR: {
    street: 'Velibaba Mah. No:1',
    city: 'Pendik',
    region: 'Istanbul',
    country: 'TR'
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
  { label: 'USA',         href: '/usa',               primary: false },
  { label: 'Services',    href: '/services',          primary: false },
  { label: 'About',       href: '/about',             primary: false },
  { label: 'Contact',     href: '/contact',           primary: false }
] as const;

export const SERVICE_SLUGS = [
  'power-distribution',
  'propulsion-motors',
  'navigation-gmdss',
  'automation-control',
  'safety-systems',
  'lighting-nav-lights',
  'testing-certification',
  'commissioning-retrofit',
  'emergency-remote-eto',
  'survey-psc-prep',
  'insulation-diagnostics'
] as const;

export const REGION_SLUGS = [
  'houston-marine-electrical',
  'new-york-nj-marine-electrical',
  'long-beach-marine-electrical'
] as const;
