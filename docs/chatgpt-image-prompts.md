# ChatGPT (DALL·E) — Levent Marine görsel üretim rehberi

**Tek dosyada — her görsel için: anahtar + tam yol + tam İngilizce prompt (tek kod bloğu):**  
→ **`docs/image-prompts-copypaste.md`**

**Tam envanter, süre tahminleri, faz planı ve galeri yolları:** `docs/visual-refresh-master-plan.md`

Aşağıdaki bölümler özet içindir; güncel tam metinler `image-prompts-copypaste.md` ile uyumludur.

## Genel kurallar

| Ne | Öneri |
|----|--------|
| Format | **PNG** (şeffaflık gerekmez) veya **JPEG** (fotoğraf ağırlıklı) |
| Renk | Apple tarzı sade arka plan: `#f5f5f7`, `#ffffff`, düşük doygunluklu mavi-gri; abartılı turuncu/teal yok |
| Stil | Kurumsal annual report, Apple ürün sayfası fotoğraf kalitesi, **metin yok**, **logo yok**, **insan yüzü yok** (istenmedikçe) |

---

## 1. Ana hero (şu an kullanılan)

| Alan | Değer |
|------|--------|
| **Dosya yolu** | `assets/brand/hero-main.png` |
| **Boyut (üretim)** | **1920 × 1080 px** (16:9) — sitede responsive küçülür |
| **Dosya boyutu hedefi** | &lt; 500 KB (JPEG 80–85% mümkünse WebP ayrıca) |

**Prompt (İngilizce — ChatGPT’ye yapıştır):**

```
Wide 16:9 editorial photograph, ultra-clean corporate style inspired by Apple product pages. Abstract suggestion of marine electrical engineering: soft cool gray and white gradients, very subtle geometric lines suggesting precision and reliability, minimal, calm, no text, no logos, no people, no ships in full view. Soft natural lighting, high-end B2B annual report aesthetic, shallow depth, professional color grading, 8k quality.
```

**Alternatif (daha “endüstriyel”):**

```
Photorealistic close-up of anonymous marine electrical equipment in soft focus background, cool white and pale blue ambient light, minimalist composition, large negative space on the left third, no text, no logos, no readable labels, corporate engineering photography, 16:9.
```

---

## 2. Sosyal / Open Graph paylaşım görseli

| Alan | Değer |
|------|--------|
| **Dosya yolu** | `assets/brand/og-image.jpg` |
| **Boyut** | **1200 × 630 px** (Facebook/LinkedIn önerisi) |

**Prompt:**

```
1200 by 630 banner, corporate marine electrical services, abstract geometric waves and subtle circuit motif, navy and cool gray palette with one accent blue, minimal, space on left for imaginary logo, no text rendered, no letters, professional marketing asset, flat depth, clean.
```

*(Meta etiketleri zaten `og-image.jpg` bekliyor; ürettikten sonra bu isimle `assets/brand/` içine koyun.)*

---

## 3. Rail / mobil için küçük marka ikonu (isteğe bağlı)

Logonuz zaten `assets/logo.png`. İsterseniz **kare ikon** üretmeyin; mevcut logo kullanılmalı. Yine de alternatif:

| Alan | Değer |
|------|--------|
| **Dosya yolu** | `assets/brand/logo-mark-square.png` |
| **Boyut** | **512 × 512 px** |

**Prompt:**

```
Simple square app icon placeholder, abstract letter L and M monogram merged, single color navy on white, flat vector style, no text words, corporate maritime engineering, 512x512.
```

*Not: Gerçek kurumsal kimlik için **vektör logo dosyanızı** (SVG/AI) kullanmak her zaman daha doğrudur.*

---

## 4. Hizmet kartları (ileride `SERVICES` görselleriyle eşleştirme)

Her biri **3:2** veya **4:3**, `assets/services/` altında — `IMAGES.md` ile uyumlu isimler:

| Dosya | Boyut | Kısa prompt yönü |
|-------|--------|-------------------|
| `assets/services/01-power-systems.jpg` | **1200 × 800** | Marine main switchboard, cool light, no text |
| `assets/services/02-propulsion-motors.jpg` | **1200 × 800** | Large electric motor detail, industrial, soft light |

*(Detaylı prompt listesi için `assets/IMAGES.md` dosyasına bakın; oradaki cümleleri ChatGPT’ye de verebilirsiniz.)*

---

## Klasör özeti

```
assets/
  logo.png                 ← mevcut kurumsal logo (rail’de kullanılıyor)
  brand/
    hero-main.png          ← ana panel sağ görsel (1920×1080 önerilir)
    og-image.jpg           ← 1200×630 paylaşım
  services/                ← hizmet kart fotoğrafları (isteğe bağlı)
  works/                   ← saha fotoğrafları (mevcut galeri)
```

---

## Neden önce logo kullanılmadı?

Önceki tasarımda geçici olarak CSS ile renkli kutu kullanılmıştı. **v7** ile sol menüde `assets/logo.png` doğrudan `<img>` ile bağlandı; hero görseli ise `assets/brand/hero-main.png` yolunda tutuluyor (şu an placeholder kopyası mevcut — ürettiğiniz dosyayla **aynı isimle üzerine yazın**).
