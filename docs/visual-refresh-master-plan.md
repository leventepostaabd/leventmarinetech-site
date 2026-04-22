# Levent Marine — Görsel & hareket master planı

Bu doküman: **boyut**, **hedef dosya ağırlığı**, **faz planı** ve stil notları.

**Kopyala-yapıştır promptlar (anahtar + yol + tam metin, tek blok):** `docs/image-prompts-copypaste.md`

---

## 0. Stil DNA (tüm görseller)


| Kural  | Değer                                                                                               |
| ------ | --------------------------------------------------------------------------------------------------- |
| Renk   | Açık tema ile uyum: soğuk gri, beyaz, tek mavi vurgu (`#0071e3` civarı), abartısız turuncu/teal yok |
| İçerik | **Metin, logo, okunabilir etiket yok** (gerekirse bulanık/çıplak ekipman)                           |
| İnsan  | Yüz yok; el/omuz silüeti isteğe bağlı                                                               |
| Format | **JPEG** 80–85% veya **PNG**; web için mümkünse **WebP** ikizi (aynı isim `.webp`)                  |
| Son ek | İngilizce prompt sonuna: `Editorial photography, 8k, no text, no logos, no readable labels.`        |


**Global negatif prompt (isteğe bağlı ek):** `text, watermark, logo, brand name, distorted fingers, cartoon, oversaturated HDR`

### 0.1 Net fotoğraf hissi — “pastel / boya” değil

Ürettiğin görseller **yumuşak, illustratif veya folyo gibi** görünüyorsa bu genelde **yanlış model seçimi değil**; prompt’un *cinematic, dreamy, volumetric, futuristic render* gibi ifadelerle **AI resim stiline** kaymasıdır.


| Sorun                            | Ne yap                                                                                                                                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bulanık / boya gibi              | Prompta ekle: `**photorealistic, shot on medium format camera, tack sharp focus, crisp micro-contrast, fine metal texture, documentary industrial photography`**                                         |
| Aşırı parlak folyo               | Ekle: `**matte steel, brushed aluminum, controlled specular highlights, f/8 depth of field**` — kaçın: *chrome foil, liquid metal, sci-fi render*                                                        |
| Köprü gece sahneleri “rüya gibi” | Ekle: `**high resolution RAW photo, visible pixel-sharp UI glow on monitors, no painterly brushstrokes*`* — kaçın: *bokeh orbs, ethereal, atmospheric fog* (biraz bokeh olabilir ama ön plan net olmalı) |
| Tek üretim yeterli olmuyor       | Aynı promptla **2–3 varyant** üret; **en keskin kenarlı** olanı seç. Gerekirse **küçük crop** + hafif **netlik (unsharp mask)** Photoshop’ta                                                             |


**Prompt sonuna her zaman eklenecek netlik bloğu (İngilizce):**

```
Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

**Kaçınılacak kelimeler (pastel / çizgi film riski):** `cinematic, dreamy, ethereal, concept art, digital painting, illustration, volumetric haze, fantasy, futuristic glow, hyper-detailed fantasy`

**Model notu:** ChatGPT / DALL·E ile üretiyorsan yukarıdaki netlik cümleleri özellikle işe yarar. Midjourney kullanıyorsan: `**--style raw --stylize 50-150`** (düşük stylize = daha fotoğraf), Flux/SD için: düşük **CFG** yerine “photo” LoRA veya *realistic* checkpoint tercih et.

---

## 1. Marka & ana panel (öncelik: P0)


| #   | Tam yol                      | Boyut (px)                               | Oran    | Hedef boyut                   | Süre (tek görsel)                    |
| --- | ---------------------------- | ---------------------------------------- | ------- | ----------------------------- | ------------------------------------ |
| B1  | `assets/logo.png`            | **512×512** min (mevcut kullanım: 44×44) | 1:1     | < 150 KB                      | — (vektör kaynaktan export önerilir) |
| B2  | `assets/brand/hero-main.png` | **1920×1080**                            | 16:9    | < 450 KB JPEG / < 280 KB WebP | 15–30 dk                             |
| B3  | `assets/brand/og-image.jpg`  | **1200×630**                             | ~1.91:1 | < 200 KB                      | 15–25 dk                             |


### B2 — `assets/brand/hero-main.png` (ana sayfa sağ görsel)

**Prompt:**

```
Wide 16:9 editorial photograph, ultra-clean corporate style inspired by Apple product marketing. Subject: abstract suggestion of marine automation and electrical systems — soft gradients, subtle precision lines, cool gray and white with a single accent blue, calm negative space suitable for text on the left in layout. Minimal, no ship silhouette unless very soft and out of focus. No text, no logos, no people, no readable equipment labels. Soft natural light, shallow depth, professional color grading.
```

**Not:** Üretim PNG ise dosya büyük olabilir; yayına `**hero-main.jpg`** olarak da kullanılabilir — o zaman `index.html` içinde `src` bir satırla `hero-main.jpg` yapılır (şu an `.png`).

### B3 — `assets/brand/og-image.jpg` (LinkedIn / WhatsApp / Twitter)

**Prompt:**

```
1200 by 630 marketing banner, marine electrical and automation engineering theme, abstract geometric waves and subtle circuit motif, navy and cool gray with one electric blue accent, large clean area on the left third for brand, no letters, no words, no logos rendered, flat modern corporate design, high resolution.
```

---

## 2. Hizmet mozaiği — 10 kart (`js/app.js` → `SERVICES`)

**Klasör:** `assets/services/`  
**Boyut (hepsi):** **1200×800** (3:2)  
**Hedef:** < 180 KB / dosya (JPEG ~82%)

Dosya adı = kod anahtarı + `.jpg`:


| #   | Dosya (tam yol)                              | Konu                                     | Süre  |
| --- | -------------------------------------------- | ---------------------------------------- | ----- |
| S1  | `assets/services/power-distribution.jpg`     | Ana pano, busbar, dijital gösterge       | 15 dk |
| S2  | `assets/services/propulsion-motors.jpg`      | Büyük motor, endüstriyel ışık            | 15 dk |
| S3  | `assets/services/navigation-comms.jpg`       | Köprü radar/ECDIS gece                   | 15 dk |
| S4  | `assets/services/automation-control.jpg`     | PLC/I/O dolabı, LED                      | 15 dk |
| S5  | `assets/services/safety-systems.jpg`         | Yangın/güvenlik paneli                   | 15 dk |
| S6  | `assets/services/lighting-nav-lights.jpg`    | Seyir feneri / direk ışığı alacakaranlık | 15 dk |
| S7  | `assets/services/testing-certification.jpg`  | Megger/multimetre, terminaller           | 15 dk |
| S8  | `assets/services/commissioning-retrofit.jpg` | Retrofit kablolama, etiketli pano        | 15 dk |
| S9  | `assets/services/emergency-remote.jpg`       | Rugged tablet/laptop, şema ekranı        | 15 dk |
| S10 | `assets/services/class-prep.jpg`             | Test ekipmanı + klasör/checklist masada  | 15 dk |


**Kopyala-yapıştır şablon (konuyu değiştir):**

```
Cinematic [KONU], cool white and pale blue ambient light, shallow depth of field, professional marine engineering photography, 3 by 2 aspect ratio, no text, no logos, editorial quality.
```

Detaylı tek tek promptlar: `docs/assets-service-photos.md` (aynı dosya adları).

**Toplam tahmini süre:** 2.5–4 saat (üretim + seçim + export).

---

## 3. Galeri — saha fotoğrafları (`index.html` galeri şeridi)

Şu an yollar **sabit HTML** içinde; dosyaları **aynı isimle** değiştirmeniz yeterli (yeniden boyutlandırma önerilir).

**Önerilen boyut:** uzun kenar **1600 px**, oran korunarak (kare değilse)  
**Hedef:** < 250 KB / görsel


| Tam yol                                          | Kısa prompt (yenileme / upgrade)                          |
| ------------------------------------------------ | --------------------------------------------------------- |
| `assets/cert/acb-mccb-test.jpg`                  | SVERKER veya test ekipmanı, ACB terminalleri, keskin odak |
| `assets/works/generator-avr-diode-speedcard.jpg` | Jeneratör kontrol kutusu, AVR modülü, kablo demeti        |
| `assets/works/motor-overhaul.jpg`                | Motor sargısı detayı, endüstriyel ışık                    |
| `assets/works/radar-magnetron-replacement.jpg`   | Radar ünitesi, köprü, ekran yansıması                     |
| `assets/works/ams-system-card-replacement.jpg`   | AMS/IO kartı, rack, etiketler bulanık                     |
| `assets/works/fire-alarm-system.jpg`             | Yangın paneli, loop, LED                                  |
| `assets/works/water-mist-system.jpg`             | Water mist başlık/boru, gemi ortamı                       |
| `assets/works/shaft-earthing-device.jpg`         | Shaft earthing ünite, kablolar                            |
| `assets/works/crane-panel-speed-control.jpg`     | Vinç kontrol paneli, VFD                                  |
| `assets/cert/busbar-kit-2.jpg`                   | Busbar bağlantı, torque işi                               |
| `assets/cert/insulation-testing.jpg`             | Megger, kablo uçları                                      |
| `assets/cert/class-reporting.jpg`                | Rapor, mühür, masa üstü                                   |
| `assets/hero/engine-room.jpg`                    | Makine dairesi geniş, derinlik                            |


**Toplam tahmini süre:** 3–6 saat (batch veya mevcut fotoğrafları optimize etmek daha kısa).

---

## 4. Projeler şeridi (`PROJECTS` in `js/app.js`)

Şu an `assets/cert/`* ve `assets/works/`* karışık. Profesyonel görünüm için **ileride** hepsini `assets/projects/` altında toplayıp `img:` yollarını güncellemek mantıklı; zorunlu değil.


| Mevcut `img` yolu               | Önerilen hedef (opsiyonel)           |
| ------------------------------- | ------------------------------------ |
| `assets/cert/acb-mccb-test.jpg` | `assets/projects/pr-01-acb-test.jpg` |
| …                               | … (8 proje)                          |


**Süre:** 1–2 saat (yeniden adlandırma + `app.js` + test).

---

## 5. Blog & diğer


| Dosya                               | Boyut                  | Not                               |
| ----------------------------------- | ---------------------- | --------------------------------- |
| `assets/blog/class-survey-hero.jpg` | **1200×630** veya 16:9 | `blog/class-survey/index.html` OG |
| `assets/sample-certificate.pdf`     | —                      | Görsel değil; PDF                 |


---

## 6. Hareket (animasyon) planı — uygulama durumu


| Öğe              | Davranış                         | Teknik                                                      |
| ---------------- | -------------------------------- | ----------------------------------------------------------- |
| Panel geçişi     | Aktif panel yumuşak belirir      | `css/motion.css` + mevcut `.shell-panel` opacity            |
| Hero             | İlk yüklemede kısa “fade + rise” | `@keyframes` sadece `prefers-reduced-motion: no-preference` |
| Trust strip      | Logolar hafif sırayla belirir    | `animation-delay` ile stagger                               |
| Rail / butonlar  | Mevcut hover                     | `shell.css` + tasarım tokenları                             |
| Drawer / overlay | Mevcut kaydırma                  | `design.css` — dokunulmadı                                  |
| Hizmet kartı     | Hover scale foto                 | `design.css` — korundu                                      |


**Erişilebilirlik:** `prefers-reduced-motion: reduce` olan kullanıcılarda animasyonlar kapatılır.

**İleride (isteğe bağlı, JS):** Panel değişiminde hafif `view-transition` API (Chrome) veya Intersection Observer ile bölüm “reveal” — ayrı sprint.

---

## 7. Uygulama fazları ve toplam süre (gerçekçi)


| Faz       | İçerik                                     | Tahmini      |
| --------- | ------------------------------------------ | ------------ |
| **Faz A** | `motion.css` + HTML’de link                | ~30 dk (kod) |
| **Faz B** | B2 + B3 üret + yerleştir                   | ~1 saat      |
| **Faz C** | 10× hizmet JPEG                            | ~3–4 saat    |
| **Faz D** | Galeri optimize / yeniden çekim            | ~2–8 saat    |
| **Faz E** | Opsiyonel WebP pipeline, `picture` etiketi | ~2–4 saat    |


**Minimum “profesyonel görünür” set:** **Faz A + B + C** → yaklaşık **1 iş günü** (üretim ve seçim dahil).

---

## 8. Yerleştirme kontrol listesi

1. Dosyayı **tam yol** ile kaydet (tabloda verilen gibi).
2. Tarayıcıda hard refresh (Ctrl+F5).
3. Hizmetler: 10 kartta kırık görsel yok mu?
4. Ana sayfa: hero sağ görsel net mi?
5. Sosyal önizleme: `og-image.jpg` — LinkedIn Post Inspector / Twitter Card Validator (isteğe bağlı).

---

## 9. İlgili dosyalar

- `docs/chatgpt-image-prompts.md` — hero/OG odaklı kısa rehber  
- `docs/assets-service-photos.md` — 10 hizmet detay prompt  
- `assets/IMAGES.md` — eski numaralı isimler; **kod için doğru isimler bu master planda §2**

