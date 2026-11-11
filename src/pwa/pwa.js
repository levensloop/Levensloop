/* ================= OFFLINE-APP (alleen in de iPhone-versie) ================= */
(function(){
  const standalone=window.navigator.standalone===true||window.matchMedia('(display-mode: standalone)').matches;
  // opslag zo veel mogelijk vasthouden
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}
  // in Safari (nog niet op het beginscherm): korte uitleg tonen
  try{const ios=/iPhone|iPad|iPod/.test(navigator.userAgent);if(ios&&!standalone&&!localStorage.getItem('levensloop.hint')){
    const d=document.createElement('div');d.id='pwa-hint';d.innerHTML='<b>📲 Speel Levensloop offline</b>Tik onderin op <b style="display:inline">Deel</b> en daarna op <b style="display:inline">Zet op beginscherm</b>. Dan heb je de app altijd bij je, ook zonder internet.<button aria-label="Sluiten">✕</button>';
    d.querySelector('button').onclick=()=>{d.remove();try{localStorage.setItem('levensloop.hint','1')}catch(e){}};document.body.appendChild(d)}}catch(e){}
  if(!('serviceWorker' in navigator))return;
  let want=false,reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!want||reloading)return;reloading=true;location.reload()});
  const bar=(w)=>{if(document.getElementById('pwa-bar'))return;const b=document.createElement('button');b.id='pwa-bar';b.textContent='✨ Nieuwe versie · tik om bij te werken';
    b.onclick=()=>{want=true;b.textContent='Even geduld…';try{if(typeof saveLife==='function')saveLife()}catch(e){}w.postMessage('skip')};document.body.appendChild(b)};
  navigator.serviceWorker.register('sw.js').then(reg=>{
    if(reg.waiting&&navigator.serviceWorker.controller)bar(reg.waiting);
    reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)bar(w)})});
    const check=()=>{if(navigator.onLine)reg.update().catch(()=>{})};document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});setInterval(check,30*60*1000)
  }).catch(()=>{});
})();
