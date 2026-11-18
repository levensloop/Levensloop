// Fase 18: controleert elk jaar of de mensen om je heen kloppen (leeftijd vs. partner, baan, kinderen, pensioen, school).
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const AUTO=fs.readFileSync(path.join(__dirname,'..','auto.js'),'utf8');
(async()=>{const b=await chromium.launch();const all=[];
 await Promise.all(['NL','UK','NL','US'].map(async cc=>{const p=await b.newPage({viewport:{width:390,height:797}});
 await p.addInitScript(`(()=>{const k=6;const st=window.setTimeout;window.setTimeout=(f,ms,...a)=>st(f,(ms||0)/k,...a);try{localStorage.setItem('levensloop.hint','1');localStorage.setItem('levensloop.uitleg','1')}catch(e){}})();`);
 await p.goto(process.env.URL||'http://localhost:8767/');await p.addScriptTag({content:AUTO});
 const r=await p.evaluate(async(cc)=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));randomize();CF.country=cc;CF.city=COUNTRIES[cc].cities[0];S&&(S.settings.bigFam=1);startCreated();S.settings.bigFam=1;ensureBigFam&&ensureBigFam();await sl(20);await AUTO(5000);
  const hits={};const add=(k,t)=>{if(!hits[k])hits[k]=[];if(hits[k].length<4)hits[k].push(t)};
  for(let y=0;y<80&&S.alive;y++){document.querySelector('#t-age').click();await sl(10);await AUTO(30000);let k=0;while(S.alive&&Q.length&&k++<20){document.querySelector('#t-age').click();await sl(10);await AUTO(30000)}
   for(const q of S.rel){if(q.role==='huisdier'||q.alive===false)continue;const a=pAge(q);const L_=q.lf||{};const nm=`${q.first} (${q.role}, ${a})`;
    if(L_.ps&&L_.ps.st&&a<18)add('partner onder 18',nm+' '+L_.ps.st);
    if(q.job&&a<15&&!/oppas|krant/i.test(q.job))add('baan onder 15',nm+' '+q.job);
    if((L_.pens||q.pens)&&a<55)add('pensioen onder 55',nm);
    if(a>112)add('ouder dan 112',nm);
    if(['vader','moeder'].includes(q.role)&&a-ageY()<14)add('ouder te jong t.o.v. jou',nm+' jij '+ageY());
    if(q.role==='kind'&&ageY()-a<14)add('kind terwijl je zelf <14 was',nm+' jij '+ageY());
    if(q.role==='kleinkind'&&ageY()-a<28)add('kleinkind te vroeg',nm+' jij '+ageY());
    if(['opa','oma'].includes(q.role)&&a-ageY()<30)add('grootouder te jong',nm+' jij '+ageY());
    if((L_.nk||0)>0&&a<16)add('kinderen onder 16',nm);
    if(L_.ed==='wo'&&a<21&&L_.done)add('universiteit klaar onder 21',nm)}}
  return {cc,age:ageY(),hits}},cc);all.push(r);console.log(cc,'tot',r.age,JSON.stringify(r.hits).slice(0,600));await p.close()}));
 await b.close()})();
