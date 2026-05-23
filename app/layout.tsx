import type { Metadata, Viewport } from 'next';
import { Inter, Manrope, JetBrains_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import TopBar from '@/components/TopBar';
import CookieBanner from '@/components/CookieBanner';
import Spotlight from '@/components/Spotlight';
import PageTransition from '@/components/PageTransition';
import ScrollLock from '@/components/ScrollLock';
import Analytics from '@/components/Analytics';
import { SITE } from '@/lib/site';
import { organizationSchema } from '@/lib/schema-org';
import { getLocale } from '@/lib/i18n';

const AboutModal = dynamic(() => import('@/components/AboutModal'), { ssr: false });
const RfqBasket  = dynamic(() => import('@/components/RfqBasket'),  { ssr: false });

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true
});
const fontHead = Manrope({
  subsets: ['latin'],
  variable: '--font-head',
  display: 'swap',
  preload: true
});
const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Levent Marine — Marine Electrical Service & Parts Supply — 24/7 Worldwide',
    template: '%s · Levent Marine'
  },
  description:
    'Marine Electrical Service & Parts Supply — 24/7 Worldwide. Florida-based operations, Wyoming LLC. Service available at all US ports.',
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
  twitter: { card: 'summary_large_image', images: ['/assets/brand/og-image.jpg'] },
  icons: { icon: [{ url: '/assets/logo.svg', type: 'image/svg+xml' }, { url: '/assets/logo.png' }] },
  robots: { index: true, follow: true },
  // Google Search Console verification — set NEXT_PUBLIC_GSC_VERIFICATION
  // to the value Google provides (just the content string, not the full meta).
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {})
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B1F3A'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  return (
    <html lang={locale} className={`${fontSans.variable} ${fontHead.variable} ${fontMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-amber focus:text-navy-700 focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold"
        >
          Skip to content
        </a>

        <ScrollLock />
        <TopBar locale={locale} />

        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>

        <CookieBanner />
        <Spotlight />
        {/* Global event listener — opens via lm:about-open dispatch or [data-about-trigger] click. */}
        <AboutModal inlineTrigger={false} />
        <RfqBasket locale={locale} />
        <Analytics />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </body>
    </html>
  );
}
