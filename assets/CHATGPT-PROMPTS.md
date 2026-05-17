# ChatGPT (DALL·E 3) Görsel Üretim Paketi — Levent Marine v3

**Nasıl kullanılır:**
1. Aşağıdaki her "Prompt" bloğunu **olduğu gibi tek parça** ChatGPT'ye yapıştır.
2. Üretildikten sonra dosyayı **Dosya** kısmında belirtilen ada ve klasöre koy.
3. **Boyut/oran** bilgisi her görselin üstünde — ChatGPT genelde 1024×1024 üretir; gerekirse [squoosh.app](https://squoosh.app) ile crop/resize et.

**Hepsinde uyulması gereken stil:** documentary photography, real industrial marine environment, deep navy + amber palette, no text, no logos, no watermarks, no cartoon, photojournalism aesthetic. Bu zaten her prompt'un içine gömülü.

---

## 1. HERO ARKA PLAN (opsiyonel — şu an animated SVG var)

> Not: Site şu an animated SVG arka plan kullanıyor. Hero için ek bir fotoğrafa **gerekmiyor**. Yine de ileride değiştirmek istersen aşağıdaki prompt'u kullan.

### 1.1 Engine room hero
**Dosya:** `assets/hero/engine-room-hero.jpg`
**Boyut:** 2560×1440 (16:9 cinematic wide)

**Prompt:**
> Wide cinematic photograph inside a working bulk carrier engine room. A marine electrical engineer in a clean blue coverall stands near a main switchboard with circuit breakers visible; another technician's hands are on a multimeter probe. Mixed lighting: warm tungsten overhead and cool fluorescent from a side panel, with a single amber emergency lamp glowing in the background. Steel grating floor, color-coded pipes, neatly bundled cables. Shallow depth of field on the engineer, switchboard slightly defocused in the foreground edges. Documentary photojournalism style, 35mm grainy film aesthetic, deep navy and steel tones with amber highlights, no text on signs, no visible logos, no watermarks, no CGI. 16:9 ultrawide cinematic frame.

---

## 2. HİZMET KARTLARI (10 görsel — `assets/services/`)

**Hepsi:** 1600×1200 (4:3), kart arka planı olarak görünür, üstüne navy gradient binecek.

### 2.1 Power & Distribution
**Dosya:** `assets/services/01-power-distribution.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Close-up photograph of an open ship main switchboard cabinet on a bulker, viewed from a slight low angle. Bright copper busbars run horizontally across, several Air Circuit Breakers (ACBs) are visible with their drawers half-extended. A gloved engineer's hand points at a busbar with an insulated screwdriver; on a portable workbench in the corner a thermal camera and a torque wrench sit ready. Lighting is cool fluorescent from above with a warm task lamp creating an amber pool over the work zone. Real industrial setting on a ship — visible bulkhead bolts in the frame edge. Documentary 35mm photography, deep navy + amber palette, no text, no brand logos, no watermarks, photorealistic. 4:3 aspect.

### 2.2 Propulsion & Motors
**Dosya:** `assets/services/02-propulsion-motors.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Photograph of a large marine electric motor mid-overhaul in a shipyard workshop. The motor's end bell is removed; copper stator windings are exposed and freshly cleaned. An engineer in a navy coverall measures bearing clearance with a feeler gauge while another holds an inspection light. Overhead crane chain hangs in the soft-focus background. The setting is gritty but professional — clean concrete floor, neat tool layout on a steel workbench, blue-painted machinery. Lighting is high overhead shop lights mixed with a warm task lamp. Documentary photojournalism, 35mm film grain, navy-blue and steel tones with amber highlights from the task lamp, no text, no logos. 4:3 aspect.

### 2.3 Navigation & GMDSS
**Dosya:** `assets/services/03-navigation-comms.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Photograph from inside a bulker's wheelhouse at dusk. Foreground: the back of a marine electronics engineer (mid-30s) leaning over an open ECDIS chart display, laptop connected to the radar processor unit with a coil of LAN cable. The radar PPI screen glows soft green, the ECDIS shows a navigation chart. Through the bridge window: the silhouette of a cargo deck and a faint orange sunset over the sea. Sparse warm panel lights reflect on polished console surfaces. Documentary photography, 35mm film, deep navy and teal tones with amber instrument-light highlights, no readable text on screens, no brand logos. 4:3 aspect.

### 2.4 Automation & Control
**Dosya:** `assets/services/04-automation-control.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Photograph of an open PLC and automation cabinet on a ship. Two rows of terminal blocks neatly wired with red, blue, white and yellow shielded cables, a Siemens-style PLC rack visible (no brand visible — generic gray industrial controller). An engineer's hand holds a small programming pendant connected by a coil cord; LED status lights glow on the I/O modules. The cabinet door swings open and the bulkhead is painted ship-grey. Lighting cool fluorescent overhead, single warm task light. Documentary photojournalism, 35mm film grain, navy-blue and grey palette with amber LED accents, no text or readable labels, no brand markings, no watermarks. 4:3 aspect.

### 2.5 Safety Systems (Fire / Water Mist)
**Dosya:** `assets/services/05-safety-systems.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Photograph of an addressable fire alarm panel in an accommodation corridor of a cargo ship, cabinet door open. An engineer in a clean coverall holds a small handheld smoke tester near a ceiling smoke detector; the panel screen shows a faint amber alarm glow (no readable text). The corridor is clean steel with white wall panels and a red painted line at the deck level. Lighting is cool fluorescent overhead. Hand and detector in sharp focus, panel slightly defocused. Documentary photography, 35mm film, deep navy + amber palette, no readable signage, no brand logos, no watermarks. 4:3 aspect.

### 2.6 Lighting & Nav Lights
**Dosya:** `assets/services/06-lighting-nav-lights.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Photograph of a bulk carrier's foremast at twilight, taken from the deck looking upward. The masthead navigation light glows steady white, and lower red and green sidelights are just becoming visible against the deepening blue sky. A maintenance technician in a high-visibility harness ascends a ladder partway up the mast, head torch beam casting a small amber pool on a junction box. The horizon shows the faintest orange band of sunset behind the silhouette of the ship's superstructure. Documentary photography, 35mm grainy film, deep navy and teal sky with amber/red/green light accents, no text, no logos. 4:3 aspect.

### 2.7 Testing & Reports
**Dosya:** `assets/services/07-testing-certification.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Close-up photograph of a SVERKER-style relay test set connected by colored test leads to a circuit breaker on a ship. The test set is a chunky bright-yellow industrial unit with knobs and an LCD (no readable text). On a portable folding desk next to it: a calibrated multimeter, a clamp-on insulation tester, an open notebook with hand-written measurements, and a rugged laptop. An engineer's hands turn one of the dials. Setting is the engine room control space — grey steel bulkhead, busbar door in the background. Lighting is cool overhead with one warm task lamp from the right. Documentary photography, 35mm film, deep navy + amber palette, no text on the equipment LCDs, no brand logos. 4:3 aspect.

### 2.8 Commissioning & Retrofit
**Dosya:** `assets/services/08-commissioning-retrofit.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Photograph of a freshly installed VFD (Variable Frequency Drive) cabinet on a ship — paint still glossy, protective plastic film half-removed from a touchscreen. An engineer in a clean blue coverall holds an A4 clipboard with a wiring drawing, ticking off lines with a black marker; the other hand traces a freshly landed cable into a terminal. Cabinet interior shows neat zip-tied cables and clean tray-arrangement. Adjacent bulkhead is freshly painted ship-grey. Lighting is even cool fluorescent overhead, no harsh shadows. Documentary photography, 35mm film, navy + steel + amber palette, no readable text on the touchscreen, no brand logos, no watermarks. 4:3 aspect.

### 2.9 Emergency & Remote
**Dosya:** `assets/services/09-emergency-remote.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Night photograph of a marine electrical engineer in a high-visibility orange coverall and a hard-hat with a head torch, walking up a ship's gangway carrying a hard-shell tool case in one hand and a coil of test leads over the shoulder. The dock behind him is lit by sodium-vapor lamps casting a deep amber glow; the bulker's superstructure looms in the background with a single accommodation light on. Light rain creates wet reflections on the gangway. Slight motion in the step gives a sense of urgency. Documentary photojournalism, 35mm grainy film, deep blue-black night with amber sodium and white head-torch highlights, no readable text, no logos. 4:3 aspect.

### 2.10 Survey & PSC Preparation
**Dosya:** `assets/services/10-class-prep.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Photograph of an engineer in a yellow safety helmet and clean coverall walking around an open main switchboard, holding a rugged tablet displaying a checklist (no readable text on screen). Other hand carries a clipboard with hand-written notes. The switchboard panels behind him are immaculately labeled — handwritten paper tags taped to each section, freshly installed. Lighting is cool fluorescent overhead with a warm task lamp on the inspection area. Documentary photography, 35mm film, deep navy + amber + yellow-helmet palette, no readable text on the tablet, no brand logos. 4:3 aspect.

### 2.11 Insulation & Hidden-Fault Diagnostics (YENİ)
**Dosya:** `assets/services/11-insulation-diagnostics.jpg`
**Boyut:** 1600×1200 (4:3)

**Prompt:**
> Close-up photograph of a 5kV Megger insulation tester being used onboard a ship. The tester is connected by thick red and black test leads with crocodile clips to a motor terminal box; one alligator clip is freshly clamped to a bare copper terminal, the other to a ground stud. An engineer's gloved hand holds the device steady; on the display (do not render readable text) a needle-style analog meter glows soft amber. In the background, partially defocused, the silhouette of an electric motor with its junction box open. The setting is the engine room — grey steel bulkhead, color-coded pipes overhead. Lighting cool overhead with a warm task lamp from the side. Documentary photography, 35mm film, deep navy + amber + steel-grey palette, no readable text, no brand logos. 4:3 aspect.

---

## 3. PROJE GÖRSELLERİ (8 — `assets/projects/`)

Site şu an `assets/works/` ve `assets/cert/` altındaki gerçek fotoğrafları kullanıyor. Eğer projeler için ayrı görsel istersen aşağıdakileri üret. Aksi halde bu bölümü atla.

### 3.1 ACB / MCCB Retest & Report
**Dosya:** `assets/projects/proj-01-acb-mccb.jpg` (boyut 1600×1200)

**Prompt:**
> Photograph of an SVERKER-style yellow relay test set sitting on top of a switchboard cabinet, connected via thick orange test leads to a freshly racked-out Air Circuit Breaker that hangs from a small overhead lifting trolley. Engineer's hands operate the test set's dials. Documentary marine industrial photography, deep navy + amber palette, no readable text, no logos. 4:3 aspect.

### 3.2 AVR Fault + Shaft Earthing
**Dosya:** `assets/projects/proj-02-avr-shaft.jpg` (1600×1200)

**Prompt:**
> Photograph of an opened generator AVR enclosure with a partially-removed AVR card lying on a cleaning cloth on a workbench. Beside it: a fresh shaft earthing brush assembly still in its packaging. Engineer's gloved hands inspect a diode bridge. Marine engine room context, grey steel bulkhead, cool overhead light + amber task lamp. Documentary 35mm, navy + amber palette, no text, no logos. 4:3.

### 3.3 Fire Alarm + Water Mist Retrofit
**Dosya:** `assets/projects/proj-03-fire-mist.jpg` (1600×1200)

**Prompt:**
> Photograph of a freshly installed modern fire alarm release panel mounted on a ship's accommodation bulkhead, with the cabinet door open. Cable conduit neatly enters the bottom; a water-mist piping manifold is visible in the soft-focus background. An engineer's hand holds a freshly printed schematic. Documentary, 35mm film, navy + amber palette, no readable text, no logos. 4:3.

### 3.4 Motor Overhaul & Alignment
**Dosya:** `assets/projects/proj-04-motor-overhaul.jpg` (1600×1200)

**Prompt:**
> Photograph of a large marine electric motor on a workshop bedplate, in mid-alignment. Dial gauges sit on the coupling; an engineer in a navy coverall reads one of them with a head-down posture. Overhead workshop lighting, polished concrete floor, the rotor visible through the open motor end. Documentary photojournalism, 35mm grain, navy + steel + amber palette, no text, no logos. 4:3.

### 3.5 Radar Magnetron + Bridge Test
**Dosya:** `assets/projects/proj-05-radar-bridge.jpg` (1600×1200)

**Prompt:**
> Photograph from the top deck of a bulker showing a marine technician in a safety harness next to the open radar antenna assembly, replacing the magnetron module. The mast is steel-painted white with rust patches. Background: the sea and a distant low coastline. Daytime, slightly overcast — soft natural light. Documentary, 35mm film, navy-sea + white-mast + amber-tool palette, no readable text, no logos. 4:3.

### 3.6 PMS Retrofit + Load Sharing
**Dosya:** `assets/projects/proj-06-pms-retrofit.jpg` (1600×1200)

**Prompt:**
> Photograph of three synchroscopes and a Power Management System HMI screen in a ship engine control room. Soft amber glow from the synchroscope dials, the HMI displays a generator-load diagram (no readable text). Engineer hands adjust a small dial below the HMI. Documentary 35mm photography, deep navy + amber palette, no readable text on the HMI, no logos. 4:3.

### 3.7 Insulation Trend & Megger
**Dosya:** `assets/projects/proj-07-insulation.jpg` (1600×1200)

**Prompt:**
> Photograph of a 5kV Megger insulation tester clamped to a transformer terminal on a ship, with the engineer's gloved hand turning the test crank. Adjacent: a small notebook with hand-drawn insulation-trend graph and pen. Engine room context, cool overhead light, single amber task lamp. Documentary 35mm, navy + amber palette, no readable text, no logos. 4:3.

### 3.8 Deck Crane Panel + VFD
**Dosya:** `assets/projects/proj-08-crane-panel.jpg` (1600×1200)

**Prompt:**
> Photograph from inside a deck crane's operator cabin or adjacent equipment room, showing a freshly retrofitted VFD cabinet with the door open. Cables enter neatly from below; an overload-relay calibration jig is connected. Through the cabin window, the deck of a bulker and a stack of cargo holds is visible. Soft daylight + warm task lamp. Documentary 35mm, navy + steel + amber palette, no readable text, no logos. 4:3.

---

## 4. BLOG HERO GÖRSELLERİ (3 — `assets/blog/`)

Site şu an blog için gradient placeholder kullanıyor. Gerçek görsel istersen:

### 4.1 Class Survey Prep
**Dosya:** `assets/blog/class-survey-hero.jpg`
**Boyut:** 1920×840 (16:7 banner)

**Prompt:**
> Wide banner photograph of an engineer at an open main switchboard, holding a rugged tablet showing a checklist (no readable text). The switchboard has multiple ACB sections, each with a hand-written paper label. Cool overhead lighting + warm task lamp. Documentary 35mm, navy + amber palette, no readable text, no logos. 16:7 cinematic banner.

### 4.2 ACB / MCCB Test Hero
**Dosya:** `assets/blog/acb-test-hero.jpg`
**Boyut:** 1920×840 (16:7)

**Prompt:**
> Wide banner photograph: extreme close-up of a SVERKER-style relay test set, the operator's hand on a black dial, two large analog gauges (without readable text) glowing soft amber. Background defocused into navy bulkhead. Documentary 35mm, deep navy + amber palette, no text, no logos. 16:7 cinematic banner.

### 4.3 Bulker Fault Hero
**Dosya:** `assets/blog/bulker-fault-hero.jpg`
**Boyut:** 1920×840 (16:7)

**Prompt:**
> Wide banner photograph of a bulk carrier alongside a quay at evening — golden sodium dock lights reflecting on wet concrete, the ship's accommodation block silhouetted against an indigo sky with a few stars. A small figure with a tool case walks toward the gangway. Documentary 35mm, navy + amber palette, no readable text, no logos, no watermarks. 16:7 cinematic banner.

---

## 5. OG / SOCIAL SHARE GÖRSELİ (1)

### 5.1 OG image
**Dosya:** `assets/brand/og-image.jpg`
**Boyut:** 1200×630 (1.91:1)

**Prompt:**
> Photograph composition for a social-media share image, 1.91:1 ratio. Top-down view of a ship's main switchboard with ACB drawer handles arranged in a clean row across the lower two-thirds. The upper-left third is intentionally empty negative space (left for text overlay later — do NOT add text). The space color is deep navy fading into a slight amber glow on the right. Lighting is even, slightly dramatic. Documentary 35mm, no readable text, no brand logos, no watermarks. 1.91:1 aspect.

---

## ÜRETIM AKIŞI

1. **ChatGPT'de** (DALL·E 3 destekli): yukarıdaki prompt'lardan birini olduğu gibi yapıştır
2. Üretildikten sonra **sağ tık → Resmi farklı kaydet** veya download butonu
3. Dosya adını üst kısımdaki **`Dosya:`** satırına göre yeniden adlandır
4. İlgili `assets/` klasörüne at — gerekirse klasörü oluştur (`mkdir -p assets/services`)
5. Site otomatik kullanır — `js/app.js` içinde SERVICES path'leri zaten doğru:
   - **Hizmet kartları:** `assets/services/01-...` zaten beklenir (şu an `assets/works/` fallback'i var)
   - **Projeler:** path'ler hâlâ `assets/works/` ve `assets/cert/` — eğer yeni proje görselleri üretirsen `js/app.js`'deki PROJECTS array'ini güncelle
   - **Hero:** şu an animated SVG kullanılıyor, fotoğraf opsiyonel
   - **Blog:** `assets/blog/` boş, gradient placeholder kullanılıyor — gerçek hero görseli eklersen `blog/*/index.html` içindeki `<div class="post-hero">` divini `<img src="...">` ile değiştir
   - **OG:** `assets/brand/og-image.jpg` index.html'de meta tag'lerde referansta — sadece dosyayı koy

## ÖNERİLER

- **Renk tutarlılığı için:** Tüm görselleri üretmeyi tek oturumda yap, aynı stil tail'i koru. Sonra bir post-prod preset (örnek: Lightroom mobile preset: +5 contrast, -10 saturation, +15 shadow, +8 blue) uygula → "Open Bridge" palette ile uyum.
- **Önce hangileri:** En kritik 5 (yüksek-impact, hero ve top-of-fold): 2.1 (Power), 2.7 (Testing), 2.9 (Emergency), 2.11 (Insulation), 5.1 (OG)
- **Bütçe (token):** Her DALL·E 3 üretimi ~$0.04. 23 görsel toplam ~$1.00. Bir 1. tur + 1 alternatif beklersen ~$2.00.
- **Boyut sorunu:** ChatGPT/DALL·E 1024×1024, 1792×1024 veya 1024×1792 üretir. Senin istediğin 1600×1200 yok — 1792×1024 üret, sonra crop/resize et squoosh.app'de.
