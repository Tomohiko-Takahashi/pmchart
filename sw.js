const CACHE_NAME = 'pmchart-v5';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('dropbox') || e.request.url.includes('api.')) return;
  e.respondWith(
    caches.match(e.request).then(c => c || fetch(e.request).then(r => {
      if(r && r.status===200 && r.type==='basic'){const cl=r.clone();caches.open(CACHE_NAME).then(ca=>ca.put(e.request,cl));}
      return r;
    }).catch(()=>c))
  );
});
