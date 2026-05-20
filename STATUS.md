# Levent Marine — İlerleme Durumu

> **Güncelleme kuralı:** Her wave / her agent görevini tamamladığında
> buradaki ilgili kutucuğu işaretler, varsa not bırakır.
> "Bugün ne durumdayız" sorusunun cevabı **bu dosyadadır**.

**Son güncelleme:** 2026-05-20

---

## Wave 0 — İskelet (Hafta 1)

**Sorumlu Agent:** A (Positioning) + E (Hero/Emergency)
**Hedef tamamlanma:** 2026-05-27

- [ ] TR adres/telefon temizliği (tüm sayfalar) — *Agent A*
- [ ] Florida-based + Wyoming LLC pozisyonlama metinleri — *Agent A*
- [ ] Slogan güncellemesi (i18n EN/TR) — *Agent A*
- [ ] Otomatik dil tespiti (lokasyon bazlı) — *Agent A*
- [ ] 3-buton hero (Servis / Tedarik / Acil) — *Agent E*
- [ ] Bölünmüş ekran layout (statik fotoğraf başlangıç) — *Agent E*
- [ ] Acil 3-buton modal (Ara / WhatsApp / 10sn Form) — *Agent E*
- [ ] Mobil sade görünüm (3 buton + nabız) — *Agent E*

## Wave 1 — Servis Akışı (Hafta 2)

**Sorumlu Agent:** B
**Hedef tamamlanma:** 2026-06-03

- [x] 19 sistemli grid + arama + 6 popüler ikon — *Agent B* (worktree-agent-a0e1b1b42692af25d)
- [x] 3 adımlı talep akışı (Sistem → Liman → Zaman → İletişim) — *Agent B*
- [x] "1 saat içinde dönüş" söz ekranı — *Agent B* (literal S5 text)
- [x] Email + WhatsApp bildirim entegrasyonu — *Agent B* (Resend + WhatsApp Business API stub w/ click-to-chat fallback)
- [x] Admin paneline taleplerin düşmesi — *Agent B* (system_slug + when_window in service_requests.meta)
- [x] 19 sistem için SEO landing sayfaları — *Agent B* (20 prerendered routes incl. "other")

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

**Agent B notları (2026-05-20):**
- `lib/site.ts` hala eski 11-slug `SERVICE_SLUGS` listesini içeriyor. `app/sitemap.ts` (Agent D) bu listeyi okuyor; sitemap doğru 20-slug listesini görsün diye Agent A/D pas atması: ya `SERVICE_SLUGS`'ı kaldırıp `readServices()`'a geçmek, ya da yeni servis slug'larıyla güncellemek lazım. Bu wave1 işini bloklamadı (build geçti, prerender 20 slug için doğru — `generateStaticParams` artık `readServices()`'tan geliyor).
- WhatsApp Business API gerçek credentials yok; `lib/notify.ts` içindeki `notifyByWhatsApp` ortamda token yokken click-to-chat URL'i loglar (N1 söz verildi, kanal hazır — sadece env var beklemede).
- Search index (`app/api/search-index/route.ts`) eski `ServiceContent` şeklini bekleyebilir; bir bakış lazım — Agent D'nin SEO çalışması sırasında uyumlu hale gelir.

## Tamamlanmış Wave'ler

_henüz yok_

## Worktree / Branch Haritası

| Agent | Branch | Worktree | Durum |
|---|---|---|---|
| A — Positioning | _will be assigned_ | _will be assigned_ | bekliyor |
| B — Service | worktree-agent-a0e1b1b42692af25d | .claude/worktrees/agent-a0e1b1b42692af25d | Wave 1 tamam (build geçti, push edilecek) |
| C — Supply | _will be assigned_ | _will be assigned_ | bekliyor |
| D — Trust/SEO | _will be assigned_ | _will be assigned_ | bekliyor |
| E — Hero/Emergency | _will be assigned_ | _will be assigned_ | bekliyor |
