# Levent Marine — Görsel & Video Asset Rehberi

> Tüm görsel/video/animasyon üretimi tek noktadan yönetilir.
> Bu dosya: hangi asset var, hangisi eksik, Gemini promptu, ölçü, dosya adı,
> hedef path. Yeni asset eklediğinde **bu dosyaya işle**.

**Son güncelleme:** 2026-05-20

---

## 1. Genel Stil & Mood

### Renk paleti (CSS theme ile uyumlu)
- **Navy** `#0B1F3A` — primary
- **Amber** `#F5A524` — accent / signal
- **Ink** `#0F1729` — text
- **Paper** `#F8FAFC` — background
- Sahnede: soğuk gölgeler + sıcak vurgular (amber highlights on navy/black scenes)

### Stil çıpaları
- **Sinematik** — geniş kadraj, low-key lighting, drama
- **Marine-industrial** — gerçek makine dairesi, gerçek panel, gerçek deniz
- **Otantik** — stock-photo gibi değil, gerçek iş hissi (ETO eli, scratch'lenmiş panel, ışıltılı kablo)
- **Detay zengin** — gauge, kablolar, ışıklar, switchboard'da binlerce LED
- **Yüz yok** (owner portresi hariç)

### Kadraj kuralları
- Hero & background → **16:9** veya **3:2 wide cinematic**
- Service tile → **3:2** veya **4:3**
- Blog hero → **16:9**
- About workshop → **3:2**
- Logo strip → şirket logoları gri-tonlama, eşit yükseklik

### Sinematik referanslar
- Wärtsilä kurumsal videoları (ışık, ölçek)
- "The Engineer" docü-seri (insan ölçeği, gerçek iş)
- Apple ProRes test footage'ı (renk doygunluğu)

---

## 2. Mevcut Asset Envanteri (Reuse Edilebilir)

`legacy/assets/` altında zaten **18 yüksek kaliteli görsel** var. Bunlar `public/` altına kopyalanacak (veya symlink) ve yeni 19-sistem haritasına eşlenecek.

### Hazır gerçek iş fotoğrafları (legacy/assets/works/)
| Dosya | Yeni hedef | Hangi sistem için kullanılacak |
|---|---|---|
| `shaft-earthing-device.jpg` | `public/services/11-shaft-earthing.jpg` | **Sistem 11 — Shaft Earthing** ✅ |
| `generator-avr-diode-speedcard.jpg` | `public/services/01-generator.jpg` | **Sistem 1 — Generator/AVR** ✅ |
| `fire-alarm-system.jpg` | `public/services/04-fire-alarm.jpg` | **Sistem 4 — Fire Alarm** ✅ |
| `ams-system-card-replacement.jpg` | `public/services/05-er-alarm.jpg` | **Sistem 5 — ER Alarm/Monitoring** ✅ |
| `radar-magnetron-replacement.jpg` | `public/services/06-bridge-nav.jpg` | **Sistem 6 — Bridge Navigation** ✅ |
| `crane-panel-speed-control.jpg` | `public/services/09-crane.jpg` | **Sistem 9 — Crane & Deck** ✅ |
| `motor-overhaul.jpg` | `public/services/17-ac-dc-motor.jpg` | **Sistem 17 — AC/DC Motor** ✅ |
| `water-mist-system.jpg` | `public/works/water-mist.jpg` | About sayfası — gerçek iş örneği |

### Hazır sertifika/test fotoğrafları (legacy/assets/cert/)
| Dosya | Yeni hedef | Kullanım |
|---|---|---|
| `acb-mccb-test.jpg` | `public/about/acb-test.jpg` | About — test ekipmanı |
| `insulation-testing.jpg` | `public/about/insulation-test.jpg` | About — Megger / IR test |
| `busbar-kit-2.jpg` | `public/about/busbar-kit.jpg` | About — switchboard işi |
| `class-reporting.jpg` | `public/about/class-reporting.jpg` | About — class rapor sürecimiz |

### Hero (legacy/assets/hero/)
| Dosya | Yeni hedef | Kullanım |
|---|---|---|
| `engine-room.jpg` | `public/hero/engine-room.jpg` | **Hero sol yarı (Servis)** ✅ |
| `landing-hero.jpg` | `public/hero/landing-archive.jpg` | Yedek / about page kullanımı |

### Brand
| Dosya | Hedef | Kullanım |
|---|---|---|
| `og-image.jpg` | `public/og-image.jpg` | Open Graph (sosyal paylaşım) |
| `og-image.svg` | `public/og-image.svg` | Vektör versiyon |
| `logo.svg` | `public/logo.svg` | Header logo (zaten public/ içinde de var) |
| `logo-dark.svg` | `public/logo-dark.svg` | Dark mode logo |

### Reuse Komutu (zaman geldiğinde)
```bash
# Hızlı kopyalama scripti — tek seferlik
mkdir -p public/services public/hero public/about public/works
cp legacy/assets/works/shaft-earthing-device.jpg public/services/11-shaft-earthing.jpg
cp legacy/assets/works/generator-avr-diode-speedcard.jpg public/services/01-generator.jpg
cp legacy/assets/works/fire-alarm-system.jpg public/services/04-fire-alarm.jpg
cp legacy/assets/works/ams-system-card-replacement.jpg public/services/05-er-alarm.jpg
cp legacy/assets/works/radar-magnetron-replacement.jpg public/services/06-bridge-nav.jpg
cp legacy/assets/works/crane-panel-speed-control.jpg public/services/09-crane.jpg
cp legacy/assets/works/motor-overhaul.jpg public/services/17-ac-dc-motor.jpg
cp legacy/assets/hero/engine-room.jpg public/hero/engine-room.jpg
cp legacy/assets/cert/*.jpg public/about/
cp legacy/assets/works/water-mist-system.jpg public/works/water-mist.jpg
```

---

## 3. Yeni Üretilecekler — Gemini Promptları

> Gemini'ye girerken: prompt + aspect ratio + style. Hepsinin sonuna ortak
> stil tag'i ekle: `**Style: cinematic marine industrial photography,
> low-key lighting, navy + amber palette, shallow depth of field,
> 35mm look, photorealistic, no text, no watermarks.**`

### 3.1 — HERO (Wave 0 — Agent E kullanıyor)

#### `hero/warehouse.jpg` — Hero sağ yarı (Tedarik)
- **Target:** `public/hero/warehouse.jpg`
- **Dimensions:** 2400 × 1600 (3:2)
- **Aspect:** wide cinematic
- **Prompt:**
> A modern marine spare-parts warehouse interior at night, tall shelving filled with neatly packaged electrical components and marine equipment, soft amber overhead strip lighting reflecting off polished concrete floor, a scanner light beam crossing one of the shelves, navy and amber color grading, atmospheric haze, no people, cinematic 35mm wide shot, photorealistic.

#### `hero/engine-room.jpg` — Hero sol yarı (Servis)
- **Target:** `public/hero/engine-room.jpg`
- **Mevcut:** legacy/assets/hero/engine-room.jpg ✅ (reuse)
- **Eğer regenerate edilecekse:**
- **Dimensions:** 2400 × 1600 (3:2)
- **Prompt:**
> Inside a large bulk carrier engine room, low-key lighting, multiple gauges and analog meters illuminated, an electrical control panel door open showing a busbar and breakers, slight motion blur of a hand reaching toward a fuse, navy-blue shadow tones with warm amber highlights, atmospheric, cinematic, photorealistic, no faces visible.

### 3.2 — VIDEO loops (Wave 4 — cinematic upgrade)

> Eğer Veo/Runway/Sora ile üretilecekse. Sessiz, döngülü, 8-12 saniye.

#### `hero/engine-room.webm` — Hero sol video
- **Target:** `public/hero/engine-room.webm` + `.mp4` fallback
- **Duration:** 10s loop
- **Resolution:** 1920 × 1080 (16:9)
- **File size budget:** < 4 MB (WebM VP9)
- **Prompt:**
> 10-second cinematic loop inside a working engine room: slow pan across glowing analog gauges, then a close-up of a gloved hand checking a busbar with a multimeter, sparks of indicator LEDs reflecting off polished surfaces, slow camera drift, silent, navy-amber color grade, depth of field shifts gently. Loops seamlessly back to start.

#### `hero/warehouse.webm` — Hero sağ video
- **Target:** `public/hero/warehouse.webm` + `.mp4` fallback
- **Duration:** 10s loop
- **Resolution:** 1920 × 1080
- **File size budget:** < 4 MB
- **Prompt:**
> 10-second cinematic loop in a marine parts warehouse at night: scanner light beam sweeping shelf labels, then a slow dolly past stacked boxes of electrical components, soft amber rim lighting on metal shelving, faint dust particles in the air, silent, navy-amber grade, loops seamlessly.

### 3.3 — SERVICE SYSTEM IMAGES (Wave 1 — Agent B kullanıyor)

7'si reuse, 12'si yeni üretilecek. Her biri 1600×1200 (4:3) veya 1800×1200 (3:2).

#### Sistem 2 — `public/services/02-main-engine.jpg`
- **Dimensions:** 1800 × 1200 (3:2)
- **Prompt:**
> Main engine electrical control cabinet on a commercial vessel, multiple sensors and wiring harnesses visible, governor module mounted with cable glands, navy steel housing with amber indicator LEDs, low-key engine room lighting, photorealistic, cinematic, no people.

#### Sistem 3 — `public/services/03-switchboard.jpg`
- **Prompt:**
> Marine main switchboard (MSB) panel front, multiple ACB and MCCB breakers in rows, busbars visible behind glass, voltmeters and ammeters glowing amber against navy-painted steel, technical wiring labels (not readable), wide cinematic shot, low-key lighting, photorealistic.

#### Sistem 7 — `public/services/07-gmdss.jpg`
- **Prompt:**
> GMDSS communication console on a ship's bridge at night, INMARSAT-C and VHF radio units stacked, illuminated channel displays, microphone hanging, navy console with amber rim light, calm dark ambiance, photorealistic, no faces.

#### Sistem 8 — `public/services/08-bwts.jpg`
- **Prompt:**
> Ballast Water Treatment System (BWTS) unit in a vessel's pump room, large cylindrical UV reactor housing, copper pipework, control panel with status LEDs, navy-painted housing, amber warning lights, slight steam, photorealistic, cinematic, no people.

#### Sistem 10 — `public/services/10-bilge-level.jpg`
- **Prompt:**
> A bilge level sensor mounted to a ship's bilge well, capacitive sensor probe descending into dark water, wiring conduit, alarm indicator panel above, navy-amber lighting, dramatic angle, photorealistic, cinematic.

#### Sistem 12 — `public/services/12-plc-automation.jpg`
- **Prompt:**
> Industrial PLC (Siemens or Allen-Bradley style) mounted in a marine automation cabinet, multiple I/O modules with status LEDs, neatly bundled cables, HMI touch screen visible, navy cabinet interior with amber indicator lights, technical, cinematic close-up.

#### Sistem 13 — `public/services/13-lighting.jpg`
- **Prompt:**
> LED retrofit deck floodlight installation on a cargo ship at dusk, electrician hands (no face) tightening a fixture, glowing LED panel face, navy steel housing, soft amber sunset light reflecting off ship structure, photorealistic, cinematic.

#### Sistem 14 — `public/services/14-battery-ups.jpg`
- **Prompt:**
> Marine battery bank and UPS cabinet, multiple sealed lead-acid or lithium battery modules in racks, wiring harnesses with color-coded labels, monitoring panel with green/amber LEDs, navy cabinet, low-key lighting, photorealistic, cinematic.

#### Sistem 15 — `public/services/15-shore-connection.jpg`
- **Prompt:**
> Shore power connection panel on a ship's main deck at port, heavy-duty cable receptacle, navy steel cover with safety markings (unreadable), thick orange shore cable plugged in, dramatic harbor lighting in background, photorealistic.

#### Sistem 16 — `public/services/16-transformer.jpg`
- **Prompt:**
> Marine three-phase step-down transformer in a vessel's electrical room, ribbed metallic housing, primary and secondary cables exiting through cable glands, navy enclosure, amber inspection light, photorealistic, technical, cinematic.

#### Sistem 18 — `public/services/18-hvac-automation.jpg`
- **Prompt:**
> HVAC control automation cabinet on a vessel, PLC modules driving chilled water valves, temperature sensors visible at the top, navy cabinet interior with amber indicator lights, ducting visible behind, photorealistic, cinematic.

#### Sistem 19 — `public/services/19-cctv-vdr.jpg`
- **Prompt:**
> Voyage Data Recorder (VDR) and CCTV camera mounted near a vessel's bridge wing, weatherproof navy steel housing, multiple Ethernet cables, status LEDs glowing amber, drizzle catching light, photorealistic, cinematic, no faces.

### 3.4 — SUPPLY CATEGORIES (Wave 2 — Agent C kullanıyor)

#### `public/supply/01-marine-electric.jpg`
- **Dimensions:** 2000 × 1200 (5:3 wide)
- **Prompt:**
> A glass shelf in a marine parts warehouse displaying marine-grade electrical components: radar magnetrons, AVR modules, marine sensors, navigation light bulbs. Amber overhead lighting, navy backdrop, polished glass reflections, cinematic, photorealistic, no people.

#### `public/supply/02-general-electric.jpg`
- **Prompt:**
> Industrial electrical components arranged on workshop shelving: ABB-style breakers, contactors, motor drives, cable spools color-coded. Clean industrial environment, amber LEDs on test panel in background, navy color grade, cinematic.

#### `public/supply/03-general-marine.jpg`
- **Prompt:**
> Marine hardware on a wooden workshop table: brass valves, marine fittings, stainless fasteners, gauges. Warm amber side light, navy table runner, cinematic photorealistic, no people.

#### `public/supply/photo-upload-illustration.svg`
- **Format:** Inline SVG (animasyonlu)
- **Talimat:** Statik bir nameplate fotoğrafı ikonu, üstüne yarı saydam "scan" satırı yukarıdan aşağı geçer (CSS animasyon). Renk: navy + amber. Boyut 240×240. Bu dosya kod olarak yazılacak (component içinde inline), promptla üretmeye gerek yok.

### 3.5 — ABOUT (Wave 3 — Agent D kullanıyor)

#### `public/about/owner-portrait.jpg` — Sahibin portresi
- **Dimensions:** 1200 × 1500 (4:5 portre)
- **Çekim notu:** Bu **gerçek fotoğraf** olmalı, AI değil. Aşağıdaki yönergeye göre kendin çek/çektir:
  > Profesyonel portre — koyu navy kazak veya teknik tulum, makine dairesi/atölye arka plan (off-focus), amber sıcak yan ışık, doğal yüz ifadesi (gülümseme zorunlu değil), 50mm prime lens hissi, sığ alan derinliği.
- **Alternatif:** Eğer gerçek portre yoksa silüet versiyon kullan (aşağıda).

#### `public/about/owner-silhouette.jpg` — Sahip silüet (gerçek portre yoksa)
- **Prompt:**
> Silhouette of a marine engineer standing in front of an open engine control panel, low-angle backlight from gauges and LEDs creating amber rim light, no facial details visible, navy and amber palette, cinematic, photorealistic.

#### `public/about/workshop-wide.jpg` — Atölye geniş
- **Dimensions:** 2400 × 1200 (2:1 cinematic)
- **Prompt:**
> Wide cinematic shot of a professional marine electrical workshop, organized test bench with multimeters, megger, oscilloscope, ACB/MCCB test rig, neatly hung tools on pegboard, navy and amber lighting, photorealistic, no people.

### 3.6 — KNOWLEDGE / BLOG (Wave 3 — Agent D kullanıyor)

#### `public/knowledge/bwts-troubleshooting.jpg`
- **Dimensions:** 2000 × 1125 (16:9)
- **Prompt:**
> Close-up of a BWTS UV reactor with control panel open, hand holding diagnostic clip leads (no face), green check-mark LED illuminated, navy housing with amber indicators, cinematic photorealistic.

#### `public/knowledge/avr-diagnostics.jpg`
- **Prompt:**
> An AVR module removed from a marine generator, laid on a workbench with a multimeter showing a reading, oscilloscope screen blurred in background, navy bench surface, amber bench light, cinematic photorealistic.

#### `public/knowledge/aog-vessel.jpg`
- **Prompt:**
> A bulker tied alongside a port at night, gangway lit by amber sodium lights, vessel hull shadow dominant, single dramatic floodlight on the cargo deck, navy night sky with port lights bokeh, cinematic photorealistic, no faces.

### 3.7 — CUSTOMER LOGO STRIP (Wave 3 — Agent D)

> Mevcut müşteri logoları telifli. Gerçek SVG/PNG'ler şu an public/ içinde yok.
> İki seçenek:
> - **A — Logoları üreticilere isteyip ekle** (önerilen): MSC, TP Offshore, Polaris, Bright, Çebi, NORD. Her biri yatay PNG/SVG, transparan zemin.
> - **B — Tipografik versiyon:** Agent D'nin LogoStrip component'i her şirket adını uniform monospace/sans-serif font'ta gri tonlamada gösterir (logo yokken).

Eğer ileride logoları ekleyeceksen:
- **Target:** `public/logos/[slug].svg`
- **Slugs:** msc, tp-offshore, polaris, bright, cebi, nord
- **Dimensions:** 200 × 80 (her biri eşit yükseklik, transparent BG)
- **Renk:** Tek renk, gri `#5B6B82` veya `currentColor`

### 3.8 — SERTİFİKA ROZETLERİ (Wave 3 — Agent D)

> Bunlar **görsel değil**, Agent D CertBadges.tsx component'inde tipografik chip olarak yapacak. Üretime gerek yok.

### 3.9 — OG / SOSYAL PAYLAŞIM

#### `public/og-image.jpg` — Open Graph (Twitter/LinkedIn/WhatsApp paylaşımı)
- **Dimensions:** 1200 × 630 (Open Graph standart)
- **Mevcut:** legacy/assets/brand/og-image.jpg ✅ (kontrol edilmeli, eskimişse yeniden)
- **Prompt (eğer yeniden):**
> Open Graph banner: ship engine room background with engineer silhouette (no face) inspecting a switchboard, large slogan overlay "Marine Electrical Service & Parts Supply — 24/7 Worldwide" in Inter Bold white text, Levent Marine logo bottom-right, navy-amber gradient, cinematic photorealistic.

### 3.10 — FAVICON / APPLE TOUCH

#### `public/favicon.ico` + `public/apple-touch-icon.png`
- **Mevcut:** logo.svg / logo.png — bunlardan üretilir.
- **Komut (zaman geldiğinde):**
```bash
# ImageMagick veya Sharp ile
# favicon.ico (32×32, 16×16 multi-res)
# apple-touch-icon.png (180×180)
```

---

## 4. Animasyonlar (Kod ile — Gemini'ye gerek yok)

Bu animasyonlar React component içinde **CSS/JS olarak** yapılacak. Görsel üretim gerekmez. Sadece referans için listeliyorum:

| Animasyon | Yer | Kütüphane / yöntem |
|---|---|---|
| Hero buton hover yükselişi | Agent E — HeroDoor | CSS `transform: scale(1.02)` |
| Acil buton nabız (pulse) | Agent E — EmergencyModal trigger | CSS `@keyframes pulse` (kırmızı glow) |
| Logo strip yatay kayma | Agent D — LogoStrip | CSS `@keyframes marquee` |
| USA harita port noktaları pulse | Agent D — USAMap | SVG `<animate>` veya Framer Motion |
| Service grid stagger reveal | Agent B — Services index | Framer Motion `staggerChildren` |
| Photo upload "scan" çizgisi | Agent C — PhotoUpload | CSS gradient sweep |
| Modal açılış slide | Tüm modaller | Framer Motion `AnimatePresence` |
| Page transition (yatay swipe) | Site geneli | Framer Motion `LayoutGroup` veya Next.js view transitions |

**Kütüphane kararı:** Framer Motion (lightweight, Next.js uyumlu, çoğu animasyon için yeterli). Eğer hero için **anime.js** veya **GSAP** isterse Wave 4'te eklenebilir.

---

## 5. Dosya Adlandırma Kuralı

```
public/
├── hero/          # Ana ekran (engine-room.jpg, warehouse.jpg, *.webm)
├── services/      # 01-generator.jpg ... 19-cctv-vdr.jpg (her sistem)
├── supply/        # 01-marine-electric.jpg, 02-general-electric.jpg, 03-general-marine.jpg
├── about/         # owner-portrait.jpg, workshop-wide.jpg, acb-test.jpg, vs.
├── knowledge/     # blog-post-slug.jpg (her yazı için 16:9 hero)
├── works/         # gerçek iş örnekleri (water-mist.jpg, vb. legacy'den)
├── logos/         # müşteri logoları (msc.svg, polaris.svg, vs.)
├── og-image.jpg   # Sosyal paylaşım
├── favicon.ico    # Browser tab
├── apple-touch-icon.png  # iOS home screen
├── logo.svg       # Brand logo
└── logo-dark.svg  # Dark mode logo
```

**Slug kuralı:** lowercase + kebab-case. ID prefix sistem dosyalarında (01-, 02-...) → URL ile uyumlu kalır.

---

## 6. Kalite Standartları

| Tip | Format | Min boyut | Max dosya | Notlar |
|---|---|---|---|---|
| Hero image | WebP + JPG fallback | 2400 × 1600 | 400 KB (WebP) | Next/Image otomatik optimize eder |
| Service tile | WebP + JPG | 1800 × 1200 | 200 KB | |
| Blog hero | WebP + JPG | 2000 × 1125 | 250 KB | |
| Hero video | WebM (VP9) + MP4 (H.264) | 1920 × 1080 | 4 MB | Sessiz, 8-12s loop, seamless |
| Logo | SVG | vektör | 10 KB | Tek renk, currentColor |
| OG image | JPG | 1200 × 630 | 200 KB | Sosyal medya zorunlu boyut |
| Favicon | ICO | 32×32 (multi) | 5 KB | |

**Compression:** Hepsi `sharp` veya `squoosh.app` ile sıkıştırılır push'tan önce.

---

## 7. Üretim Akışı (Pratik)

### Senin yapacakların (Gemini / Veo / Runway)
1. Yukarıdaki 12 servis görseli (3.3) — Gemini Imagen
2. 3 supply kategorisi (3.4) — Gemini Imagen
3. 3 blog hero (3.6) — Gemini Imagen
4. About portre (3.5) — gerçek fotoğraf, kendin / fotoğrafçı
5. 2 hero video (3.2) — Veo / Runway / Sora (en cinematic olan)

### Benim yapabileceğim (kodla)
- Inline SVG'ler (Photo upload scan animasyonu, USA map, logo strip tipografi)
- Tüm CSS/JS animasyonlar
- Image optimization pipeline (next/image config)
- Legacy assets'ten public/'a kopyalama scripti

### Sıra
1. **Önce reuse:** Section 2'deki komut çalıştırılır, 18 görsel public/'a alınır. Site %80 hazır görselli hale gelir.
2. **Eksik 12 servis görseli:** Hafta içi Gemini'den çıkar, yüklenir.
3. **Supply kategorileri (3):** Gemini.
4. **Blog hero (3):** Yazı ile birlikte Gemini.
5. **About portre:** Gerçek çekim.
6. **Hero video (Wave 4):** En son. Statik fotoğraf → video upgrade.

---

## 8. Güncelleme Kuralı

Yeni asset eklediğinde **buraya işle**:
- Bölüme uygun yere ekle (services/supply/about/knowledge)
- Dosya adı + path + ölçü + (yeni üretilecekse) Gemini prompt
- "Mevcut Asset Envanteri" tablosunu güncelle

Asset değiştiğinde (yenisi geldi, eskisi değiştirildi) → eski satırı sil veya `~~strike-through~~` yap.
