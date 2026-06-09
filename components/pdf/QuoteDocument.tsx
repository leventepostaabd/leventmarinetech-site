/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { money, LINE_KIND_LABEL, DEFAULT_SETTINGS, type LineKind, type CompanySettings } from '@/lib/billing';

export type QuotePdfData = {
  number: string;
  revision: number;
  created_at: string;
  valid_until: string | null;
  currency: string;
  incoterm: string | null;
  po_reference: string | null;
  notes: string | null;
  subtotal: number;
  tax: number;
  total: number;
  company?: { name: string; billing_address?: string | null } | null;
  vessel?: { name: string; imo_no?: string | null } | null;
  lines: { kind: LineKind; description: string; qty: number; unit_price_usd: number; line_total: number; is_optional?: boolean }[];
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
  footer: { position: 'absolute', bottom: 28, left: 36, right: 36, borderTopWidth: 0.5, borderTopColor: LINE, paddingTop: 8, fontSize: 7.5, color: MUTED, flexDirection: 'row', justifyContent: 'space-between' }
});

function fmtDate(d: string | null): string {
  if (!d) return '—';
  try { return new Date(d).toISOString().slice(0, 10); } catch { return d; }
}

export default function QuoteDocument({ data, seller }: { data: QuotePdfData; seller?: CompanySettings }) {
  const cur = data.currency || 'USD';
  const S = seller ?? DEFAULT_SETTINGS;
  return (
    <Document title={`Quote ${data.number}`}>
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
            <Text style={s.docTitle}>QUOTATION</Text>
            <Text style={[s.muted, s.small, { textAlign: 'right', marginTop: 4 }]}>
              {data.number}{data.revision > 1 ? ` · R${data.revision}` : ''}
            </Text>
            <Text style={[s.muted, s.small, { textAlign: 'right' }]}>Date: {fmtDate(data.created_at)}</Text>
            {data.valid_until ? <Text style={[s.muted, s.small, { textAlign: 'right' }]}>Valid until: {fmtDate(data.valid_until)}</Text> : null}
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
            <Text style={s.cDesc}>{l.description}{l.is_optional ? '  (optional)' : ''}</Text>
            <Text style={s.cQty}>{l.qty}</Text>
            <Text style={s.cPrice}>{money(l.unit_price_usd, cur)}</Text>
            <Text style={s.cTotal}>{l.is_optional ? '—' : money(l.line_total, cur)}</Text>
          </View>
        ))}

        <View style={s.totalsBox}>
          <View style={s.totalRow}><Text style={s.muted}>Subtotal</Text><Text>{money(data.subtotal, cur)}</Text></View>
          <View style={s.totalRow}><Text style={s.muted}>Tax</Text><Text>{money(data.tax, cur)}</Text></View>
          <View style={s.grandRow}><Text style={s.grand}>TOTAL</Text><Text style={s.grand}>{money(data.total, cur)}</Text></View>
        </View>

        {data.notes ? (
          <View style={{ marginTop: 18 }}>
            <Text style={s.sectionLabel}>NOTES</Text>
            <Text style={[s.muted, { fontSize: 8.5, lineHeight: 1.4 }]}>{data.notes}</Text>
          </View>
        ) : null}

        {S.quote_terms ? (
          <View style={{ marginTop: 14 }}>
            <Text style={s.sectionLabel}>TERMS</Text>
            <Text style={[s.muted, { fontSize: 8, lineHeight: 1.4 }]}>{S.quote_terms}</Text>
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
