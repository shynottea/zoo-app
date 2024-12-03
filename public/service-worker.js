import { precacheAndRoute } from 'workbox-precaching';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

const CACHE_NAME = 'my-app-cache-v1';
const CACHE_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png',
  '/static/js/main.js',
  '/timestamp', 
];


const CACHE_EXPIRATION_TIME = 5 * 60 * 1000;


precacheAndRoute(self.__WB_MANIFEST);


const bgSyncPlugin = new BackgroundSyncPlugin('post-requests-queue', {
  maxRetentionTime: 24 * 60, 
});


const isCacheExpired = async () => {
  const cacheTimestamp = await caches.open(CACHE_NAME).then((cache) =>
    cache.match('/timestamp').then((response) => response?.text())
  );

  if (!cacheTimestamp) return true; 

  const now = Date.now();
  return now - parseInt(cacheTimestamp, 10) > CACHE_EXPIRATION_TIME;
};


const updateCacheTimestamp = async () => {
  const now = Date.now().toString();
  await caches.open(CACHE_NAME).then((cache) =>
    cache.put('/timestamp', new Response(now))
  );
};


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets during install');
      return cache.addAll([...CACHE_FILES, '/timestamp']);
    })
  );
});


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


self.addEventListener('fetch', (event) => {
  const { request } = event;


  if (request.method === 'GET') {
    event.respondWith(
      isCacheExpired().then((expired) => {
        if (expired) {
          return caches.delete(CACHE_NAME).then(() =>
            fetch(request).then((response) => {
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
          return caches.match(request).then((response) => response || fetch(request));
        }
      })
    );
  }

  if (request.method === 'POST') {
    event.respondWith(bgSyncPlugin.pushRequest({ request }));
  }
});


registerRoute(
  /\/(products|users|orders|reviews)/,
  new CacheFirst({
    cacheName: 'api-get-cache',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (response && response.status === 200) {
            return response;
          }
          return null; 
        },
      },
    ],
  })
);


registerRoute(
  /\/(products|users|orders|reviews)/, 
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);


const clearCacheForOperation = (url) => {
  caches.open(CACHE_NAME).then((cache) => {
    cache.delete(url); 
  });
};

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'invalidateCache') {
    caches.open(CACHE_NAME).then((cache) => cache.delete(event.data.url));
  }
});
