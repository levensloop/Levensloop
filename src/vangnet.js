/* ================= VANGNET (verbeterplan 1.13) =================
   Gaat er ergens iets mis, dan blijft het spel bruikbaar: de pop-up gaat dicht, het leven wordt bewaard
   en de speler ziet "Er ging iets mis. Je leven is bewaard." De fout komt in een lijstje van de laatste 20,
   te zien via Menu → Foutenlog, zodat Thijmen er een schermafbeelding van kan sturen.
   Ook fouten die safe() stil opvangt komen in het lijstje (zonder melding), want die wijzen op een fout in het spel. */
const ERR_KEY='levensloop.errors';
function errList(){try{return JSON.parse(localStorage.getItem(ERR_KEY)||'[]')}catch(e){return []}}
function errLog(err,soort){try{const m=String(err&&err.message||err||'onbekende fout').slice(0,300);
    const st=String(err&&err.stack||'').split('\n').slice(1,3).map(x=>x.trim().replace(/\(?https?:\/\/[^)]*?(:\d+:\d+)\)?/,'$1')).join(' | ').slice(0,200);
    const waar=(()=>{try{const t=!$('#modal').hidden?(($('#modal .ptitle')||$('#modal h3')||{}).textContent||'pop-up'):!$('#sheet').hidden?$('#sheet-t').textContent:curScreen;return `${S?ageY()+' jaar, '+S.p.country:'geen leven'} · ${t}`}catch(e){return ''}})();
    const l=errList();const same=l.find(x=>x.m===m&&x.soort===soort);
    if(same){same.n=(same.n||1)+1;same.t=new Date().toISOString();same.waar=waar;l.splice(l.indexOf(same),1);l.unshift(same)}
    else l.unshift({t:new Date().toISOString(),v:typeof APP_VERSION!=='undefined'?APP_VERSION:'claude.ai',m,st,waar,soort,n:1});
    localStorage.setItem(ERR_KEY,JSON.stringify(l.slice(0,20)))}catch(e){}}
let errBurst=[];
function onCrash(err){errLog(err,'crash');
  try{const now=Date.now();errBurst=errBurst.filter(t=>now-t<3000);errBurst.push(now);
    // zelfde gebeurtenis blijft crashen: wachtrij leeghalen zodat je verder kunt
    if(errBurst.length>=3&&typeof Q!=='undefined'){Q.length=0;errBurst=[]}
    if(!$('#modal').hidden)closeModal();
    if(S&&S.alive&&curScreen==='game'){try{render()}catch(e){}}
    if(S)saveLife();
    toast('Er ging iets mis. Je leven is bewaard.')}catch(e){}}
window.addEventListener('error',e=>onCrash(e.error||e.message));
window.addEventListener('unhandledrejection',e=>onCrash(e.reason));
function sheetErrors(el){const l=errList();
  card(el,`<span class="muted">Hier staan de laatste ${l.length?l.length:''} fouten die het spel heeft opgevangen. Maak een schermafbeelding en stuur die naar Claude als er iets niet goed gaat.</span>`);
  const s=sec(el,'');if(!l.length){empty(s,'Geen fouten. Alles loopt goed.');return}
  for(const x of l)row(s,{ic:x.soort==='crash'?'💥':'🩹',t:x.m.slice(0,90),s:`${x.t.slice(0,16).replace('T',' ')} · versie ${x.v}${x.n>1?` · ${x.n}×`:''} · ${x.waar}${x.st?' · '+x.st:''}`});
  foot(el,'🧹','Foutenlog wissen',()=>{try{localStorage.removeItem(ERR_KEY)}catch(e){}refreshSheet();toast('Foutenlog gewist')})}
