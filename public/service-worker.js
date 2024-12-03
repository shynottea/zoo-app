const CACHE_NAME = 'my-app-cache-v1';
const CACHE_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
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

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets during install');
      return cache.addAll([...CACHE_FILES, '/timestamp']);
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

  event.respondWith(
    isCacheExpired().then((expired) => {
      if (expired) {
        // Clear old cache and fetch fresh content
        return caches.delete(CACHE_NAME).then(() =>
          fetch(request.clone()).then((response) => {
            if (response && response.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response.clone());
                updateCacheTimestamp();
              });
            }
            return response;
          })
        );
      } else {
        // Serve from cache or fallback to network
        return caches.match(request).then((response) => response || fetch(request));
      }
    })
  );
});
