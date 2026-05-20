# Levent Marine — Claude Code için proje rehberi

Bu dosya Claude Code'un her oturumda otomatik okuduğu proje context'idir. Lütfen silme.

> **YENİ SESSION / YENİ AGENT BAŞLANGICI:** Önce `AGENT-GUIDE.md` oku.
> Sonra: `ROADMAP.md` (ne yapılıyor), `DECISIONS.md` (neden), `STATUS.md` (şu an nerede).

## Proje Özeti

**Firma:** Levent Marine Electro Technical Services LLC (Wyoming LLC, Florida operations)
**İş:** Florida merkezli marine elektrik servis & tedarik. Tüm ABD limanlarına 24/7 servis, worldwide kapsam. Bulker / ticari gemi / kruvaziyer üzerinde elektrik arıza müdahalesi, test/sertifikasyon, ETO desteği, class denetim hazırlığı + Amazon/eBay business hesabı ile parça tedariki.
**Domain:** www.leventmarinetech.com
**Hosting:** Vercel (Next.js 14) — eski statik versiyon `legacy/`
**Hedef kitle:** Armatör technical superintendent, class surveyor, broker, P&I sigorta, tersane.

> **Pazarlama pozisyonu (P1-P7 — DECISIONS.md):** Site **sadece USA bilgilerini** gösterir. TR adres/telefon **görünmez**. Slogan: "Marine Electrical Service & Parts Supply — 24/7 Worldwide".

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, server components
- **Styling:** Tailwind CSS + custom marine palette (navy / amber / ink)
- **Fonts:** Space Grotesk (heading) + Inter (body) + JetBrains Mono (mono) via Google Fonts
- **Backend:** Supabase — Postgres (RFQ + service requests + products + supplier sources), Auth (magic link, admin-only), Storage (uploads, reports)
- **Notifications:** Resend (Email) + WhatsApp Business API (planlanan)
- **Hosting:** Vercel (edge middleware + serverless functions)
- **i18n:** TR/EN, lokasyona göre otomatik (P7)
- **Eski sürüm:** `legacy/` altında statik HTML — referans için tutulur, deploy edilmez

## Renk Paleti

Tailwind config + CSS variables. **Direkt HEX kullanma, theme token kullan.**

- `navy` (primary) — `#0B1F3A`
- `amber` (accent) — `#F5A524`
- `bg` — `#F8FAFC` (light) / dark token
- `surface` — `#FFFFFF`
- `text` / `text-2` / `border` — Tailwind tokens

## Dosya Yapısı (Next.js)

```
.
├── app/                          # Next.js App Router
│   ├── (legal)/                  # Privacy, terms, cookie, accessibility
│   ├── about/                    # About page (Agent D)
│   ├── admin/                    # Admin dashboard (auth required)
│   ├── api/                      # API routes (service-request, quote-request)
│   ├── auth/                     # Auth callback
│   ├── contact/                  # Contact (Agent A — sadece USA)
│   ├── knowledge/                # Blog / SEO content (Agent D — yeni)
│   ├── login/                    # Magic-link sign-in (admin)
│   ├── portal/                   # (deferred — müşteri portali yok, Y5)
│   ├── service-wizard/           # Servis intake (Agent B)
│   ├── services/                 # Servis sayfaları (Agent B)
│   ├── supply/                   # Tedarik (Agent C)
│   ├── supply-wizard/            # Supply intake (Agent C)
│   ├── usa/                      # (kaldırılacak — Q14)
│   ├── layout.tsx
│   ├── page.tsx                  # HERO (Agent E)
│   ├── sitemap.ts                # (Agent D)
│   ├── robots.ts                 # (Agent D)
│   └── not-found.tsx
├── components/                   # React component'ler
├── content/                      # JSON içerik (services, products, regions, i18n)
├── lib/                          # Shared TS lib (notify, schema-org, site, supabase, i18n)
├── supabase/migrations/          # DB schema
├── public/                       # Static assets
├── legacy/                       # Eski statik site (DEPLOY EDİLMEZ)
├── middleware.ts                 # Edge middleware (locale, auth)
├── CLAUDE.md                     # Bu dosya
├── ROADMAP.md                    # Yol haritası
├── DECISIONS.md                  # Karar günlüğü
├── STATUS.md                     # İlerleme durumu
├── AGENT-GUIDE.md                # Agent/session devir rehberi
└── README.md
```

## Kurallar

1. **Bağlam dosyalarını koru:** `ROADMAP.md` · `DECISIONS.md` · `STATUS.md` · `AGENT-GUIDE.md` — bunlar tek doğru kaynak. Yön değişikliği → önce buraya yansıt, sonra koda dokun.
2. **Her metin TR + EN olmalı.** `content/i18n-en.json` + `content/i18n-tr.json`'a ekle.
3. **TR adres/telefon YASAK** (P3). Sadece USA: Wyoming adres + US telefon + WhatsApp.
4. **Fiyat YASAK** müşteri-yüzünde (F3, T3). Sadece "In stock / Get quote".
5. **Müşteri scroll'a zorlama** masaüstünde (F1). Yatay akış + modal.
6. **Müşteri login yok** (Y5). Sadece admin login.
7. **Müşteri logoları:** MSC · TP · Polaris · NORD · Bright · Çebi · MEDLOG (P5, G1).
8. **Slogan:** "Marine Electrical Service & Parts Supply — 24/7 Worldwide" (P4).
9. **Acil:** Her sayfada görünür, 3 buton (Ara / WhatsApp / 10sn Form) (E1).
10. **Bildirim:** Email + WhatsApp sahibe düşer (N1).
11. **Commit:** conventional, İngilizce, çok satırlı body. `feat/fix/docs/refactor/style/chore/perf`.
12. **Push:** Branch `claude/roadmap-implementation-k5IPG`. Diğer branch'lere izin yok.
13. **Secrets:** `.env.local`, asla commit etme.

## Servis Sistemleri (19 + Diğer)

`content/services.json` (Agent B sorumlu):

1. Generator (diesel, shaft, emergency, AVR)
2. Main Engine — Electric/Control Side
3. Switchboard (MSB / ESB / power management)
4. Fire Alarm & Detection
5. Engine Room Alarm / Monitoring
6. Bridge Navigation (radar, ECDIS, gyro, autopilot)
7. Communication / GMDSS
8. BWTS
9. Crane & Deck Machinery
10. Bilge / Level Sensor / Alarm
11. Shaft Earthing Device
12. PLC & Automation / IAS
13. Lighting & Nav Lights
14. Battery / UPS
15. Shore Connection
16. Transformer
17. AC/DC Motor (bow thruster, fan, pump motor)
18. HVAC Automation
19. CCTV / VDR
20. Diğer / Başka

## Tedarik Kategorileri (Supply)

`content/products.json` (Agent C sorumlu):

1. **Marine Electric** (ana ürün grubu — radar, GMDSS, AVR, sensors, vb.)
2. **General Electric** (geniş elektrik — kablolar, breaker, motor, vb.)
3. **General Marine** (marine genel — fittings, valves, vb.)

Her ürün: Amazon/eBay business hesabından canlı. Fiyat gizli. Sadece "In stock / Get quote".

## Class Otoriteleri

Uyumlu rapor formatları: DNV · BV · ABS · Lloyd's · TL · RINA · ClassNK · IRS

## Sertifikasyon (firma sahibi)

- ETO — STCW Reg. III/6
- HV Operations (Up to 1000V) — STCW Reg. III/6
- Advanced Fire Fighting (VI/3), Medical First Aid (VI/4-1), BST (VI/1)
- Gas Tanker Familiarization (V/1-2), Oil & Chemical Tanker (V/1-1)

## Mevcut Müşteriler (Logo Şeridi)

TP Offshore · Polaris Denizcilik · Bright Denizcilik · Çebi Kaptan · MEDLOG (MSC) · Reederei NORD

## İletişim (sadece USA — P3)

- **USA:** +1 619 384 04 03 · 32 N Gould St, Sheridan WY 82801
- **Email:** info@leventmarinetech.com
- **WhatsApp:** wa.me/16193840403

## Test & Deploy

```bash
npm install
cp .env.example .env.local         # Supabase + Resend keys
npm run dev                         # http://localhost:3000

# Production
git add [files]
git commit -m "feat(...): ..."
git push -u origin claude/roadmap-implementation-k5IPG
```

## Yararlı Dokümanlar

**Bağlam (öncelik):**
- `ROADMAP.md` — yol haritası
- `DECISIONS.md` — karar günlüğü (neden + tarih)
- `STATUS.md` — ilerleme durumu
- `AGENT-GUIDE.md` — agent/session devir rehberi

**Teknik:**
- `BACKEND-SETUP.md` — Supabase + Resend kurulumu
- `SEO-STRATEGY.md` — anahtar kelime + içerik planı
- `ANALYTICS-SETUP.md` — GA4 + Search Console
- `CI-CD-GITHUB-ACTIONS.md` — pipeline
- `LIGHTHOUSE-OPTIMIZATION.md` — performans hedefleri
- `MONITORING-ALERTS.md` — uptime + alarm
- `GIT-WORKFLOW.md` — branch stratejisi

## İlk oturumda yap (yeni session/agent)

1. `git status` çalıştır
2. `AGENT-GUIDE.md` oku → sonra `ROADMAP.md` → `DECISIONS.md` → `STATUS.md`
3. Son commit'leri kontrol et (`git log --oneline -10`)
4. STATUS.md'de aktif engelleri kontrol et
5. Kullanıcıya "Ne yapmak istersiniz?" diye sor — varsayma

## Asla Yapma (Özet — tam liste AGENT-GUIDE §7)

- TR adres / telefon eklemek
- Müşteri-yüzünde fiyat göstermek
- Müşteri scroll'a zorlamak (masaüstü)
- Müşteri login zorunluluğu
- DECISIONS.md'yi atlayarak yön değişikliği
- STATUS.md'yi güncellemeden commit
- Başka agent'ın dosyasına dokunmak (worktree disiplini)
