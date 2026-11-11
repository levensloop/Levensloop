const { chromium } = require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:797}});const errs=[];p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1].trim().slice(0,80)));
 await p.goto('http://localhost:8765/');await p.addScriptTag({content:AUTO});
 const out=await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const o=[];const tryS=(lbl)=>{try{openSheet('School',sheetSchool,true);closeSheet()}catch(e){o.push('SCHOOL '+lbl+': '+e.message+' stage='+S.edu.stage+' lvl='+S.edu.lvl+' cur='+JSON.stringify(S.edu.cur))}};
  for(const a of [3,5,8,12,13,16,18,19]){newLife({first:'T',last:'Y',g:'m',country:'NL',city:'Utrecht',by:2000,mode:'year',chaos:0});closeModal();show('game');for(let i=0;i<a&&S.alive;i++){advance();Q=[]}closeModal();
    document.querySelector('#t-job').click();await sl(10);const rows=[...document.querySelectorAll('#sheet-b .mrow')].map(r=>(r.querySelector('b')||r).textContent.trim());o.push(a+'j stage='+S.edu.stage+': '+rows.join(' | '));
    const r=[...document.querySelectorAll('#sheet-b .mrow')][0];try{r&&r.click()}catch(e){o.push('ERR '+e.message)}await sl(10);closeModal();closeSheet()}
  // payMed onder de 18
  newLife({first:'T',last:'Y',g:'m',country:'NL',city:'Utrecht',by:2000,mode:'year',chaos:0});closeModal();for(let i=0;i<10;i++){advance();Q=[]}try{payMed(100);o.push('payMed ok')}catch(e){o.push('payMed 10j NL: '+e.message)}
  // negatief saldo en gokken
  S.m=30*12;S.money=-5000;try{openSheet('Activiteiten',sheetAct);await sl(10);const c=[...document.querySelectorAll('#sheet-b .mrow')].find(r=>/^Casino/.test((r.querySelector('b')||r).textContent.trim()));o.push('casino rij disabled='+c.disabled);c.click();await sl(10);o.push('casino rijen: '+[...document.querySelectorAll('#sheet-b .mrow')].map(r=>(r.querySelector('b')||r).textContent.trim()+(r.disabled?'*':'')).join(' | '));const rl=[...document.querySelectorAll('#sheet-b .mrow')].find(r=>/Roulette|Dobbelen|Poker/.test(r.textContent));rl.click();await sl(10);o.push('modal: '+document.querySelector('#modal').textContent.slice(0,120))}catch(e){o.push('E '+e.message)}closeModal();closeSheet();
  // hoe diep kan je saldo zakken? 30 jaar zonder inkomen met dure spullen
  S.money=-2e6;let m0=S.money;for(let i=0;i<5;i++){advance();Q=[]}o.push('saldo -2M na 5 jaar: '+Math.round(S.money)+' · log: '+S.log.slice(-40).filter(l=>/schuld|incasso|deurwaarder|beslag|faill/i.test(l.t)).map(l=>l.t.slice(0,80)).join(' / '));
  // geld is een kommagetal?
  o.push('saldo typ: '+S.money);
  return o.join('\n')});console.log(out);console.log('ERR',[...new Set(errs)].slice(0,8));await b.close()})();
