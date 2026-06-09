# Admin "Evrak & Finans" Modülü — Spec

> Kaynak: 3 paralel araştırma ajanı (sektör belge/akış · US-LLC muhasebe/vergi/KPI · tasarım+ürün+teknik), 2026-06-08.
> Karar günlüğü: `DECISIONS.md` (Billing modülü). Bu doküman tek doğru kaynaktır; yön değişince önce burayı güncelle.

## 1. Amaç ve kapsam

Admin içinde (müşteri-yüzü DEĞİL) firmanın **tüm ticari evrakını** üreten ve işi/teklifi/parayı takip eden bir modül:
teklif → proforma → iş/servis raporu → ticari fatura → makbuz/hesap özeti, **tek satır-kalemi motoru → çok belge**,
tek tuşla baskıya hazır PDF, ve ay/yıl sonu **yönetim panosu** (K/Z, win/loss, pipeline, AR).

### Onaylanmış kararlar (kullanıcı, 2026-06-08)
- **Muhasebe = HİBRİT:** belgeyi panel üretir; resmi vergi muhasebesi **QuickBooks/CPA**'ya CSV ile aktarılır. Panel defter TUTMAZ.
- **İstatistik = yönetim düzeyi** (operasyonel K/Z, win/loss, pipeline, AR) — GAAP/denetim DEĞİL.
- **Para birimi = USD ana + uluslararası hazır** (EIN/SWIFT, HS/menşe/Incoterms, çok dilli belge).

### ⚠️ Tek yüksek-risk alanı — CPA gerektirir (kod değil, iş kararı)
Florida deniz aracı kısmi muafiyeti (**Rule 12A-1.0641 / §212.08(8)**): ticari (dış ticaret taşıyan) gemilere parça+işçilik
kısmi/tam muaf olabilir — ama **gemi sahibinin imzalı affidavit'i + mileage oranı dosyada** olmalı. Panel bu affidavit'i
ve gemi meta verisini (IMO/flag/commerce/mileage%) yakalar; **pozisyonu bir FL CPA/vergi avukatı bir kez onaylamalı.**
Diğer her şey (eyalet-dışı/ihracat = US satış vergisi yok, resale certificate DR-13, nexus) panelin tuttuğu belgelerle savunulur.

## 2. Belge seti ve zorunlu alanlar

Tek kök referans tüm zincirde taşınır: `QT-2026-0042 → PF-… → JOB-… → INV-…`. Teklif revizyonu `R1/R2`; fatura/proforma **düzenlenmez, yeniden basılır** (audit).

| Belge | Amaç | Kritik alanlar |
|---|---|---|
| **Quote** (teklif, bağlayıcı değil) | Fiyatlı teklif, revize edilir | no+rev, **geçerlilik tarihi**, gemi+IMO, liman, **işçilik vs parça ayrı**, para birimi, vade, Incoterm |
| **Proforma** | Banka/LC/gümrük ön-belge | quote + HS kodu, menşe, Incoterm, banka, son geçerlilik |
| **Job/İş emri** (iç) | İşi açar, saat+parça biriktirir | iş no, quote/PO bağı, gemi, atanan ETO, maliyetler |
| **Service/Attendance raporu** ⭐ | Teknik kayıt; class/PSC/sigorta artefaktı | gemi+IMO, **PO ref**, ölçümler (değer+birim+**cihaz kalibrasyon**), bulgular, parçalar, **fotoğraf + çift imza (mühendis + Chief Eng.)** |
| **Commercial Invoice** | Ödeme talebi + gümrük değer belgesi | tekil no, **PO ref**, gemi+IMO, işçilik vs parça, para birimi, **EIN + banka/SWIFT**, vade, (parça: HS+menşe+Incoterm) |
| **Receipt / Statement** | Ödeme/cari hesap özeti | fatura(lar), ödenen, bakiye, yaşlandırma |

**Her belgede yapısal (free-text değil) alan:** gemi adı + **IMO**, **müşteri PO ref**, liman+tarih, işçilik/parça ayrımı, para birimi (USD açık), vade, EIN+SWIFT.

⭐ **Service raporu = asıl rekabet farkı** (jenerik fatura araçları yapamaz): fotoğraf + gemide Chief Engineer imzası + kalibrasyonlu ölçüm + class formatı (DNV/ABS/BV/LR/ClassNK).

## 3. Teknik kararlar

- **PDF: `@react-pdf/renderer`** (Puppeteer DEĞİL — Vercel 50MB limiti + 3-6sn cold start; react-pdf ~2MB, <0.5sn, TR karakter OK). İleride tek bir class formu pixel-exact gerekirse o forma özel Puppeteer/hosted API.
- **Numaralandırma Postgres'te** (gapless, eşzamanlılık güvenli) — `document_sequences` + kilitli fonksiyon `next_doc_number(type, year)`. 1001'den başlar.
- **PDF depolama:** Supabase Storage private bucket `documents/{type}/{year}/{number}.pdf`; signed URL (admin) / Resend eki (müşteri). Gönderilen PDF **immutable**.
- **QuickBooks: önce CSV** (QBO invoice import kolonlarıyla; IIF ASLA). Hacim artarsa Faz-sonrası OAuth2 API.
- **Auth:** mevcut `/admin` (Supabase Auth, profiles.role='admin'). Müşteri login yok (Y5).
- **i18n:** belgeler TR+EN (react-pdf gömülü font + locale prop). `cost_usd` yalnız admin (mevcut kural F4).
- **Stack reuse:** `companies` = müşteri, `vessels` (IMO) zaten var (0002_crm). Resend zaten var (hatırlatma/gönderim).

## 4. Veri modeli (migration `0004_billing.sql`)

Mevcut `companies`/`vessels`'e billing alanları eklenir; yeni tablolar:

- **companies** (+): `tax_id`, `billing_address`, `default_payment_terms`, `default_incoterm`, `w9_on_file`
- **vessels** (+): `class_society`, `in_foreign_commerce` (bool), `mileage_factor` (numeric), `exemption_affidavit_path`
- **price_book_items** — `kind`(service|labour|part|freight|consumable), `code`, `name_en/tr`, `default_price_usd`, `default_cost_usd`(admin), `unit`, `taxable`
- **quotes** — `number`, `revision`, `company_id`, `vessel_id`, `status`(draft|sent|accepted|declined|expired), `lost_reason`, `currency`, `valid_until`, `incoterm`, `deposit_pct`, totals, `accepted_at/by`, `signature_ref`, `pdf_path`, `po_reference`
- **quote_lines** — `quote_id`, `item_id?`, `kind`, `description`, `qty`, `unit_price_usd`, `cost_usd`(admin), `line_total`, `is_optional`, `sort_order`
- **jobs** — `number`, `quote_id?`, `company_id`, `vessel_id`, `port`, `status`(scheduled|in_progress|completed|cancelled), `service_system`, `is_aog`, `dispatched_at`, `completed_at`, `summary`
- **job_costs** — `job_id`, `kind`(parts|labour|travel|other), `description`, `amount_usd` → gerçek brüt marj
- **invoices** — `number`, `type`(full|deposit|progress|final), `progress_pct`, `quote_id?`, `job_id?`, `company_id`, `vessel_id`, `status`(draft|sent|partial|paid|overdue|void), `currency`, totals, `amount_paid`, `due_date`, `po_reference`, `incoterm`, `pdf_path`
- **invoice_lines** — quote_lines aynası
- **payments** — `invoice_id`, `amount_usd`, `method`(ach|wire|card|other), `received_at`, `reference`
- **service_reports** — `number`, `job_id?`, `vessel_id`, `company_id`, `findings`, `work_performed`, `parts_used`, `test_results`(jsonb: nokta/değer/birim/eşik/cihaz/kal-tarih), `class_format`, `engineer_sign_ref`, `vessel_sign_ref`, `pdf_path`
- **service_report_photos** — `service_report_id`, `storage_path`, `caption`
- **document_sequences** — `(type, year)` PK, `last_value`
- **audit_log** — `entity`, `entity_id`, `action`, `actor`, `diff_json`, `created_at`

Tümü RLS: `profiles.role='admin'` (0002 deseni). Sunucu yazımları service-role ile bypass.

## 5. Yönetim panosu (KPI — quotes+invoices+payments'tan hesaplanır)

Win/Loss oranı + kayıp nedeni · pipeline ($/aşama) · **parça vs işçilik brüt marj** · AR yaşlandırma (0-30/31-60/61-90/90+) + **DSO** · ay/yıl K/Z · top müşteri · AOG yanıt süresi (talep→teklif, talep→sahada).

## 6. Yol haritası (faz)

### Faz 1 — çekirdek döngü
1. DB migration `0004_billing.sql` ✅ (bu turda)
2. `@react-pdf/renderer` kur ✅
3. Müşteri(company)/gemi yönetimi + **price book** (hızlı girişin motoru)
4. **Quote builder** (kalem ızgarası, kind-tag, otomatik toplam) + tek-tuş PDF
5. **Quote → Invoice** dönüşümü (bağlı), gapless numara
6. Invoice + payment + durum
7. **Service raporu** (foto + çift imza, ölçüm tablosu)
8. **Pano** (pipeline, AR aging, win/loss, K/Z MTD/YTD)
9. **QuickBooks CSV** export

### Faz 1.1 — para/güven katmanı
e-imza teklif kabulü · depozito/aşamalı fatura · AR otomatik hatırlatma (Resend) · iş-maliyet→marj · hesap özeti · audit log · vergi-zamanı paketi (CSV+PDF zip)

### Sonra
QBO OAuth2 API · tekrarlayan sözleşme faturası · çoklu para birimi (FX 4900 hesabı) · PDF/A (class talep ederse) · light rol bazlı erişim

## 7. Hesap planı (QBO eşlemesi için kalem tag → hesap)
`4000 Labour · 4010 Testing/Cert · 4100 Parts resale · 4200 Freight recharged · 4900 FX · 5000 COGS-Parts · 5010 COGS-Freight · 5100 COGS-Subcontract`.
Her kalemi girişte **Labour/Parts/Freight/Consumable** etiketle → satış vergisi + COGS/marj + QBO eşlemesi aynı anda çözülür.

## 8. Kaynaklar
Araştırma ajan raporları (sektör belge zinciri + Incoterms/HS; FL 12A-1.0641 muafiyet + DR-13 + nexus + 1099 + QBO CSV; react-pdf vs Puppeteer + Jobber/QBO/Zoho desenleri) — özet bu dokümanda; tam kaynak URL'leri ajan çıktılarında.
