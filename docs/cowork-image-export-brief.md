# Cowork / ekip — ChatGPT PNG çıktılarını siteye hazırlama

## Görev

Elimizde **ChatGPT’den indirilen büyük PNG** dosyaları var. Bunları aşağıdaki tablodaki **tam dosya yolu**, **piksel boyutu** ve **uzantı** ile export edip **Levent Marine site reposunun kökünden** ilgili klasörlere koyacaksın. Gerekirse önce `assets/brand` ve `assets/services` klasörlerinin var olduğunu kontrol et.

**Kaynak varsayımı:** Dosya adları üretim anahtarıyla eşleşiyor (ör. `power-distribution.png`, `hero-main.png`). Farklı isimlendirme varsa tablodaki **hedef dosya adına** manuel eşle.

## Tablo — kaynak → hedef

| Kaynak (örnek isim) | Hedef yol (repo köküne göre) | Boyut (px) | Format | JPEG kalite notu |
|---------------------|------------------------------|------------|--------|------------------|
| `hero-main.png` | `assets/brand/hero-main.png` | **1920 × 1080** | **PNG** (veya site için PNG; dosya büyükse lossy PNG / optimize) | — |
| `og-image.png` | `assets/brand/og-image.jpg` | **1200 × 630** | **JPEG** | %82–85 |
| `power-distribution.png` | `assets/services/power-distribution.jpg` | **1200 × 800** | **JPEG** | %82–85 |
| `propulsion-motors.png` | `assets/services/propulsion-motors.jpg` | **1200 × 800** | **JPEG** | %82–85 |
| `navigation-comms.png` | `assets/services/navigation-comms.jpg` | **1200 × 800** | **JPEG** | %82–85 |
| `automation-control.png` | `assets/services/automation-control.jpg` | **1200 × 800** | **JPEG** | %82–85 |
| `safety-systems.png` | `assets/services/safety-systems.jpg` | **1200 × 800** | **JPEG** | %82–85 |
| `lighting-nav-lights.png` | `assets/services/lighting-nav-lights.jpg` | **1200 × 800** | **JPEG** | %82–85 |
| `testing-certification.png` | `assets/services/testing-certification.jpg` | **1200 × 800** | **JPEG** | %82–85 |
| `commissioning-retrofit.png` | `assets/services/commissioning-retrofit.jpg` | **1200 × 800** | **JPEG** | %82–85 |
| `emergency-remote.png` | `assets/services/emergency-remote.jpg` | **1200 × 800** | **JPEG** | %82–85 |
| `class-prep.png` | `assets/services/class-prep.jpg` | **1200 × 800** | **JPEG** | %82–85 |

**İsteğe bağlı:** `logo-mark-square.png` → `assets/brand/logo-mark-square.png`, **512 × 512**, PNG.

## Kurallar

1. **Oran:** Hedef oran sabit; kaynak farklı oranda ise **kırpma (center crop)** veya **cover** ile doldur — görseli **esnetme (stretch yapma)**.
2. **Renk:** sRGB export.
3. **Dosya boyutu hedefi (yaklaşık):** hero PNG &lt; ~500 KB mümkünse; hizmet JPEG’leri ~120–200 KB civarı; OG JPEG &lt; ~200 KB.
4. **Üzerine yaz:** Aynı isimde dosya varsa yeni export ile değiştir.

## ImageMagick örnek (tek satır / dosya)

Örnek: hizmet kartı (PowerShell’de yolları düzenle):

```bash
magick "IN/power-distribution.png" -resize 1200x800^ -gravity center -extent 1200x800 -colorspace sRGB -quality 84 "OUT/assets/services/power-distribution.jpg"
```

Hero PNG:

```bash
magick "IN/hero-main.png" -resize 1920x1080^ -gravity center -extent 1920x1080 -colorspace sRGB "OUT/assets/brand/hero-main.png"
```

OG JPEG:

```bash
magick "IN/og-image.png" -resize 1200x630^ -gravity center -extent 1200x630 -colorspace sRGB -quality 84 "OUT/assets/brand/og-image.jpg"
```

`IN/` = ChatGPT’den gelen PNG’lerin klasörü, `OUT/` = repo kökü (veya doğrudan repo içinde çalışıyorsan `OUT/` kaldır).

## Doğrulama

- `assets/services/` altında **10 adet** `.jpg` var mı?
- `assets/brand/hero-main.png` ve `assets/brand/og-image.jpg` var mı?
- Yerelde `index.html` açılıp Hizmetler ve ana hero görünüyor mu (kırık görsel yok)?

Referans: `docs/image-prompts-copypaste.md`

---

## Tamamlanma kaydı (işlendi — sRGB, cover + center crop)

HTML/CSS/JS içindeki görsel referansları bu dosya adlarıyla eşleşiyor; kırık referans yok.

### `assets/brand/`

| Dosya | Boyut | Dosya boyutu | Not |
|--------|--------|---------------|-----|
| `hero-main.png` | 1920×1080 | **572 KB** | PNG, 128 renk paleti (Pillow). ~500 KB hedefi için ileride **yerelde** `pngquant --quality=65-80` denenebilir; tam RGB ~1.6 MB. |
| `og-image.jpg` | 1200×630 | **56 KB** | JPEG q=85. Kaynak bazen JPEG uzantılı PNG verisiydi — gerçek JPEG olarak yeniden yazıldı. |

### `assets/services/` (1200×800, JPEG progressive, 4:2:0)

| Dosya | Boyut | q | Not |
|--------|--------|---|-----|
| `power-distribution.jpg` | 200 KB | 85 | — |
| `propulsion-motors.jpg` | 199 KB | 84 | — |
| `navigation-comms.jpg` | 176 KB | 85 | — |
| `automation-control.jpg` | 198 KB | 78 | Kaynak detaylı; daha düşük q banding riski |
| `safety-systems.jpg` | 164 KB | 85 | — |
| `lighting-nav-lights.jpg` | 113 KB | 85 | — |
| `testing-certification.jpg` | 146 KB | 85 | — |
| `commissioning-retrofit.jpg` | **213 KB** | 78 | ~200 KB penceresinin hafif üstü; q&lt;78 blok artefakt. İsteğe bağlı: q=75 ile ~200 KB altı denemesi |
| `emergency-remote.jpg` | 168 KB | 85 | — |
| `class-prep.jpg` | 188 KB | 85 | — |

### İsteğe bağlı sonraki adımlar

1. **Hero:** Makinede `pngquant` veya `oxipng` ile 572 KB → hedef &lt;500 KB (kaliteyi gözle karşılaştır).
2. **commissioning-retrofit:** Sadece ağırlık kritikse q=75 tek deneme; değilse mevcut 213 KB kabul edilebilir.
