const CACHE_NAME = 'portugal-travel-v5';
const ASSETS = [
  './',
  './index.html',
  './portugal_data.js',
  './portugal_guides.js',
  './coords_data.js',
  './manifest.json',
  './icons/icon-192x192.png'
];

// 설치 (캐싱)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 활성화 (구버전 캐시 정리)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// 요청 (오프라인 지원)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});