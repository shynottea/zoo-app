const CACHE_NAME = 'my-app-cache-v1';
const CACHE_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets during install');
      return cache.addAll(CACHE_FILES);
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Handle POST requests for the product list
  const isProductPostRequest = request.url.includes('http://localhost:5000/products') && request.method === 'POST';

  if (isProductPostRequest) {
    event.respondWith(
      fetch(request.clone())
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            // Clone the response and store it in the cache
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request.url, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cached response if available
          return caches.match(request.url).then((cachedResponse) => {
            return cachedResponse || new Response('{"error":"Network error and no cached data."}', { status: 500 });
          });
        })
    );
  } else {
    // Default behavior for other requests
    event.respondWith(
      caches.match(request).then((response) => response || fetch(request))
    );
  }
});
