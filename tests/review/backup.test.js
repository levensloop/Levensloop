// Reservekopie (2.3): exporteren, alle app-gegevens wissen, importeren → dezelfde levens.
// Gebruikt alles.json uit tests/fixtures (oude opslag), zodat ook een omgezet leven meedoet.
const { chromium, devices } = require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};const errs=[];
  const fx=JSON.parse(fs.readFileSync(path.join(__dirname,'..','fixtures','alles.json'),'utf8'));
  const ctx=await b.newContext({...devices['iPhone 13'],acceptDownloads:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(ls=>{if(sessionStorage.getItem('fx'))return;sessionStorage.setItem('fx','1');localStorage.clear();for(const k in ls)localStorage.setItem(k,ls[k])},fx.localStorage);
  await p.goto('http://localhost:8765/');
  // de app opent meteen het laatste leven; ga naar het startscherm via het menu
  await p.evaluate(()=>{openSheet('Hoofdmenu',sheetMain);[...document.querySelectorAll('#sheet-b .mrow')].find(r=>/Startscherm/.test(r.textContent)).click()});await p.waitForTimeout(400);
  const before=await p.evaluate(()=>{const canon=o=>JSON.stringify(o,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v).sort().reduce((a,x)=>(a[x]=v[x],a),{}):v);
    const o={};for(const [id,l] of Object.entries(STORE.lives)){o[id]=canon(Object.assign({},l,{snaps:undefined,updated:undefined}))+'|'+(l.snaps||[]).length}return o});
  // exporteren via de knop (in Chromium wordt het een download)
  await p.click('#btn-backup');await p.waitForTimeout(200);
  const [dl]=await Promise.all([p.waitForEvent('download',{timeout:10000}),p.evaluate(()=>[...document.querySelectorAll('#modal .btn')].find(r=>/Reservekopie maken/.test(r.textContent)).click())]);
  const file=await dl.path();const txt=fs.readFileSync(file,'utf8');ok(dl.suggestedFilename().startsWith('levensloop-reservekopie-')&&txt.length>1000,`bestand ${dl.suggestedFilename()} (${Math.round(txt.length/1024)} KB)`);
  // alles wissen, alsof de app opnieuw is geïnstalleerd
  await p.evaluate(()=>{localStorage.clear();sessionStorage.setItem('fx','1')});await p.reload();
  ok(await p.evaluate(()=>Object.keys(STORE.lives).length)===0,'na wissen: geen levens meer');
  // importeren via de bestandskiezer
  await p.click('#btn-backup');await p.waitForTimeout(200);
  const [fc]=await Promise.all([p.waitForEvent('filechooser'),p.evaluate(()=>[...document.querySelectorAll('#modal .btn')].find(r=>/Bestand kiezen/.test(r.textContent)).click())]);
  await fc.setFiles(file);await p.waitForTimeout(500);
  const after=await p.evaluate(()=>{const canon=o=>JSON.stringify(o,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v).sort().reduce((a,x)=>(a[x]=v[x],a),{}):v);
    const o={};for(const [id,l] of Object.entries(STORE.lives)){o[id]=canon(Object.assign({},l,{snaps:undefined,updated:undefined}))+'|'+(l.snaps||[]).length}return o});
  const ids=Object.keys(before);const same=ids.filter(id=>after[id]===before[id]);for(const id of ids)if(after[id]!==before[id]){const a=after[id]||"",b=before[id]||"";let i=0;while(i<a.length&&a[i]===b[i])i++;console.log("   verschil bij",id,"voor:",b.slice(i-60,i+60),"| na:",a.slice(i-60,i+60))}
  ok(same.length===ids.length&&Object.keys(after).length===ids.length,`${same.length} van ${ids.length} levens precies terug (met opnames)`);
  // nogmaals importeren: niets mag stil overschreven worden
  await p.evaluate(t=>backupImport(t),txt);await p.waitForTimeout(100);const m=await p.evaluate(()=>document.querySelector('#modal').hidden?'':document.querySelector('#modal').textContent);
  ok(/Bestaat al/.test(m)&&/Overslaan/.test(m),'dubbel importeren vraagt eerst wat je wilt');
  await p.evaluate(()=>[...document.querySelectorAll('#modal .btn')].find(x=>/Als kopie/.test(x.textContent)).click());await p.waitForTimeout(100);
  ok(await p.evaluate(()=>Object.keys(STORE.lives).length)===ids.length*2,'"als kopie toevoegen" verdubbelt de levens');
  // na herladen nog alles?
  await p.reload();ok(await p.evaluate(()=>Object.keys(STORE.lives).length)===ids.length*2,'na herladen staan ze er nog');
  // kopiëren als tekst en plakken
  const ok2=await p.evaluate(async()=>{localStorage.clear();const t=backupText();for(const k of Object.keys(STORE.lives))delete STORE.lives[k];backupImport(t);return Object.keys(STORE.lives).length});
  ok(ok2===ids.length*2,'plakken van de tekst werkt');
  ok(await p.evaluate(()=>{try{backupParse('hallo');return false}catch(e){return /geen reservekopie/.test(e.message)}}),'onzin plakken geeft een nette melding');
  await p.evaluate(()=>{loadLife(Object.keys(STORE.lives).find(id=>!STORE.lives[id].done&&STORE.lives[id].alive));openSheet('Hoofdmenu',sheetMain);[...document.querySelectorAll('#sheet-b .mrow')].find(r=>/Reservekopie/.test(r.textContent)).click()});await p.waitForTimeout(300);
  ok(/Reservekopie maken/.test(await p.evaluate(()=>document.querySelector('#sheet-b').textContent)),'Menu → Reservekopie werkt in het spel');
  ok(!errs.length,'geen JS-fouten'+(errs.length?': '+errs.join(' | '):''));
  await b.close();process.exit(fail?1:0)})();
