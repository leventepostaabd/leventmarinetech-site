/* Levent Marine — Service Worker v1
   Strategy:
   - Pre-cache the shell (HTML, CSS, JS, logo, hero) on install
   - Stale-while-revalidate for static assets (images, fonts)
   - Network-first for HTML so router/i18n updates show up immediately
   - Bypass /api/* completely
*/
const CACHE = 'lm-shell-v1';
const SHELL = [
  '/',
  '/index.html',
  '/css/design.css',
  '/js/app.js',
  '/assets/logo.svg',
  '/assets/logo-dark.svg',
  '/assets/logo.png',
  '/assets/hero/engine-room.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Same-origin only
  if (url.origin !== self.location.origin) return;

  // Skip API routes
  if (url.pathname.startsWith('/api/')) return;

  // Network-first for HTML navigation
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/')))
    );
    return;
  }

  // Stale-while-revalidate for everything else
  e.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
