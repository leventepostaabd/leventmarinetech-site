import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy', alternates: { canonical: '/privacy' } };

export default function Privacy() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p className="text-ink-subtle"><em>Last updated: {new Date().toISOString().slice(0, 10)}</em></p>

      <h2>1. Who we are</h2>
      <p>Levent Marine Electro Technical Services LLC, registered in Wyoming, USA (operational base also in Tuzla, Türkiye). Contact: info@leventmarinetech.com.</p>

      <h2>2. What we collect</h2>
      <ul>
        <li><strong>Form data:</strong> when you submit a service or supply request, we collect name, email, phone, company, vessel name and IMO, port, and the request body.</li>
        <li><strong>Authentication data:</strong> when you sign in to the authorized portal, we store the email tied to your account.</li>
        <li><strong>Technical data:</strong> standard request logs (IP, user agent) for security and abuse-prevention only.</li>
        <li><strong>Analytics (optional, only with consent):</strong> aggregate, IP-anonymized traffic data via Google Analytics 4 or Plausible.</li>
      </ul>

      <h2>3. Why we use it</h2>
      <ul>
        <li>Process your RFQ or service request, including supplier sourcing and delivery coordination.</li>
        <li>Send a same-day acknowledgement and follow-up about your request.</li>
        <li>Provide vessel-based history when you log into the authorized portal.</li>
        <li>Comply with US export and customs requirements (e.g., USCG / CBP documentation).</li>
      </ul>

      <h2>4. What we never share</h2>
      <p>We do not sell personal data. We do not share customer data with marketing third parties. Our internal supplier sourcing is never disclosed to anyone outside our team — including the price we pay or which supplier we used.</p>

      <h2>5. GDPR / CCPA rights</h2>
      <p>You may request access, correction, or deletion of your personal data by emailing privacy@leventmarinetech.com. We respond within 30 days. California residents have the right to opt out of any sale of personal information — we don't sell personal information.</p>

      <h2>6. Cookies</h2>
      <p>See our <a href="/cookie-policy">Cookie Policy</a> for the full list. We only set analytics cookies after you accept them in the consent banner.</p>

      <h2>7. Data retention</h2>
      <p>Service / RFQ requests are retained for 7 years for invoicing and vessel-history purposes. Authentication data is retained while your account is active.</p>

      <h2>8. Security</h2>
      <p>Data is stored on Supabase (SOC 2 Type II) with row-level security policies. Form submissions are transmitted over TLS. Supplier sourcing data is in a separate access-controlled table.</p>

      <h2>9. Contact</h2>
      <p>For any privacy question: <a href="mailto:privacy@leventmarinetech.com">privacy@leventmarinetech.com</a>.</p>
    </article>
  );
}
