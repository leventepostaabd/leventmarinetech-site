import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Cookie Policy', alternates: { canonical: '/cookie-policy' } };

export default function Cookies() {
  return (
    <article>
      <h1>Cookie Policy</h1>
      <p className="text-ink-subtle"><em>Last updated: {new Date().toISOString().slice(0, 10)}</em></p>

      <p>We use the smallest set of cookies that keeps the site working. We do not run advertising trackers.</p>

      <h2>Essential</h2>
      <ul>
        <li><strong>sb-*</strong> (Supabase) — authentication session for the authorized portal. Required to stay signed in.</li>
        <li><strong>lm.cookie.v1</strong> — remembers whether you accepted the cookie banner.</li>
      </ul>

      <h2>Optional analytics (only if you accept)</h2>
      <ul>
        <li><strong>_ga, _ga_*</strong> — Google Analytics 4, IP-anonymized.</li>
        <li><strong>Plausible</strong> — privacy-friendly traffic analytics, cookieless when used in the default configuration.</li>
      </ul>

      <h2>Your choices</h2>
      <p>You may revisit your consent at any time by clearing your browser data for this site; the banner will reappear on next visit. The "Essential only" option blocks all optional analytics.</p>

      <h2>Third-party services</h2>
      <ul>
        <li><strong>Supabase</strong> (database / auth) — see <a href="https://supabase.com/privacy" target="_blank" rel="noopener">supabase.com/privacy</a></li>
        <li><strong>Vercel</strong> (hosting) — see <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">vercel.com/legal/privacy-policy</a></li>
        <li><strong>Resend</strong> (transactional email) — see <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener">resend.com/legal/privacy-policy</a></li>
      </ul>
    </article>
  );
}
