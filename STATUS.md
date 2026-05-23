# Levent Marine — İlerleme Durumu

> **Güncelleme kuralı:** Her wave / her agent görevini tamamladığında
> buradaki ilgili kutucuğu işaretler, varsa not bırakır.
> "Bugün ne durumdayız" sorusunun cevabı **bu dosyadadır**.

**Son güncelleme:** 2026-05-23

---

## Wave 0 — İskelet (Hafta 1)

**Sorumlu Agent:** A (Positioning) + E (Hero/Emergency)
**Hedef tamamlanma:** 2026-05-27

- [x] TR adres/telefon temizliği (tüm sayfalar) — *Agent A*
- [x] Florida-based + Wyoming LLC pozisyonlama metinleri — *Agent A*
- [x] Slogan güncellemesi (i18n EN/TR) — *Agent A*
- [x] Otomatik dil tespiti (lokasyon bazlı) — *Agent A*
- [x] 3-buton hero (Servis / Tedarik / Acil) — *Agent E* — `components/Hero.tsx`, `app/page.tsx`
- [x] Bölünmüş ekran layout (statik fotoğraf başlangıç) — *Agent E* — `components/HeroDoor.tsx` + SVG placeholders
- [x] Acil 3-buton modal (Ara / WhatsApp / 10sn Form) — *Agent E* — `components/EmergencyModal.tsx`
- [x] Mobil sade görünüm (3 buton + nabız) — *Agent E* — `components/MobileLanding.tsx`

## Wave 1 — Servis Akışı (Hafta 2)

**Sorumlu Agent:** B
**Hedef tamamlanma:** 2026-06-03

- [x] 19 sistemli grid + arama + 6 popüler ikon — *Agent B* — `app/services/page.tsx` + `ServicesBrowser.tsx`
- [x] 3 adımlı talep akışı (Sistem → Liman → Zaman → İletişim) — *Agent B* — `app/service-wizard/ServiceWizardClient.tsx`
- [x] "1 saat içinde dönüş" söz ekranı — *Agent B* — wizard success screen (literal S5 text)
- [x] Email + WhatsApp bildirim entegrasyonu — *Agent B* — `lib/notify.ts` (WhatsApp click-to-chat fallback until API creds)
- [x] Admin paneline taleplerin düşmesi — *Agent B* — `app/api/service-request/route.ts` (system_slug + when_window in meta)
- [x] 19 sistem için SEO landing sayfaları — *Agent B* — `app/services/[slug]/page.tsx` (20 prerendered routes incl. Other)

## Wave 2 — Tedarik Akışı (Hafta 3-4)

**Sorumlu Agent:** C
**Hedef tamamlanma:** 2026-06-17

- [x] Arama kutusu (Amazon/eBay live) — *Agent C* (live-completion against local index; `/api/supply-search` proxies `lib/ebay-amazon.ts`; live API wiring deferred to Wave 4)
- [x] Kategori navigasyonu (Marine Elec / General Elec / General Marine) — *Agent C* (3 top-level + 21 subcategories in `content/products.json`)
- [x] Foto yükleme UI + admin dashboard'a düşme — *Agent C* (`components/PhotoUpload.tsx` → Supabase `attachments` bucket; wired in unlisted-request, equivalent-finder, and supply-wizard step 3)
- [x] Fiyat gizleme + "Get quote" butonları — *Agent C* (every product card + detail page shows only "In Stock" or "Get Quote"; sanitizeExternalUrl strips price params)
- [x] Amazon / eBay business API entegrasyonu (stub başlangıç) — *Agent C* — `lib/ebay-amazon.ts` (local-fallback; TODO Wave 4)
- [x] 6-step supply-wizard (category → brand → part+photo → vessel → urgency → contact) — *Agent C*
- [x] Equivalent-part-finder + unlisted-request now accept up to 5 photos — *Agent C*
- [ ] (İleride) OCR nameplate okuma — *deferred to Wave 4*

## Wave 3 — Güven & SEO (Hafta 4)

**Sorumlu Agent:** D
**Hedef tamamlanma:** 2026-06-17

- [x] USA haritası + 25 port pulsing — *Agent D* — `components/USAMap.tsx`
- [x] Müşteri logo şeridi (gri tonlama) — *Agent D* — `components/LogoStrip.tsx`
- [x] Sertifika rozetleri bileşeni — *Agent D* — `components/CertBadges.tsx`
- [x] About modal + `/about` tam sayfa — *Agent D* — `components/AboutModal.tsx`, `app/about/page.tsx`
- [x] 3 başlangıç blog yazısı + `/knowledge` altyapısı — *Agent D* — `app/knowledge/*`, `content/knowledge/posts.json`
- [x] schema.org + OG + sitemap + robots güncellemeleri — *Agent D* — `lib/schema-org.ts`, `app/sitemap.ts`, `app/robots.ts`

## Wave 4 — Cila & Devam (Hafta 5+)

**Sorumlu Agent:** _atanmamış_

- [ ] Video'ların hero'ya entegrasyonu (statik → canlı geçiş)
- [ ] Animasyonlar (anime.js / GSAP)
- [ ] 3 yeni blog yazısı (toplam 6-8)
- [ ] Lighthouse 95+ skor optimizasyon
- [ ] Core Web Vitals
- [ ] Custom domain + SSL bağlama
- [ ] Hero için gerçek görseller (`MEDIA-ASSETS.md` Section 2 reuse + Section 3 yeni üretim)
- [ ] OCR nameplate okuma (Agent C deferred item)
- [ ] WhatsApp Business API credentials provision
- [ ] LogoStrip için gerçek logo SVG'leri (`public/logos/`)

---

## Bekleyen Mimari Tartışmalar

**eBay → multi-source procurement engine (Phase 2 öncesi gündem):**
Bir uzman dostumuzun mevcut yapı için verdiği değerlendirme — mevcut
temel doğru (backend proxy + OAuth token cache + secure env vars +
multi-source-ready stub var) ama Phase 2'ye geçmeden önce şunlar
oturup konuşulacak:
- Redis / Supabase KV ile sıcak cache (popüler arama terimleri için)
- SKU normalization layer (örn. "ABB A16-30-10 220VAC" varyantlarını
  birleştiren AI parsing katmanı) — marine sourcing'de en büyük edge
- Amazon Business + Alibaba + direct vendor connector'larının aynı
  arama yüzeyi altında birleşmesi
- RFQ otomasyon dashboard'u (admin tarafı genişletme)
- Predictive spare sourcing (Phase 3)
Kullanıcı "yeri gelince hatırlat" dedi; supply MVP'si stabil + canlı
trafik akmaya başladığında bunu gündeme getir.

## Aktif Engeller

**Integration notes:**
- ✅ ~~`lib/site.ts` eski `SERVICE_SLUGS`~~ — kaldırıldı, `readServices()`'a geçildi (önceki commit).
- ✅ ~~`content/search-index.json` eski 11-slug shape~~ — 2026-05-23 commit `937dc3e` ile services.json'dan regenerate edildi (22 service entry).
- ✅ ~~Knowledge yazılarındaki kırık `/services/{slug}` linkleri~~ — 2026-05-23 commit `937dc3e` ile 8 service slug + 4 supply slug doğru ID'lere map'lendi.
- ⏳ **Digi-Key API** — 2026-05-23 itibarıyla configured + ok (Mouser + Digi-Key + eBay üçü canlı). Grainger henüz B2B account approval bekliyor; marine motor/breaker traffic'i artana kadar lazım değil.
- ⏳ **WhatsApp Business API** gerçek credentials yok; `lib/notify.ts` içindeki `notifyByWhatsApp` token yokken click-to-chat URL'i loglar (N1 söz verildi, kanal hazır — sadece env var beklemede).
- ⏳ **Hero entegrasyon** — `<USAMap />`, `<LogoStrip />`, `<CertBadges compact />`, `<AboutModal />` componentleri ana sayfada doğru import edilmiş mi son bir kontrol gerek (Wave 4 cila kapsamında).

## Tamamlanmış Wave'ler

- ✅ Wave 0 (Agent A + E)
- ✅ Wave 1 (Agent B)
- ✅ Wave 2 (Agent C) — OCR Wave 4'e ertelendi
- ✅ Wave 3 (Agent D)

## Worktree / Branch Haritası

| Agent | Branch | Worktree | Durum |
|---|---|---|---|
| A — Positioning | `agent-a/positioning-i18n` | `.claude/worktrees/agent-a3133eede915ccb44` | ✅ Merged (df33005) |
| B — Service | `worktree-agent-a0e1b1b42692af25d` | `.claude/worktrees/agent-a0e1b1b42692af25d` | ✅ Merged (67c2f5b) |
| C — Supply | `claude/wave-C-supply-a5da769e675a3232f` | `.claude/worktrees/agent-a5da769e675a3232f` | ✅ Merged (fe3b339) |
| D — Trust/SEO | `claude/wave-D-trust-seo-ac766d28` | `.claude/worktrees/agent-ac766d28096d29ed7` | ✅ Merged (e250bd3) |
| E — Hero/Emergency | `worktree-agent-accab780b571dab7d` | `.claude/worktrees/agent-accab780b571dab7d` | ✅ Merged (09a73e3) |
