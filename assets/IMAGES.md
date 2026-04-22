# LEVENT MARINE — Görsel Üretim Rehberi

> **Tek blokta tam prompt + dosya yolu:** `docs/image-prompts-copypaste.md`  
> **Master plan (boyut, süre, galeri):** `docs/visual-refresh-master-plan.md`  
> Aşağıdaki `01-power-systems` vb. numaralı isimler **eski taslak**; canlı sitede `assets/services/power-distribution.jpg` gibi **isimler** kullanılır (`js/app.js`).

Bu dosya site'de kullanılan TÜM görsel için üretim prompt'larını, dosya adlarını ve yerleştirileceği tam yolu listeler.

## Genel Yaklaşım

- **AI Üretici tercih sırası:** Midjourney v7 (cinematic foto) > Flux 1.1 Pro (ekipman doğruluğu) > Ideogram 2.0 (metinli görsel) > Adobe Firefly (ticari güvence)
- **Stil referans:** Her prompt sonuna `--style raw --v 7 --ar [oran] --sref [seed]` (Midjourney için). İlk üretilen görselden stil referansı alıp diğerlerinde aynı DNA'yı kullan.
- **Renk teması:** Deep Harbor paletine uyum — koyu navy (#0B1F3A), amber accent (#F5A524), off-white zemin
- **Format:** Üretildikten sonra `jpg` olarak kaydet (hero 85% kalite, kart 80%). WebP alternatif oluşturulabilir.

## Üretim Komut Seti (Midjourney + Flux)

Her bölümde:
1. **Dosya yolu** — görseli tam olarak nereye koyacağın
2. **Oran** — üretim sırasında kullanılacak aspect ratio
3. **Prompt** — kopyalayıp AI'a yapıştırılacak metin
4. **Not** — alternatif prompt veya düzenleme ipucu

---

## 1. HERO & MARKA

### `assets/brand/og-image.jpg` (1200×630)
**Oran:** `--ar 16:9` (sonra 1200×630 crop)
```
cinematic wide shot of a large bulk carrier at golden hour, calm Bosphorus waters, deep navy gradient sky, subtle amber signal lights on deck, minimalist composition with space for logo overlay on left third, photorealistic, Fuji X-T5 look, editorial photography --ar 16:9 --style raw --v 7
```
**Not:** Site'de Open Graph meta tag için. WhatsApp, LinkedIn paylaşımında bu görünür.

### `assets/hero/hero-bg.jpg` (2400×1600, koyu ton)
**Oran:** `--ar 3:2`
```
ultra-wide cinematic shot of bulk carrier engine room, main switchboard with amber and green status LEDs, cool blue ambient light mixed with warm tungsten work lamps, dramatic depth of field, volumetric haze, industrial photorealism, editorial quality --ar 3:2 --style raw --v 7
```
**Not:** Hero section arkaplanı — CSS'te %15 opacity + koyu overlay.

### `assets/hero/hero-signal-wave.svg`
**Üretim:** AI değil, SVG motif. Zaten inline olarak `design.css`'te tanımlı. Ayrı dosya istersen aşağıda oluşturulacak.

---

## 2. HİZMET KARTLARI (10 ana kategori)

Her biri 3:2 oranında, karta gömülecek. Kart içinde gradient overlay + metin üstüne gelecek.

### `assets/services/01-power-systems.jpg`
**Oran:** `--ar 3:2`
```
close-up of marine main switchboard panel, vertical busbars, insulated cable terminations, analog gauges and digital meters, professional photography, deep navy and amber accent lighting, tack-sharp focus on copper busbar --ar 3:2 --style raw --v 7
```

### `assets/services/02-propulsion-motors.jpg`
**Oran:** `--ar 3:2`
```
industrial photograph of large marine electric motor with windings visible, technician hands inspecting insulation, warm key light, cool fill light, shallow depth of field, editorial documentary style --ar 3:2 --style raw --v 7
```

### `assets/services/03-navigation-comms.jpg`
**Oran:** `--ar 3:2`
```
modern ship bridge console at dusk, radar display with green sweep glow, ECDIS chart on LCD, multiple navigation instruments, moody cinematic lighting, reflections on black glass console, photorealistic --ar 3:2 --style raw --v 7
```

### `assets/services/04-automation-control.jpg`
**Oran:** `--ar 3:2`
```
close-up of industrial PLC cabinet inside marine engine control room, colored Ethernet cables organized in bundles, labeled terminal blocks, teal and amber indicator lights, clinical sharp focus, engineering photography --ar 3:2 --style raw --v 7
```

### `assets/services/05-safety-systems.jpg`
**Oran:** `--ar 3:2`
```
marine fire detection panel mounted on bulkhead, red and green LEDs, protective glass cover, emergency signage background, dramatic side lighting, photorealistic industrial documentation --ar 3:2 --style raw --v 7
```

### `assets/services/06-lighting-nav-lights.jpg`
**Oran:** `--ar 3:2`
```
bulk carrier navigation lights at twilight, masthead light glowing amber against navy blue sky, ship silhouette, cinematic wide composition, editorial maritime photography --ar 3:2 --style raw --v 7
```

### `assets/services/07-testing-certification.jpg`
**Oran:** `--ar 3:2`
```
hands of a marine electrician operating SVERKER 900 protection relay test set connected to switchboard with multicolor test leads, laptop with test report open, clinical workshop lighting, sharp focus on test device display --ar 3:2 --style raw --v 7
```

### `assets/services/08-commissioning-retrofit.jpg`
**Oran:** `--ar 3:2`
```
engineer wearing navy blue coverall and hard hat commissioning new marine switchboard in a shipyard, LED indicators illuminated for the first time, golden hour light through shipyard window, photorealistic --ar 3:2 --style raw --v 7
```

### `assets/services/09-emergency-response.jpg`
**Oran:** `--ar 3:2`
```
marine technician with headlamp working on electrical panel in engine room at night, focused concentration, warm work light, deep shadow background, dramatic documentary photography --ar 3:2 --style raw --v 7
```

### `assets/services/10-class-prep.jpg`
**Oran:** `--ar 3:2`
```
marine surveyor in white coverall with clipboard inspecting ship electrical equipment with flashlight, technician standing nearby, professional class survey documentation scene, clinical lighting --ar 3:2 --style raw --v 7
```

---

## 3. HIZMET DETAY KAPAĞI (drawer içi)

Her hizmet drawer'ı açılırken tepede 16:5 oranında geniş görsel. Opsiyonel, `.jpg` olarak.

### `assets/services/detail-power.jpg`
**Oran:** `--ar 16:5`
```
ultra-wide panoramic view of large marine main switchboard, rows of ACB and MCCB breakers, busbar chamber visible, editorial industrial photography, deep navy and amber accent --ar 16:5 --style raw --v 7
```

### `assets/services/detail-testing.jpg`
**Oran:** `--ar 16:5`
```
panoramic documentary photo of SVERKER 900, Megger MIT insulation tester and Fluke 1587 arranged on workbench with cables, clipboard with test report, clinical bright lighting, photorealistic --ar 16:5 --style raw --v 7
```

### `assets/services/detail-navigation.jpg`
**Oran:** `--ar 16:5`
```
panoramic photograph of modern ship bridge with multiple ECDIS displays, radar, autopilot console, twilight lighting through bridge windows showing calm sea, cinematic --ar 16:5 --style raw --v 7
```

### `assets/services/detail-automation.jpg`
**Oran:** `--ar 16:5`
```
ultra-wide shot of engine control room with integrated automation system displays, alarm monitoring screens, operator chair in foreground, moody blue ambient lighting --ar 16:5 --style raw --v 7
```

### `assets/services/detail-safety.jpg`
**Oran:** `--ar 16:5`
```
panoramic shot of engine room fire detection installation with smoke and heat detectors on overhead, CO2 system piping visible, clinical documentation photography --ar 16:5 --style raw --v 7
```

### `assets/services/detail-lighting.jpg`
**Oran:** `--ar 16:5`
```
panoramic view of bulk carrier deck at night with LED floodlights illuminating hatch covers, masthead navigation light visible, photorealistic maritime photography --ar 16:5 --style raw --v 7
```

### `assets/services/detail-propulsion.jpg`
**Oran:** `--ar 16:5`
```
panoramic shot of large marine electric motor undergoing maintenance, windings exposed, technician in foreground with digital multimeter, editorial industrial documentation --ar 16:5 --style raw --v 7
```

### `assets/services/detail-commissioning.jpg`
**Oran:** `--ar 16:5`
```
panoramic view of new shipyard construction, crane overhead, workers in high-vis vests installing cable trays, golden hour lighting --ar 16:5 --style raw --v 7
```

### `assets/services/detail-emergency.jpg`
**Oran:** `--ar 16:5`
```
panoramic night shot of bulk carrier docked with emergency work lights active on deck, technician silhouette on upper deck, dramatic cinematic lighting --ar 16:5 --style raw --v 7
```

### `assets/services/detail-class.jpg`
**Oran:** `--ar 16:5`
```
panoramic documentation scene of class surveyor reviewing test reports on ship with technician presenting equipment, clinical bright lighting, professional editorial style --ar 16:5 --style raw --v 7
```

---

## 4. PROJE VAKALARI (carousel)

Her biri 16:10 oranında.

### `assets/projects/proj-01-acb-mccb.jpg`
```
professional documentation photo of newly tested ACB and MCCB breakers in main switchboard, amber LED indicators, clean organized cable labeling, editorial industrial photography --ar 16:10 --style raw --v 7
```

### `assets/projects/proj-02-avr-shaft.jpg`
```
close-up of marine generator AVR module being replaced, technician hands with screwdriver, shaft earthing brush visible, warm work light, documentary photography --ar 16:10 --style raw --v 7
```

### `assets/projects/proj-03-fire-mist.jpg`
```
modern marine fire detection panel with addressable loops, mounted clean on bulkhead, water mist piping in background, professional installation documentation --ar 16:10 --style raw --v 7
```

### `assets/projects/proj-04-motor-overhaul.jpg`
```
large marine motor partially disassembled on shop floor, rotor and stator visible, technician inspecting windings, dramatic workshop lighting --ar 16:10 --style raw --v 7
```

### `assets/projects/proj-05-radar-bridge.jpg`
```
new radar magnetron being installed on ship mast platform, technician in safety harness, port Bosphorus view in background, editorial maritime photography --ar 16:10 --style raw --v 7
```

### `assets/projects/proj-06-pms-retrofit.jpg`
```
Power Management System HMI touch screen showing generator load share, technician fingers on screen, colored indicator lights, close-up industrial photography --ar 16:10 --style raw --v 7
```

### `assets/projects/proj-07-led-conversion.jpg`
```
before-after split composition of ship deck lighting, left side old yellow halogen fixtures, right side bright white LED floodlights, editorial comparison photography --ar 16:10 --style raw --v 7
```

### `assets/projects/proj-08-crane-panel.jpg`
```
marine deck crane electrical control panel with variable frequency drive, open cabinet showing labeled contactors and terminal blocks, professional installation photography --ar 16:10 --style raw --v 7
```

---

## 5. EKİPMAN VİTRİNİ

### `assets/equipment/sverker-900.jpg`
**Oran:** `--ar 4:3`
```
professional product photography of Megger SVERKER 900 protection relay test set on dark slate surface, multicolor test leads coiled, diagonal amber accent lighting, crisp focus --ar 4:3 --style raw --v 7
```

### `assets/equipment/megger-mit.jpg`
**Oran:** `--ar 4:3`
```
professional product photography of Megger MIT insulation resistance tester with probes, dark slate surface, amber accent light, clean minimal composition --ar 4:3 --style raw --v 7
```

### `assets/equipment/fluke-1587.jpg`
**Oran:** `--ar 4:3`
```
professional product photography of Fluke 1587 insulation multimeter on dark slate, yellow body contrasting with navy background, clean minimal product shot --ar 4:3 --style raw --v 7
```

### `assets/equipment/thermal-imager.jpg`
**Oran:** `--ar 4:3`
```
professional product photography of FLIR thermal imager camera on dark slate surface, display showing heat map of electrical panel, amber accent lighting --ar 4:3 --style raw --v 7
```

### `assets/equipment/toolkit-flatlay.jpg`
**Oran:** `--ar 1:1`
```
top-down flat lay of marine electrical toolkit on dark slate surface: Fluke multimeter, insulation tester, torque wrench, cable ties, safety gloves, headlamp, warm amber accent light from one side, editorial product photography --ar 1:1 --style raw --v 7
```

---

## 6. HAKKIMIZDA

### `assets/about/pendik-office.jpg`
**Oran:** `--ar 3:2`
```
documentary photograph of marine electrical workshop interior in Pendik Istanbul, Turkish flag subtle in background, organized testing equipment on shelves, warm window light, editorial industrial photography --ar 3:2 --style raw --v 7
```

### `assets/about/wyoming-office.jpg`
**Oran:** `--ar 3:2`
```
modern minimal office interior with American flag subtle, desk with laptop showing marine documentation, clean professional photography, Wyoming mountain view through window suggested --ar 3:2 --style raw --v 7
```

### `assets/about/bosphorus-bulker.jpg`
**Oran:** `--ar 16:9`
```
panoramic cinematic photograph of bulk carrier passing through Bosphorus strait at blue hour, Istanbul skyline distant, calm water reflections, editorial maritime photography, deep navy sky with amber city lights --ar 16:9 --style raw --v 7
```

### `assets/about/technician-hands.jpg`
**Oran:** `--ar 4:3`
```
close-up hands of a marine electrician in navy blue coverall using a digital multimeter on a control cabinet, blurry wiring background, no face visible, Fuji X-T5 look, 35mm, f/2, natural window light --ar 4:3 --style raw --v 7
```

### `assets/about/team-silhouette.jpg`
**Oran:** `--ar 16:9`
```
silhouettes of three technicians in coveralls walking along ship deck at dawn, back lit, editorial documentary style, hopeful cinematic composition, no identifiable faces --ar 16:9 --style raw --v 7
```

---

## 7. PROSES / İNFOGRAFİK

### `assets/brand/process-isometric.svg`
**Üretim:** SVG vector — Figma/Illustrator'da çizilecek veya AI'dan PNG olarak alınıp trace edilecek.
**Alternatif prompt (PNG için):**
```
isometric technical illustration of a ship electrical system workflow, 5 numbered stages connected by amber arrow flow, thin 2px navy blue line art on off-white background, minimal blueprint aesthetic --ar 2:1 --style raw --v 7
```

### `assets/brand/bulker-cutaway.svg`
**Alternatif prompt:**
```
isometric cutaway technical illustration of a bulk carrier ship showing main electrical systems (engine room, bridge, cargo holds with sensors, deck machinery, navigation mast), thin 2px navy blue line art on white background, amber highlight on 4 key electrical zones, blueprint engineering aesthetic --ar 16:9 --style raw --v 7
```
**Not:** Bu bir "tıklanabilir hotspot" haritası olarak kullanılabilir — her amber highlight bir hizmet kategorisine götürür.

---

## 8. BACKGROUND & MOTİF

### `assets/brand/wave-pattern.svg` (tile-able SVG)
Signal wave motif — `design.css` içinde inline SVG olarak tanımlanmış. Ayrı dosya istersen üretilecek.

### `assets/brand/tuzla-shipyard-bg.jpg`
**Oran:** `--ar 21:9`
```
panoramic drone photograph of Tuzla shipyard at golden hour, multiple cranes, bulk carriers in dry dock, Istanbul silhouette beyond, editorial aerial photography, deep shadows --ar 21:9 --style raw --v 7
```

### `assets/brand/engine-room-wide.jpg`
**Oran:** `--ar 21:9`
```
ultra-wide panoramic engine room of bulk carrier, main engine on right, generators left, deep depth of field, dramatic industrial lighting, cinematic maritime photography --ar 21:9 --style raw --v 7
```

---

## 9. SLD (SINGLE LINE DIAGRAM)

### `assets/brand/sld-typical.svg`
**Üretim yöntemi:** Figma'da IEC 60617 sembolleri ile çizilmeli. AI'dan çıkmaz, mühendislik doğruluğu gerekli.
**Not:** Yerleşim: certification section'ının içinde. İnteraktif — hover/tap ile her eleman tooltip açılır.

---

## 10. FAVİCON & LOGO

### `assets/logo.svg` (vektör logo — bir kerelik üretim)
Mevcut `logo.png` → SVG'ye dönüştürülmeli. Dönüştürme yolu:
1. `logo.png`'yi yüksek çözünürlükte tara/aç
2. [Vectorizer.AI](https://vectorizer.ai) veya Adobe Illustrator Image Trace ile SVG'ye çevir
3. SVG'yi `currentColor` destekli hale getir (fill="currentColor")
4. Üç varyant: primary (renkli), mono-dark, mono-light

Eğer logoyu yeniden tasarlatmak istersen, prompt:
```
minimalist monogram logo combining letter L with a subtle sine wave pattern suggesting both ocean wave and electrical voltage signal, modern geometric sans-serif, single color navy #0B1F3A, square aspect ratio, clean vector style, professional B2B brand identity --ar 1:1 --style raw --v 7 --no gradient text
```

### `assets/favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`
Tek SVG logo'dan üretilir — [RealFaviconGenerator.net](https://realfavicongenerator.net) ile otomatik.

---

## ÜRETİM İŞ AKIŞI (öneri)

1. **Hafta 1:** Hero + OG image + 10 service card image (13 görsel) — Midjourney ile $10 paket yeterli
2. **Hafta 2:** 10 detail cover + 8 proje + 5 ekipman (23 görsel)
3. **Hafta 3:** About görselleri (5) + SLD + izometrik illustration (Figma'da manuel çizim)
4. **Hafta 4:** Logo SVG revizyonu + favicon paketi + OG paylaşım testleri

**Toplam:** ~50 görsel. Midjourney Basic $10 ile ~200 üretim hakkın olur; denemeler dahil fazlasıyla yeter.

## HIZLI ÜRETIM (tek prompt paketi)

Zaman kısıtlıysan aşağıdaki 10 prompt'u kopyala-yapıştır ile Midjourney'e ver; site v1 için yeterli:

```
# 1. Hero BG
cinematic wide shot of bulk carrier engine room main switchboard, amber and green LED indicators, cool blue ambient light, volumetric haze, industrial photorealism --ar 16:9 --style raw --v 7

# 2. Power Systems
close-up of marine main switchboard vertical busbars with insulated terminations, deep navy and amber accent lighting --ar 3:2 --style raw --v 7

# 3. Propulsion
large marine electric motor with visible windings, technician hands inspecting, warm key light, editorial industrial --ar 3:2 --style raw --v 7

# 4. Navigation
modern ship bridge console at dusk, radar display green sweep, ECDIS chart on LCD, cinematic --ar 3:2 --style raw --v 7

# 5. Automation
marine PLC cabinet with color-coded Ethernet cables, terminal blocks, teal indicator lights, engineering photography --ar 3:2 --style raw --v 7

# 6. Safety
marine fire detection panel with red-green LEDs on bulkhead, dramatic side lighting, industrial documentary --ar 3:2 --style raw --v 7

# 7. Lighting
bulk carrier navigation lights at twilight, masthead light glowing amber, ship silhouette, cinematic maritime --ar 3:2 --style raw --v 7

# 8. Testing
hands operating SVERKER 900 protection relay test set, multicolor leads, laptop with report, workshop lighting --ar 3:2 --style raw --v 7

# 9. Commissioning
engineer in navy coverall commissioning new marine switchboard, LED indicators illuminated, golden hour light, photorealistic --ar 3:2 --style raw --v 7

# 10. Class Prep
marine surveyor in white coverall with clipboard inspecting electrical equipment, clinical lighting, professional --ar 3:2 --style raw --v 7
```

Üretim tamamlanınca her görseli belirtilen `.jpg` adıyla `assets/...` altına yerleştir. Site otomatik tanır.

---

## GEÇICI GÖRSEL — PLACEHOLDER

Site hemen canlı olsun istersen, her görsel yerine CSS-gradient placeholder otomatik gösterilir (site kodunda `onerror` yedekli). Görsel üretildikçe ekle, site güncellenir.
