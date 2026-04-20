# Claude Code Prompt Paketi — Levent Marine

VS Code'da Claude Code ekstensiyonunu açtığınızda aşağıdaki prompt'ları sırayla (veya ihtiyaca göre) kullanın.

---

## 🎯 PROMPT 0 — İlk oryantasyon (HER YENİ OTURUMDA İLK BU)

Yeni bir Claude Code oturumu açtığınızda bunu yapıştırın. Projeyi anlar ve yardıma hazır olur:

```
Merhaba. Bu proje: Levent Marine Electro Technical Services web sitesi.

BAĞLAM
- Firma: Türkiye (Pendik) + USA (Wyoming) merkezli marine elektrik servis firması
- Uzmanlık: bulker (kuruyuk) gemilerde elektrik arıza/bakım/test/sertifikasyon
- Hedef kitle: technical superintendent, class surveyor, ship broker, P&I sigorta
- Domain: www.leventmarinetech.com (GitHub Pages deploy)
- Repo: https://github.com/leventepostaabd/leventmarinetech-site

MEVCUT DURUM
- v2.0 bento grid yeniden tasarım yayında
- Açık tema (Deep Harbor paleti: #0B1F3A primary + #F5A524 accent)
- TR/EN i18n (localStorage persistence)
- 10 hizmet kategorisi, ~80 alt hizmet
- Static HTML + CSS + vanilla JS (build step yok, GitHub Pages friendly)
- Backend API ayrı repo (leventmarinetech-api) — form endpoint henüz canlı değil

BENİM ÖNEMLİ DOSYALAR
- index.html: ana sayfa
- profile.html: hakkımızda
- authorized.html: yetkili panel (DOKUNMA, backend API'ye bağlı)
- css/design.css: TÜM v2 stiller burada
- js/app.js: services data + i18n + drawer + form + login
- assets/IMAGES.md: tüm görseller için AI prompt + dosya yolu rehberi
- CHANGELOG.md: ne değişti geçmişi
- README.md: proje özeti

KURALLAR
- Herhangi bir değişiklik öncesi önce değişecek dosyayı oku
- Build step yok — HTML/CSS/JS doğrudan çalışmalı
- Tüm yeni metinleri TR+EN eklememli (data-i18n key + I18N obj güncelleme)
- Renk paleti dışına çıkma (--c-primary, --c-accent vs. CSS variable'larını kullan)
- Tipografi: Space Grotesk (heading), Inter (body), JetBrains Mono (mono)
- authorized.html ve eski CSS/JS dosyalarına DOKUNMA — yetkili panel onlara bağlı
- Commit mesajları İngilizce, conventional (feat:, fix:, docs:, style:, chore:)

İLK YAPACAĞIN
1. `git status` ile mevcut durumu kontrol et
2. README.md ve CHANGELOG.md oku
3. Proje yapısını anladığını bana 3 cümle ile özetle
4. Benim ne yapmak istediğimi sor

Şimdi ne yapmak istediğim: [BURAYA HEDEFİ YAZ — örn: "ilk blog postunu eklemek istiyorum" veya "contact form backend'ini kurmak istiyorum"]
```

---

## 📸 PROMPT 1 — AI görsel batch üretimi ve yerleştirme

Midjourney ile görselleri üretip siteye koyarken:

```
assets/IMAGES.md dosyasını oku. Ben Midjourney'de ~50 görsel üretip bilgisayarımdaki bir klasöre koydum. Onları sitede doğru yerlere yerleştirmek istiyorum.

YAPACAKLARIN
1. assets/IMAGES.md'deki her görsel için hangi dosya yoluna gitmesi gerektiğini listele
2. Bana görselleri nasıl adlandırıp nereye koymam gerektiğini adım adım söyle
3. Yerleştirme sonrası index.html'i aç ve `background-image` referansları doğru mu kontrol et
4. Eksik görsel varsa, placeholder olmaya devam edeceklerini bana söyle (hata olmasın)
5. Yerleştirme sonrası local'de `python3 -m http.server 8080` ile test et, bana hangi URL'i açacağımı söyle

GÖRSEL OPTİMİZASYONU
- Her jpg dosyasını sıkıştır (sharp CLI veya imagemin). Hedef: hero <400KB, kart <150KB, ekipman <100KB
- WebP alternatif üret (.jpg ile aynı isim + .webp)
- index.html'de `<picture>` element kullan (WebP önce, jpg fallback)

Eğer cwebp/imagemin yüklü değilse bana nasıl yükleyeceğimi söyle (pip veya brew).

Yerleştirme bittiğinde commit:
git add assets/
git commit -m "feat(assets): add AI-generated hero, service and project images"
git push
```

---

## 🌐 PROMPT 2 — GitHub Pages + custom domain (www.leventmarinetech.com)

Domain'i bağlarken:

```
GitHub Pages'i aktive ettim. Şimdi custom domain bağlayacağım (www.leventmarinetech.com).

YAPACAKLARIN
1. CNAME dosyası doğru mu kontrol et (cat CNAME — içinde "www.leventmarinetech.com" olmalı)
2. Domain sağlayıcımda (bana sor) hangi DNS kayıtlarını ekleyeceğimi tam olarak söyle:
   - A kayıtları (4 adet: 185.199.108.153, 109, 110, 111)
   - CNAME kaydı (www → leventepostaabd.github.io)
3. DNS propagation'u test etme komutunu ver (dig, nslookup)
4. GitHub'da Settings → Pages → Custom domain: www.leventmarinetech.com gir + Enforce HTTPS onayla
5. Sertifika (Let's Encrypt) provisioning'i beklerken beni bilgilendir
6. Test için: `curl -I https://www.leventmarinetech.com` → 200 OK bekliyoruz

Ayrıca meta tag'leri kontrol et — index.html'de og:url ve canonical doğru domain'e işaret ediyor mu?
```

---

## 📝 PROMPT 3 — İlk blog post ekleme

İlk içerik girişi için:

```
Blog yapısı kurup ilk 3 post'u ekleyeceğim. SEO odaklı, TR+EN iki dilli.

YAPACAKLARIN
1. blog/ klasörü oluştur
2. blog/index.html — blog ana sayfa (minimal: başlık + post kartları listesi)
3. blog/[slug]/index.html — her post için ayrı klasör + index.html
4. blog.css veya design.css'e blog stilleri ekle (aynı Deep Harbor palet, tipografi)
5. İlk 3 post'u ekle (her biri ~1000-1500 kelime, TR; EN versiyonu /en/blog/[slug]/ altına):

POST 1: "Class Survey Öncesi Elektriksel Hazırlık — 25 Maddelik Checklist (BV/DNV/ABS)"
- Giriş, class survey tipleri (intermediate/special/annual), 25 checklist maddesi kategorize edilmiş
- PDF download CTA (lead magnet), WhatsApp CTA
- Schema.org Article markup

POST 2: "ACB ve MCCB Testinde En Sık Yapılan 7 Hata"
- Her hata + sebep + çözüm
- Fotoğraf/diyagram yeri işaretle (assets/blog/acb-mccb/ klasöründe)
- CTA: "SVERKER ile ACB testi için talep oluştur"

POST 3: "Bulker Gemilerde En Sık Karşılaşılan 10 Elektrik Arızası"
- Her arıza + teşhis + müdahale süresi + koruma önlemi
- İç link: ilgili servis kartlarına (#service/power-distribution vs)

HER POST
- Hero image (alt text + WebP)
- Meta title + description (50-160 karakter)
- Open Graph + Twitter Card
- Breadcrumb: Home > Blog > Post
- Related posts section (alt tarafta 2 link)
- Author bio + yayın tarihi

index.html'e navigasyon menüsünde "Blog" linki ekle.
blog/ için sitemap.xml güncelle (yoksa oluştur).
robots.txt yoksa oluştur.

Tamamlandığında commit:
git add blog/ index.html sitemap.xml robots.txt
git commit -m "feat(blog): add blog structure + first 3 SEO posts (class survey, ACB/MCCB, bulker faults)"
git push
```

---

## 📄 PROMPT 4 — Lead magnet PDF oluşturma

İlk PDF indirme aracı:

```
"Class Survey Electrical Checklist — 25 Points (BV/DNV/ABS)" PDF'ini üret.

TEKNOLOJİ
- Markdown → PDF pandoc ile, veya
- HTML + puppeteer ile, veya (önerilen):
- weasyprint (pip install weasyprint) — HTML+CSS direkt PDF

ÇIKTI
- Dosya: assets/leadmagnets/class-survey-checklist-bv-dnv-abs.pdf
- 2-3 sayfa, A4
- Logo + brand renkleri (Deep Harbor palet)
- Kapak + 25 checklist maddesi kategorize + son sayfada CTA (WhatsApp + email)

YAPACAKLARIN
1. assets/leadmagnets/ klasörü oluştur
2. class-survey-checklist.html yaz (weasyprint için — A4, print stili)
3. Build script: scripts/build-pdf.sh veya package.json'a "build:pdf" script'i
4. PDF üret, dosya boyutunu kontrol et (<500KB hedef)
5. CTA band'da "Checklist İste" butonunu güncelle — direkt PDF linkine
6. Form submit sonrası PDF otomatik download (js/app.js güncelle)

SEO faydası
- PDF'i /assets/leadmagnets/ altında serve et (Google indeksler)
- Blog post 1'den (class survey guide) bu PDF'e link ver
- LinkedIn featured section için URL hazır

Commit:
git add assets/leadmagnets/ scripts/ js/app.js
git commit -m "feat(leadmagnet): class survey electrical checklist PDF + auto-download flow"
git push
```

---

## 🔌 PROMPT 5 — Contact form backend endpoint (Node/Express)

Form çalışsın diye:

```
Backend API ayrı repo (leventmarinetech-api). Şimdi /api/contact endpoint'ini kuralım.

YAPACAKLARIN
1. leventmarinetech-api repo'sunu clone et (yan dizine)
2. server.js içine /api/contact POST endpoint ekle:
   - Body validation (name, email, message required)
   - Email gönder (SendGrid veya Nodemailer + Gmail SMTP)
   - info@leventmarinetech.com'a mail at
   - Gönderen kişiye auto-reply (PDF checklist attachment opsiyonel)
   - CORS: sadece leventmarinetech.com + www + localhost kabul et
   - Rate limit: 3 mesaj / dakika / IP
   - Spam filter: honeypot field + Akismet opsiyonel
3. .env.example oluştur (SENDGRID_API_KEY, MAIL_FROM, MAIL_TO)
4. README güncelle — deploy talimatları
5. Deploy hedefi seç: Vercel, Railway, Render, Fly.io. Her biri için talimat ver.

ÖN YÜZ (site repo)
1. js/app.js — form submit'te fetch URL'ini production API'ye çevir
2. localhost'ta test için fallback WhatsApp akışı korunsun
3. Environment-based URL: localhost → http://localhost:3000/api/contact, prod → https://api.leventmarinetech.com/api/contact

Deploy sonrası test:
curl -X POST https://api.leventmarinetech.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'

Commit backend repo'ya:
git commit -am "feat(api): add contact form endpoint with email + auto-reply"

Commit site repo'ya:
git commit -am "feat(form): wire contact form to production API endpoint"
```

---

## ⚡ PROMPT 6 — Performans optimizasyonu (Lighthouse 95+)

Site hızını artırmak için:

```
Hedef: Lighthouse skorları 95+ (Performance, Accessibility, Best Practices, SEO).

YAPACAKLARIN
1. Lighthouse çalıştır (Chrome DevTools veya CLI: npx lighthouse https://www.leventmarinetech.com --view)
2. Her kategori için öneriyi listele ve puanla
3. Aşağıdakileri uygula:

CSS
- design.css'i minify (cssnano veya clean-css)
- Critical CSS inline (above-the-fold)
- Unused CSS temizle (purgecss)

JS
- app.js'i minify (terser)
- services data'yı lazy yüklenebilir yap (ilk render'da sadece ilk 4 kart, gerisinde IntersectionObserver)
- Passive event listeners

Görseller (assets/IMAGES.md bakımında)
- Tüm .jpg → WebP + .jpg fallback <picture>
- width/height attribute EKLE (CLS önle)
- loading="lazy" below-the-fold
- Responsive srcset (400w, 800w, 1600w)

HTML
- Gereksiz whitespace (HTML minify opsiyonel)
- Preload kritik kaynaklar (fonts, hero image)
- Font-display: swap var mı kontrol et
- defer/async script attributes

Güvenlik
- Content-Security-Policy header (GitHub Pages _headers ile)
- X-Frame-Options, Referrer-Policy

4. Değişiklikleri uygula, Lighthouse tekrar çalıştır, önceki/sonraki puanları paylaş
5. Commit:
git commit -am "perf: Lighthouse 95+ optimizations (minify, lazy-load, WebP, preload)"
git push
```

---

## 🎨 PROMPT 7 — Yeni hizmet kategorisi ekleme

İlerde hizmet eklemek istediğinizde:

```
js/app.js içindeki SERVICES object'ine yeni bir hizmet kategorisi ekle.

YENİ HİZMET
- Key: [slug, örn: "battery-hybrid"]
- İsim TR: [örn: "Battery & Hybrid Sistemler"]
- İsim EN: [örn: "Battery & Hybrid Systems"]
- Icon: [Lucide'dan veya ICONS object'ten seç]
- Kart boyutu: card-lg / card-md / card-sm / card-wide / card-third
- Foto: assets/services/[yeni-foto].jpg
- Detay foto: assets/services/detail-[slug].jpg
- Özet (lead): 1 cümle
- Summary: 2-3 cümle
- 6-8 alt hizmet item'ı (h: başlık, d: açıklama)
- CTA

YAPACAKLARIN
1. js/app.js SERVICES object'ine yeni key ekle (order numarası en yüksek +1)
2. assets/IMAGES.md'ye bu kategori için prompt + dosya yolu ekle
3. I18N object'e gerekli key varsa ekle (genelde gerekmez, SERVICES içinde TR/EN dahili)
4. Bento grid layout'ı bozulmadı mı kontrol et (total span hesabı doğru)
5. localhost'ta test et
6. Commit:
git commit -am "feat(services): add [yeni kategori] service category"
git push
```

---

## 📊 PROMPT 8 — Google Business Profile + LinkedIn + Analytics setup

Pazarlama aktiviasyonu:

```
Site canlıda, şimdi dijital varlığı güçlendirelim.

YAPACAKLARIN
1. Google Analytics 4 ekle (measurement ID'yi ben vereceğim)
   - js/app.js veya index.html'e gtag snippet
   - GDPR uyumlu cookie consent banner (vanilla JS, küçük)
   - Event tracking: form_submit, service_drawer_open, whatsapp_click, pdf_download
2. Google Search Console'a site ekle — DNS TXT veya HTML file verification
3. sitemap.xml + robots.txt oluştur (yoksa)
4. Bing Webmaster Tools'a da ekle
5. Google Business Profile oluşturma talimatları (iki ayrı profil: Türkiye + Wyoming)
   - Kategori: "Marine Services" + "Electrical Repair Shop"
   - Açıklama şablonu TR + EN
   - Service area: Tuzla, Yalova, Aliağa tersaneler
   - Foto listesi (hangi assets/ klasöründen)
6. LinkedIn Company Page oluşturma checklist'i
   - Logo, banner (hangi assets/)
   - Tagline, About
   - Specialties 10-20 keyword
7. LinkedIn kişisel profil optimizasyon önerisi
   - Headline, About, Featured

Tamamlayınca GELISIM-PLANI.md'ye "tamamlanan" listesi ekle.
```

---

## 🐛 PROMPT 9 — Hata ayıklama (bug fix)

Bir sorun olduğunda:

```
Şu sorunu yaşıyorum: [SORUNU AÇIK AÇIK YAZ]
Tarayıcı: [Chrome/Safari/Firefox + versiyon]
Cihaz: [Desktop/Mobile]
URL: [hangi sayfa]

YAPACAKLARIN
1. Sorunu önce yerel olarak reproduce et
2. İlgili dosyaları oku (sadece gerekli olanları)
3. Kök sebebi bul (geçici yama değil)
4. Düzelt, ama:
   - Başka bir şeyi kırma
   - CSS değişken sistemini bozma
   - authorized.html'e dokunma
5. Değişiklikten sonra localhost'ta test et
6. Browser console temiz mi kontrol et
7. Lighthouse skorlarında regresyon var mı kontrol et
8. Commit:
git commit -am "fix: [sorun özetini 1 satırda]"
git push
```

---

## 📋 PROMPT 10 — Authorized panel backend entegrasyonu

Yetkili panel aktifleştirme:

```
authorized.html sayfası bir yetkili kullanıcı panelidir. Class surveyor, firma temsilcisi ve admin girişi yapıp gemi bazında test kayıtlarını görür.

MEVCUT DURUM
- Frontend: authorized.html + css/authorized.css + js/authorized.js (v1 tasarım, ÇALIŞIYOR)
- Backend: leventmarinetech-api repo'sunda server.js (JWT auth, PDF upload)
- Bu alana v2 bento tasarım uygulanmadı — fonksiyon kritik, risk almayalım

YAPACAKLARIN
1. Mevcut authorized.js + authorized.css dosyalarını oku, fonksiyonalite listesini çıkar
2. Backend server.js endpoint'lerini listele
3. MVP işlev seti:
   - Class/Company/Admin 3 tip giriş
   - Admin: gemi ekle/düzenle/sil, test kaydı ekle, PDF upload, user yönetim
   - Class: atandığı class'a ait gemilerin test kayıtlarını görme
   - Company: kendi firma filosunun test kayıtlarını görme
4. SEÇENEK A: Eski design'ı koru (risk yok), sadece minor tasarım iyileştirme
5. SEÇENEK B: Tam refactor — v2 design system'e taşı, gemi-bazlı dashboard
6. Benim tercihim B ise: feature branch aç (git checkout -b refactor/authorized-v2), paralel geliştir, main'e merge öncesi test

Benim tercihim: [A veya B yaz]
```

---

## ⚙️ PROMPT 11 — Deploy automation (GitHub Actions)

CI/CD kurma:

```
Her push'ta otomatik HTML/CSS/JS validation + Lighthouse test isterim.

YAPACAKLARIN
1. .github/workflows/ klasörü oluştur
2. .github/workflows/validate.yml — her PR'da:
   - HTMLHint (HTML syntax)
   - Stylelint (CSS)
   - ESLint (JS)
   - Link checker (broken link)
   - Image size check (>500KB warning)
3. .github/workflows/lighthouse.yml — main'e push'ta:
   - Lighthouse CI koş
   - Sonuçları PR comment olarak ekle
   - Skor <90 ise fail
4. .github/workflows/pages.yml — main'e push'ta:
   - GitHub Pages'e deploy (default yeterli ama manuel trigger + notifikasyon)
5. CONTRIBUTING.md yaz — geliştirme akışı
6. Status badge'leri README.md'ye ekle

Commit:
git commit -am "ci: add validation + Lighthouse + Pages deploy workflows"
git push
```

---

## 🎁 BONUS — Günlük kullanım "shorthand" prompts

Sık yaptığınız işler için tek satırlık shortcut'lar:

```
"Merhaba. README.md oku, sonra ne yapmam gerektiğini sor."

"Sitede [şu sayfada] [şu sorun] var. Fix et, test et, commit et, push et."

"Yeni bir [hizmet / proje vakası / blog post] ekle: [detaylar]"

"Bu hafta yapılacakları GELISIM-PLANI.md'den hatırlat."

"Lighthouse skor kontrol et, 90'ın altı varsa iyileştir."

"Son 5 commit'i özetle ve sıradaki adımı öner."

"Yeni bir logo fikri için 5 Midjourney prompt üret (IMAGES.md stilinde)."
```

---

## NOTLAR

- **VS Code Claude Code:** Projeyi açıkken `/init` komutu ile CLAUDE.md oluştur — Claude her oturumda otomatik okur
- **Prompt 0 bağlam:** CLAUDE.md'ye yukarıdaki bağlam bloğunu zaten ekledik
- **Dosya okuma izni:** Claude Code'a dosya okuma izni verin (varsayılan açık)
- **Git push'ları:** Kendiniz yapın ya da Claude'a "push yap" dediğinizde onaylayın
- **Hassas bilgi:** SENDGRID_API_KEY, SMTP şifresi asla repo'ya commit etmeyin — .env ve .gitignore kullanın
