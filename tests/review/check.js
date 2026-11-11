// Controleert simulatie-uitvoer op JS-fouten. Bekende fouten (tests/bekende-fouten.txt) tellen niet mee.
// Vastlopers en negatieve-inzetmeldingen worden gemeld maar maken de test niet rood (de autospeler heeft af en toe een time-out).
// Gebruik: node check.js passive.json monkey.json
const fs=require('fs'),path=require('path');
const KNOWN=(()=>{try{return fs.readFileSync(path.join(__dirname,'..','bekende-fouten.txt'),'utf8').split('\n').map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'))}catch(e){return[]}})();
let real={},known={},crash=[],stuck=0,neg=0,lives=0;
for(const f of process.argv.slice(2)){const d=JSON.parse(fs.readFileSync(f,'utf8'));
  for(const r of d){lives++;if(r.crash){crash.push(`${r.cc}: ${r.crash}`);continue}
    stuck+=(r.stuck||[]).length;neg+=(r.neg||[]).length;
    for(const e of r.errs||[]){const k=KNOWN.find(x=>e.m.includes(x));const key=e.m.slice(0,140);
      if(k)known[key]=(known[key]||0)+1;else{real[key]=real[key]||{n:0,cc:new Set(),s:e.s||''};real[key].n++;real[key].cc.add(r.cc)}}}}
const nReal=Object.values(real).reduce((a,x)=>a+x.n,0),nKnown=Object.values(known).reduce((a,x)=>a+x,0);
console.log(`   ${lives} levens · nieuwe JS-fouten: ${nReal} · bekende fouten: ${nKnown} · crashes van de simulatie: ${crash.length} · time-outs autospeler: ${stuck} · negatieve inzet: ${neg}`);
for(const [m,x] of Object.entries(real))console.log(`   ✗ ${x.n}× ${m}  [${[...x.cc].join(',')}]  ${x.s}`);
for(const [m,n] of Object.entries(known))console.log(`   · bekend ${n}× ${m}`);
for(const c of crash)console.log(`   ✗ ${c}`);
process.exit(nReal||crash.length?1:0);
