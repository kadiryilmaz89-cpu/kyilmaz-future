const CACHE_NAME = 'kyilmaz-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

// Fetch olayı - offline destek
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// Push bildirimi gelince göster
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'KYILMAZ FUTURE', {
      body: data.body || 'Yeni sinyal!',
      icon: '/kyilmaz-future/icon.png',
      badge: '/kyilmaz-future/icon.png',
      tag: data.tag || 'kyilmaz',
      requireInteraction: true,
      vibrate: [200, 100, 200]
    })
  );
});

// Bildirime tıklayınca uygulamayı aç
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('kyilmaz-future') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/kyilmaz-future/');
      }
    })
  );
});
