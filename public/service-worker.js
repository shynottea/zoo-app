const CACHE_NAME = 'my-app-cache-v2'; // Cache versioning
const CACHE_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png', // Add other static assets here
];

const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to check cache expiration
const isCacheExpired = async () => {
  const cacheTimestamp = await caches.open(CACHE_NAME).then((cache) =>
    cache.match('/timestamp').then((response) => response?.text())
  );

  if (!cacheTimestamp) return true; // No timestamp means cache is expired

  const now = Date.now();
  return now - parseInt(cacheTimestamp, 10) > CACHE_EXPIRATION_TIME;
};

// Helper function to update cache timestamp
const updateCacheTimestamp = async () => {
  const now = Date.now().toString();
  await caches.open(CACHE_NAME).then((cache) =>
    cache.put('/timestamp', new Response(now))
  );
};

// Install Event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    }).then(() => {
      // Cache the new version of assets
      return caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching assets during install');
        return cache.addAll([...CACHE_FILES, '/timestamp']);
      });
    })
  );
});

// Activate Event: Clear old caches when service worker is updated
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Delete old caches
          }
        })
      )
    )
  );
});

// Fetch Event: Use stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Fetch data from the network while serving cached content if available
      const networkFetch = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone()); // Update cache with fresh data
          });
        }
        return networkResponse;
      });

      // Return cached content if available, otherwise fetch and cache new data
      return cachedResponse || networkFetch;
    })
  );
});

// Handle POST/PUT/DELETE operations by clearing relevant cache
const clearCacheForOperation = (url) => {
  caches.open(CACHE_NAME).then((cache) => {
    cache.delete(url); // Delete specific cache
    cache.delete('/users'); // Optionally clear other related caches (e.g., all users)
  });
};

// Example of clearing cache for user-related operations:
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'invalidateCache') {
    clearCacheForOperation(event.data.url); // Delete cache for the URL passed in the message
  }
});
