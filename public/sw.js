const CACHE_NAME = 'yuitility-v4';
const STATIC_CACHE_NAME = 'yuitility-static-v4';

const CORE_APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/brand/yuitility-logo.png',
  '/icon.png',
  '/favicon.ico',
];

// Install: Precache core app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        CORE_APP_SHELL.map((url) =>
          fetch(url, { cache: 'no-cache' })
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    })
  );
});

// Activate: Claim clients and purge outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Smart Caching Strategies for Next.js App Router
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass service worker caching on localhost/127.0.0.1 to avoid stale hot-reloading and hydration mismatches
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // Skip non-GET or non-http(s) requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Next.js Static Build Assets (_next/static/*)
  // Strategy: Cache-First with Network Fallback & Cache Update
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return cachedResponse || new Response('Asset not cached', { status: 404 });
        }
      })
    );
    return;
  }

  // 2. HTML Navigation Requests (Page Load & Reload)
  // Strategy: Network-First with Cache Fallback and App Shell ('/') Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy);
              cache.put(url.pathname, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // 1. Match exact request
          const cached = await caches.match(request);
          if (cached) return cached;

          // 2. Match request pathname
          const pathCached = await caches.match(url.pathname);
          if (pathCached) return pathCached;

          // 3. Fallback to App Shell (Homepage) HTML
          const homeCached = await caches.match('/');
          if (homeCached) return homeCached;

          return new Response(
            '<!DOCTYPE html><html><head><title>Offline - Yuitility</title></head><body><h1>Working Offline</h1><p>Please check your connection or return to <a href="/">Home</a>.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 3. Fonts, Images, Audio/Video, CDN Assets (unpkg, gstatic)
  // Strategy: Cache-First with Background Update (Stale-While-Revalidate)
  const isStaticMedia =
    /\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot|wasm)$/i.test(url.pathname) ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('unpkg.com');

  if (isStaticMedia) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. Default GET Requests (RSC payload, API, etc.)
  // Strategy: Stale-While-Revalidate / Network First with Cache Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
