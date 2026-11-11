/* ================= FINANCIËN ================= */
// losse aandelen en munten: [naam, icoon, gem. rendement, risico, dividend, emmer]
const HOLD={
  asml:['ASML','🔬',.12,.35,.01,'aandelen'],shell:['Shell','🛢️',.06,.22,.04,'aandelen'],heineken:['Heineken','🍺',.05,.18,.02,'aandelen'],philips:['Philips','💡',.03,.3,.025,'aandelen'],
  adyen:['Adyen','💳',.11,.45,0,'aandelen'],ahold:['Ahold Delhaize','🛒',.05,.15,.035,'aandelen'],apple:['Apple','🍎',.12,.28,.005,'aandelen'],microsoft:['Microsoft','🪟',.12,.25,.008,'aandelen'],
  nvidia:['Nvidia','🎮',.18,.55,0,'aandelen'],tesla:['Tesla','🔋',.1,.65,0,'aandelen'],amazon:['Amazon','📦',.11,.33,0,'aandelen'],cocacola:['Coca-Cola','🥤',.05,.14,.03,'aandelen'],
  btc:['Bitcoin','🟠',.2,.7,0,'crypto'],eth:['Ethereum','🔷',.18,.85,0,'crypto'],sol:['Solana','🟣',.16,1,0,'crypto'],doge:['Dogecoin','🐕',.08,1.3,0,'crypto'],
  mixA:['Aandelenmix','📈',.08,.3,0,'aandelen'],mixC:['Cryptomix','🪙',.14,.8,0,'crypto']};
const STK=id=>HOLD[id];
function stkSync(){S.stk=S.stk||{};S.invIn=S.invIn||{};for(const b of ['aandelen','crypto']){const ids=Object.keys(S.stk).filter(id=>HOLD[id]&&HOLD[id][5]===b);const sum=ids.reduce((x,id)=>x+S.stk[id].v,0),bv=S.inv[b]||0;
    if(sum<=0&&bv>=1){const id=b==='aandelen'?'mixA':'mixC';S.stk[id]={v:bv,in:S.invIn[b]??bv}}
    else if(sum>0&&Math.abs(sum-bv)>.5){const f=bv/sum;for(const id of ids)S.stk[id].v*=f}
    for(const id of ids)if(S.stk[id]&&S.stk[id].v<1)delete S.stk[id]}}
function stkPush(){for(const b of ['aandelen','crypto']){let v=0,i=0;for(const [id,h] of Object.entries(S.stk||{}))if(HOLD[id]&&HOLD[id][5]===b){v+=h.v;i+=h.in}S.inv[b]=Math.round(v);S.invIn=S.invIn||{};S.invIn[b]=Math.round(i)}}
// geld ergens in stoppen of eruit halen (bucket = spaar/index, of een aandeel/munt)
function invest(to,x){if(x<=0)return;S.invIn=S.invIn||{};if(INV[to]&&to!=='aandelen'&&to!=='crypto'){S.inv[to]+=x;S.invIn[to]=invIn(to)+x;return}stkSync();const h=S.stk[to]||(S.stk[to]={v:0,in:0});h.v+=x;h.in+=x;stkPush()}
function divest(from,x){if(INV[from]&&from!=='aandelen'&&from!=='crypto'){const v=S.inv[from];x=Math.min(x,v);const f=v>0?x/v:0;S.invIn[from]=Math.round(invIn(from)*(1-f));S.inv[from]-=x;return x}stkSync();const h=S.stk[from];if(!h)return 0;x=Math.min(x,h.v);h.in*=1-x/h.v;h.v-=x;if(h.v<1)delete S.stk[from];stkPush();return x}
const destName=to=>INV[to]&&to!=='aandelen'&&to!=='crypto'?INV[to][0]:HOLD[to]?HOLD[to][0]:'?';
// elk jaar: koersen
function stockYear(){stkSync();const reb=S.flags.rebound?1:0,mkt=(S.eco?S.eco.ret-.07+gauss()*.03:gauss()*.12+(econ()==='recessie'?-.1:econ()==='groei'?.04:0))+(reb?.2:0),cm=gauss()*.25+(reb?.3:0)+(S.eco?(S.eco.ret-.07)*1.5+((S.eco.sh&&S.eco.sh.crypto)||0):0);const tot={aandelen:[0,0],crypto:[0,0]};let div=0;
  for(const [id,h] of Object.entries(S.stk)){const H=HOLD[id];if(!H)continue;const c=H[5]==='crypto';const r=Math.max(-.9,H[2]+(c?cm:mkt)*.8+gauss()*H[3]*.75);const v0=h.v;h.v*=1+r;tot[H[5]][0]+=v0;tot[H[5]][1]+=h.v;if(H[4])div+=h.v*H[4];
    if(Math.abs(r)>=.35&&v0>=500&&!id.startsWith('mix'))L(`${H[0]}: ${r>0?'+':''}${Math.round(r*100)}% dit jaar.`,r>0?'good':'bad')}
  for(const b of ['aandelen','crypto']){const [a0,a1]=tot[b];if(a0>0&&Math.abs(a1-a0)>=250)L(`${b==='aandelen'?'Je aandelen':'Je crypto'}: ${a1>=a0?'+':''}${Math.round((a1/a0-1)*100)}% (${a1>=a0?'+':''}${fmt(a1-a0)}).`,a1>=a0?'good':'bad')}
  if(div>=1){cash(div);L(`Dividend ontvangen: ${fmt(div)}.`,'good')}
  stkPush();angelYear()}
// automatisch beleggen: elke maand een deel van wat je overhoudt
function autoInvest(net){const A=S.auto;if(!A||!A.pct||net<=0)return;const x=net*A.pct/100;S.money-=x;invest(A.to||'index',x);period.auto=(period.auto||0)+x}
// ---- startups ----
const SUPRE=['Nova','Blip','Kwik','Groen','Slim','Flux','Orbit','Puur','Zap','Hapi','Lumo','Trek'];
const SUSEC=[['🤖','AI-assistent voor huisartsen'],['🛵','bezorgapp voor boodschappen'],['🌱','vleesvervanger van zeewier'],['🔋','thuisbatterijen'],['🎮','mobiele game'],['🏠','app voor huurwoningen'],['💸','betaalapp voor studenten'],['🚲','deelfietsen'],['🧬','test voor zeldzame ziektes'],['🛰️','mini-satellieten'],['👕','tweedehands kleding'],['☕','koffieabonnement']];
function pitches(){const y=year();if(!S.pitch||S.pitch.y!==y){S.pitch={y,l:Array.from({length:3},()=>{const [em,w]=pick(SUSEC);const risk=pick(['laag','gemiddeld','hoog']);return {n:pick(SUPRE)+pick(['ly','io','a','r','hub','lab','go']),em,w,risk,val:Math.round(ri(5,200)*100000*(S.cpi||1))}})}}return S.pitch.l}
function angelYear(){for(const x of (S.angel||[])){if(x.st!=='actief')continue;x.yrs=(x.yrs||0)+1;const R0=R(),fr={laag:.08,gemiddeld:.14,hoog:.22}[x.risk]||.14;
    if(R0<fr){x.st='failliet';x.v=0;L(`${x.n} is failliet. Je investering van ${fmt(x.in)} is weg.`,'bad');continue}
    if(x.yrs>=3&&R0<fr+.06){const f=x.risk==='hoog'?(chance(.25)?ri(15,60):ri(2,8)):ri(2,5);const pay=Math.round(Math.max(x.v,x.in)*f*(.6+R()*.8));x.st='exit';x.v=0;cash(pay);L(`${x.n} wordt overgenomen! Jouw aandeel levert ${fmt(pay)} op (${Math.round(pay/x.in*10)/10}× je inleg).`,'good big');if(pay>=1e6)MS(`Verdiende ${fmt(pay)} met een investering in ${x.n}`,2);continue}
    x.v=Math.round(x.v*Math.max(.3,1+gauss()*({laag:.2,gemiddeld:.4,hoog:.7}[x.risk]||.4)+.1))}}
const angelVal=()=>(S.angel||[]).reduce((s,x)=>s+(x.st==='actief'?x.v:0),0);
// ---- bedrag kiezen: zelf intypen of snelknoppen ----
function amountModal(title,max,cb){max=Math.floor(max);const q=[.1,.25,.5].map(f=>Math.round(max*f/10)*10).filter(v=>v>0);
  modal({title,em:'💶',cat:curCat(),html:`<p class="muted" style="margin:0 0 6px">Maximaal ${fmt(max)}</p><div class="inrow"><input class="inp num" id="amt" type="number" inputmode="decimal" min="1" max="${max}" placeholder="Bedrag"></div>`,choices:opts([
    {t:'Bevestigen',cls:'go',on:()=>{const v=Math.floor(+($('#amt').value||0));if(!(v>0)){toast('Vul een bedrag in');return}if(v>max){toast(`Maximaal ${fmt(max)}`);return}closeModal();cb(v)}},
    ...q.map((v,i)=>({t:`${['10%','25%','50%'][i]} · ${fmt(v)}`,on:()=>{closeModal();cb(v)}})),
    {t:`Alles · ${fmt(max)}`,dis:max<=0,on:()=>{closeModal();cb(max)}}])});setTimeout(()=>{const i=$('#amt');if(i)i.focus()},60)}
// ---- het scherm ----
function sheetFinance(el){const a=ageY(),inv=Object.values(S.inv).reduce((x,y)=>x+y,0),inc=incomeParts().reduce((x,[,v])=>x+v,0);stkSync();stkPush();
  card(el,`<h3>💰 Financiën</h3>${kv([['Saldo',fmt(S.money)],['Inkomen per jaar',fmt(inc)],['Beleggingen',fmt(inv)],['Startups',fmt(angelVal())],['Schulden',fmt(S.debt+S.loan)],['Netto vermogen',`<b>${fmt(netWorth())}</b>`]])}`);
  const o=sec(el,'Overzicht');row(o,{ic:'🧾',t:'Inkomsten, uitgaven en vermogen',s:'Alles op een rij',dots:true,on:finPopup});
  if(typeof sheetWorld==='function'){const E_=ecoW();row(o,{ic:'🌍',t:'Wereld en economie',s:`${EPH[E_.ph].n} · rente ${E_.r.toLocaleString('nl-NL')}% · inflatie ${E_.inf.toLocaleString('nl-NL')}%`,on:()=>openSheet('Wereld en economie',sheetWorld,true)})}
  if(a<18){empty(el,'Beleggen en lenen kan vanaf 18 jaar.');return}
  const au=sec(el,'Automatisch beleggen');const A=S.auto||{pct:0,to:'index'};
  row(au,{ic:'🔁',t:A.pct?`${A.pct}% van wat je overhoudt → ${destName(A.to)}`:'Uit',s:A.pct?`Elke maand automatisch · dit jaar al ${fmt(period.auto||0)}`:'Laat elke maand een deel van je netto inkomsten automatisch beleggen',dots:true,on:autoMenu});
  const b=sec(el,'Sparen en fondsen');
  for(const k of ['spaar','index']){const [n,mu,sd]=INV[k];row(b,{ic:k==='spaar'?'🐷':'📊',t:n,s:k==='spaar'&&S.eco?`Rente nu ${Math.max(0,S.eco.r-.8).toLocaleString('nl-NL')}% · risico geen`:`${Math.round(mu*100)}% per jaar gemiddeld · risico ${sd<.01?'geen':'gemiddeld'}`,r:fmt(S.inv[k]),on:()=>holdMenu(k)})}
  const st=sec(el,'Aandelen');for(const [id,H] of Object.entries(HOLD).filter(([id,H])=>H[5]==='aandelen'&&(id!=='mixA'||S.stk.mixA))){const h=S.stk[id];row(st,{ic:H[1],t:H[0],s:h?`Ingelegd ${fmt(h.in)} · ${plTxt(h.v,h.in)}`:`Gem. ${Math.round(H[2]*100)}% per jaar · risico ${H[3]<.2?'laag':H[3]<.4?'gemiddeld':'hoog'}${H[4]?` · ${Math.round(H[4]*1000)/10}% dividend`:''}`,r:h?fmt(h.v):'',on:()=>holdMenu(id)})}
  const cr=sec(el,'Crypto');for(const [id,H] of Object.entries(HOLD).filter(([id,H])=>H[5]==='crypto'&&(id!=='mixC'||S.stk.mixC))){const h=S.stk[id];row(cr,{ic:H[1],t:H[0],s:h?`Ingelegd ${fmt(h.in)} · ${plTxt(h.v,h.in)}`:`Risico ${H[3]>1?'extreem':'zeer hoog'}`,r:h?fmt(h.v):'',on:()=>holdMenu(id)})}
  const su=sec(el,'Investeren in startups');
  for(const x of (S.angel||[]).filter(x=>x.st==='actief'))row(su,{ic:x.em,t:x.n,s:`Ingelegd ${fmt(x.in)} · ${plTxt(x.v,x.in)}`,r:fmt(x.v)});
  row(su,{ic:'🚀',t:'Startups zoeken geld',s:'Elk jaar nieuwe pitches · kies zelf je bedrag',on:()=>openSheet('Startups',sheetPitch,true)});
  if(S.biz.length){const bz=sec(el,'Je eigen bedrijven');for(const x of S.biz)row(bz,{ic:BIZEM[x.type],t:x.name,s:`In kas ${fmt(x.cash)} · tik om geld in te leggen of op te nemen`,on:()=>openSheet(x.name,el=>sheetBiz(el,x),true)})}
  const l=sec(el,'Lenen en aflossen');const cap_=Math.round(Math.max(0,salary()*.8+Math.max(0,netWorth())*.3-S.loan));
  row(l,{ic:'🏦',t:'Lening afsluiten',s:`6% rente · tot ${fmt(cap_)}`,dis:cap_<=500||inJail(),dots:true,on:()=>amountModal('Lenen',cap_,x=>doAct('Lening',()=>{S.loan+=x;cash(x);return `De bank leent je ${fmt(x)} tegen 6% rente.`},true,'🏦'))});
  if(S.loan>0)row(l,{ic:'✅',t:'Lening aflossen',s:`Nog ${fmt(S.loan)}`,dis:S.money<=0,dots:true,on:()=>amountModal('Lening aflossen',Math.min(S.money,S.loan),x=>doAct('Afgelost',()=>{cash(-x);S.loan-=x;return `${fmt(x)} afgelost.`},true,'✅'))});
  if(S.debt>0)row(l,{ic:'🎓',t:'Studieschuld aflossen',s:`Nog ${fmt(S.debt)}`,dis:S.money<=0,dots:true,on:()=>amountModal('Studieschuld aflossen',Math.min(S.money,S.debt),x=>doAct('Afgelost',()=>{cash(-x);S.debt-=x;return `${fmt(x)} studieschuld afgelost.`},true,'✅'))})}
function holdMenu(id){const isB=INV[id]&&id!=='aandelen'&&id!=='crypto';const H=isB?null:HOLD[id];const n=isB?INV[id][0]:H[0],em=isB?(id==='spaar'?'🐷':'📊'):H[1];const v=isB?S.inv[id]:(S.stk[id]?S.stk[id].v:0),inn=isB?invIn(id):(S.stk[id]?S.stk[id].in:0);
  modal({title:n,em,cat:'Beleggen',html:pkv([['Ingelegd',fmt(inn)],['Waarde nu',fmt(v)],...(v>0?plRow(v,inn):[]),...(H?[['Gemiddeld rendement',Math.round(H[2]*100)+'% per jaar'],['Schommelingen',H[3]<.2?'klein':H[3]<.4?'gemiddeld':H[3]<.8?'groot':'enorm'],...(H[4]?[['Dividend',`${Math.round(H[4]*1000)/10}% per jaar, uitbetaald`]]:[])]:[])]),choices:opts([
    {t:'Kopen / storten',cls:'go',dis:S.money<=0||id.startsWith('mix'),on:()=>{closeModal();amountModal(`${n} kopen`,S.money,x=>doAct('Belegd',()=>{cash(-x);invest(id,x);return `Je belegt ${fmt(x)} in ${n}.`},true,em))}},
    {t:'Verkopen / opnemen',dis:v<1,on:()=>{closeModal();amountModal(`${n} verkopen`,v,x=>doAct('Verkocht',()=>{const got=divest(id,x);cash(got);return `Je verkoopt voor ${fmt(got)} aan ${n}.`},true,em))}},
    ...(!id.startsWith('mix')?[{t:'Als bestemming voor automatisch beleggen',on:()=>{closeModal();S.auto=Object.assign({pct:10},S.auto||{},{to:id});if(!S.auto.pct)S.auto.pct=10;toast(`Automatisch beleggen gaat nu naar ${n}`);refreshSheet()}}]:[])])})}
function autoMenu(){const A=S.auto||{pct:0,to:'index'};
  modal({title:'Automatisch beleggen',em:'🔁',cat:'Financiën',html:`<p class="muted" style="margin:0 0 8px">Elke maand gaat dit deel van wat je overhoudt (inkomen min vaste lasten) automatisch naar je belegging. In maanden dat je niets overhoudt, gebeurt er niets.</p><label class="sl"><span>Percentage</span><b id="apv">${A.pct}%</b><input type="range" min="0" max="100" step="5" value="${A.pct}" id="apr"></label><p style="margin:10px 0 4px;font-weight:700">Naar: <span id="ato">${he(destName(A.to))}</span></p>`,
    choices:opts([{t:'Opslaan',cls:'go',on:()=>{S.auto={pct:+$('#apr').value,to:A.to};closeModal();toast(S.auto.pct?`${S.auto.pct}% gaat elke maand naar ${destName(S.auto.to)}`:'Automatisch beleggen staat uit');refreshSheet()}},
      {t:'Bestemming kiezen',on:()=>{const pct=+$('#apr').value;closeModal();modal({title:'Waar naartoe?',em:'🔁',cat:'Automatisch beleggen',choices:opts(['spaar','index',...Object.keys(HOLD).filter(k=>!k.startsWith('mix'))].map(k=>({t:destName(k),ic:k==='spaar'?'🐷':k==='index'?'📊':HOLD[k][1],on:()=>{S.auto={pct,to:k};closeModal();autoMenu()}})))})}}])});
  const r=$('#apr');if(r)r.oninput=()=>{$('#apv').textContent=r.value+'%'}}
function sheetPitch(el){const L_=pitches();card(el,`<span class="muted">Startups zijn een gok: veel gaan failliet, een paar worden enorm. Na een paar jaar kan een startup worden overgenomen, dan krijg je je deel uitbetaald.</span>`);const s=sec(el,`Pitches in ${year()}`);
  for(const p of L_)row(s,{ic:p.em,t:p.n,s:`${cap(p.w)} · waardering ${fmt(p.val)} · risico ${p.risk}`,dis:!!p.done,dots:true,on:()=>{const max=Math.min(S.money,p.val*.2);if(max<1000){toast('Je hebt minimaal '+fmt(1000)+' nodig');return}
    amountModal(`Investeren in ${p.n}`,max,x=>doAct('Startup',()=>{if(x<1000)return 'Het minimum is '+fmt(1000)+'.';cash(-x);p.done=1;(S.angel=S.angel||[]).push({id:uid(),n:p.n,em:p.em,w:p.w,risk:p.risk,in:x,v:x,st:'actief',yrs:0});return `Je investeert ${fmt(x)} in ${p.n} en krijgt ${Math.max(.01,Math.round(x/p.val*10000)/100)}% van de aandelen.`},true,'🚀'))}})}
