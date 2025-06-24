self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('equipment-cache-v1').then(cache => {
      return cache.addAll([
        './index.html',
        './manifest.json',
        './main.js',
        './service-worker.js',
        './icon-192.png',
        './icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
