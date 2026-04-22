# Levent Marine — tek blokta anahtar + yol + tam prompt

**Kullanım:** Her **kod bloğu** tek kayıttır.  

- **Satır 1:** `SERVICES` anahtarı (veya marka etiketi)  
- **Satır 2:** Repoda kaydedeceğin **tam dosya yolu**  
- **Satır 3:** boş  
- **Satır 4’ten sona:** Görsel üreticiye (ChatGPT / DALL·E vb.) yapıştırılacak **tek parça İngilizce prompt**

**DALL·E’ye yapıştırırken:** Kod bloğunda **4. satırdan itibaren** seçin; veya bloğu komple yapıştırıp **ilk iki satırı** silin.

Boyut özeti: hizmet kartları **1200×800** (3:2), hero **1920×1080**, OG **1200×630**. Detay: `docs/visual-refresh-master-plan.md`.

---

## Marka — ana hero

```
hero-main
assets/brand/hero-main.png

Wide 16:9 photorealistic editorial photograph, ultra-clean corporate style inspired by Apple product marketing. Abstract suggestion of marine automation and electrical systems: soft cool gray and white gradients, subtle precision lines, single accent blue, calm negative space suitable for text on the left. Minimal, no ship silhouette unless extremely soft and out of focus. No text, no logos, no people, no readable equipment labels. Matte surfaces not chrome foil, not oil painting, not digital illustration, soft natural light, professional color grading for B2B annual report, 8k quality.
```

---

## Marka — Open Graph / sosyal

```
og-image
assets/brand/og-image.jpg

Photorealistic 1200 by 630 marketing banner, marine electrical and automation engineering theme, abstract geometric waves and subtle circuit motif, navy and cool gray with one electric blue accent, large clean area on the left third for brand placement, no letters, no words, no logos rendered, flat modern corporate design, sharp edges not painterly brushstrokes, high resolution, crisp not dreamy.
```

---

## Marka — kare ikon (isteğe bağlı; tercihen vektör logo kullanın)

```
logo-mark-square
assets/brand/logo-mark-square.png

Simple square app icon, abstract letter L and M monogram merged, single color navy on white, flat vector style, no text words, corporate maritime engineering, 512 by 512 pixels, sharp edges, not painterly.
```

---

## Hizmet kartları (10) — `js/app.js` ile aynı dosya adları

```
power-distribution
assets/services/power-distribution.jpg

Photorealistic close-up of a marine main switchboard with vertical busbars and digital meters, cool white and blue ambient light, f/8 sharp depth, matte metal surfaces not chrome foil, professional engineering photography, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

```
propulsion-motors
assets/services/propulsion-motors.jpg

Photorealistic large marine electric motor in engine room, sharp focus on winding and casing texture, warm tungsten work light, matte painted steel not foil metal, industrial documentary photo, f/8, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

```
navigation-comms
assets/services/navigation-comms.jpg

Photorealistic ship bridge at night, radar and ECDIS monitors in foreground tack sharp, abstract UI glow without readable text, console buttons in focus, background city lights slightly blurred only, RAW photo look not illustration, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

```
automation-control
assets/services/automation-control.jpg

Photorealistic marine PLC and I/O cabinet with organized cables and status LEDs, clinical sharp focus, cool gray tones, matte enclosure not plastic CGI, f/8, documentary industrial photography, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

```
safety-systems
assets/services/safety-systems.jpg

Photorealistic marine fire or safety panel on bulkhead, red and green LEDs, sharp focus on panel surface texture, dramatic but hard side light not foggy, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

```
lighting-nav-lights
assets/services/lighting-nav-lights.jpg

Photorealistic ship navigation lantern at twilight, sharp glass and housing edges, navy sky, minimal composition, no painterly glow, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

```
testing-certification
assets/services/testing-certification.jpg

Photorealistic technician hands holding calibrated multimeter or megger at cable terminals, sharp focus on instrument and terminals, neutral background, documentary photo, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

```
commissioning-retrofit
assets/services/commissioning-retrofit.jpg

Photorealistic commissioning scene: temporary cables and labeled panels during vessel retrofit, organized chaos, cool light, matte metal, sharp focus on cable labels as texture not readable words, f/8, documentary photography, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

```
emergency-remote
assets/services/emergency-remote.jpg

Photorealistic laptop or rugged tablet with abstract ship schematic on screen in dim engine control room, blue screen glow, no readable text on display, urgency without people faces visible, sharp device edges, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

```
class-prep
assets/services/class-prep.jpg

Photorealistic survey-style checklist and electrical test gear on table, neutral ship office lighting, sharp paper and tool textures, no readable form text, documentary photo, 3:2 aspect ratio, no text, no logos. Photorealistic documentary style, sharp focus throughout the main subject, no oil painting look, no watercolor, no illustration, no CGI plastic look, high micro-detail, professional color grading for tech annual report, NOT cinematic soft glow.
```

