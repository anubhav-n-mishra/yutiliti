const CACHE_NAME = 'yuitility-v1';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/brand/yuitility-logo.png',
  '/icon.png',
  '/favicon.ico',
  '/privacy',
  '/terms',
];

// 1. Install Event - Precache critical app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event - Clean up stale old caches
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

// 3. Fetch Event - Serve offline with Stale-While-Revalidate & Cache-First strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests or browser extension requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Handle Page Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback from Cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          
          // Fallback to homepage cache if specific page isn't in cache
          const homeCache = await caches.match('/');
          if (homeCache) return homeCache;

          return new Response(
            '<html><body><h2 style="font-family:sans-serif;text-align:center;margin-top:20%;">Yuitility Offline</h2><p style="font-family:sans-serif;text-align:center;">You are offline. Please reconnect to load new pages.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Handle Static Assets (JS, CSS, Images, Fonts) - Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // Silent fallback on network failure
        });

      return cachedResponse || fetchPromise;
    })
  );
});
