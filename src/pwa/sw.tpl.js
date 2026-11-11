/* Levensloop service worker: bewaart de app op je telefoon zodat hij offline werkt */
const VERSION='__VERSION__';
const CACHE='levensloop-'+VERSION;
const FONTS='levensloop-fonts';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png'];
const FONT_CSS='https://fonts.googleapis.com/css2?family=Anton&family=Pacifico&family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap';
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})));
    // lettertypes alvast ophalen (lukt alleen met internet; anders bij de volgende keer)
    try{const f=await caches.open(FONTS);if(!(await f.match(FONT_CSS))){const r=await fetch(FONT_CSS);const css=await r.clone().text();await f.put(FONT_CSS,r);
      const urls=[...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]);await Promise.all(urls.map(u=>fetch(u).then(x=>f.put(u,x)).catch(()=>{})))}}catch(err){}
    // de allereerste installatie mag meteen actief worden; updates wachten op de speler
    if(!self.registration.active)self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE&&k!==FONTS)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){e.respondWith((async()=>{const f=await caches.open(FONTS);const m=await f.match(req,{ignoreVary:true});if(m)return m;try{const r=await fetch(req);f.put(req,r.clone());return r}catch(err){return new Response('',{status:504})}})());return}
  if(u.origin!==self.location.origin)return;
  // testapp: altijd vers van internet, met de laatst bewaarde kopie als terugval
  if(req.mode==='navigate'&&u.pathname.endsWith('/test.html')){e.respondWith((async()=>{try{const r=await fetch(req,{cache:'no-store'});(await caches.open(CACHE)).put('./test.html',r.clone());return r}catch(err){return (await caches.match('./test.html'))||Response.error()}})());return}
  if(req.mode==='navigate'){e.respondWith((async()=>(await caches.match('./index.html'))||fetch(req))());return}
  e.respondWith((async()=>(await caches.match(req,{ignoreSearch:true}))||fetch(req))())});
