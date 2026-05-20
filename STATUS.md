# Levent Marine — İlerleme Durumu

> **Güncelleme kuralı:** Her wave / her agent görevini tamamladığında
> buradaki ilgili kutucuğu işaretler, varsa not bırakır.
> "Bugün ne durumdayız" sorusunun cevabı **bu dosyadadır**.

**Son güncelleme:** 2026-05-20 (Agent E — Wave 0 hero/emergency tamamlandı)

---

## Wave 0 — İskelet (Hafta 1)

**Sorumlu Agent:** A (Positioning) + E (Hero/Emergency)
**Hedef tamamlanma:** 2026-05-27

- [ ] TR adres/telefon temizliği (tüm sayfalar) — *Agent A*
- [ ] Florida-based + Wyoming LLC pozisyonlama metinleri — *Agent A*
- [ ] Slogan güncellemesi (i18n EN/TR) — *Agent A*
- [ ] Otomatik dil tespiti (lokasyon bazlı) — *Agent A*
- [x] 3-buton hero (Servis / Tedarik / Acil) — *Agent E* — `worktree-agent-accab780b571dab7d`
- [x] Bölünmüş ekran layout (statik fotoğraf başlangıç) — *Agent E* — SVG placeholders in `public/hero/`
- [x] Acil 3-buton modal (Ara / WhatsApp / 10sn Form) — *Agent E* — focus trap + Esc, posts `source: 'emergency'`
- [x] Mobil sade görünüm (3 buton + nabız) — *Agent E* — `MobileLanding.tsx`, no video on `<md`

## Wave 1 — Servis Akışı (Hafta 2)

**Sorumlu Agent:** B
**Hedef tamamlanma:** 2026-06-03

- [ ] 19 sistemli grid + arama + 6 popüler ikon — *Agent B*
- [ ] 3 adımlı talep akışı (Sistem → Liman → Zaman → İletişim) — *Agent B*
- [ ] "1 saat içinde dönüş" söz ekranı — *Agent B*
- [ ] Email + WhatsApp bildirim entegrasyonu — *Agent B*
- [ ] Admin paneline taleplerin düşmesi — *Agent B*
- [ ] 19 sistem için SEO landing sayfaları — *Agent B*

## Wave 2 — Tedarik Akışı (Hafta 3-4)

**Sorumlu Agent:** C
**Hedef tamamlanma:** 2026-06-17

- [ ] Arama kutusu (Amazon/eBay live) — *Agent C*
- [ ] Kategori navigasyonu (Marine Elec / General Elec / General Marine) — *Agent C*
- [ ] Foto yükleme UI + admin dashboard'a düşme — *Agent C*
- [ ] Fiyat gizleme + "Get quote" butonları — *Agent C*
- [ ] Amazon / eBay business API entegrasyonu (stub başlangıç) — *Agent C*
- [ ] (İleride) OCR nameplate okuma — *deferred*

## Wave 3 — Güven & SEO (Hafta 4)

**Sorumlu Agent:** D
**Hedef tamamlanma:** 2026-06-17

- [ ] USA haritası + 20-30 port pulsing — *Agent D*
- [ ] Müşteri logo şeridi (gri tonlama) — *Agent D*
- [ ] Sertifika rozetleri bileşeni — *Agent D*
- [ ] About modal + `/about` tam sayfa — *Agent D*
- [ ] 3 başlangıç blog yazısı + `/knowledge` altyapısı — *Agent D*
- [ ] schema.org + OG + sitemap + robots güncellemeleri — *Agent D*

## Wave 4 — Cila & Devam (Hafta 5+)

**Sorumlu Agent:** _atanmamış_

- [ ] Video'ların hero'ya entegrasyonu (statik → canlı geçiş)
- [ ] Animasyonlar (anime.js / GSAP)
- [ ] 3 yeni blog yazısı (toplam 6-8)
- [ ] Lighthouse 95+ skor optimizasyon
- [ ] Core Web Vitals
- [ ] Custom domain + SSL bağlama

---

## Aktif Engeller

- **Agent E → Agent B koordinasyon notu:** Emergency modal `POST /api/service-request` çağrısı `source: 'emergency'`, `vessel`, `imo`, `port`, `system`, `contact_required: true` gönderir; aynı zamanda bugünkü zod şemasının kabul ettiği `vesselName`, `problemCategory`, `urgency: 'aog'`, `contactName`, `contactEmail` alanlarını da gönderir (geçici köprü). Agent B route handler'ı `source === 'emergency'` dalını eklerken bu yedek alanları kaldırabilir.
- **Hero placeholder görselleri:** `public/hero/engine-room-placeholder.svg` ve `public/hero/warehouse-placeholder.svg` — gerçek foto/video gelince `Hero.tsx` içindeki `image` propları güncellenir, opsiyonel `videoSrc` zaten desteklenir.

## Tamamlanmış Wave'ler

_henüz yok_

## Worktree / Branch Haritası

| Agent | Branch | Worktree | Durum |
|---|---|---|---|
| A — Positioning | _will be assigned_ | _will be assigned_ | bekliyor |
| B — Service | _will be assigned_ | _will be assigned_ | bekliyor |
| C — Supply | _will be assigned_ | _will be assigned_ | bekliyor |
| D — Trust/SEO | _will be assigned_ | _will be assigned_ | bekliyor |
| E — Hero/Emergency | `worktree-agent-accab780b571dab7d` | `.claude/worktrees/agent-accab780b571dab7d` | Wave 0 hero/emergency tamam — build green, push edildi |
