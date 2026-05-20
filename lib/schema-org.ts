import { SITE } from './site';

/** Organization + ProfessionalService — emit once on the root layout. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.legalName,
    alternateName: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
    logo: `${SITE.url}/assets/logo.svg`,
    image: `${SITE.url}/assets/brand/og-image.jpg`,
    telephone: SITE.phoneUS,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.addressUS.street,
      addressLocality: SITE.addressUS.city,
      addressRegion: SITE.addressUS.state,
      postalCode: SITE.addressUS.zip,
      addressCountry: SITE.addressUS.country
    },
    areaServed: 'Worldwide',
    serviceType: [
      'Marine Electrical Repair',
      'Marine Technical Parts Supply',
      'Ship Fault Response',
      'Generator & Switchboard Service',
      'Navigation & GMDSS Service',
      'Automation & Control',
      'Commissioning & Retrofit',
      'Testing & Reporting',
      'Insulation & Hidden-Fault Diagnostics'
    ]
  };
}

export function localBusinessSchema(opts: {
  name: string;
  city: string;
  state: string;
  serviceArea: string[];
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: opts.city,
      addressRegion: opts.state,
      addressCountry: 'US'
    },
    areaServed: opts.serviceArea.map((c) => ({
      '@type': 'City',
      name: c
    })),
    telephone: SITE.phoneUS,
    priceRange: '$$'
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
    serviceType: opts.name,
    areaServed: 'Worldwide'
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url
    }))
  };
}
