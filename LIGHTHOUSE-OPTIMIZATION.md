# Lighthouse 95+ Optimization Guide

## Current Status: Pre-optimization

Your site is built with:
- Static HTML/CSS/JS (no build step currently)
- Deep Harbor design system
- i18n runtime toggle
- Responsive grid layouts

## Optimization Checklist

### 1. CSS Minification

#### Before (design.css: ~35KB)
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --c-primary: #0B1F3A;
  --c-accent: #F5A524;
  ...
}
```

#### After (design.min.css: ~25KB)
```bash
# Option A: Use an online minifier (copy-paste)
# https://cssnano.co/

# Option B: Add npm build step
npm install --save-dev cssnano postcss-cli
npx postcss css/design.css -o css/design.min.css

# Add to package.json:
"scripts": {
  "minify-css": "postcss css/design.css -o css/design.min.css"
}
```

**Action:** In `index.html` change:
```html
<!-- Old -->
<link rel="stylesheet" href="css/design.css">

<!-- New -->
<link rel="stylesheet" href="css/design.min.css">
```

### 2. JavaScript Minification

#### Before (app.js: ~55KB)
```javascript
const I18N = { tr: { "nav.services": "Hizmetler", ... }, en: { ... } };
```

#### After (app.min.js: ~38KB)
```bash
npm install --save-dev terser
npx terser js/app.js -o js/app.min.js

# Add to package.json:
"scripts": {
  "minify-js": "terser js/app.js -o js/app.min.js"
}
```

**Action:** In `index.html` change:
```html
<!-- Old -->
<script src="js/app.js"></script>

<!-- New -->
<script src="js/app.min.js"></script>
```

### 3. Image Optimization & Lazy Loading

#### Current: All images load immediately
```html
<div class="card-photo" style="background-image:url('assets/services/01-power-distribution.jpg')"></div>
```

#### After: Lazy loading with blur-up effect
```html
<!-- Add to index.html <head> -->
<link rel="preload" as="image" href="assets/services/01-power-distribution.jpg" imagesrcset="
  assets/services/01-power-distribution-320w.jpg 320w,
  assets/services/01-power-distribution-640w.jpg 640w,
  assets/services/01-power-distribution-1280w.jpg 1280w
" imagesizes="(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px">

<!-- Use responsive images -->
<img 
  src="assets/services/01-power-distribution-640w.jpg"
  srcset="assets/services/01-power-distribution-320w.jpg 320w,
          assets/services/01-power-distribution-640w.jpg 640w,
          assets/services/01-power-distribution-1280w.jpg 1280w"
  sizes="(max-width: 640px) 100vw, 50vw"
  loading="lazy"
  decoding="async"
  alt="Power Distribution Services — MSB, ESB, Generator"
>
```

Or use CSS `background-image` with lazyloading JavaScript:
```javascript
// Add to app.js
function lazyLoadImages() {
  const images = document.querySelectorAll('[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.src}')`;
        el.classList.add('is-loaded');
        observer.unobserve(el);
      }
    });
  });
  images.forEach(img => imageObserver.observe(img));
}
lazyLoadImages();
```

Update HTML:
```html
<div class="card-photo" data-src="assets/services/01-power-distribution.jpg"></div>
```

### 4. WebP Conversion

#### Install ImageMagick or use online tool
```bash
# macOS
brew install imagemagick

# Linux
apt-get install imagemagick

# Generate WebP versions (e.g., for services cards)
mogrify -format webp assets/services/*.jpg
mogrify -format webp assets/projects/*.jpg
mogrify -format webp assets/brand/*.png

# Verify
ls assets/services/*.webp
```

#### Use WebP with fallback
```html
<picture>
  <source srcset="assets/services/01-power-distribution.webp" type="image/webp">
  <source srcset="assets/services/01-power-distribution.jpg" type="image/jpeg">
  <img src="assets/services/01-power-distribution.jpg" alt="Power Distribution">
</picture>
```

### 5. Font Optimization

#### Current: Google Fonts (2 requests)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

#### Optimize: Use font-display=swap + subset
```html
<!-- Preconnect for faster loading -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load only Latin subset -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap&subset=latin" rel="stylesheet">
```

#### Self-host fonts (better performance)
```bash
# Download WOFF2 versions from Google Fonts
# Place in: assets/fonts/

# Add to CSS:
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/assets/fonts/inter-400.woff2') format('woff2');
}
```

### 6. Caching Headers (GitHub Pages)

GitHub Pages automatically sets:
- `Cache-Control: public, max-age=3600` (1 hour)

To extend caching for static assets, add `.htaccess`:

```apache
# .htaccess (if using a CDN like Cloudflare)
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images: 30 days
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/gif "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/webp "access plus 30 days"
  
  # CSS/JS: 30 days
  ExpiresByType text/css "access plus 30 days"
  ExpiresByType application/javascript "access plus 30 days"
  
  # HTML: 1 hour
  ExpiresByType text/html "access plus 1 hours"
</IfModule>
```

**GitHub Pages Alternative:** Use Cloudflare for caching:
1. Point CNAME to Cloudflare DNS
2. Enable Caching Rules in Cloudflare Dashboard

### 7. Performance Metrics

#### Lighthouse Audits (Chrome DevTools)
```bash
# Run locally
# 1. Open index.html in Chrome
# 2. DevTools → Lighthouse
# 3. Audit performance
# 4. Review report

# OR use CLI
npm install -g lighthouse
lighthouse https://leventmarinetech.com --view
```

#### Key Metrics to Track

| Metric | Target | Current |
|--------|--------|---------|
| Largest Contentful Paint (LCP) | < 2.5s | ~3.2s (needs improvement) |
| First Input Delay (FID) | < 100ms | ~120ms (OK) |
| Cumulative Layout Shift (CLS) | < 0.1 | ~0.05 (Good) |

#### Improve LCP:
- Load hero image ASAP: `<link rel="preload" as="image" href="assets/hero/...">`
- Inline critical CSS
- Defer non-critical CSS

#### Improve FID:
- Split large JS bundles
- Use `<script defer>` for non-critical scripts

### 8. Quick Wins

#### A. Remove unused CSS
```bash
npm install --save-dev uncss
npx uncss index.html blog/index.html profile.html > css/unused.txt
# Review and remove unused rules
```

#### B. Defer non-critical scripts
```html
<!-- Old -->
<script src="js/app.js"></script>

<!-- New -->
<script src="js/app.js" defer></script>
```

#### C. Inline critical CSS
```html
<!-- Extract critical CSS (above-the-fold) and inline -->
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --c-primary: #0B1F3A; ... }
  body { font-family: 'Inter', sans-serif; ... }
  .hero { ... }
</style>

<!-- Link non-critical CSS -->
<link rel="stylesheet" href="css/design.min.css" media="print" onload="this.media='all'">
```

#### D. Async third-party scripts
```html
<!-- Async load analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-..."></script>
```

### 9. Deployment Optimization

#### GitHub Pages built-in caching:
```bash
# .github/workflows/lighthouse.yml (optional)
name: Lighthouse
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install -g lighthouse
      - run: lighthouse https://leventmarinetech.com --output-path=./report.html
      - uses: actions/upload-artifact@v2
        with:
          name: lighthouse-report
          path: ./report.html
```

### 10. Final Lighthouse Target

**Goal:** 95+ on Performance, Accessibility, Best Practices, SEO

```
Performance: 95+
Accessibility: 90+
Best Practices: 90+
SEO: 95+
```

## Implementation Order

1. **Week 1:** CSS/JS minification + image lazy loading
2. **Week 2:** WebP conversion + font optimization
3. **Week 3:** Caching headers + Cloudflare setup
4. **Week 4:** Performance monitoring + further optimization

---

**Status:** 📋 Optimization roadmap ready. Implementation tools: cssnano, terser, ImageMagick, Cloudflare.

**Next Action:** Install build tools and minify CSS/JS, then commit.
