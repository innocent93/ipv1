const CACHE_NAME = 'ipmc-v1';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.ico', '/logo192.png', '/logo512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).then((res) => { const clone = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(request, clone)); return res; }).catch(() => caches.match(request))
    );
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => { if (!res || res.status !== 200 || res.type !== 'basic') return res; const clone = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(request, clone)); return res; });
    })
  );
});
