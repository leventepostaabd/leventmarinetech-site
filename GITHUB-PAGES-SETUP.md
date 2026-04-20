# 🌐 GitHub Pages + Custom Domain Kurulum

**Durum:** CNAME ✅, GitHub repo ✅, DNS setup ❌ (henüz)

---

## 1️⃣ GitHub Repository Ayarları

1. **GitHub'a git:** https://github.com/leventepostaabd/leventmarinetech-site
2. **Settings → Pages (sol menu)**
3. **Build and deployment:**
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
   - **Kaydet**

4. **Custom domain:**
   - Alan adı gir: `www.leventmarinetech.com`
   - **Save**
   - ⚠️ GitHub otomatik DNS kontrol yapacak — başarısız gösterebilir (normal, DNS kayıtları hala güncellenmiyor)

5. **Enforce HTTPS**
   - Checkbox'ı işaretle (Let's Encrypt otomatik sertifika düzenleyecek)

---

## 2️⃣ DNS Kayıtları (Domain Sağlayıcıda Yapılacak)

**Hangi sağlayıcı kullanıyorsun?** Godaddy, Namecheap, Cloudflare, etc. Sağlayıcıdaki DNS ayarlarına git:

### Option A: CNAME (Basit, önerilen)
Eğer subdomain'de (`www.`) yayın yapacaksan:
```
Type:  CNAME
Name:  www
Value: leventepostaabd.github.io
TTL:   3600 (veya default)
```
✅ **Tarafımız için:** `www.leventmarinetech.com` çalışacak

### Option B: A Records (Root domain için)
Eğer `leventmarinetech.com` (www olmadan) da çalışsın istersen:
```
Type:  A
Name:  @
Value: 185.199.108.153

Type:  A
Name:  @
Value: 185.199.109.153

Type:  A
Name:  @
Value: 185.199.110.153

Type:  A
Name:  @
Value: 185.199.111.153
```
(Bunlar GitHub Pages IP'leri)

### Option C: Kurulum Taşı (CNAME + A)
```
www.leventmarinetech.com  → CNAME leventepostaabd.github.io
leventmarinetech.com      → A 185.199.108.153, 109, 110, 111
```

---

## 3️⃣ DNS Propagation Test

DNS değişiklikleri **15 dakika - 48 saat** arasında yayılır.

**Kontrol komutları (Terminal/PowerShell):**

```bash
# CNAME kontrolü
nslookup www.leventmarinetech.com
# Beklenen çıktı: www.leventmarinetech.com  CNAME  leventepostaabd.github.io

# A kaydı kontrolü (opsiyonel)
nslookup leventmarinetech.com
# Beklenen çıktı: leventmarinetech.com  A  185.199.108.153

# Hızlı HTTP test
curl -I https://www.leventmarinetech.com
# Beklenen: HTTP/1.1 200 OK
```

---

## 4️⃣ HTTPS Sertifikası

- GitHub Pages otomatik Let's Encrypt SSL sertifikası düzenleyecek
- **Enforce HTTPS** aktive ettiğinde, tüm trafiği HTTPS'ye yönlendirecek
- Bekleme süresi: **5-30 dakika**

---

## 5️⃣ Meta Tag Kontrolü

**index.html içinde doğru domain'i kontrol et:**

```html
<meta property="og:url" content="https://www.leventmarinetech.com" />
<link rel="canonical" href="https://www.leventmarinetech.com" />
```

✅ Doğru mu? Kontrol et, yanlışsa düzelt.

---

## 6️⃣ GitHub Pages Sitemap & Robots

Arama motorlarının indekslemesi için:

1. **robots.txt** (repo root'ta olmalı):
```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://www.leventmarinetech.com/sitemap.xml
```

2. **sitemap.xml** (repo root'ta):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.leventmarinetech.com/</loc>
    <lastmod>2026-04-20</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.leventmarinetech.com/profile.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.leventmarinetech.com/blog/</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## ✅ Kontrol Listesi

- [ ] GitHub Settings → Pages yapılandırılmış (`main` branch, custom domain)
- [ ] HTTPS enforced
- [ ] DNS kayıtları eklenmiş (CNAME veya A records)
- [ ] DNS propagation test yapıldı (nslookup başarılı)
- [ ] `curl -I https://www.leventmarinetech.com` → 200 OK
- [ ] index.html meta tag'leri doğru domain'i gösteriyor
- [ ] robots.txt + sitemap.xml mevcut

---

## 🚀 Canlıya Alma

DNS aktif olduğunda:

```bash
git add .
git commit -m "docs(deploy): GitHub Pages + custom domain DNS setup"
git push origin main
```

**1-2 dakika sonra:** https://www.leventmarinetech.com canlı! 🎉

---

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| **"Custom domain unreachable"** | DNS propagation bekle (48 saat) |
| **HTTP 404** | CNAME doğru mu kontrol et, branch `main` mı? |
| **Mixed content (HTTPS + HTTP)** | CSS/JS/img URL'lerinde `http://` yoksa kontrol et |
| **SSL sertifikası 30 dk. sonra değil** | GitHub Support'a ticket aç |
