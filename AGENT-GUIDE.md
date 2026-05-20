# Agent & Session Devir Rehberi

> Bu projeyi farklı session'larda / farklı agent'larda devam ettirirken
> bağlam kaybolmaması için **bu rehber tek doğru başlangıç noktasıdır**.

---

## 1. Yeni Session / Yeni Agent İlk Adımları

Sırayla şunları oku:

1. **`CLAUDE.md`** — proje özeti, stack, kurallar
2. **`ROADMAP.md`** — ne yapıyoruz, hangi sıraya
3. **`DECISIONS.md`** — neden böyle yapıyoruz (her karar + sebep)
4. **`STATUS.md`** — şu an ne durumdayız, neye odaklan

Bu 4 dosya **tek kaynak doğruluk**. Diğer dokümanlar (BACKEND-SETUP, SEO-STRATEGY, vb.) detay için.

---

## 2. Güncelleme Kuralları (KRİTİK)

### Karar değişikliği

Yön değişti, fikir değişti, müşteri başka şey istedi → **kodu yazmadan önce** `DECISIONS.md`'ye işle:

```markdown
| S5 | ~~eski karar~~ → **yeni karar** | Sebep + tarih |
```

Eski karar silinmez, üstü çizilir. Sebep kaydı kalır.

### Wave/görev tamamlandı

`STATUS.md`'de ilgili kutucuğu işaretle (`[x]`). Bir not bırak (varsa): commit hash, branch adı, dikkat edilecek bir konu.

### Yeni karar eklendi

`DECISIONS.md`'ye yeni oturum başlığı altında ekle. ROADMAP.md güncel mi kontrol et, gerekirse oraya da yansıt.

### Mimari değişiklik

(örn: Supabase yerine başka bir backend, Next.js yerine başka framework, vb.)
→ `CLAUDE.md`'de Stack bölümünü güncelle, `DECISIONS.md`'ye sebebi yaz.

---

## 3. Agent İş Bölümü (Paralel Çalışma)

İşler 5 agent'a bölünür. **Her agent kendi worktree'sinde çalışır**,
diğer agent'ın dosyasına dokunmaz. Sorumluluk haritası:

### Agent A — Positioning & i18n
**Dosyalar:**
- `content/i18n-en.json`, `content/i18n-tr.json`
- `lib/site.ts` (SITE constant — adres, telefon, sosyal)
- `components/Header.tsx`, `components/Footer.tsx`
- `components/LocaleToggle.tsx` + lokasyon bazlı otomatik dil
- `app/contact/page.tsx`
- `middleware.ts` (lokasyon tespiti)

**Yasak:** `app/page.tsx`, `app/services/*`, `app/supply/*`

### Agent B — Service Flow
**Dosyalar:**
- `content/services.json` (19 sistem)
- `app/service-wizard/*`
- `app/services/*` (her sistem için SEO sayfası)
- `app/api/service-request/route.ts`
- `lib/notify.ts` (Email + WhatsApp)
- `components/ServiceTile.tsx`

**Yasak:** `app/page.tsx`, `content/i18n-*.json`, `app/supply/*`

### Agent C — Supply Flow
**Dosyalar:**
- `app/supply/*`
- `app/supply-wizard/*`
- `content/products.json` (kategoriler)
- `app/api/quote-request/route.ts`
- `lib/` (Amazon/eBay entegrasyon stub'ları)
- `components/PhotoUpload.tsx`

**Yasak:** `app/page.tsx`, `app/services/*`, `content/services.json`

### Agent D — Trust, SEO, Knowledge Base
**Dosyalar:**
- `components/USAMap.tsx` (yeni)
- `components/LogoStrip.tsx` (yeni)
- `components/CertBadges.tsx` (yeni)
- `app/about/*`
- `app/knowledge/*` (yeni — blog scaffold)
- `lib/schema-org.ts`
- `app/sitemap.ts`, `app/robots.ts`

**Yasak:** `app/page.tsx`, `app/services/*`, `app/supply/*`, `content/services.json`, `content/products.json`

### Agent E — Hero & Emergency
**Dosyalar:**
- `app/page.tsx` (yeniden yazılır)
- `components/Hero.tsx` (yeni)
- `components/EmergencyModal.tsx` (yeni)
- `components/MobileLanding.tsx` (yeni)

**Yasak:** Yukarıdaki diğer agent'ların dosyaları

**Bağımlılık notu:** Agent E hero içine `<USAMap />`, `<LogoStrip />` koyar. Bu bileşenler Agent D tarafından oluşturulur. Merge sırasına dikkat: önce A → D → B → C → E.

---

## 4. Merge Sırası

Branch'ler birleştirilirken çakışma riskini azaltmak için **bu sıra**:

1. **Agent A** (positioning) — i18n + SITE config, taban değişiklikleri
2. **Agent D** (trust/SEO) — yeni component'ler (USAMap, LogoStrip) ve about/knowledge
3. **Agent B** (service) — services.json + wizard + API
4. **Agent C** (supply) — products.json + supply + API
5. **Agent E** (hero) — `app/page.tsx`, en son çünkü diğer component'leri kullanır

Her merge sonrası `npm run build` yapılır, broken build varsa düzeltilir.

---

## 5. Branch Naming

Ana çalışma branch'i: `claude/roadmap-implementation-k5IPG`

Agent worktree branch'leri (otomatik atanır, format):
- `claude/wave-A-positioning-*`
- `claude/wave-B-service-*`
- `claude/wave-C-supply-*`
- `claude/wave-D-trust-seo-*`
- `claude/wave-E-hero-*`

Her agent kendi branch'inde **commit + push** yapar. Merge işlemini ana
session koordine eder.

---

## 6. İletişim & Bağlam Korunması

### Yön değişikliği

Kullanıcı "şunu artık başka türlü yapalım" derse:

1. **HEMEN** `DECISIONS.md`'ye işle (kodu yazmadan)
2. Etkilenen `STATUS.md` kutucuklarını güncelle
3. Etkilenen `ROADMAP.md` bölümlerini güncelle
4. Sonra koda dokun

### Yeni bir karar talep edildiğinde

Sorma sırası:

1. `DECISIONS.md`'de zaten cevabı var mı? → varsa o
2. Yoksa → kullanıcıya **2-4 net seçenekli kısa soru** sor
3. Cevap geldiğinde → `DECISIONS.md`'ye işle

### Agent görevini bitirdiğinde

Son commit'inden önce:

1. `STATUS.md`'de kendi kutucuklarını işaretle
2. Branch adı + commit hash'ini STATUS.md'deki tabloya yaz
3. Karşılaştığı engelleri "Aktif Engeller" bölümüne yaz
4. Sonra push

---

## 7. Asla Yapma

- Test edilmemiş radikal mimari değişiklik
- `DECISIONS.md`'yi atlayarak yön değişikliği
- `STATUS.md`'yi güncellemeden commit
- Başka agent'ın dosyasına dokunmak
- TR adres / telefon eklemek (P3 kararı)
- Müşteri-yüzünde fiyat göstermek (T3, F3 kararı)
- Müşteri login zorunluluğu (Y5 kararı)
- Müşteri scroll'a zorlamak (F1 kararı — masaüstü)
