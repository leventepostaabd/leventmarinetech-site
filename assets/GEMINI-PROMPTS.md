# Gemini Görsel Üretim Paketi — Levent Marine v4 (SPA)

Bu paket Gemini (Google Imagen / Gemini 2.0 Flash with image generation) kullanmana göre hazırlanmıştır. Her prompt **tek-parça, kopyala-yapıştır** formatında. Dosya adı + path + boyut + alt-text her görselin başında.

**Önemli:** Gemini image gen genelde 1:1 (1024×1024) veya 16:9 (1920×1080) üretir. İhtiyacın olan oran farklıysa belirtilen "ChatGPT/Squoosh ile kırp" notunu uygula veya prompt'a "framed for 4:3 crop" gibi ek hint koy.

**Stil tutarlılığı için (Gemini sürümü):** İlk üretimden sonra "use the same lighting, palette and grain as the previous image" diyerek devamlılığı sağla. Tek oturumda hepsini üret.

---

## ÖNCELİK SIRASI

**Tier 1 — Aşağıdaki 4 görsel olmadan site eksik:**
1. **L1 Landing Hero** (büyük arka plan)
2. **S1 Power & Distribution** (servis tile)
3. **S2 Materials Desk** (tile arka plan veya teaser)
4. **OG1 Social share image**

**Tier 2 — Servis tile'larının kalanı (10 adet):**
5–14. Service cards (`assets/services/02-...` ila `11-...`)

**Tier 3 — İsteğe bağlı:**
15–22. Project photos (`assets/projects/`)
23–25. Blog hero'lar (`assets/blog/`)

---

## TIER 1 — KRİTİK 4 GÖRSEL

### L1 · Landing Hero — büyük, dramatik

**Dosya:** `assets/hero/landing-hero.jpg`
**Klasör:** `assets/hero/` (zaten var)
**Boyut hedefi:** 2560×1440 (16:9). Gemini 1920×1080 üretir, squoosh.app ile %33 büyüt veya AI upscaler kullan.
**Alt-text:** "Marine engineer at work in a bulker engine room — main switchboard inspection"

**Prompt (tek parça):**

> Cinematic wide-angle photograph inside the engine room of a working bulk carrier, taken at eye level. In the foreground a marine electrical engineer in a clean navy-blue coverall holds a multimeter probe to a busbar inside an opened main switchboard cabinet; one Air Circuit Breaker drawer is half-extended, copper conductors glinting. Lighting mixes cool overhead fluorescent with a single amber emergency lamp glowing in the deep background and a small warm task light casting an amber pool on the workspace. The bulkhead is industrial gray with neatly bundled color-coded cables, steel grating floor with subtle reflections, several pipes running overhead. Atmosphere is professional, focused, slightly serious — documentary photojournalism, not staged. 35mm grainy film aesthetic, deep navy and steel tones with strong amber highlights, no readable text on any signs or screens, no brand logos or watermarks. Cinematic 16:9 widescreen frame, shallow depth of field on the engineer's hands.

---

### S1 · Power & Distribution (servis kartı)

**Dosya:** `assets/services/01-power-distribution.jpg`
**Klasör:** `assets/services/` (oluştur: `mkdir -p assets/services`)
**Boyut:** 1600×1200 (4:3). Gemini 1:1 üretir → squoosh ile 4:3 crop.
**Alt-text:** "Open main switchboard with ACB and busbars during inspection"

**Prompt:**

> Close-up photograph of an opened ship's main switchboard cabinet on a bulk carrier. Bright copper busbars run horizontally across the frame; two Air Circuit Breaker (ACB) drawers are visible — one fully racked in, one half-extended. A gloved engineer's hand points at a busbar with an insulated screwdriver. On a portable workbench in the lower corner: a thermal imaging camera, a torque wrench, and a notebook with handwritten measurements. Lighting is cool fluorescent from above with a warm task lamp from the side creating a soft amber pool over the work area. Visible bulkhead bolts and color-coded cable bundles at the frame edges. Documentary 35mm photography aesthetic, deep navy plus copper plus amber palette, no readable text on equipment or labels, no brand logos, no watermarks. Framed for 4:3 crop, medium-shot composition.

---

### S2 · Materials & Parts Supply

**Dosya:** `assets/services/02-materials-supply.jpg`
**Klasör:** `assets/services/`
**Boyut:** 1600×1200 (4:3)
**Alt-text:** "Marine spare parts ready for shipment — switchgear cards and modules"

**Prompt:**

> Overhead-angle photograph of a workbench loaded with marine electrical spare parts, ready for shipment. In view: a 19-inch PLC card with bright LEDs in protective anti-static foam, an AVR module in original packaging, a stack of contactors, a coil of marine-grade tinned copper cable, a labeled box stamped with the word "AOG" in red (no other readable text), a roll of fragile-sticker tape, and a courier shipping label face-down. To the side, a clipboard with a handwritten parts list and a pen. Lighting is even from above with a single warm task light casting a soft amber edge. Background blurred into deep navy bulkhead with a workshop pegboard. Documentary 35mm photography, deep navy plus brass plus amber palette, no readable brand names, no watermarks. Framed for 4:3 crop, slightly elevated angle.

---

### OG1 · Social Share Image

**Dosya:** `assets/brand/og-image.jpg`
**Klasör:** `assets/brand/` (oluştur)
**Boyut:** 1200×630 (1.91:1)
**Alt-text:** "Levent Marine — marine electrical repair service"

**Prompt:**

> Wide horizontal photograph composition for a social media share card, 1.91:1 aspect ratio. Right two-thirds: top-down view of a ship's main switchboard with rows of Air Circuit Breaker handles arranged in clean horizontal lines, copper conductors visible behind. Left third: intentionally empty deep-navy negative space — leave this area dark and uncluttered (text overlay will be added later in editing; do NOT add any text). A faint amber glow seeps in from the right side. Lighting is even and slightly dramatic. Documentary 35mm photography, deep navy plus copper plus amber palette, no readable text anywhere in the image, no brand logos or watermarks. Strict 1.91:1 widescreen crop.

---

## TIER 2 — SERVİS KARTLARI (10 adet)

Hepsi `assets/services/`, 1600×1200 (4:3), Gemini 1:1 üretir → squoosh ile crop.

### S3 · Propulsion & Motors
**Dosya:** `assets/services/03-propulsion-motors.jpg`
**Alt:** "Marine electric motor mid-overhaul in a shipyard workshop"

> Photograph of a large marine electric motor mid-overhaul in a shipyard workshop. The motor's end bell is removed; copper stator windings are exposed and freshly cleaned. An engineer in a navy coverall measures bearing clearance with a feeler gauge while another holds an inspection light at a low angle. An overhead crane chain hangs in the soft-focus background. The setting is gritty but professional — clean concrete floor, neat tool layout on a steel workbench, blue-painted machinery. Lighting is high overhead shop lights mixed with a warm task lamp. Documentary photojournalism, 35mm film grain, navy plus steel plus amber tones, no readable text, no brand logos. Framed for 4:3 crop.

### S4 · Navigation & GMDSS
**Dosya:** `assets/services/04-navigation-comms.jpg`
**Alt:** "Engineer working on radar and ECDIS in a ship's wheelhouse at dusk"

> Photograph from inside a bulker's wheelhouse at dusk. Foreground: the back-quarter view of a marine electronics engineer in his thirties, leaning over an open ECDIS chart display, laptop connected via LAN to the radar processor rack. The radar PPI screen glows soft green; the ECDIS shows an abstract navigation chart with no readable text. Through the bridge window: silhouette of a cargo deck and a faint orange sunset over the sea. Warm panel lights reflect softly on polished console surfaces. Documentary 35mm photography, deep navy plus teal plus amber palette, no readable text on screens, no brand logos. Framed for 4:3 crop.

### S5 · Automation & Control
**Dosya:** `assets/services/05-automation-control.jpg`
**Alt:** "Open PLC automation cabinet with terminal blocks and shielded cables"

> Photograph of an open PLC and automation cabinet on a ship, door swung wide. Two neat rows of terminal blocks wired with red, blue, white and yellow shielded cables, a generic gray industrial PLC rack visible (NO brand logo). An engineer's hand holds a small programming pendant connected by a curled coil cord; LED status lights glow on the I/O modules. The cabinet door is open and the bulkhead behind is painted ship-grey. Lighting cool fluorescent overhead, single warm task light from the side. Documentary photojournalism, 35mm film, navy plus grey plus amber-LED palette, no readable text or visible brand markings, no watermarks. Framed for 4:3 crop.

### S6 · Safety Systems (Fire / Water Mist)
**Dosya:** `assets/services/06-safety-systems.jpg`
**Alt:** "Engineer testing a fire detector at an addressable fire alarm panel in a ship corridor"

> Photograph of an addressable fire alarm panel in the accommodation corridor of a cargo ship, cabinet door open. An engineer in a clean coverall holds a small handheld smoke tester near a ceiling smoke detector; the panel screen shows a faint amber alarm glow (no readable text). The corridor walls are clean steel with white panel sections and a red painted line at deck level. Lighting is cool fluorescent from above. Hand and detector are in sharp focus, the panel slightly defocused. Documentary photography, 35mm film, deep navy plus white plus amber palette, no readable signage, no brand logos, no watermarks. Framed for 4:3 crop.

### S7 · Lighting & Navigation Lights
**Dosya:** `assets/services/07-lighting-nav-lights.jpg`
**Alt:** "Bulker foremast at twilight with navigation lights, technician on ladder"

> Photograph of a bulk carrier's foremast at twilight, looking upward from the foredeck. The masthead navigation light glows steady white, and the lower red and green sidelights are just becoming visible against a deepening blue sky. A maintenance technician in a high-visibility harness ascends a ladder partway up the mast, head-torch beam casting a small amber pool on a junction box he is inspecting. The horizon shows the faintest orange band of sunset behind the silhouette of the ship's superstructure. Documentary photography, 35mm grainy film, deep navy and teal sky with amber/red/green light accents, no readable text, no logos. Framed for 4:3 crop.

### S8 · Testing & Reports
**Dosya:** `assets/services/08-testing-certification.jpg`
**Alt:** "SVERKER-style relay test set connected to a marine circuit breaker"

> Close-up photograph of a chunky yellow relay test set (SVERKER-style — no readable brand) connected by thick colored test leads to a freshly racked-out Air Circuit Breaker. On a portable folding desk next to the test set: a calibrated multimeter, an open hand-written notebook with test data, and a rugged laptop. An engineer's hands turn one of the test-set dials. Setting is the engine room control space — grey steel bulkhead, busbar door defocused in the background. Lighting cool overhead with one warm task lamp from the right. Documentary 35mm photography, deep navy plus yellow plus amber palette, no text on any LCD or display, no brand logos. Framed for 4:3 crop.

### S9 · Commissioning & Retrofit
**Dosya:** `assets/services/09-commissioning-retrofit.jpg`
**Alt:** "Engineer commissioning a freshly installed VFD cabinet on board"

> Photograph of a freshly installed VFD (Variable Frequency Drive) cabinet on a ship — the paint still glossy, protective plastic film half-removed from a touchscreen display. An engineer in a clean blue coverall holds an A4 clipboard with a wiring drawing, ticking off lines with a black marker; the other hand traces a freshly landed cable into a terminal block. The cabinet interior is full of neatly zip-tied cables in tray arrangement. The adjacent bulkhead is freshly painted ship-grey. Lighting is even cool fluorescent overhead, no harsh shadows. Documentary photography, 35mm film, navy plus steel plus amber palette, no readable text on the touchscreen, no brand logos, no watermarks. Framed for 4:3 crop.

### S10 · Emergency & Remote Response
**Dosya:** `assets/services/10-emergency-remote.jpg`
**Alt:** "Engineer boarding a ship at night with a tool case, dockside lit amber"

> Night photograph of a marine electrical engineer in a high-visibility orange coverall and hard-hat with a head-torch, walking up a ship's gangway carrying a hard-shell tool case in one hand and a coil of test leads slung over the shoulder. The dockside behind is lit by sodium-vapor lamps casting a deep amber glow on wet concrete; the bulk carrier's superstructure looms in the background with a single accommodation light on. Light rain creates wet reflections on the gangway. A slight motion blur in the step gives a sense of urgency. Documentary photojournalism, 35mm grainy film, deep blue-black night with amber sodium and white head-torch highlights, no readable text, no logos. Framed for 4:3 crop.

### S11 · Survey & PSC Preparation
**Dosya:** `assets/services/11-class-prep.jpg`
**Alt:** "Engineer walking around an open switchboard with a tablet checklist"

> Photograph of an engineer in a yellow safety helmet and clean coverall walking around an open main switchboard, holding a rugged tablet displaying an abstract checklist interface (no readable text on the screen). His other hand carries a clipboard with hand-written notes. The switchboard panels behind him are neatly labeled with handwritten paper tags taped to each section, freshly installed and crisp. Lighting is cool fluorescent overhead with a warm task lamp on the inspection area. Documentary photography, 35mm film, deep navy plus amber plus yellow-helmet palette, no readable text on the tablet, no brand logos. Framed for 4:3 crop.

### S12 · Insulation & Hidden-Fault Diagnostics
**Dosya:** `assets/services/12-insulation-diagnostics.jpg`
**Alt:** "Engineer using a 5kV Megger insulation tester on a marine motor terminal"

> Close-up photograph of a 5kV Megger-style insulation tester being used onboard a ship. The tester is connected by thick red and black test leads with crocodile clips — one alligator clip freshly clamped to a bare copper terminal in a motor junction box, the other to a ground stud. An engineer's gloved hand holds the device steady. On the analog meter display (do not render readable text), a needle-style gauge glows soft amber. In the background, partially defocused, the silhouette of an electric motor with its junction box open. Setting is the engine room — grey steel bulkhead, color-coded pipes overhead. Lighting cool overhead with a warm task lamp from the side. Documentary photography, 35mm film, deep navy plus amber plus steel-grey palette, no readable text, no brand logos. Framed for 4:3 crop.

---

## TIER 3 — PROJE GÖRSELLERİ (8 adet, opsiyonel)

**Sadece** mevcut `assets/works/` ve `assets/cert/` görsellerinden memnun değilsen üret. Boyut hepsi 1600×1200 (4:3), `assets/projects/` klasörüne (oluştur).

### P1 · ACB / MCCB Retest
**Dosya:** `assets/projects/proj-01-acb-mccb.jpg`
**Alt:** "ACB removed for retesting, SVERKER-style test set on top of switchboard"

> Photograph of a chunky yellow relay test set sitting on top of an open switchboard cabinet, connected via thick orange test leads to a freshly racked-out Air Circuit Breaker hanging from a small overhead lifting trolley. An engineer's hands operate the test set's rotary dials. Documentary 35mm marine industrial photography, deep navy plus yellow plus amber palette, no readable text, no brand logos. Framed for 4:3 crop.

### P2 · AVR Fault + Shaft Earthing
**Dosya:** `assets/projects/proj-02-avr-shaft.jpg`
**Alt:** "Generator AVR card removed for inspection, with new shaft earthing brush kit"

> Photograph of an opened generator AVR enclosure with a partially-removed AVR card lying on a clean cloth on a workbench. Beside it: a fresh shaft earthing brush assembly still in its packaging. Engineer's gloved hands inspect a diode bridge module. Marine engine room context — grey steel bulkhead, cool overhead light plus an amber task lamp. Documentary 35mm, navy plus amber palette, no readable text, no logos. Framed for 4:3 crop.

### P3 · Fire Alarm + Water Mist Retrofit
**Dosya:** `assets/projects/proj-03-fire-mist.jpg`
**Alt:** "Newly installed fire alarm release panel and water mist manifold"

> Photograph of a freshly installed modern fire alarm release panel mounted on a ship's accommodation bulkhead, cabinet door open. Cable conduit neatly enters the bottom; a water-mist piping manifold is visible in the soft-focus background. An engineer's hand holds a freshly printed schematic. Documentary 35mm, navy plus amber palette, no readable text, no logos. Framed for 4:3 crop.

### P4 · Motor Overhaul & Alignment
**Dosya:** `assets/projects/proj-04-motor-overhaul.jpg`
**Alt:** "Marine electric motor in mid-alignment with dial gauges on coupling"

> Photograph of a large marine electric motor on a workshop bedplate, in mid-alignment. Dial gauges sit on the coupling; an engineer in a navy coverall reads one of them with a head-down posture. Overhead workshop lighting, polished concrete floor, the rotor visible through the open motor end. Documentary photojournalism, 35mm grain, navy plus steel plus amber palette, no readable text, no logos. Framed for 4:3 crop.

### P5 · Radar Magnetron Replacement
**Dosya:** `assets/projects/proj-05-radar-bridge.jpg`
**Alt:** "Marine technician on top deck replacing a radar magnetron module"

> Photograph from the top deck of a bulker showing a marine technician in a safety harness next to an open radar antenna assembly, replacing the magnetron module. The mast is steel-painted white with rust patches. Background: the sea and a distant low coastline. Daytime, slightly overcast — soft natural light. Documentary 35mm, navy-sea plus white-mast plus amber-tool palette, no readable text, no logos. Framed for 4:3 crop.

### P6 · PMS Retrofit + Load Sharing
**Dosya:** `assets/projects/proj-06-pms-retrofit.jpg`
**Alt:** "Three synchroscopes and a Power Management System HMI in the engine control room"

> Photograph of three synchroscopes and a Power Management System HMI screen in a ship's engine control room. Soft amber glow from the synchroscope dials; the HMI displays an abstract generator-load diagram (no readable text). Engineer hands adjust a small dial below the HMI. Documentary 35mm photography, deep navy plus amber palette, no readable text on the HMI, no logos. Framed for 4:3 crop.

### P7 · Insulation Trend & Megger Test
**Dosya:** `assets/projects/proj-07-insulation.jpg`
**Alt:** "Engineer performing 5kV Megger insulation test on a marine transformer"

> Photograph of a 5kV Megger insulation tester clamped to a transformer terminal on a ship, with the engineer's gloved hand turning the test crank. Adjacent: a small notebook with a hand-drawn insulation-trend graph and a pen. Engine room context, cool overhead light, single amber task lamp. Documentary 35mm, navy plus amber palette, no readable text, no logos. Framed for 4:3 crop.

### P8 · Deck Crane Panel + VFD
**Dosya:** `assets/projects/proj-08-crane-panel.jpg`
**Alt:** "Freshly retrofitted VFD cabinet in a deck crane equipment room"

> Photograph from inside a deck crane's adjacent equipment room, showing a freshly retrofitted VFD cabinet with the door open. Cables enter neatly from below; an overload-relay calibration jig is connected on a portable stand. Through the cabin window the deck of a bulker and a stack of cargo holds is visible. Soft daylight plus a warm task lamp. Documentary 35mm, navy plus steel plus amber palette, no readable text, no logos. Framed for 4:3 crop.

---

## TIER 3 ADDITIONAL — BLOG HERO'LARI (opsiyonel)

`assets/blog/` klasörü (oluştur), 1920×840 (16:7 wide banner). Gemini 16:9 üretir → squoosh ile 16:7 crop.

### B1 · Class Survey Preparation Hero
**Dosya:** `assets/blog/class-survey-hero.jpg`

> Wide banner photograph of an engineer at an open main switchboard, holding a rugged tablet showing an abstract checklist (no readable text). The switchboard has multiple ACB sections, each with hand-written paper labels. Cool overhead lighting plus a warm task lamp. Documentary 35mm, navy plus amber palette, no readable text, no logos. Cinematic 16:7 banner crop.

### B2 · ACB / MCCB Test Hero
**Dosya:** `assets/blog/acb-test-hero.jpg`

> Wide banner photograph: extreme close-up of a yellow relay test set, the operator's hand on a black dial, two large analog gauges (without readable text) glowing soft amber. Background defocused into navy bulkhead. Documentary 35mm, deep navy plus yellow plus amber palette, no text, no logos. Cinematic 16:7 banner crop.

### B3 · Bulker Fault Hero
**Dosya:** `assets/blog/bulker-fault-hero.jpg`

> Wide banner photograph of a bulk carrier alongside a quay at evening — golden sodium dock lights reflecting on wet concrete, the ship's accommodation block silhouetted against an indigo sky with a few stars. A small figure with a tool case walks toward the gangway. Documentary 35mm, navy plus amber palette, no readable text, no logos, no watermarks. Cinematic 16:7 banner crop.

---

## ÜRETIM AKIŞI

1. **Gemini'de** (Gemini 2.0 Flash with image gen veya Imagen 3):
   - Prompt'u olduğu gibi yapıştır
   - "Generate this image" gibi bir komut ekle eğer gerekirse
2. Üretilen 1–4 varyantın **en iyi olanı seç**
3. **Sağ tık → Download** veya export
4. **Dosya adını** yukarıdaki tabloya göre değiştir (`landing-hero.jpg`, `01-power-distribution.jpg` vb.)
5. **Boyutu doğrula** — Gemini 1024×1024 / 1536×1024 üretir, hedef boyutla uyuşmazsa:
   - [squoosh.app](https://squoosh.app) — crop + JPEG q82-85
   - Veya Photopea — manuel kırp
6. Doğru klasöre at:
   ```bash
   mkdir -p assets/services assets/projects assets/blog assets/brand
   mv ~/Downloads/landing-hero.jpg assets/hero/
   mv ~/Downloads/01-power-distribution.jpg assets/services/
   # vs.
   ```

## SİTEYE BAĞLAMA

Yeni görselleri eklediğinde:

- **Landing hero** otomatik kullanılır — `css/design.css:.landing-bg` zaten `assets/hero/engine-room.jpg` referans veriyor. Yeni dosya adı `landing-hero.jpg` ise CSS'i 1 satır güncellemen lazım — söyle yaparım.
- **Servis kartları**: `js/app.js` içinde `SERVICES.[key].photo` path'leri hâlâ `assets/works/` veya `assets/cert/` altında. Yeni `assets/services/*` görsellerini koyduğunda app.js'de 11 satır path güncellenmeli — söyle hepsini değiştiririm.
- **Proje görselleri**: `PROJECTS` array'inde `img` path'leri — aynı şekilde.
- **OG image**: `index.html`'de `<meta property="og:image">` ve `<meta name="twitter:image">` zaten `assets/brand/og-image.jpg` referans veriyor — sadece dosyayı oraya koymak yeter.

## ÖNERILER

- **Tutarlılık için** tek oturumda hepsini üret. Her prompt sonuna ihtiyaç duyarsan ekle: *"Match the lighting, palette, color grading and grain of the previous Levent Marine engine-room image I generated in this conversation."*
- **Yüz/kimlik:** Mühendisler genel görünürlüklü — yüzleri ya sırttan ya yandan, çok belirgin değil. Bu hem etik (kişiyi tanımlamayalım) hem evrensel.
- **Renk tutarlılığı için** post-prod: Hepsine aynı preset uygula — *Lightroom: +5 contrast, -10 saturation, +15 shadow, +8 blue temperature, -5 highlight*. Bu "Open Bridge" palettiyle uyumlu olur.
- **Markalı içerik yok:** Promptlarda "no brand logos" zaten var ama yine de Gemini bazen kendi başına sahte logo çiziyor. Üretimden sonra kontrol et, varsa silmek için **photopea.com** spot heal tool kullan.
- **Bütçe:** Gemini ücretsiz tier'da günlük ~20-30 görsel limiti var; Imagen 3 paid tier $0.03–0.05/görsel. 22 görsel toplam ~$0.66–1.10 paid.

## DOSYA ÖZETİ — HIZLI ERIŞIM

```
assets/
├── hero/
│   └── landing-hero.jpg         ← L1 (2560×1440)
├── services/
│   ├── 01-power-distribution.jpg ← S1
│   ├── 02-materials-supply.jpg   ← S2
│   ├── 03-propulsion-motors.jpg  ← S3
│   ├── 04-navigation-comms.jpg   ← S4
│   ├── 05-automation-control.jpg ← S5
│   ├── 06-safety-systems.jpg     ← S6
│   ├── 07-lighting-nav-lights.jpg ← S7
│   ├── 08-testing-certification.jpg ← S8
│   ├── 09-commissioning-retrofit.jpg ← S9
│   ├── 10-emergency-remote.jpg   ← S10
│   ├── 11-class-prep.jpg         ← S11
│   └── 12-insulation-diagnostics.jpg ← S12
├── projects/
│   ├── proj-01-acb-mccb.jpg      ← P1
│   ├── proj-02-avr-shaft.jpg     ← P2
│   ├── proj-03-fire-mist.jpg     ← P3
│   ├── proj-04-motor-overhaul.jpg ← P4
│   ├── proj-05-radar-bridge.jpg  ← P5
│   ├── proj-06-pms-retrofit.jpg  ← P6
│   ├── proj-07-insulation.jpg    ← P7
│   └── proj-08-crane-panel.jpg   ← P8
├── blog/
│   ├── class-survey-hero.jpg     ← B1
│   ├── acb-test-hero.jpg         ← B2
│   └── bulker-fault-hero.jpg     ← B3
└── brand/
    └── og-image.jpg              ← OG1 (1200×630)
```

**Toplam 24 görsel. Tier 1 yeterli (4 görsel). Tier 2 ile site profesyonelleşir. Tier 3 ileri seviye.**
