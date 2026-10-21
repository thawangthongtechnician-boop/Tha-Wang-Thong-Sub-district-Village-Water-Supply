// Service worker: โหลดหน้าแอพจากเครือข่ายก่อนเสมอ (ได้เวอร์ชันล่าสุด) ถ้าไม่มีเน็ตใช้สำเนาที่เก็บไว้
const CACHE = 'water-tha-wang-thong-v1';
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // ไม่แตะแผนที่ ไลบรารี และการเรียกข้อมูล (API)
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('index.html'))));
});
