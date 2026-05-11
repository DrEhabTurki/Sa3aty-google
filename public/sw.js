const cacheName = 'v1';
const cacheAssets = ['./', 'index.html', 'manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(cacheAssets);
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
