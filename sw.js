const CACHE_NAME = 'guaite-del-gusto-v15';

const PRECACHE_URLS = [
  'index.html',
  'css/style.css',
  'css/fonts.css',
  'js/main.js',
  'manifest.json',
  'fonts/fraunces-italic-500-latin-ext.woff2',
  'fonts/fraunces-italic-500-latin.woff2',
  'fonts/fraunces-normal-latin-ext.woff2',
  'fonts/fraunces-normal-latin.woff2',
  'fonts/jost-latin-ext.woff2',
  'fonts/jost-latin.woff2',
  'pages/programma.html',
  'pages/gusto.html',
  'pages/tavolozza.html',
  'pages/mappa.html',
  'images/hero.png',
  'images/hero-desktop.png',
  'images/logo-visso.png',
  'images/logotype.png',
  'images/g-swirl.png',
  'images/grand-tour-badge.png',
  'images/favicon.png',
  'images/icon-192.png',
  'images/icon-512.png',
  'images/qr-code.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Le navigazioni (click sui link, indirizzo digitato) le lascia gestire
  // sempre alla rete/browser: niente intercettazioni che possano romperle.
  if (req.mode === 'navigate') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return response;
      });
    })
  );
});
