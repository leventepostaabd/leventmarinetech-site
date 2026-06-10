/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { money, LINE_KIND_LABEL, DEFAULT_SETTINGS, type LineKind, type CompanySettings } from '@/lib/billing';

export type InvoicePdfData = {
  number: string;
  type: string;
  created_at: string;
  issue_date: string | null;
  due_date: string | null;
  currency: string;
  incoterm: string | null;
  po_reference: string | null;
  payment_scope?: string | null;
  notes: string | null;
  subtotal: number;
  tax: number;
  total: number;
  amount_paid: number;
  company?: { name: string; billing_address?: string | null } | null;
  vessel?: { name: string; imo_no?: string | null } | null;
  lines: { kind: LineKind; description: string; qty: number; unit_price_usd: number; line_total: number }[];
};

const NAVY = '#0B1F3A', AMBER = '#F5A524', MUTED = '#5B6B82', LINE = '#E2E8F0';

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 9.5, color: NAVY, fontFamily: 'Helvetica' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: NAVY },
  brandAmber: { color: AMBER },
  muted: { color: MUTED },
  small: { fontSize: 8 },
  docTitle: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: NAVY, textAlign: 'right' },
  rule: { borderBottomWidth: 1.5, borderBottomColor: AMBER, marginTop: 8, marginBottom: 14 },
  sectionLabel: { fontSize: 7.5, color: AMBER, letterSpacing: 1, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  block: { width: '48%' },
  th: { backgroundColor: '#F1F5FB', flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 6, marginTop: 16 },
  tr: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: LINE },
  cKind: { width: '14%' }, cDesc: { width: '46%' }, cQty: { width: '12%', textAlign: 'right' },
  cPrice: { width: '14%', textAlign: 'right' }, cTotal: { width: '14%', textAlign: 'right' },
  bold: { fontFamily: 'Helvetica-Bold' },
  totalsBox: { marginTop: 12, marginLeft: 'auto', width: '45%' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  grandRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, marginTop: 4, borderTopWidth: 1, borderTopColor: NAVY },
  grand: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  remit: { marginTop: 18, backgroundColor: '#F8FAFC', borderWidth: 0.5, borderColor: LINE, borderRadius: 4, padding: 10 },
  footer: { position: 'absolute', bottom: 28, left: 36, right: 36, borderTopWidth: 0.5, borderTopColor: LINE, paddingTop: 8, fontSize: 7.5, color: MUTED, flexDirection: 'row', justifyContent: 'space-between' }
});

function fmtDate(d: string | null): string {
  if (!d) return '—';
  try { return new Date(d).toISOString().slice(0, 10); } catch { return d; }
}

export default function InvoiceDocument({ data, seller }: { data: InvoicePdfData; seller?: CompanySettings }) {
  const cur = data.currency || 'USD';
  const S = seller ?? DEFAULT_SETTINGS;
  const balance = data.total - data.amount_paid;
  const wireRouting = S.bank_routing_wire || S.bank_routing;
  const hasBank = !!(S.bank_account || S.bank_swift || wireRouting || S.bank_routing_ach);
  const scope = data.payment_scope || 'both';
  const showDom = scope === 'both' || scope === 'domestic';
  const showIntl = scope === 'both' || scope === 'international';
  return (
    <Document title={`Invoice ${data.number}`}>
      <Page size="A4" style={s.page}>
        <View style={s.rowBetween}>
          <View style={{ width: '55%' }}>
            <Text style={s.brand}>Levent Marine <Text style={s.brandAmber}>Tech</Text></Text>
            <Text style={[s.muted, s.small, { marginTop: 4 }]}>{S.legal_name}</Text>
            {S.address ? <Text style={[s.muted, s.small]}>{S.address}</Text> : null}
            <Text style={[s.muted, s.small]}>{[S.email, S.phone].filter(Boolean).join('  ·  ')}</Text>
            {S.ein ? <Text style={[s.muted, s.small]}>{S.ein}</Text> : null}
          </View>
          <View style={{ width: '40%' }}>
            <Text style={s.docTitle}>INVOICE</Text>
            <Text style={[s.muted, s.small, { textAlign: 'right', marginTop: 4 }]}>{data.number}</Text>
            <Text style={[s.muted, s.small, { textAlign: 'right' }]}>Issue: {fmtDate(data.issue_date || data.created_at)}</Text>
            {data.due_date ? <Text style={[s.muted, s.small, { textAlign: 'right' }]}>Due: {fmtDate(data.due_date)}</Text> : null}
          </View>
        </View>
        <View style={s.rule} />

        <View style={s.rowBetween}>
          <View style={s.block}>
            <Text style={s.sectionLabel}>BILL TO</Text>
            <Text style={s.bold}>{data.company?.name ?? '—'}</Text>
            {data.company?.billing_address ? <Text style={[s.muted, s.small]}>{data.company.billing_address}</Text> : null}
          </View>
          <View style={s.block}>
            <Text style={s.sectionLabel}>VESSEL / REFERENCE</Text>
            <Text style={s.bold}>{data.vessel?.name ?? '—'}{data.vessel?.imo_no ? `  ·  IMO ${data.vessel.imo_no}` : ''}</Text>
            {data.po_reference ? <Text style={[s.muted, s.small]}>PO: {data.po_reference}</Text> : null}
            {data.incoterm ? <Text style={[s.muted, s.small]}>Incoterm: {data.incoterm}</Text> : null}
          </View>
        </View>

        <View style={s.th}>
          <Text style={[s.cKind, s.bold]}>TYPE</Text>
          <Text style={[s.cDesc, s.bold]}>DESCRIPTION</Text>
          <Text style={[s.cQty, s.bold]}>QTY</Text>
          <Text style={[s.cPrice, s.bold]}>UNIT</Text>
          <Text style={[s.cTotal, s.bold]}>AMOUNT</Text>
        </View>
        {data.lines.map((l, i) => (
          <View style={s.tr} key={i}>
            <Text style={s.cKind}>{LINE_KIND_LABEL[l.kind]?.en ?? l.kind}</Text>
            <Text style={s.cDesc}>{l.description}</Text>
            <Text style={s.cQty}>{l.qty}</Text>
            <Text style={s.cPrice}>{money(l.unit_price_usd, cur)}</Text>
            <Text style={s.cTotal}>{money(l.line_total, cur)}</Text>
          </View>
        ))}

        <View style={s.totalsBox}>
          <View style={s.totalRow}><Text style={s.muted}>Subtotal</Text><Text>{money(data.subtotal, cur)}</Text></View>
          <View style={s.totalRow}><Text style={s.muted}>Tax</Text><Text>{money(data.tax, cur)}</Text></View>
          <View style={s.grandRow}><Text style={s.grand}>TOTAL</Text><Text style={s.grand}>{money(data.total, cur)}</Text></View>
          {data.amount_paid > 0 ? (
            <>
              <View style={[s.totalRow, { marginTop: 4 }]}><Text style={s.muted}>Paid</Text><Text>{money(data.amount_paid, cur)}</Text></View>
              <View style={s.totalRow}><Text style={s.bold}>Balance due</Text><Text style={s.bold}>{money(balance, cur)}</Text></View>
            </>
          ) : null}
        </View>

        <View style={s.remit}>
          <Text style={s.sectionLabel}>REMITTANCE</Text>
          {hasBank ? (
            <>
              <Text style={s.small}>Beneficiary: {S.bank_beneficiary || S.legal_name}</Text>
              {S.bank_name ? <Text style={s.small}>Bank: {S.bank_name}{S.bank_address ? ` — ${S.bank_address}` : ''}</Text> : null}
              {S.bank_account ? <Text style={s.small}>Account no: {S.bank_account}</Text> : null}
              {showDom && (S.bank_routing_ach || wireRouting) ? (
                <View style={{ marginTop: 4 }}>
                  <Text style={[s.small, s.bold]}>For US (domestic) payment</Text>
                  {S.bank_routing_ach ? <Text style={s.small}>ACH routing: {S.bank_routing_ach}</Text> : null}
                  {wireRouting ? <Text style={s.small}>Wire / ABA routing: {wireRouting}</Text> : null}
                </View>
              ) : null}
              {showIntl && (S.bank_swift || S.bank_intermediary) ? (
                <View style={{ marginTop: 4 }}>
                  <Text style={[s.small, s.bold]}>For international payment</Text>
                  {S.bank_swift ? <Text style={s.small}>SWIFT/BIC: {S.bank_swift}</Text> : null}
                  {S.bank_intermediary ? <Text style={s.small}>Intermediary: {S.bank_intermediary}</Text> : null}
                </View>
              ) : null}
              <Text style={[s.muted, s.small, { marginTop: 4 }]}>Payable in {cur}. Please quote invoice {data.number} on the transfer.</Text>
            </>
          ) : (
            <Text style={[s.muted, s.small]}>Payable in {cur} by bank wire — remittance details provided on request. Please quote invoice {data.number}.</Text>
          )}
        </View>

        {S.invoice_terms ? (
          <View style={{ marginTop: 12 }}>
            <Text style={s.sectionLabel}>TERMS</Text>
            <Text style={[s.muted, { fontSize: 8, lineHeight: 1.4 }]}>{S.invoice_terms}</Text>
          </View>
        ) : null}

        {data.notes ? (
          <View style={{ marginTop: 10 }}>
            <Text style={s.sectionLabel}>NOTES</Text>
            <Text style={[s.muted, { fontSize: 8.5, lineHeight: 1.4 }]}>{data.notes}</Text>
          </View>
        ) : null}

        <View style={s.footer} fixed>
          <Text>{S.legal_name}</Text>
          <Text>{S.website}</Text>
        </View>
      </Page>
    </Document>
  );
}
