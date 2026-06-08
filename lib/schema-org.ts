import { SITE } from './site';

/**
 * Organization + LocalBusiness — emitted once from the root layout.
 *
 * Per DECISIONS.md (P1/P2/P3): Florida-based ops surface, Wyoming LLC stays
 * in the legal fine print, no TR contact details are exposed to crawlers.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${SITE.url}#organization`,
    name: SITE.legalName,
    alternateName: SITE.name,
    description: `${SITE.tagline} — 24/7 Worldwide. Florida-based, Wyoming-registered marine electrical service desk and technical parts supplier.`,
    url: SITE.url,
    logo: `${SITE.url}/assets/logo.svg`,
    image: `${SITE.url}/assets/brand/og-image.jpg`,
    telephone: SITE.phoneUS,
    email: SITE.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.addressUS.street,
      addressLocality: SITE.addressUS.city,
      addressRegion: SITE.addressUS.state,
      postalCode: SITE.addressUS.zip,
      addressCountry: SITE.addressUS.country
    },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Place',   name: 'Worldwide' }
    ],
    serviceArea: {
      '@type': 'AdministrativeArea',
      name: 'United States (all major ports) + worldwide attendance on request'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59'
      }
    ],
    sameAs: [
      'https://www.linkedin.com/company/levent-marine',
      'https://www.facebook.com/leventmarine'
    ],
    knowsAbout: [
      'Marine Electrical Service',
      'Ship Electrical Repair',
      'Generator and AVR Diagnostics',
      'Switchboard (MSB / ESB) Service',
      'Ballast Water Treatment System (BWTS)',
      'Bridge Navigation (Radar, ECDIS, Gyro, Autopilot)',
      'GMDSS Communications',
      'PLC and Automation (IAS)',
      'Marine Lighting and Navigation Lights',
      'Marine HVAC Automation',
      "Class Survey Preparation (DNV, BV, ABS, Lloyd's, TL, RINA, ClassNK, IRS)",
      'AOG (Aircraft on Ground) equivalent for vessels'
    ],
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

/**
 * LocalBusiness — used by region landing pages where we want to anchor a
 * sub-area page to a city. Wyoming HQ stays the parent organization;
 * regional pages declare a coverage city without claiming a physical office.
 */
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
    parentOrganization: { '@id': `${SITE.url}#organization` },
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

/**
 * Service — generator for system-level landing pages.
 */
export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType ?? opts.name,
    category: opts.category ?? 'Marine Electrical Service',
    provider: { '@id': `${SITE.url}#organization` },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Place',   name: 'Worldwide' }
    ],
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Commercial vessel owners and technical superintendents'
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD' },
      url: opts.url
    }
  };
}

/**
 * Product — generator for the supply catalogue. Marine spares are quoted on
 * RFQ (decision F3 / T3) so we do not publish a price — only currency and
 * availability hint. Brand and SKU pass through from products.json.
 */
export function productSchema(opts: {
  name: string;
  description: string;
  url: string;
  brand?: string;
  sku?: string;
  category?: string;
  image?: string;
  availability?: 'InStock' | 'PreOrder' | 'OutOfStock' | 'BackOrder';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    brand: opts.brand ? { '@type': 'Brand', name: opts.brand } : undefined,
    sku: opts.sku,
    category: opts.category,
    image: opts.image,
    offers: {
      '@type': 'Offer',
      url: opts.url,
      priceCurrency: 'USD',
      availability: `https://schema.org/${opts.availability ?? 'InStock'}`,
      seller: { '@id': `${SITE.url}#organization` },
      itemCondition: 'https://schema.org/NewCondition',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        valueAddedTaxIncluded: false
      }
    }
  };
}

/**
 * BlogPosting — generator for /knowledge/[slug]. Author defaults to the
 * organization until we publish individual author bylines.
 */
export function blogPostingSchema(opts: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  wordCount?: number;
  keywords?: string[];
  inLanguage?: string;
}) {
  const url = `${SITE.url}/knowledge/${opts.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: opts.title,
    description: opts.description,
    url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    image: opts.image ?? `${SITE.url}/assets/brand/og-image.jpg`,
    author: {
      '@type': 'Organization',
      name: opts.author ?? SITE.legalName,
      url: SITE.url
    },
    publisher: { '@id': `${SITE.url}#organization` },
    inLanguage: opts.inLanguage ?? 'en-US',
    wordCount: opts.wordCount,
    keywords: opts.keywords?.join(', ')
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

/**
 * FAQPage — used by Knowledge posts that include a Q&A section.
 */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer }
    }))
  };
}
