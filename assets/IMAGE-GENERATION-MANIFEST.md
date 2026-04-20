# 🎨 LEVENT MARINE — Görsel Üretim Manifestosu

**Durum:** 50 görsel eksik, Midjourney prompt'ları hazır, 4 haftalık üretim planı

---

## 📅 HAFTA 1 — KRİTİK BATCH (13 görsel)

### Üretim Komutları — DOĞRUDAN Midjourney Discord'a yapıştır

**Komut 1: HERO OG IMAGE** (1200×630)
```
cinematic wide shot of a large bulk carrier at golden hour, calm Bosphorus waters, deep navy gradient sky, subtle amber signal lights on deck, minimalist composition with space for logo overlay on left third, photorealistic, Fuji X-T5 look, editorial photography --ar 16:9 --style raw --v 7
```
**Kaydet as:** `assets/brand/og-image.jpg`

---

**Komut 2: HERO BACKGROUND** (dark engine room)
```
ultra-wide cinematic shot of bulk carrier engine room, main switchboard with amber and green status LEDs, cool blue ambient light mixed with warm tungsten work lamps, dramatic depth of field, volumetric haze, industrial photorealism, editorial quality --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/hero/hero-bg.jpg`

---

**Komut 3: POWER SYSTEMS Kartı**
```
close-up of marine main switchboard panel, vertical busbars, insulated cable terminations, analog gauges and digital meters, professional photography, deep navy and amber accent lighting, tack-sharp focus on copper busbar --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/01-power-systems.jpg`

---

**Komut 4: PROPULSION MOTORS Kartı**
```
industrial photograph of large marine electric motor with windings visible, technician hands inspecting insulation, warm key light, cool fill light, shallow depth of field, editorial documentary style --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/02-propulsion-motors.jpg`

---

**Komut 5: NAVIGATION COMMS Kartı**
```
modern ship bridge console at dusk, radar display with green sweep glow, ECDIS chart on LCD, multiple navigation instruments, moody cinematic lighting, reflections on black glass console, photorealistic --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/03-navigation-comms.jpg`

---

**Komut 6: AUTOMATION CONTROL Kartı**
```
close-up of industrial PLC cabinet inside marine engine control room, colored Ethernet cables organized in bundles, labeled terminal blocks, teal and amber indicator lights, clinical sharp focus, engineering photography --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/04-automation-control.jpg`

---

**Komut 7: SAFETY SYSTEMS Kartı**
```
marine fire detection panel mounted on bulkhead, red and green LEDs, protective glass cover, emergency signage background, dramatic side lighting, photorealistic industrial documentation --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/05-safety-systems.jpg`

---

**Komut 8: LIGHTING NAV LIGHTS Kartı**
```
bulk carrier navigation lights at twilight, masthead light glowing amber against navy blue sky, ship silhouette, cinematic wide composition, editorial maritime photography --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/06-lighting-nav-lights.jpg`

---

**Komut 9: TESTING CERTIFICATION Kartı**
```
hands of a marine electrician operating SVERKER 900 protection relay test set connected to switchboard with multicolor test leads, laptop with test report open, clinical workshop lighting, sharp focus on test device display --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/07-testing-certification.jpg`

---

**Komut 10: COMMISSIONING RETROFIT Kartı**
```
engineer wearing navy blue coverall and hard hat commissioning new marine switchboard in a shipyard, LED indicators illuminated for the first time, golden hour light through shipyard window, photorealistic --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/08-commissioning-retrofit.jpg`

---

**Komut 11: EMERGENCY RESPONSE Kartı**
```
marine technician with headlamp working on electrical panel in engine room at night, focused concentration, warm work light, deep shadow background, dramatic documentary photography --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/09-emergency-response.jpg`

---

**Komut 12: CLASS PREP Kartı**
```
marine surveyor in white coverall with clipboard inspecting ship electrical equipment with flashlight, technician standing nearby, professional class survey documentation scene, clinical lighting --ar 3:2 --style raw --v 7
```
**Kaydet as:** `assets/services/10-class-prep.jpg`

---

### Yerleştirme Talimatları

1. **Midjourney'de üret:** Yukarıdaki her prompt'ı Discord `/imagine` komutuna yapıştır
2. **4 seçenekten seç:** En net, en kontrastlı seçeneği belirle
3. **Upscale + Refine:** `U3` (upscale) veya `V3` (variations) ile düzelt
4. **İndir:** Sağ tık → "Save image"
5. **Kaydet:** Yukarıdaki dosya yollarına `.jpg` olarak kaydet (85% kalite)
6. **Repo'ya ekle:** 
   ```bash
   git add assets/brand/ assets/hero/ assets/services/
   git commit -m "feat(assets): add week-1 hero + 10 service card images"
   git push
   ```

---

### ✅ Kontrol Listesi

- [ ] 13 görsel Midjourney'de üretildi
- [ ] Tümü `.jpg` olarak kaydedildi
- [ ] Dosya yolları doğru (assets/services/01- vs.)
- [ ] `git push` yapıldı
- [ ] Site http://localhost:8080 açıldığında görseller görünüyor
- [ ] Placeholder gradient'ler kayboldu (yerine fotoğraflar geldi)

---

## 📊 Gelecek Haftalar

| Hafta | Görsel | Amaç |
|-------|---------|------|
| 1 | 13 | ✅ Hero + 10 hizmet kartı + 2 özel |
| 2 | 10 | Hizmet detay panoramaları (drawer) |
| 3 | 13 | Proje + ekipman görselleri |
| 4 | 12 | Kurumsal + infografik + logo.svg |

---

## 🎯 Hedef

Site görsel olarak **%100 tamamlanmış** görünsün, rakiplerden öne çık.

**Sonraki:** Prompt 2 (GitHub Pages domain), Prompt 3 (blog), Prompt 4 (PDF), Prompt 5 (form endpoint)
