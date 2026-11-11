// Migratietest: zet elk bestand uit tests/fixtures/ in localStorage, laadt de NIEUWE versie (testserver :8765)
// en controleert per leven dat het opent, een jaar ouder kan worden en na herladen nog bestaat.
// Eindigt met foutcode 1 als er iets misgaat. Bekende fouten (tests/bekende-fouten.txt) tellen niet mee.
const { chromium, devices } = require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');
const DIR=path.join(__dirname,'..','fixtures');const URL=process.env.URL||'http://localhost:8765/';
const KNOWN=(()=>{try{return fs.readFileSync(path.join(__dirname,'..','bekende-fouten.txt'),'utf8').split('\n').map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'))}catch(e){return[]}})();
const known=m=>KNOWN.some(k=>m.includes(k));
const LSNEW=process.env.OLD!=='1';// nieuwe opslag verwacht (zet OLD=1 om tegen de oude versie te testen)
(async()=>{const b=await chromium.launch();let fail=0,knownN=0;
  const files=fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).sort();
  for(const f of files){const fx=JSON.parse(fs.readFileSync(path.join(DIR,f),'utf8'));
    const ctx=await b.newContext({...devices['iPhone 13']});const p=await ctx.newPage();const errs=[];
    p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|Failed to load resource|net::/.test(m.text()))errs.push('console: '+m.text().slice(0,200))});
    // alleen bij de eerste keer laden de oude opslag terugzetten, niet bij herladen
    await p.addInitScript(ls=>{if(sessionStorage.getItem('fx'))return;sessionStorage.setItem('fx','1');localStorage.clear();for(const k in ls)localStorage.setItem(k,ls[k])},fx.localStorage);
    await p.goto(URL);await p.addScriptTag({content:AUTO});
    const r=await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const out=[];
      const ids=Object.keys(STORE.lives);
      for(const id of ids){const l=STORE.lives[id];const o={id,name:l.done?l.name:(l.p.first+' '+l.p.last),done:!!l.done,ok:true,msg:''};
        try{
          if(l.done){renderStart();if(!document.querySelector(`#start [data-id="${id}"], [data-id="${id}"]`)){o.ok=false;o.msg='staat niet op het startscherm'}}
          else{loadLife(id);await sl(20);await AUTO(20000);
            if(S.id!==id){o.ok=false;o.msg='leven opent niet'}
            else if(!S.alive){o.msg='overleden, doodscherm';if(curScreen!=='death'){o.ok=false;o.msg='doodscherm opent niet'}}
            else{const a=ageY();document.querySelector('#t-age').click();await sl(20);const lg=await AUTO(30000);let n=0;while(S.alive&&Q.length&&n++<20){document.querySelector('#t-age').click();await sl(20);await AUTO(30000)}
              if(lg.includes('TIMEOUT')){o.ok=false;o.msg='pop-up blijft hangen'}
              else if(S.alive&&ageY()!==a+1){o.ok=false;o.msg=`leeftijd ${a} → ${ageY()}`}else o.msg=`${a} → ${S.alive?ageY():'overleden'}`;
              closeModal();closeSheet();saveLife()}
            renderStart();show('start')}
        }catch(e){o.ok=false;o.msg='fout: '+e.message}
        out.push(o)}
      return {ids,out}});
    // herladen: zijn alle levens er nog? En is de oude opslag netjes omgezet?
    await p.reload();const after=await p.evaluate(()=>Object.keys(STORE.lives));
    const st=await p.evaluate(()=>{let n=0;for(const k of Object.keys(localStorage))n+=localStorage.getItem(k).length;return {v1:localStorage.getItem('levensloop.v1')!=null,v2:localStorage.getItem('levensloop.v2')!=null,kb:Math.round(n/1024)}});
    const oldKb=Math.round(Object.values(fx.localStorage).reduce((a,v)=>a+v.length,0)/1024);
    if(typeof LSNEW!=='undefined'&&LSNEW&&(st.v1||!st.v2)){r.out.push({ok:false,name:'opslag',msg:`niet omgezet (v1 ${st.v1}, v2 ${st.v2})`})}
    r.out.push({ok:true,name:'opslag',msg:`${oldKb} KB → ${st.kb} KB`});
    const lost=r.ids.filter(id=>!after.includes(id));
    const real=errs.filter(e=>!known(e)),kn=errs.length-real.length;knownN+=kn;
    const bad=r.out.filter(o=>!o.ok).length+lost.length+real.length;fail+=bad;
    console.log(`${bad?'✗':'✓'} ${f} (gemaakt met ${fx.version}): ${r.out.map(o=>`${o.ok?'':'✗ '}${o.name}${o.done?' (begraafplaats)':''} ${o.msg}`).join(' · ')}${lost.length?` · KWIJT na herladen: ${lost.length}`:''}${real.length?` · JS-fouten: ${[...new Set(real)].join(' | ')}`:''}${kn?` · ${kn}× bekende fout`:''}`);
    await ctx.close()}
  await b.close();
  console.log(fail?`migratie: ${fail} probleem/problemen`:`migratie: alles in orde${knownN?` (${knownN}× bekende fout)`:''}`);
  process.exit(fail?1:0)})();
