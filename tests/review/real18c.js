// Fase 18: speelt hele levens (willekeurige keuzes) en controleert elk jaar de nieuwe logregels tegen de toestand van dat moment.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');const N=+process.env.N||8,PAR=+process.env.PAR||4;
const CC=(process.env.CC||'NL,NL,NL,BE,UK,US,DE,NL').split(',');
async function one(b,i){const p=await b.newPage({viewport:{width:390,height:797}});
 await p.addInitScript(`(()=>{const k=6;const st=window.setTimeout;window.setTimeout=(f,ms,...a)=>st(f,(ms||0)/k,...a);try{localStorage.setItem('levensloop.hint','1');localStorage.setItem('levensloop.uitleg','1')}catch(e){}})();`);
 await p.goto(process.env.URL||'http://localhost:8767/');await p.addScriptTag({content:AUTO});
 const r=await p.evaluate(async(cc)=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));randomize();CF.country=cc;CF.city=COUNTRIES[cc].cities[0];startCreated();await sl(20);await AUTO(5000);
  const hits=[];let seen=S.log.length;const has=r=>S.rel.some(p=>p.role===r&&p.alive!==false);
  const R=[[/\bje baas\b|\bje collega|op je werk\b|je werkgever/i,s=>!s.job&&!s.wasJob,'werk zonder baan'],[/\bje partner\b|\bje (?:man|vrouw)\b(?! en )/i,s=>!s.partner&&!s.exP,'partner zonder partner'],
   [/\bje auto\b/i,s=>!s.car,'auto zonder auto'],[/\bje (?:moeder|vader)\b/i,s=>!s.parent,'ouder die er niet is'],[/\bje (?:zoon|dochter|kinderen)\b/i,s=>!s.kids,'kind zonder kinderen'],
   [/je bent zwanger|je zwangerschap/i,s=>s.g==='m','zwanger als man'],[/\bje klas\b|\bhuiswerk\b|je juf\b|je meester\b/i,s=>s.a>=25,'school op volwassen leeftijd'],
   [/\b(?:betaal|kost je|koop|kocht|gekocht)/i,s=>s.a<12&&s.m<0,'kind betaalt']];
  for(let y=0;y<95&&S.alive;y++){const st={a:ageY(),g:S.p.g,job:!!S.job,wasJob:(S.jobs||[]).length>0,partner:has('partner'),exP:S.rel.some(p=>p.role==='ex'),car:S.cars.length>0,parent:has('moeder')||has('vader'),kids:has('kind')};const m0=S.money;
   document.querySelector('#t-age').click();await sl(10);await AUTO(30000);let k=0;while(S.alive&&Q.length&&k++<20){document.querySelector('#t-age').click();await sl(10);await AUTO(30000)}
   const st2=Object.assign({},st,{job:st.job||!!S.job,partner:st.partner||has('partner'),car:st.car||S.cars.length>0,kids:st.kids||has('kind'),parent:st.parent||has('moeder')||has('vader'),m:S.money-m0});
   for(const l of S.log.slice(seen)){for(const [re,f,why] of R)if(re.test(l.t)&&f(st2))hits.push({cc,a:l.a,why,t:l.t.slice(0,200)})}seen=S.log.length}
  return {cc,age:ageY(),hits}},CC[i%CC.length]).catch(e=>({crash:String(e).slice(0,200),hits:[]}));await p.close();return r}
(async()=>{const b=await chromium.launch();const all=[];let i=0;
 await Promise.all([...Array(PAR)].map(async()=>{while(i<N){const k=i++;const r=await one(b,k);all.push(r);console.log(r.cc,'dood',r.age,'meldingen',r.hits.length,r.crash||'')}}));
 fs.writeFileSync(process.argv[2]||'real18c.json',JSON.stringify(all,null,1));await b.close()})();
