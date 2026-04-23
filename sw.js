const CACHE_NAME = 'portugal-travel-v37';
const ASSETS = [
  './',
  './index.html',
  './portugal_data.js',
  './portugal_guides.js',
  './coords_data.js',
  './css/styles.css',
  './js/app.js?v=37',
  './js/ui-components.js?v=37',
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

// 요청 (Network First 전략: 네트워크 우선, 실패 시 캐시)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // 네트워크 요청 성공 시 캐시 업데이트 (최신 내용 유지)
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => {
        // 네트워크 요청 실패(오프라인) 시 캐시 사용
        return caches.match(e.request);
      })
  );
});