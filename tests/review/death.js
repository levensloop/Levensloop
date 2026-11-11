const { chromium } = require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:797}});const errs=[];p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));
 await p.goto('http://localhost:8765/');await p.addScriptTag({content:AUTO});const o=[];
 await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));try{localStorage.setItem('levensloop.hint','1')}catch(e){};const h=document.getElementById('pwa-hint');h&&h.remove();randomize();CF.country='NL';CF.first='Thijmen';CF.last='de Vries';CF.g='m';startCreated();await sl(30);await AUTO(8000);
   for(let i=0;i<44&&S.alive;i++){document.querySelector('#t-age').click();await sl(15);await AUTO(40000);let k=0;while(S.alive&&Q.length&&k++<20){document.querySelector('#t-age').click();await sl(15);await AUTO(40000)}}
   if(S.alive){if(!S.rel.some(x=>x.role==='kind')){const k=mkPerson('kind','v',S.m-20*12,{rel:80});k.role='kind';S.rel.push(k)}S.money=250000;die('een hartaanval');showDeath()}await sl(600)});
 o.push('scherm '+await p.evaluate(()=>curScreen+' modal:'+(document.querySelector('#modal').hidden?'-':document.querySelector('#modal').textContent.slice(0,200))));
 await p.screenshot({path:'shots/90-dood.png'});
 await p.evaluate(async()=>{await AUTO(3000);await new Promise(r=>setTimeout(r,800))});await p.screenshot({path:'shots/91-dood.png'});
 o.push('death: '+await p.evaluate(()=>document.querySelector('#death').textContent.slice(0,500)+' || knoppen: '+[...document.querySelectorAll('#death button')].map(x=>x.textContent.trim().slice(0,28)).join(' | ')));
 const names=await p.evaluate(()=>[...document.querySelectorAll('#death button')].map(x=>x.textContent.trim().slice(0,28)));
 let i=92;for(const nm of names.slice(0,6)){const ok=await p.evaluate(async(nm)=>{const b=[...document.querySelectorAll('#death button')].find(x=>x.textContent.trim().slice(0,28)===nm);if(!b)return false;b.click();await new Promise(r=>setTimeout(r,500));return true},nm);if(!ok)continue;await p.screenshot({path:`shots/${i++}-dood-${nm.replace(/[^a-z]/gi,'').slice(0,10)}.png`});
   o.push(nm+' -> '+await p.evaluate(()=>curScreen+' | '+(document.querySelector('#modal').hidden?document.querySelector('#death').textContent.slice(0,160):'MODAL '+document.querySelector('#modal').textContent.slice(0,260))));await p.evaluate(()=>{closeModal()});if(await p.evaluate(()=>curScreen)!=='death')break}
 console.log(o.join('\n'));console.log('ERR',errs.slice(0,6));await b.close()})();
