# Levent Marine — Claude Code için proje rehberi

Bu dosya Claude Code'un her oturumda otomatik okuduğu proje context'idir. Lütfen silme.

## Proje Özeti

**Firma:** Levent Marine Electro Technical Services LLC
**İş:** Türkiye (Pendik) + USA (Wyoming) merkezli marine elektrik servis firması. Bulker (kuruyuk) gemilerde elektrik arıza müdahalesi, test/sertifikasyon, ETO desteği, class denetim hazırlığı.
**Domain:** www.leventmarinetech.com
**Hosting:** GitHub Pages (main branch auto-deploy)
**Hedef kitle:** Armatör technical superintendent, class surveyor, broker, P&I sigorta, tersane.

## Stack

- **Frontend:** Static HTML + CSS + vanilla JS (build step YOK)
- **Fonts:** Space Grotesk (heading) + Inter (body) + JetBrains Mono (mono) via Google Fonts
- **i18n:** Runtime TR/EN toggle (localStorage)
- **Theme:** Deep Harbor — açık tema varsayılan, dark opsiyonel
- **Backend:** Ayrı repo (`leventmarinetech-api`) — Node/Express — form endpoint + auth panel

## Renk Paleti

CSS variable'ları `css/design.css` içinde `:root` altında:
- `--c-primary: #0B1F3A` (navy)
- `--c-accent: #F5A524` (signal amber)
- `--c-bg: #F8FAFC` (paper)
- `--c-surface: #FFFFFF`
- `--c-text: #0F1729`
- `--c-text-2: #5B6B82` (secondary)
- `--c-border: #E2E8F0`

**Kural:** Direkt HEX kullanma, `var(--c-*)` kullan. Dark mode otomatik değişir.

## Dosya Yapısı

```
.
├── index.html              # Ana sayfa — bento grid
├── profile.html            # Professional background
├── authorized.html         # Class/Company/Admin panel — DOKUNMA
├── index-v1-backup.html    # Eski v1 yedek — DOKUNMA
├── css/
│   ├── design.css          # v2 TÜM stiller
│   ├── authorized.css      # Yetkili panel — DOKUNMA
│   └── [eski dosyalar]     # Backward compat — DOKUNMA
├── js/
│   ├── app.js              # v2 TÜM JS (i18n + services + drawer + form)
│   └── authorized.js       # Yetkili panel — DOKUNMA
├── assets/
│   ├── IMAGES.md           # AI görsel üretim prompt'ları
│   ├── logo.png
│   ├── services/           # Kart görselleri
│   ├── projects/           # Vaka görselleri
│   ├── equipment/          # Test ekipmanı görselleri
│   ├── about/              # Ofis görselleri
│   └── brand/              # Logo + OG + motif
├── CNAME                   # www.leventmarinetech.com
├── CHANGELOG.md            # Sürüm geçmişi
└── README.md
```

## Kurallar

1. **DOKUNMA** listesi: `authorized.html`, `js/authorized.js`, `css/authorized.css`, `index-v1-backup.html`, eski `home.js`/`home.css`/`global.js`/`global.css`/`login.js`/`login.css`/`profile.js` dosyaları. Bunlar yetkili panel için kritik.
2. **Her yeni metin TR+EN olmalı.** `js/app.js` içindeki `I18N` object'e ekle, HTML'de `data-i18n="key"` kullan.
3. **Servisleri değiştirirken** `js/app.js` > `SERVICES` object'ini düzenle (her hizmet için tr + en objeleri var).
4. **Renk ve font**: CSS variable sistemi dışına çıkma.
5. **Build step yok** — HTML/CSS/JS tarayıcıda doğrudan çalışmalı.
6. **Commit:** conventional (feat/fix/docs/style/chore/perf/refactor). İngilizce mesaj. Çok satırlı body ekle.
7. **Push öncesi:** local'de test et (`python3 -m http.server 8080` veya `npx serve`).
8. **Secrets:** `.env` kullan, `.gitignore` zaten var. Asla API key commit etme.
9. **GitHub Pages:** `main` branch → otomatik deploy. Manuel bir şey yapma.

## Hizmet Kataloğu (10 kategori)

`js/app.js` > `SERVICES` object:

1. `power-distribution` — Güç & Dağıtım (MSB/ESB, jeneratör, AVR, shaft gen, transformer, shore power)
2. `propulsion-motors` — Tahrik & Motor (bow thruster, deck crane, hatch cover, windlass)
3. `navigation-comms` — Navigasyon & GMDSS (radar, ECDIS, gyro, GMDSS)
4. `automation-control` — Otomasyon (AMS, IAS, PMS, PLC/SCADA)
5. `safety-systems` — Güvenlik (fire detection, CO2, PA/GA, gas detection)
6. `lighting-nav-lights` — Aydınlatma & Seyir Fenerleri (LED retrofit)
7. `testing-certification` — Test & Sertifikasyon (ACB/MCCB, Megger, thermography)
8. `commissioning-retrofit` — Commissioning & Retrofit (FAT/SAT, VFD, cyber security)
9. `emergency-remote` — Acil & Remote ETO (24h, retainer, PSC Green Pass)
10. `class-prep` — Class Hazırlığı (Intermediate, Special, Annual, PSC, CII)

Her servisin tıklanınca açılan drawer'ı var, URL hash `#service/[key]` olarak değişir.

## Class Otoriteleri

Uyumlu rapor formatları: DNV · BV · ABS · Lloyd's · TL · RINA · ClassNK · IRS

## Sertifikasyon (firma sahibi)

- ETO — STCW Reg. III/6
- HV Operations (Up to 1000V) — STCW Reg. III/6
- Advanced Fire Fighting (VI/3), Medical First Aid (VI/4-1), BST (VI/1)
- Gas Tanker Familiarization (V/1-2), Oil & Chemical Tanker (V/1-1)

## Mevcut Müşteriler

TP Offshore · Polaris Denizcilik · Bright Denizcilik · Çebi Kaptan · MEDLOG (MSC) · Reederei NORD

## İletişim

- Pendik: +90 537 650 77 76 · Velibaba Mah. No:1
- Wyoming: +1 619 384 04 03 · 32 N Gould St, Sheridan WY 82801
- Email: info@leventmarinetech.com
- WhatsApp: wa.me/905376507776 ve wa.me/16193840403

## Test & Deploy

```bash
# Local test
python3 -m http.server 8080   # veya: npx serve

# Commit + deploy
git add [files]
git commit -m "feat(...): ..."
git push origin main          # GitHub Pages 1-2 dk'da yayında
```

## Yararlı Dokümanlar

- `CHANGELOG.md` — sürüm geçmişi ve v2.0 değişiklik detayları
- `README.md` — proje tanıtım + kurulum
- `assets/IMAGES.md` — ~50 görsel için AI üretim prompt'ları + dosya yolları
- `GELISIM-PLANI.md` (üst dizinde olabilir) — 90 günlük pazarlama + web gelişim planı

## İlk oturumda yap

1. `git status` çalıştır
2. Bu CLAUDE.md + README.md + CHANGELOG.md oku
3. Son commit'leri kontrol et (`git log --oneline -10`)
4. Kullanıcıya "Ne yapmak istersiniz?" diye sor — varsayma, görev bekleme

## Öncelik sırası (kullanıcı belirtmezse öner)

1. Eksik görselleri üretmek (`assets/IMAGES.md` prompt'ları ile)
2. Contact form backend'ini canlıya almak
3. İlk 3 blog postunu eklemek (SEO + lead magnet)
4. Custom domain bağlamak (DNS ayarları)
5. Google Analytics + Search Console + LinkedIn setup
6. Lighthouse 95+ optimizasyonu
7. Yeni hizmet kategorileri (pazar geri bildirimine göre)
