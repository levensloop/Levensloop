// Fase 18 realisme-check: haalt elke willekeurige gebeurtenis langs een reeks levenssituaties en meldt
// teksten die iets noemen wat er niet is, en kinderen die moeten betalen. Gebruik: URL=... node real18.js [uit.json]
const {chromium,devices}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['iPhone 13']});
await c.addInitScript(()=>{try{localStorage.setItem('levensloop.hint','1');localStorage.setItem('levensloop.uitleg','1')}catch(e){}});
const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.env.URL||'http://localhost:8767/');await p.waitForTimeout(500);
const res=await p.evaluate(async()=>{
 const SC=[
  {n:'peuter 3 (m)',a:3,g:'m'},{n:'kind 8 (v)',a:8,g:'v'},{n:'tiener 14 (m)',a:14,g:'m'},{n:'tiener 17 (v)',a:17,g:'v'},
  {n:'student 20 (v)',a:20,g:'v',study:1},{n:'werkloos 30 (m), alleen',a:30,g:'m'},{n:'werkend 38 (v), gezin, auto, huis',a:38,g:'v',job:1,partner:1,kids:1,car:1,house:1},
  {n:'werkend 45 (m), gezin',a:45,g:'m',job:1,partner:1,kids:1},{n:'pensioen 74 (v), weduwe',a:74,g:'v',retired:1,kids:1},{n:'alleen 45 (m), werkend',a:45,g:'m',job:1,car:1},{n:'alleen 52 (v), werkloos',a:52,g:'v'},{n:'pensioen 70 (m), alleen, geen kinderen',a:70,g:'m',retired:1},{n:'student 22 (m), auto',a:22,g:'m',study:1,car:1},{n:'gevangene 30 (m)',a:30,g:'m',jail:1}];
 const ROLES=['moeder','vader','opa','oma','broer','zus','partner','kind'];
 const out=[];
 for(const sc of SC){randomize();CF.country='NL';CF.city='Utrecht';CF.g=sc.g;startCreated();closeModal();Q.length=0;
  S.m=sc.a*12+3;S.money=sc.a<18?20:2000;
  // ouders van een 74-jarige zijn dood; broers/zussen laten we leven
  if(sc.a>=60)for(const p of S.rel)if(['moeder','vader','opa','oma'].includes(p.role))p.alive=false;
  if(sc.a>=40)for(const p of S.rel)if(['opa','oma'].includes(p.role))p.alive=false;
  if(sc.study){S.edu.stage='studie';S.edu.study={id:'rechten',ty:'wo',y:1,len:4}}
  else if(sc.a>=19){S.edu.stage='klaar'}else if(sc.a>=4){S.edu.stage=sc.a<12?'basis':'middel';if(sc.a>=12&&!S.edu.lvl){S.edu.lvl='havo';S.edu.len=5;S.edu.yrs=sc.a-12}}
  if(sc.job){try{const j=JOBS.find(j=>j.id==='accountant')||JOBS[0];hire(j)}catch(e){}}
  if(sc.partner){const pt=mkPerson('partner',sc.g==='m'?'v':'m',S.m-(sc.a+1)*12,{rel:70});S.rel.push(pt);pt.married=1;S.flags.getrouwd=1}
  if(sc.kids){for(let i=0;i<2;i++)S.rel.push(mkPerson('kind',i?'m':'v',S.m-(sc.a-28-i*3)*12,{rel:70}))}
  if(sc.retired){S.pension=20000;S.job=null}
  if(sc.car){S.lic=1;S.cars.push({id:uid(),kind:'autos',name:'Volkswagen Golf',value:15000,cond:90,yr:year()-3})}
  if(sc.house){try{const h=mkListing(3);const pr=buyHouse(h,false);S.home={k:'eigen',pid:pr.id}}catch(e){}}
  if(sc.jail){jail(48,'diefstal')}
  const has=r=>S.rel.some(p=>p.role===r&&p.alive!==false);
  const base=JSON.stringify(S);
  const state={job:!!S.job,partner:has('partner'),kids:has('kind'),car:S.cars.length>0,student:S.edu.stage==='studie',school:['basis','middel'].includes(S.edu.stage)};
  for(const id in EV){const e=EV[id];if(e.sys)continue;if(!!e.jail!==!!sc.jail)continue;const a=sc.a;if(e.a&&(a<e.a[0]||a>e.a[1]))continue;
   S=JSON.parse(base);Q.length=0;
   let ok=false;try{ok=!e.c||!!e.c()}catch(x){ok=false}if(!ok)continue;
   let ctx={};if(e.ctx){try{ctx=e.ctx()}catch(x){continue}if(!ctx)continue}if(e.need){let n=false;try{n=!!e.need(ctx)}catch(x){n=false}if(!n)continue}const base2=JSON.stringify(S);
   let txt='';try{txt=typeof e.x==='function'?e.x(ctx):(e.x||'')}catch(x){txt='[fout in tekst: '+x.message+']'}
   const T=(e.t||'')+' · '+txt;const flags=[];
   let chs=[];try{chs=typeof e.ch==='function'?e.ch(ctx):(e.ch||[])}catch(x){flags.push('fout in keuzes: '+x.message)}
   const results=[];
   for(const ch of chs){const lbl=Array.isArray(ch)?ch[0]:ch.t;const fn=Array.isArray(ch)?ch[1]:ch.on;if(typeof fn!=='function')continue;if(Array.isArray(ch)&&typeof ch[2]==='function'){let show=false;S=JSON.parse(base2);try{show=!!ch[2](ctx)}catch(x){}if(!show)continue}
     S=JSON.parse(base2);Q.length=0;const m0=S.money;let r='';
     try{r=fn(ctx);if(r&&typeof r==='object')r=r.t||(r.go?'[minigame]':'');}catch(x){if(String(x&&x.message||x).includes('NOMONEY')||x===NOMONEY)r='[geen geld]';else r='[fout: '+(x&&x.message||x)+']'}
     try{closeModal()}catch(x){}
     const dm=Math.round(S.money-m0);results.push({lbl,r:String(r||'').slice(0,220),dm})}
   if(e.f&&!chs.length){S=JSON.parse(base2);const m0=S.money;let r='';try{r=e.f(ctx)}catch(x){r='[fout: '+(x&&x.message||x)+']'}results.push({lbl:'(vanzelf)',r:String(r||'').slice(0,220),dm:Math.round(S.money-m0)})}
   const all=T+' '+results.map(r=>r.lbl+' '+r.r).join(' ');
   const chk=(cond,msg)=>{if(cond)flags.push(msg)};
   chk(!state.job&&/\bje baas\b|\bcollega|op je werk\b|je werkgever|je salaris/i.test(all),'noemt werk zonder baan');
   chk(!state.partner&&/\bje partner\b|\bje (?:man|vrouw|echtgeno\w+)\b/i.test(all),'noemt partner zonder partner');
   chk(!state.kids&&/\bje (?:kind|kinderen|zoon|dochter)\b/i.test(all),'noemt kinderen zonder kinderen');
   chk(!state.car&&/\bje auto\b/i.test(all),'noemt je auto zonder auto');
   chk(!state.school&&!state.student&&/\b(?:je klas|je juf|je meester|huiswerk|je school|je leraar|je mentor)\b/i.test(all),'noemt school terwijl je niet op school zit');
   for(const r of ['moeder','vader','opa','oma'])chk(!has(r)&&new RegExp('\\bje '+r+'\\b','i').test(all),'noemt je '+r+' die er niet (meer) is');
   chk(sc.g==='m'&&/je bent zwanger|je zwangerschap|je menstruatie|je ongesteld/i.test(all),'zwanger als man');
   chk(sc.a<12&&results.some(r=>r.dm<0),'kind betaalt ('+results.filter(r=>r.dm<0).map(r=>r.lbl+': '+r.dm).join(', ')+')');
   chk(sc.a>=12&&sc.a<18&&results.some(r=>r.dm<-100),'tiener betaalt veel ('+results.filter(r=>r.dm<-100).map(r=>r.lbl+': '+r.dm).join(', ')+')');
   chk(sc.a<16&&/\brijbewijs\b|je rijdt\b|achter het stuur/i.test(all),'rijden onder de 16');
   chk(results.some(r=>/^\[fout/.test(r.r)),'fout bij een keuze: '+results.filter(r=>/^\[fout/.test(r.r)).map(r=>r.r).join(' | '));
   chk(sc.a<12&&results.some(r=>r.r==='[geen geld]'),'kind loopt vast op geld');
   if(flags.length)out.push({sc:sc.n,id,t:e.t,flags,txt:txt.slice(0,200),res:results.map(r=>`${r.lbl} → ${r.r}${r.dm?' ['+r.dm+']':''}`)});
  }
 }
 return out});
const f=process.argv[2]||'real18.json';fs.writeFileSync(f,JSON.stringify(res,null,1));
const by={};for(const r of res)for(const fl of r.flags){const k=fl.replace(/\(.*\)/,'').trim();by[k]=(by[k]||0)+1}
console.log('meldingen:',res.length,JSON.stringify(by,null,0));console.log('paginafouten:',errs.slice(0,5));await b.close()})();
