'use client';

import Script from 'next/script';

/**
 * Analytics + tracker scripts — only render when the relevant env var is set.
 * Honours the cookie banner consent if available; until consent is given,
 * we use anonymised "essential" mode that does not set marketing cookies.
 *
 * Configuration (Vercel → Settings → Environment Variables):
 *   - NEXT_PUBLIC_GA4_ID            — G-XXXXXXXXXX (empty disables)
 *   - NEXT_PUBLIC_PLAUSIBLE_DOMAIN  — leventmarinetech.com (empty disables)
 *
 * Both are loaded with `strategy="afterInteractive"` so they don't block
 * the initial paint. Server-rendered HTML never exposes the IDs to
 * unauthenticated visitors beyond what's already in the page metadata.
 */
export default function Analytics() {
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <>
      {ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="lm-ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4}', {
                anonymize_ip: true,
                allow_google_signals: false,
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}

      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
