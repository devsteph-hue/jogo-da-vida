// guarda o app no aparelho para abrir sem internet
const C='jogo-da-vida-v14';
const CORE=['./','./index.html','./vida-imagens.js','./vida-exercicios.js','./vida-sons-1.js','./vida-sons-2.js','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // a página sempre tenta a versão mais nova; sem internet, usa a guardada
  if(r.mode==='navigate'||(u.origin===location.origin&&u.pathname.endsWith('/index.html'))){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html')));return}
  // o resto (ícones, fontes) vem do que já está guardado
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})))});
