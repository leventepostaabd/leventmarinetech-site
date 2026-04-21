# Levent Marine — v2.0 Sürüm Notu

**Tarih:** 20 Nisan 2026
**Tema:** Interactive Bento Grid (Konsept C) — Deep Harbor paleti

## Nelerin değiştiği

### Tamamen yenilendi
- `index.html` — tek sayfa, bento grid tabanlı, açık tema, TR/EN toggle, tema toggle, mobil sticky aksiyon bar
- `css/design.css` — tam design system (renk tokenları, tipografi, bileşenler, dark mode, reduced-motion, print stili)
- `js/app.js` — i18n (TR/EN), 10 hizmet veri kataloğu, bento render, drawer expand, form, login, scrollspy, count-up

### Yeni servis kataloğu (10 kategori, ~80 alt hizmet)
Eski sitede 8 rotator kartı vardı. Yeni sitede bulker gemisinde karşılaşılan **her elektrik ihtiyacı** kategorize edilmiş:

1. **Güç & Dağıtım** — MSB/ESB, jeneratör, AVR, shaft generator, transformer, shore power, busbar, synchroscope
2. **Tahrik & Motor** — ana makine elektrik, bow thruster, deck crane, hatch cover, windlass, pompalar, air compressor
3. **Navigasyon & GMDSS** — radar, ECDIS, gyro, autopilot, AIS/VDR, GMDSS, echo sounder, bridge integration
4. **Otomasyon & Kontrol** — AMS, IAS, PMS, PLC/SCADA, tank level, sensörler, valve actuator, boiler control
5. **Güvenlik Sistemleri** — fire detection, CO2/HI-FOG/water mist, PA/GA, gas detection, CCTV, emergency lighting
6. **Aydınlatma & Seyir Fenerleri** — navigation lights, LED retrofit, cargo hold, engine room, emergency
7. **Test & Sertifikasyon** — ACB/MCCB, insulation, protection relay, HV switchboard, thermography, cable continuity
8. **Commissioning & Retrofit** — FAT/SAT, VFD, LED conversion, shore power, battery hybrid, cyber security
9. **Acil Müdahale & Remote ETO** — 24h onboard, retainer desk, PSC Green Pass, P&I survey desteği
10. **Class & Sertifika Hazırlığı** — Intermediate/Special/Annual, PSC, CII rating, SOLAS uyum, surveyor attendance

Her hizmet kartı tıklandığında detay drawer açılıyor (görsel + açıklama + alt hizmet listesi + CTA).

### Geliştirilenler
- `profile.html` — yeni design system'e uyumlu, minimal clean layout
- SEO: Open Graph + Twitter Card + hreflang + canonical + schema.org (ProfessionalService) eklendi
- Erişilebilirlik: ARIA roles, focus management, keyboard navigation, prefers-reduced-motion
- Mobil: hamburger menu + sticky bottom action bar (Ara / WhatsApp / Talep)
- Form: yapılandırılmış 10 alanlı servis talep formu (Gemi/IMO/Class/Hizmet/Aciliyet) + WhatsApp fallback

### Korunanlar (dokunulmadı)
- `authorized.html` + `css/authorized.css` + `js/authorized.js` — admin/class/company panel aynen çalışıyor
- Backend API (`/levent-backend-api-main/`) — hiç değişiklik yok
- `assets/logo.png`, `assets/sample-certificate.pdf` — mevcut asset'ler korundu

### Backup
- `index-v1-backup.html` — eski index (geri alma gerekirse)
- Eski CSS/JS dosyaları (`home.css`, `home.js`, `global.css`, vs.) silinmedi — authorized sayfası için gerekli

## Görsel üretimi

`assets/IMAGES.md` dosyası TÜM görsellerin üretim prompt'larını ve yerleştirileceği tam dosya yollarını içeriyor (~50 görsel, Midjourney v7 formatında).

Görsel üretmeden site çalışır durumda — her kart CSS-gradient + ikon placeholder'la düzgün görünüyor. Görsel ekledikçe otomatik olarak ilgili karta yerleşiyor.

## Canlıya alım

Mevcut GitHub Pages deploy'u dokunulmadı. Yeni dosyalar repo'ya push edildiğinde otomatik yayına alınır:
```bash
cd levent-backend-main
git add index.html profile.html css/design.css js/app.js assets/IMAGES.md CHANGELOG.md
git commit -m "v2.0: Bento grid redesign, 10-category service catalog, full i18n"
git push origin main
```

## Geri alma

Herhangi bir sorun çıkarsa:
```bash
cp index-v1-backup.html index.html
git commit -am "Revert to v1"
```

## Next steps (öneri)

1. **Görselleri üret** (IMAGES.md'den prompt'lar) — Midjourney Basic $10 paketi yeterli, ~1-2 saat üretim
2. **Logo SVG'leştir** — vectorizer.ai veya Adobe Illustrator Image Trace ile
3. **Backend form endpoint** — `/api/contact` rotasını Express'e ekle (veya Formspree/Netlify Forms ile geçici)
4. **Google Business Profile + LinkedIn Company Page** — `GELISIM-PLANI.md` içindeki 30 günlük aksiyon listesi
5. **İlk 3 lead magnet PDF** — Class Survey Checklist, Maintenance Plan, ACB Test Template
