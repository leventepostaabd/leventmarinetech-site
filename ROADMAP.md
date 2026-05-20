# Levent Marine — Yol Haritası (v1)

> Bu dosya, kullanıcı ile yapılan 25 soruluk karar oturumundan çıkan
> yol haritasıdır. Site mimarisi, pazarlama pozisyonu ve inşa sırası
> bu dosya üzerinden takip edilir.

---

## 1. Vizyon

Kurumsal · modern · yenilikçi bir marine elektrik servis & tedarik
platformu. Müşteri siteye girdiği saniyede üç kapıdan birini seçer
(Servis / Tedarik / Acil), kaybolmaz, gereksiz konuşmaz, doğru
hedefe ulaşır. Site genelinde **aşağı kaydırma yoktur** — yatay
akış, modal'lar ve animasyonlarla iş tamamlanır.

---

## 2. Pazarlama Pozisyonu

| Konu | Karar |
|---|---|
| Merkez algısı | **Florida-based** (şehir belirtilmez), tüm ABD'ye servis |
| Hukuki HQ | Wyoming LLC (alt bilgide görünür) |
| TR varlığı | Sitede TR adres/telefon **YOK** — sadece "Worldwide" mesajı |
| Servis kapsamı | "Service available at all US ports — 24/7 worldwide" |
| Slogan | **"Marine Electrical Service & Parts Supply — 24/7 Worldwide"** |
| Müşteri referansları | TP / Polaris / MEDLOG / NORD vb. logoları küçük gri şerit |
| Dil | TR + EN — kullanıcı lokasyonuna göre otomatik açılır, tek tıkla değişir |

---

## 3. Ana Ekran (Hero)

Üst orta — slogan. Altında **bölünmüş ekran + iki taraf da video**:

- **Sol yarı:** Gemi makine dairesi videosu (yavaş döngü, sessiz) → Servis
- **Sağ yarı:** Depo / kargo / scanner videosu (yavaş döngü) → Tedarik
- **Ortada:** **Acil** butonu — kırmızı nabız atıyor

**Mobilde:** Video gizlenir, sadece 3 buton tam ekran + nabız atan Acil.

---

## 4. Üç Ana Akış

### 4.1 Acil

3 buton yan yana açılır:
1. **Hemen Ara** → direkt telefonu açar (lokasyona göre US no)
2. **WhatsApp** → US WhatsApp hattı (lokasyona göre)
3. **10 sn Form** → Gemi / IMO / Liman / Sistem → submit

Talep gönderilince: **Email + WhatsApp** sahibe anında düşer.

### 4.2 Servis

Müşteri "Servis" → ekranda:

- **Arama kutusu:** "Hangi sistemde sorun var?" (otomatik tamamlama)
- **6 popüler sistem ikonu:** Generator · BWTS · Fire Alarm · Bridge Nav · PLC · Crane
- **"Tümünü Gör" butonu** → 19 sistemli grid açılır

**19 Sistem Listesi:**

1. Generator (diesel, shaft, emergency, AVR)
2. Main Engine — Electric/Control Side
3. Switchboard (MSB / ESB / power management)
4. Fire Alarm & Detection
5. Engine Room Alarm / Monitoring
6. Bridge Navigation (radar, ECDIS, gyro, autopilot)
7. Communication / GMDSS
8. BWTS
9. Crane & Deck Machinery
10. Bilge / Level Sensor / Alarm
11. Shaft Earthing Device
12. PLC & Automation / IAS
13. Lighting & Nav Lights
14. Battery / UPS
15. Shore Connection
16. Transformer
17. AC/DC Motor (bow thruster, fan, pump motor)
18. HVAC Automation
19. CCTV / VDR
20. **Diğer / Başka bir sistem** (serbest yazı)

**Sistem seçildikten sonra 3 hızlı tıklama:**

1. **Hangi liman?**
2. **Ne zaman?** (şimdi / 24 saat / 1 hafta / planlı)
3. **İletişim** (isim · e-posta · telefon · gemi adı/IMO opsiyonel)

→ Submit. Müşteriye gösterilen söz:
> "İlk müsait teknisyenimiz **1 saat içinde** sizinle iletişime geçecek."

Sahibe **Email + WhatsApp** anında düşer.

### 4.3 Tedarik (Supply)

3 yol bir arada:

1. **Arama kutusu** → Amazon / eBay business hesabından canlı arama
2. **Kategori navigasyonu:**
   - Marine Electric → General Electric → General Marine (3 ana grup)
3. **"Fotoğrafını yükle, biz bulalım"** → müşteri etiket / nameplate
   fotosu yükler, sen Amazon / eBay'den eşleştirip teklif verirsin

**Kural:** Müşteriye fiyat gösterilmez. Her ürün altında sadece
**"In stock"** veya **"Get quote"** butonu. Sen teklif çıkarırsın.

---

## 5. Güven & Sosyal Kanıt (Ana Ekran Altı)

- **Müşteri logo şeridi** (gri tonlama): MSC · TP · Polaris · NORD · Bright · Çebi · MEDLOG
- **USA haritası** — 20-30 büyük port pulsing nokta (kırmızı/amber)
- **Sertifika rozetleri:** ETO · HV Operations · AFF · Medical First Aid · BST · Gas/Oil Tanker
- **Class onayları:** DNV · BV · ABS · Lloyd's · TL · RINA · ClassNK · IRS

---

## 6. Hakkımızda (About)

İki katmanlı:

- **Modal (hızlı):** Ana ekrandan açılır — 4-5 satır profil, sertifikalar, Florida/Wyoming, sahip fotoğrafı
- **`/about` tam sayfa:** SEO için — 16 yıl tecrübe, ekipman görselleri, yapılan iş örnekleri, sertifika detayları

---

## 7. Site Yapısı (Hem Tek Sayfa Hem SEO)

Ana akış **tek sayfa + modal'lar**. Arka tarafta Google için 5-6 SEO sayfası yaşar:

- `/` — Hero + 3 buton + harita + logo şeridi
- `/services/[slug]` — Her sistem için SEO sayfası (19 sayfa)
- `/supply/category/[slug]` — Her kategori için SEO sayfası
- `/about` — Tam profil sayfası
- `/contact` — Sadece US bilgileri
- `/knowledge/[slug]` — Blog / SEO içerik (aşağıda)

Müşteri SPA akışını kullanır, görmez. Google crawl eder, indeksler.

---

## 8. SEO İçerik Stratejisi (Max Verim, UI Bozmaz)

- **Blog `/knowledge` altında** — ana navigasyondan görünmez, sadece footer'da link
- **Başlangıç:** 6-8 yazı (BWTS, AVR, Class survey, AOG checklist, Furuno radar, ECDIS, vb.)
- **Ayda 1 yeni yazı** — uzun vadeli organik trafik
- **Teknik SEO maks:**
  - schema.org structured data (LocalBusiness + Service + Product)
  - Open Graph + Twitter cards
  - sitemap.xml + robots.txt
  - Canonical URLs
  - Core Web Vitals 95+ skor (Lighthouse)
  - Internal linking strategy
  - Alt-text + lazy loading

---

## 9. Admin Tarafı

- **Sadece sen login olursun.** Müşteri login YOK
- `/admin` — gelen Servis + Tedarik + Acil + Equivalent + Photo-upload talepleri tek dashboard
- Her talep yanında: status (yeni / işlemde / kapandı), notlar, müşteri iletişim
- Mobil uyumlu — telefondan da yönetebilirsin

---

## 10. Bildirim Kanalları (Müşteri Talebi → Sen)

| Kanal | Tip | Tetik |
|---|---|---|
| Email | Always | Her talep |
| WhatsApp | Always | Her talep |
| (Opsiyonel ileride) | SMS / robot arama | Sadece Acil için |

---

## 11. İnşa Fazları (Wave-based, Paralel)

> Hepsi paralel ilerler ama **her hafta görünür ilerleme** olur.
> Önce iskelet kurulur, sonra her parça detaylandırılır.

### Wave 0 — İskelet (Hafta 1)
- [ ] 3 buton hero (Servis / Tedarik / Acil) — placeholder
- [ ] Bölünmüş ekran layout (statik fotoğraf ile başla, video sonra)
- [ ] Otomatik dil tespiti
- [ ] Acil 3-buton modal'ı
- [ ] Mobil sade görünüm
- [ ] TR adres/telefon temizliği — tüm sayfalardan
- [ ] Florida/Wyoming pozisyonlama metinleri

### Wave 1 — Servis Akışı (Hafta 2)
- [ ] Arama + 6 popüler ikon + 19 sistem grid
- [ ] 3 adımlı talep akışı (Sistem → Liman → Zaman → İletişim)
- [ ] "1 saat içinde dönüş" söz ekranı
- [ ] Email + WhatsApp bildirim entegrasyonu (Resend + WhatsApp Business API)
- [ ] Admin paneline taleplerin düşmesi
- [ ] 19 sistem için SEO landing sayfaları

### Wave 2 — Tedarik Akışı (Hafta 3-4)
- [ ] Arama kutusu
- [ ] Kategori navigasyonu (3 ana grup)
- [ ] Amazon / eBay business hesabı entegrasyonu (API veya scraping)
- [ ] Fiyat gizleme + "Get quote" butonları
- [ ] Foto yükleme + sahip dashboard'a düşme
- [ ] (İleride) OCR ile nameplate okuma

### Wave 3 — Güven & SEO (Hafta 4)
- [ ] USA haritası + 20-30 port pulsing
- [ ] Müşteri logo şeridi
- [ ] Sertifika rozetleri
- [ ] About modal + `/about` tam sayfa
- [ ] 3 başlangıç blog yazısı + `/knowledge` altyapısı
- [ ] schema.org + OG + sitemap + robots

### Wave 4 — Cila & Devam (Hafta 5+)
- [ ] Video'ların hero'ya entegrasyonu (statik → canlı geçiş)
- [ ] Animasyonlar (anime.js / GSAP)
- [ ] 3 yeni blog yazısı (toplam 6-8)
- [ ] Lighthouse 95+ skor optimizasyon
- [ ] Performance + Core Web Vitals
- [ ] Domain SSL + custom domain bağlama

---

## 12. Kararlaştırılmış Tasarım Kuralları

1. **Scroll yok** (masaüstünde) — yatay akış + modal'lar
2. **Tek tıkla hedef** — müşteri max 3 tıklamada talebini gönderir
3. **Fiyat gösterme** — sadece "Get quote"
4. **Aciliyet her zaman 1 tık uzaklıkta** — Acil butonu her sayfada görünür
5. **Dil bariyeri yok** — TR/EN otomatik
6. **Mobil = sade** — telefonda 3 buton, video yok
7. **SEO arka tarafta** — kullanıcı görmez, Google görür

---

## 13. Sıradaki Adım

**Wave 0** başlıyor. Önce şunlar:

1. Mevcut Next.js yapısı içinde TR adres/telefon temizliği
2. Florida-based + Wyoming LLC pozisyonlama metinleri (`content/` JSON'ları)
3. Yeni hero — 3 buton + statik split layout
4. Acil 3-buton modal iskeleti
5. Mobil sade görünüm

Bu 5 madde Hafta 1'de bitirilir. Sonra Wave 1 (Servis akışı) başlar.
