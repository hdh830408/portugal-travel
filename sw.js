const CACHE_NAME = 'portugal-travel-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './portugal_data.js',
  './portugal_guides.js',
  'https://cdn-icons-png.flaticon.com/512/197/197463.png'
];

// 1. 설치 (Install): 캐시 저장
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. 활성화 (Activate): 이전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. 요청 (Fetch): 오프라인이면 캐시에서 꺼내줌
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});