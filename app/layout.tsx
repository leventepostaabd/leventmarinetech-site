import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileActionBar from '@/components/MobileActionBar';
import FloatingRail from '@/components/FloatingRail';
import CookieBanner from '@/components/CookieBanner';
import { SITE } from '@/lib/site';
import { organizationSchema } from '@/lib/schema-org';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Levent Marine — Marine Electrical Service & Parts Supply · Wyoming, USA + Tuzla, Türkiye',
    template: '%s · Levent Marine'
  },
  description: 'Marine electrical service & technical parts supply for commercial vessels. Coast-to-coast US response · 24/7 AOG dispatch · 12 years onboard.',
  alternates: {
    canonical: '/',
    languages: { 'en-US': '/', 'tr-TR': '/tr' }
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: SITE.url,
    images: ['/assets/brand/og-image.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/brand/og-image.jpg']
  },
  icons: { icon: [{ url: '/assets/logo.svg', type: 'image/svg+xml' }, { url: '/assets/logo.png' }] },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B1F3A'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-amber focus:text-navy-700 focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <FloatingRail />
        <Footer />
        <MobileActionBar />
        <CookieBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </body>
    </html>
  );
}
