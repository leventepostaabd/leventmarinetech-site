# Yeni Görsel Üretim Paketi — Levent Marine

Bu dosya, site için üretilecek görsellerin Midjourney / Flux / DALL·E / Ideogram için hazır prompt setidir. Her prompt **direkt kopyala-yapıştır** formatındadır.

## Stil rehberi (tüm promptlarda ortak)

Promptların sonuna ekle (style tail):

```
documentary photography, natural light, medium format, 35mm, grainy film, muted cool palette with deep navy blues and amber highlights, industrial maritime atmosphere, real engineer hands in frame where appropriate, no stock-photo gloss, photojournalism --ar 16:9 --style raw --v 6
```

Negative prompts (Midjourney `--no`):

```
--no text, watermarks, logos, cartoon, illustration, CGI, 3D render, stock photo look, plastic faces, oversaturated
```

---

## 1. Hero arka plan (`assets/hero/`)

**Dosya adı:** `engine-room-hero.jpg` (genişletilmiş, ultrawide)
**Boyut:** 2560×1440 → JPEG q85

**Prompt:**
```
Wide shot inside a bulk carrier engine room, main switchboard and generator in background, marine electrician in blue coverall holding a multimeter, warm tungsten lighting mixed with cool fluorescent, pipes and cables, steel decking, shallow depth of field, photojournalism
```

**Alternatif:** `bridge-hero.jpg` — köprü-odaklı hero
```
Night bridge of a bulk carrier at sea, radar screen glowing green, ECDIS chart visible, silhouette of officer, amber instrument lights reflecting on polished console, deep blue sea through window, calm professional atmosphere
```

---

## 2. Hizmet kart görselleri (`assets/services/`)

Her 10 hizmet kategorisi için 1 adet — oran **4:3**, boyut 1600×1200.

| # | Dosya | Prompt özü |
|---|-------|-----------|
| 1 | `01-power-distribution.jpg` | Main switchboard with ACB compartments open, engineer gloved hand pointing at busbar, copper conductors visible, thermal camera on the side |
| 2 | `02-propulsion-motors.jpg` | Large marine electric motor opened, windings visible, crane overhead, workshop lighting, tools on floor |
| 3 | `03-navigation-comms.jpg` | Bridge instrument panel, radar and ECDIS displays on, engineer with laptop connected to a navigation unit, cables running from rack |
| 4 | `04-automation-control.jpg` | PLC cabinet with terminal strips, technician holding programmer, tangle of shielded cables, LED status lights |
| 5 | `05-safety-systems.jpg` | Fire alarm addressable panel with door open, engineer testing a detector with smoke tester, clean corridor background |
| 6 | `06-lighting-nav-lights.jpg` | Mast of a bulker at dusk, navigation lights on, LED fixtures freshly installed, ship's silhouette behind |
| 7 | `07-testing-certification.jpg` | SVERKER 900 relay test set connected to a circuit breaker, multimeter and laptop on a portable desk, engineer in uniform |
| 8 | `08-commissioning-retrofit.jpg` | Newly installed VFD cabinet, protective film still on a screen, engineer with clipboard verifying wiring, new clean cables |
| 9 | `09-emergency-remote.jpg` | Night scene, engineer in coverall boarding a ship, orange high-vis vest, tool case in hand, portside lit by sodium lamps |
| 10 | `10-class-prep.jpg` | Engineer walking around switchboard with a checklist tablet, yellow helmet, documentation binder on workbench |

**Prompt template (hepsi için):**
```
[description above], real photography, 35mm documentary style, natural light, industrial ship environment, grainy film look, cool blue-navy tones with amber highlights, no text, no logos --ar 4:3 --style raw --v 6
```

**Detay görselleri (drawer hero — 16:5 panoramik):**
Her hizmet için bir `detail-[name].jpg` (2400×750), aynı konu daha geniş çerçeveden.

---

## 3. Proje görselleri (`assets/projects/`)

Mevcut `assets/works/` ve `assets/cert/` altındaki 12 görsel şu an proje kartlarını besliyor. Eğer bu 8 proje için özel yeni görseller istenirse:

```
proj-01-acb-mccb.jpg         — ACB'nin test cihazına bağlı, SVERKER ekranı
proj-02-avr-shaft.jpg        — AVR kartı elinde, kapağı açık jeneratör
proj-03-fire-mist.jpg        — Modernleştirilmiş fire alarm paneli kapısı açık
proj-04-motor-overhaul.jpg   — Tersanede asılı büyük elektrik motoru
proj-05-radar-bridge.jpg     — Radar antenna üstünde servis teknisyeni (yüksek açı)
proj-06-pms-retrofit.jpg     — Üç jeneratör sync meteri, PMS HMI ekranı
proj-07-insulation.jpg       — Megger 5kV elinde, trafo tarafında teknisyen
proj-08-crane-panel.jpg      — Deck crane kabini içinde yeni VFD
```

---

## 4. Blog hero görselleri (`assets/blog/`)

Şu an gradient placeholder kullanılıyor. Gerçek görsel eklemek istenirse:

- `class-survey-hero.jpg` → engineer reviewing checklist at main switchboard
- `acb-test-hero.jpg` → SVERKER 900 display close-up with hand on test knob
- `bulker-fault-hero.jpg` → bulker at port from low angle, evening light

**Boyut:** 1920×800 (16:7 wide banner)

---

## 5. Logo/Brand (`assets/brand/`)

- `og-image.jpg` — 1200×630, site'ın ana OG görseli. Öneri:
```
Top-down view of main switchboard with ACB handles in a row, left one third filled with "Levent Marine" wordmark in white Space Grotesk font, amber accent line underneath, deep navy background
```
- `motif.svg` — abstrakt sinyal dalgası / devre şeması motifi (opsiyonel dekoratif)

---

## Üretim akışı

1. Herhangi bir AI tool'a prompt + style tail'i yapıştır
2. 4 kare üretim çıkar, en iyi olanı seç
3. [Photopea](https://photopea.com) veya [squoosh.app](https://squoosh.app) ile:
   - Doğru boyuta kırp (kart için 4:3, proje için 4:3, hero için 16:9 / 16:5)
   - JPEG q80-85 olarak kaydet (KB hedefi: kartlar <150KB, hero <300KB)
4. İlgili klasöre yerleştir — dosya adları yukarıdaki tabloya göre
5. `js/app.js` SERVICES object'inde `photo` path'ini güncelle (şu anda mevcut görsellerin path'i var; yeni seri hazır olduğunda bulk-replace yeter)

## Yapay renk-tonu tutarlılığı için

Tüm görselleri aynı renk uzayında yakalamak için:
- Midjourney: `--seed` değerini tüm set için sabit tut
- Flux: aynı LoRA / style reference kullan
- Post'ta: [PhotoDirector](https://www.cyberlink.com/) veya Lightroom preset ile hepsine aynı +5 contrast, -10 saturation, +15 shadow filtresi uygula → "Deep Harbor" palettle uyumlu olur.

---

**Not:** Bu dosyanın üst seviye manifestosu `assets/IMAGES.md` içinde daha detaylı. Bu dosya o manifesto'nun servisi artık "marine elektrik arıza servisi" olan yeni tema ile güncel karşılığıdır.
