/* ================= MEETSCHERM (verbeterplan 2.1) =================
   Verborgen: tik 5 keer op het versienummer onderaan het hoofdmenu.
   Toont schermmaten en laat de speler wisselen tussen indelingen (standen) zonder nieuwe versie.
   De gekozen stand en de hulplijnen worden bewaard en bij het starten meteen toegepast. */
const DIAG_PFX=window.LEVENSLOOP_TEST?'levensloop.test.':'levensloop.';
const LAYOUTS={
  A:{n:'A · Huidige indeling',css:''},
  B:{n:'B · Hoogte 100vh, niet vast',css:'html,body{height:100vh!important}body{position:relative!important;top:auto!important;bottom:auto!important}'},
  C:{n:'C · Onder de statusbalk door (testapp)',css:'html{min-height:calc(100% + env(safe-area-inset-top,0px))!important}body{bottom:auto!important;height:calc(100% + env(safe-area-inset-top,0px))!important}'},
  D:{n:'D · App vast op 100dvh',css:'html body #app{position:fixed!important;top:0;left:0;right:0;height:100dvh!important}'},
  E:{n:'E · Hoogte 100dvh, niet vast',css:'html,body{height:100dvh!important;max-height:100dvh}body{position:relative!important;top:auto!important;bottom:auto!important}'},
};
const diagGet=k=>{try{return localStorage.getItem(DIAG_PFX+k)}catch(e){return null}};
const diagSet=(k,v)=>{try{v==null?localStorage.removeItem(DIAG_PFX+k):localStorage.setItem(DIAG_PFX+k,v)}catch(e){}};
function curLayout(){const k=diagGet('layout');return LAYOUTS[k]?k:'A'}
function applyLayout(){let st=document.getElementById('lay-css');if(!st){st=document.createElement('style');st.id='lay-css';document.head.appendChild(st)}
  st.textContent=LAYOUTS[curLayout()].css;applyGuides()}
function applyGuides(){const on=diagGet('guides')==='1';let g=document.getElementById('diag-guides');
  if(!on){if(g)g.remove();const i=document.getElementById('diag-appline');if(i)i.remove();return}
  if(!g){g=document.createElement('div');g.id='diag-guides';g.innerHTML=
    '<i style="position:fixed;left:0;right:0;bottom:0;height:5px;background:#e11d74;z-index:99990;pointer-events:none"></i>'+
    '<i style="position:fixed;left:0;width:5px;top:0;bottom:0;background:#e11d74;z-index:99990;pointer-events:none"></i>'+
    '<b style="position:fixed;right:4px;bottom:8px;font:700 10px system-ui;color:#e11d74;background:#fff;padding:1px 4px;border-radius:4px;z-index:99990;pointer-events:none">roze = onderkant volgens iOS</b>';
    document.body.appendChild(g)}
  const app=document.getElementById('app');if(app&&!app.querySelector('#diag-appline')){const i=document.createElement('i');i.id='diag-appline';i.style.cssText='position:absolute;left:0;right:0;bottom:0;height:3px;background:#18b04a;z-index:99991;pointer-events:none';app.appendChild(i)}
}
function diagMeasure(){const r=[];const px=v=>Math.round(v*10)/10;
  const probe=css=>{const d=document.createElement('div');d.style.cssText='position:fixed;left:0;top:0;width:1px;visibility:hidden;pointer-events:none;'+css;document.body.appendChild(d);const cs=getComputedStyle(d),h=d.getBoundingClientRect().height;const o={h,pt:cs.paddingTop,pr:cs.paddingRight,pb:cs.paddingBottom,pl:cs.paddingLeft};d.remove();return o};
  const ins=probe('padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)');
  const vv=window.visualViewport;const rect=s=>{const e=document.querySelector(s);if(!e)return 'ontbreekt';const b=e.getBoundingClientRect();if(!b.height)return 'niet zichtbaar';return `boven ${px(b.top)} · onder ${px(b.bottom)} · hoogte ${px(b.height)}`};
  const sb=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  r.push(['versie',(typeof APP_VERSION!=='undefined'?APP_VERSION:'claude.ai')+(window.LEVENSLOOP_TEST?' (testapp)':'')]);
  r.push(['stand',curLayout()]);
  r.push(['statusbalk',sb?sb.content:'-']);
  r.push(['standalone',`navigator ${navigator.standalone} · display-mode ${matchMedia('(display-mode: standalone)').matches}`]);
  r.push(['scherm',`${screen.width} × ${screen.height} · dpr ${devicePixelRatio}`]);
  r.push(['innerHeight',`${innerHeight} (breed ${innerWidth})`]);
  r.push(['clientHeight',document.documentElement.clientHeight]);
  r.push(['visualViewport',vv?`hoogte ${px(vv.height)} · offsetTop ${px(vv.offsetTop)} · pageTop ${px(vv.pageTop)}`:'-']);
  r.push(['safe-area',`boven ${ins.pt} · rechts ${ins.pr} · onder ${ins.pb} · links ${ins.pl}`]);
  r.push(['100vh / dvh / lvh / svh',['100vh','100dvh','100lvh','100svh'].map(u=>px(probe('height:'+u).h)).join(' / ')]);
  r.push(['100% (fixed)',px(probe('height:100%').h)]);
  r.push(['html',rect('html')]);r.push(['body',rect('body')]);r.push(['#app',rect('#app')]);
  r.push(['tabbalk',rect('.tabbar')]);r.push(['statsbalk',rect('#stats')]);r.push(['scherm nu',curScreen]);
  r.push(['scrollY',`${scrollY} · html.scrollTop ${document.documentElement.scrollTop}`]);
  r.push(['toestel',navigator.userAgent.replace(/^Mozilla\/5\.0 /,'')]);
  return r}
function openDiag(){closeDiag();const o=document.createElement('div');o.id='diag';
  o.style.cssText='position:fixed;inset:0;z-index:99995;background:#fff;color:#172033;overflow-y:auto;-webkit-overflow-scrolling:touch;font:14px/1.4 -apple-system,system-ui,sans-serif;padding:calc(env(safe-area-inset-top,0px) + 12px) 16px calc(env(safe-area-inset-bottom,0px) + 24px);-webkit-user-select:text;user-select:text';
  const draw=()=>{const m=diagMeasure();const cur=curLayout();const g=diagGet('guides')==='1';
    o.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><h2 style="margin:0;font-size:20px">📏 Meetscherm</h2><button data-x style="padding:8px 14px;border-radius:10px;background:#0a57a6;color:#fff;font-weight:700">Sluiten</button></div>
      <p style="margin:10px 0 6px;color:#647089">Kies een stand, tik op Sluiten en kijk of de blauwe balk onderin tot de onderkant doorloopt. Verandert er niets? Veeg de app helemaal weg en open hem opnieuw: de stand blijft bewaard.</p>
      <div style="display:grid;gap:6px">${Object.entries(LAYOUTS).map(([k,l])=>`<button data-l="${k}" style="text-align:left;padding:11px 12px;border-radius:10px;border:2px solid ${k===cur?'#0a57a6':'#e0e5ee'};background:${k===cur?'#e4eefa':'#fff'};font-weight:${k===cur?800:600}">${k===cur?'✓ ':''}${l.n}</button>`).join('')}</div>
      <button data-g style="margin-top:8px;width:100%;padding:11px 12px;border-radius:10px;border:2px solid #e0e5ee;font-weight:600;text-align:left">${g?'✓ ':''}Hulplijnen ${g?'aan':'uit'} <span style="color:#647089;font-weight:400">· roze = onderkant volgens iOS, groen = onderkant van de app</span></button>
      <h3 style="margin:16px 0 6px;font-size:16px">Maten</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px">${m.map(([k,v])=>`<tr><td style="padding:4px 8px 4px 0;color:#647089;vertical-align:top;white-space:nowrap">${he(k)}</td><td style="padding:4px 0;word-break:break-word">${he(String(v))}</td></tr>`).join('')}</table>
      <div style="display:flex;gap:8px;margin-top:12px"><button data-c style="flex:1;padding:12px;border-radius:10px;background:#17a05a;color:#fff;font-weight:700">Kopieer</button><button data-r style="flex:1;padding:12px;border-radius:10px;background:#eef2f7;font-weight:700">Ververs</button></div>
      <textarea data-t readonly style="position:absolute;left:-9999px;top:0;width:10px;height:10px"></textarea>`;
    o.querySelector('[data-x]').onclick=closeDiag;
    o.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{diagSet('layout',b.dataset.l==='A'?null:b.dataset.l);applyLayout();setTimeout(draw,60)});
    o.querySelector('[data-g]').onclick=()=>{diagSet('guides',g?null:'1');applyGuides();draw()};
    o.querySelector('[data-r]').onclick=draw;
    o.querySelector('[data-c]').onclick=async()=>{const txt=m.map(([k,v])=>k+': '+v).join('\n');let ok=false;
      try{await navigator.clipboard.writeText(txt);ok=true}catch(e){}
      if(!ok){const t=o.querySelector('[data-t]');t.value=txt;t.select();t.setSelectionRange(0,txt.length);try{ok=document.execCommand('copy')}catch(e){}}
      toast(ok?'Gekopieerd':'Kopiëren lukte niet, maak een schermafbeelding')}};
  document.body.appendChild(o);draw()}
function closeDiag(){const o=document.getElementById('diag');if(o)o.remove()}
// vijf tikken binnen drie seconden op een element openen het meetscherm
function diagTap(el){let n=0,t0=0;el.addEventListener('click',()=>{const t=Date.now();if(t-t0>3000)n=0;if(!n)t0=t;if(++n>=5){n=0;openDiag()}})}
function versionLine(el){const p=document.createElement('p');p.className='verline';p.textContent='Versie '+(typeof APP_VERSION!=='undefined'?APP_VERSION:'claude.ai')+(window.LEVENSLOOP_TEST?' · testapp':'');
  p.style.cssText='text-align:center;font-size:12px;color:#8a93a6;margin:18px 0 6px;padding:8px;-webkit-user-select:none;user-select:none';diagTap(p);el.appendChild(p)}
applyLayout();
