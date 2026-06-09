/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_SETTINGS, type ServiceReportData, type CompanySettings } from '@/lib/billing';

const NAVY = '#0B1F3A', AMBER = '#F5A524', MUTED = '#5B6B82', LINE = '#E2E8F0';

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 9.5, color: NAVY, fontFamily: 'Helvetica' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: NAVY },
  brandAmber: { color: AMBER },
  muted: { color: MUTED }, small: { fontSize: 8 }, bold: { fontFamily: 'Helvetica-Bold' },
  docTitle: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: NAVY, textAlign: 'right' },
  rule: { borderBottomWidth: 1.5, borderBottomColor: AMBER, marginTop: 8, marginBottom: 12 },
  sectionLabel: { fontSize: 7.5, color: AMBER, letterSpacing: 1, fontFamily: 'Helvetica-Bold', marginBottom: 3, marginTop: 10 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap' },
  metaCell: { width: '33%', marginBottom: 4 },
  metaK: { fontSize: 7, color: MUTED }, metaV: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  body: { fontSize: 9, lineHeight: 1.4, color: '#1F2D3D' },
  th: { backgroundColor: '#F1F5FB', flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 5, marginTop: 4 },
  tr: { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 5, borderBottomWidth: 0.5, borderBottomColor: LINE },
  c1: { width: '26%' }, c2: { width: '15%' }, c3: { width: '13%' }, c4: { width: '16%' }, c5: { width: '20%' }, c6: { width: '10%' },
  signRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  signBox: { width: '47%' },
  signLine: { borderBottomWidth: 1, borderBottomColor: NAVY, marginTop: 26, marginBottom: 3 },
  stampBox: { borderWidth: 0.7, borderColor: LINE, borderStyle: 'dashed', height: 46, borderRadius: 3, marginTop: 6, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', bottom: 26, left: 36, right: 36, borderTopWidth: 0.5, borderTopColor: LINE, paddingTop: 6, fontSize: 7.5, color: MUTED, flexDirection: 'row', justifyContent: 'space-between' }
});

function fmtDate(d: string | null): string {
  if (!d) return '—';
  try { return new Date(d).toISOString().slice(0, 10); } catch { return d; }
}

export default function ServiceReportDocument({ data, seller }: { data: ServiceReportData; seller?: CompanySettings }) {
  const S = seller ?? DEFAULT_SETTINGS;
  return (
    <Document title={`Service Report ${data.number}`}>
      <Page size="A4" style={s.page}>
        <View style={s.rowBetween}>
          <View style={{ width: '58%' }}>
            <Text style={s.brand}>Levent Marine <Text style={s.brandAmber}>Tech</Text></Text>
            <Text style={[s.muted, s.small, { marginTop: 3 }]}>{S.legal_name}</Text>
            <Text style={[s.muted, s.small]}>{[S.email, S.phone].filter(Boolean).join('  ·  ')}</Text>
          </View>
          <View style={{ width: '40%' }}>
            <Text style={s.docTitle}>SERVICE / ATTENDANCE REPORT</Text>
            <Text style={[s.muted, s.small, { textAlign: 'right', marginTop: 3 }]}>{data.number}</Text>
            <Text style={[s.muted, s.small, { textAlign: 'right' }]}>Attended: {fmtDate(data.attended_on || data.created_at)}</Text>
          </View>
        </View>
        <View style={s.rule} />

        <View style={s.metaRow}>
          <Meta k="VESSEL" v={`${data.vessel?.name ?? '—'}${data.vessel?.imo_no ? `  ·  IMO ${data.vessel.imo_no}` : ''}`} />
          <Meta k="FLAG" v={data.vessel?.flag ?? '—'} />
          <Meta k="CLASS" v={data.class_format ?? '—'} />
          <Meta k="CLIENT" v={data.company?.name ?? '—'} />
          <Meta k="PO REF" v={data.po_reference ?? '—'} />
          <Meta k="PORT" v={data.port ?? '—'} />
        </View>

        <Field label="REPORTED DEFECT / FINDINGS" value={data.findings} />
        <Field label="WORK PERFORMED" value={data.work_performed} />
        <Field label="PARTS USED / FITTED" value={data.parts_used} />

        {data.test_results.length > 0 && (
          <>
            <Text style={s.sectionLabel}>TEST &amp; MEASUREMENT</Text>
            <View style={s.th}>
              <Text style={[s.c1, s.bold]}>POINT</Text><Text style={[s.c2, s.bold]}>VALUE</Text><Text style={[s.c3, s.bold]}>UNIT</Text>
              <Text style={[s.c4, s.bold]}>THRESHOLD</Text><Text style={[s.c5, s.bold]}>INSTRUMENT</Text><Text style={[s.c6, s.bold]}>CAL DUE</Text>
            </View>
            {data.test_results.map((t, i) => (
              <View style={s.tr} key={i}>
                <Text style={s.c1}>{t.point}</Text><Text style={s.c2}>{t.value}</Text><Text style={s.c3}>{t.unit}</Text>
                <Text style={s.c4}>{t.threshold}</Text><Text style={s.c5}>{t.instrument}</Text><Text style={s.c6}>{t.cal_due}</Text>
              </View>
            ))}
          </>
        )}

        <Field label="OUTSTANDING ITEMS" value={data.outstanding || 'NIL'} />

        <Text style={[s.muted, s.small, { marginTop: 14, lineHeight: 1.4 }]}>
          Signature below confirms the work was performed as described, the hours and parts recorded are correct, and the work
          is completed to the vessel&apos;s satisfaction with no outstanding defects except as noted above. This report is the
          basis of invoicing and does not waive any applicable warranty.
        </Text>

        <View style={s.signRow}>
          <View style={s.signBox}>
            <Text style={s.sectionLabel}>FOR LEVENT MARINE TECH</Text>
            <Text style={s.body}>{data.engineer_name || ' '}</Text>
            <View style={s.signLine} />
            <Text style={s.small}>Attending engineer — signature / date</Text>
          </View>
          <View style={s.signBox}>
            <Text style={s.sectionLabel}>ACKNOWLEDGED ONBOARD</Text>
            <Text style={s.body}>{data.ce_name || ' '}{data.ce_rank ? `  ·  ${data.ce_rank}` : ''}</Text>
            <View style={s.signLine} />
            <Text style={s.small}>Name · rank · signature · date · time · port</Text>
            <View style={s.stampBox}><Text style={[s.muted, s.small]}>Ship&apos;s stamp</Text></View>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text>{S.legal_name}</Text>
          <Text>{S.website}</Text>
        </View>
      </Page>
    </Document>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <View style={s.metaCell}>
      <Text style={s.metaK}>{k}</Text>
      <Text style={s.metaV}>{v}</Text>
    </View>
  );
}
function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <View>
      <Text style={s.sectionLabel}>{label}</Text>
      <Text style={s.body}>{value || '—'}</Text>
    </View>
  );
}
