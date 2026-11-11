const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:797}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');
 const out=await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const o=[];
  newLife({first:'T',last:'Y',g:'m',country:'NL',city:'Eindhoven',by:1990,mode:'year',chaos:1});closeModal();show('game');S.m=32*12;S.money=5e6;S.edu.stage='klaar';S.edu.lvl='wo';
  const dump=async(title,fn,depth)=>{openSheet(title,fn,false);await sl(15);const rows=[...document.querySelectorAll('#sheet-b .mrow')];const names=rows.map(r=>((r.querySelector('b')||r).textContent||'').trim().slice(0,34)+(r.disabled?'*':''));o.push(`## ${title}: ${names.join(' | ')}`);
    if(depth>0)for(let i=0;i<rows.length;i++){openSheet(title,fn,false);await sl(10);const r=[...document.querySelectorAll('#sheet-b .mrow')][i];if(!r||r.disabled)continue;const nm=((r.querySelector('b')||r).textContent||'').trim().slice(0,30);if(/Tijdmachine|Opgeven|Emigreren/.test(nm))continue;r.click();await sl(15);
      if(!document.querySelector('#modal').hidden){const t=document.querySelector('#modal');o.push(`   > ${nm} [modal]: `+[...t.querySelectorAll('.btn')].map(b=>b.textContent.trim().slice(0,26)).slice(0,14).join(' | '));closeModal();continue}
      const t2=(document.querySelector('#sheet-t')||{}).textContent;if(t2&&t2!==title.toUpperCase()){o.push(`   > ${nm}: `+[...document.querySelectorAll('#sheet-b .mrow')].map(r=>((r.querySelector('b')||r).textContent||'').trim().slice(0,26)+(r.disabled?'*':'')).slice(0,40).join(' | '))}}
    closeSheet();closeModal()};
  await dump('Activiteiten',sheetAct,1);await dump('Beroep',sheetJob,1);await dump('Bezit',sheetAssets,1);await dump('Hoofdmenu',sheetMain,0);
  o.push('ACH: '+ACH.length+' | CAREERS '+(typeof CAREERS!=='undefined'?Object.keys(CAREERS).length:'?')+' | JOBS '+(typeof JOBS!=='undefined'?JOBS.length:'?')+' | EV '+Object.keys(EV).length+' | landen '+Object.keys(COUNTRIES).length);
  return o.join('\n')});console.log(out);console.log(errs.slice(0,5));await b.close()})();
