const CACHE_NAME = 'kuangyu-pwa-v1';
const urlsToCache = [
    './',
    './index.html',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// 1. 安裝階段：把網頁的「外殼 (HTML與套件)」下載到手機裡
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// 2. 攔截請求階段：沒網路時，就從手機快取拿「外殼」出來用
self.addEventListener('fetch', event => {
    // ⚠️ 絕對不攔截 Google Sheets API！讓資料庫的連線永遠走真實網路
    if (event.request.url.includes('script.google.com')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果手機快取裡有這個檔案，就直接給它 (離線也能開)
                // 如果沒有，才去網路上抓
                return response || fetch(event.request);
            })
    );
});
