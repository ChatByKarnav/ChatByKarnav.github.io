// Minimal structural service worker required for universal PWA installation
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
