# Levent Marine Electro Technical Services — Web

Class-ready electrotechnical partner for bulker fleets.
Pendik İstanbul + Sheridan Wyoming · 240+ vessels serviced · 8 class authorities.

🌐 **Live site:** https://www.leventmarinetech.com

## Stack

- **Static HTML + CSS + vanilla JS** (GitHub Pages friendly, no build step)
- **Google Fonts** — Space Grotesk + Inter + JetBrains Mono (via CDN)
- **Design system:** Deep Harbor palette (light primary, amber accent)
- **i18n:** TR/EN runtime toggle (localStorage persistence)
- **Backend:** `leventmarinetech-api` (ayrı repo) — form + authorized user panel API

## Struktur

```
.
├── index.html              # Ana sayfa — bento grid, 10 hizmet kategorisi
├── profile.html            # Professional background + certifications
├── authorized.html         # Class/Company/Admin yetkili panel
├── css/
│   ├── design.css          # v2 design system (TÜM stiller)
│   ├── authorized.css      # Yetkili panel stilleri
│   └── [eski dosyalar]     # Geriye uyumluluk için korundu
├── js/
│   ├── app.js              # v2 — i18n + services data + drawer + form + login
│   └── authorized.js       # Yetkili panel mantığı
├── assets/
│   ├── IMAGES.md           # ~50 görsel için AI üretim prompt + dosya yolları
│   ├── logo.png            # Ana logo
│   ├── sample-certificate.pdf
│   ├── services/           # Hizmet kart görselleri (10 kategori)
│   ├── projects/           # Proje vakası görselleri
│   ├── equipment/          # Test ekipmanları görselleri
│   ├── about/              # Ofis + ekip görselleri
│   └── brand/              # Logo SVG + OG image + motif
├── CNAME                   # www.leventmarinetech.com
├── CHANGELOG.md            # Sürüm notları
└── README.md
```

## Yerel geliştirme

Build gerekmiyor — dosyaları doğrudan aç veya statik sunucu başlat:

```bash
# Python 3
python3 -m http.server 8080

# Node (npx)
npx serve -l 8080

# PHP
php -S localhost:8080
```

Ardından http://localhost:8080 açın.

## Dağıtım (Deployment)

GitHub Pages otomatik — `main` branch'e push olduğunda 1-2 dakikada yayına alınır.

GitHub Settings → Pages → Source: **`main`** / `root` olarak ayarlı.

Domain: `www.leventmarinetech.com` (CNAME dosyası üzerinden).

## Servis Kataloğu

10 ana kategori, ~80 alt hizmet. Bulker gemisinde karşılaşılan her elektrik ihtiyacı:

1. **Güç & Dağıtım** — MSB/ESB, jeneratör, AVR, shaft generator, transformer, shore power
2. **Tahrik & Motor** — bow thruster, deck crane, hatch cover, windlass, pompalar
3. **Navigasyon & GMDSS** — radar, ECDIS, gyro, autopilot, AIS/VDR, GMDSS
4. **Otomasyon & Kontrol** — AMS, IAS, PMS, PLC/SCADA, sensors
5. **Güvenlik Sistemleri** — fire detection, CO2, PA/GA, gas detection, CCTV
6. **Aydınlatma & Seyir Fenerleri** — nav lights, LED retrofit, cargo hold
7. **Test & Sertifikasyon** — ACB/MCCB, insulation, protection relay, thermography
8. **Commissioning & Retrofit** — FAT/SAT, VFD, LED, shore power, cyber security
9. **Acil Müdahale & Remote ETO** — 24h response, retainer, PSC Green Pass
10. **Class & Sertifika Hazırlığı** — Intermediate, Special, Annual, PSC, CII

## Sertifikasyon

- ETO — STCW Reg. III/6
- HV Operations (Up to 1000V) — STCW Reg. III/6
- Advanced Fire Fighting, Medical First Aid, BST
- Gas Tanker + Oil & Chemical Tanker Familiarization

## Class Otoriteleri (uyumlu rapor formatı)

DNV · BV · ABS · Lloyd's Register · Türk Loydu · RINA · ClassNK · IRS

## İletişim

- 🇹🇷 Türkiye: +90 537 650 77 76 · Velibaba Mah. No:1, Pendik / İstanbul
- 🇺🇸 USA: +1 619 384 04 03 · 32 N Gould St, Sheridan WY 82801
- ✉️ info@leventmarinetech.com

## Lisans

© 2026 Levent Marine LLC. Tüm hakları saklıdır.
