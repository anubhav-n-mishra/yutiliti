const CACHE_NAME = 'yuitility-v2';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/brand/yuitility-logo.png',
  '/icon.png',
  '/favicon.ico',
  '/privacy',
  '/terms',
];

// Install: Precache shell assets & skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA] Precache warning:', err);
      });
    })
  );
});

// Activate: Claim clients and purge old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Bulletproof offline caching for Next.js App Router
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-HTTP(S) & external domain requests outside yuitility
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation / HTML Page Requests (Offline Support)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cachedPage) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cachedPage || caches.match('/'));

        return cachedPage || networkFetch;
      })
    );
    return;
  }

  // 2. Next.js Static Assets & Media (Cache First)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update for cache freshness
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        // Return empty fallback if asset fetch fails offline
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});
