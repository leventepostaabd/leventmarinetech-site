import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms of Service', alternates: { canonical: '/terms' } };

export default function Terms() {
  return (
    <article>
      <h1>Terms of Service</h1>
      <p className="text-ink-subtle"><em>Last updated: {new Date().toISOString().slice(0, 10)}</em></p>

      <h2>1. Engagement</h2>
      <p>By submitting a service or supply request you authorize Levent Marine to: (a) review the request, (b) source candidate parts or schedule engineer attendance, and (c) reply with a quote, lead time, or technical note. No quote is binding until a written PO is countersigned by both parties.</p>

      <h2>2. Quotations & pricing</h2>
      <p>Quotes are valid 7 days unless stated otherwise. Prices are quoted exclusive of taxes, duties, port handling, and on-vessel installation labor unless explicitly included. AOG / urgent items may carry an air-freight surcharge passed through at cost plus handling.</p>

      <h2>3. Equivalents & compatibility</h2>
      <p>When an exact OEM item is obsolete or unavailable we may propose a compatible alternative, accompanied by an engineering note. Final acceptance of any equivalent rests with the vessel's technical superintendent and / or the class society where applicable. We do not ship an alternative without written approval.</p>

      <h2>4. Service attendance</h2>
      <p>Service quotes cover engineer time, materials, and travel. Onboard work is subject to vessel safety procedures, hot-work permits where applicable, and master's discretion. Standby and port delays beyond agreed scope are billed hourly.</p>

      <h2>5. Delivery</h2>
      <p>We arrange courier or freight to the vessel, the port agent, a warehouse for consolidation, or a hotel pickup as agreed in the PO. Title passes on delivery to the named consignee. Loss / damage claims must be reported within 48h of receipt.</p>

      <h2>6. Payment</h2>
      <p>Standard terms: 50% on PO, 50% on delivery, USD via Wyoming LLC bank account. New customers may be asked for 100% prepayment on the first order. Fleet customers may negotiate net-15 or net-30 once a credit reference is on file.</p>

      <h2>7. Warranty</h2>
      <p>Parts: pass-through of OEM warranty. Service: workmanship warranted 90 days from completion. Liability is limited to the value of the engagement; no consequential damages.</p>

      <h2>8. Confidentiality</h2>
      <p>Vessel and fleet information shared with us is treated as confidential. We do not disclose customer identities, supplier sources, or pricing structures to third parties.</p>

      <h2>9. Governing law</h2>
      <p>Wyoming, USA for US engagements. Türkiye for Turkish-flag and Mediterranean engagements. Disputes resolved by arbitration in the appropriate jurisdiction.</p>

      <h2>10. Contact</h2>
      <p><a href="mailto:legal@leventmarinetech.com">legal@leventmarinetech.com</a></p>
    </article>
  );
}
