// Kerncijfers uit een sim-uitvoer (sim.js). Gebruik: node stats.js pad/naar/passive.json [meer.json ...]
const fs=require('fs');const med=a=>{a=[...a].sort((x,y)=>x-y);return a.length?a[Math.floor(a.length/2)]:null};
for(const f of process.argv.slice(2)){const d=JSON.parse(fs.readFileSync(f,'utf8'));
  const ages=d.filter(l=>l.dead&&!l.dead.alive).map(l=>l.dead.age);const yrs=d.reduce((s,l)=>s+l.years.length,0);
  const pops=d.reduce((s,l)=>s+Object.values(l.ev).reduce((a,b)=>a+b,0),0);
  const at=(a,k)=>med(d.map(l=>(l.years.find(y=>y.a===a)||{})[k]).filter(v=>v!=null));
  const ev={};for(const l of d)for(const k in l.ev)ev[k]=(ev[k]||0)+l.ev[k];
  const errs={};for(const l of d)for(const e of l.errs||[])errs[e.m]=(errs[e.m]||0)+1;
  const kb=med(d.map(l=>(l.sizes[l.sizes.length-1]||{}).kb).filter(Boolean));
  console.log('\n== '+f+' · '+d.length+' levens, '+yrs+' jaren');
  console.log('sterfleeftijd: mediaan '+med(ages)+', onder 60: '+ages.filter(a=>a<60).length+'/'+ages.length+', min '+Math.min(...ages)+', max '+Math.max(...ages));
  console.log('gezondheid mediaan op 40/55/65: '+[40,55,65].map(a=>at(a,'he')).join(' / ')+' · geluk op 40/55/65: '+[40,55,65].map(a=>at(a,'hp')).join(' / '));
  console.log('gezondheid per leeftijd (mediaan) 20..80: '+[20,30,40,50,55,60,65,70,75,80].map(a=>a+':'+at(a,'he')).join(' ')+' · geluk: '+[20,30,40,50,55,60,65,70,75,80].map(a=>a+':'+at(a,'hp')).join(' '));
  {const c={};for(const l of d)if(l.dead&&!l.dead.alive){const k=(l.dead.cause||'?').replace(/^aan /,'');c[k]=(c[k]||0)+1}console.log('doodsoorzaken: '+Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>k+' '+v).join(' · '))}
  {const q=[...ages].sort((a,b)=>a-b);const p=f=>q[Math.floor(q.length*f)];console.log(`sterfleeftijd p10/p25/p50/p75/p90: ${p(.1)}/${p(.25)}/${p(.5)}/${p(.75)}/${p(.9)} · vóór 60: ${Math.round(ages.filter(a=>a<60).length/ages.length*100)}%`)}
  console.log('pop-ups per jaar: '+(pops/yrs).toFixed(1)+' · verschillende titels: '+Object.keys(ev).length);
  console.log('meest herhaald per leven: '+Object.entries(ev).sort((a,b)=>b[1]-a[1]).slice(0,15).map(([k,v])=>k+' '+(v/d.length).toFixed(1)).join(' · '));
  console.log('vastlopers: '+d.reduce((s,l)=>s+l.stuck.length,0)+' · negatieve-inzetmeldingen: '+d.reduce((s,l)=>s+(l.neg||[]).length,0)+' · opslag laatste meting (mediaan): '+kb+' KB');
  console.log('fouten: '+(Object.keys(errs).length?Object.entries(errs).map(([k,v])=>v+'× '+k).join(' | '):'geen'));}
