/* ================= FASE 8.8: PERSONAGE-EDITOR EN GOD-MODUS =================
   Editor: bij een nieuw leven kies je ook je familie (arm, gewoon of rijk, aantal broers en zussen,
   namen van je ouders) en je afkomst (gewoon, adel of koninklijk huis).
   God-modus (Menu → Spel): eigenschappen van jezelf en van anderen aanpassen. Staat standaard uit.
   Een leven waarin je hem gebruikt, krijgt S.god = 1 en een ✱ bij de prestaties. */
const GTRAITS=['Lief','Grappig','Ambitieus','Avontuurlijk','Verlegen','Jaloers','Lui','Chagrijnig'];
const TREM={Lief:'🥰',Grappig:'😂',Ambitieus:'🚀',Avontuurlijk:'🧗',Verlegen:'🙈',Jaloers:'😒',Lui:'🛋️',Chagrijnig:'😠'};
/* ---------- editor op het knoppenscherm ---------- */
const WEALN={'':'🎲 Willekeurig',arm:'🪙 Arm',midden:'🏠 Gewoon',rijk:'💰 Rijk'};
const AFKN={'':'Gewone familie',adel:'🎩 Adel',kon:'👑 Koninklijk huis'};
function afkTxt(c){if(c.afk==='kon'&&!royLand(c.country))return adelLand(c.country)?'🎩 Adel (geen koningshuis hier)':'Gewone familie (geen koningshuis hier)';if(c.afk==='adel'&&!adelLand(c.country))return 'Gewone familie (geen adel hier)';return AFKN[c.afk||'']}
function cFamily(){const c=CF;const N=NAMES[COUNTRIES[c.country].r];const mf=c.momN||'',df=c.dadN||'';
  const paint=()=>{openRaw(`<div class="mhead"><small>Nieuw leven</small><h3>👪 Familie</h3></div><div class="mbody">
    <div class="sl"><span>💶 Hoe rijk is je familie?</span></div><div class="seg" id="fw">${Object.entries(WEALN).map(([k,t])=>`<button data-v="${k}" aria-pressed="${(c.wealth||'')===k}">${t}</button>`).join('')}</div>
    <div class="sl" style="margin-top:10px"><span>👫 Broers en zussen</span></div><div class="seg" id="fs">${['🎲',0,1,2,3,4].map(v=>`<button data-v="${v}" aria-pressed="${String(c.sibs??'🎲')===String(v)}">${v}</button>`).join('')}</div>
    <label class="lab" for="fm" style="margin-top:10px">Voornaam van je moeder</label><input class="inp" id="fm" maxlength="24" placeholder="Willekeurig" value="${he(mf)}">
    <label class="lab" for="fd" style="margin-top:8px">Voornaam van je vader</label><input class="inp" id="fd" maxlength="24" placeholder="Willekeurig" value="${he(df)}">
    <div class="choices" style="margin-top:12px"><button class="btn go" id="fsave">Opslaan</button><button class="btn ghost" id="frand">🎲 Alles willekeurig</button></div></div>`);
    document.querySelectorAll('#fw button').forEach(b=>b.onclick=()=>{c.wealth=b.dataset.v;document.querySelectorAll('#fw button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
    document.querySelectorAll('#fs button').forEach(b=>b.onclick=()=>{c.sibs=b.dataset.v==='🎲'?null:+b.dataset.v;document.querySelectorAll('#fs button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
    $('#fsave').onclick=()=>{c.momN=$('#fm').value.trim()||null;c.dadN=$('#fd').value.trim()||null;done_()};
    $('#frand').onclick=()=>{c.wealth='';c.sibs=null;c.momN=null;c.dadN=null;paint()}};paint()}
function cAfk(){const c=CF;const kon=royLand(c.country),adel=adelLand(c.country);
  modal({title:'Afkomst',em:'👑',cat:'Nieuw leven',text:`In welke familie word je geboren?${!kon?` ${COUNTRIES[c.country].n} heeft geen koningshuis.`:''}${!adel?' Adel kan in dit land niet.':''}`,choices:[
    {t:'Gewone familie',cls:!c.afk?'go':'',on:()=>{c.afk='';done_()}},
    {t:'🎩 Adel',s:adel?'Een titel, een familiewapen en misschien een kasteel':'Kies een land met adel, zoals België, Duitsland of Frankrijk',dis:!adel,cls:c.afk==='adel'?'go':'',on:()=>{c.afk='adel';done_()}},
    {t:'👑 Koninklijk huis',s:kon?`Een verzonnen koningshuis in ${COUNTRIES[c.country].n}`:'Kan in Nederland, België, het Verenigd Koninkrijk en Spanje',dis:!kon,cls:c.afk==='kon'?'go':'',on:()=>{c.afk='kon';c.wealth='rijk';done_()}}]})}
// knoppen toevoegen aan het knoppenscherm, zonder de opbouw in create.js te herschrijven
renderCreate=(f=>function(){f();const c=CF;if(!c)return;const tl=(id,cls,val,lab)=>`<button class="cbtn ${cls}" data-k8="${id}"><b>${val}</b><small>${he(lab)}</small></button>`;
  const at=$('#cbody').querySelector('[data-k="ap"]');if(!at)return;at.insertAdjacentHTML('beforebegin',tl('fam','blue',`${WEALN[c.wealth||'']} gezin`,'Familie')+tl('afk','orange',afkTxt(c),'Afkomst'));
  $('#cbody').querySelectorAll('[data-k8]').forEach(b=>b.onclick=()=>{haptic(6);({fam:cFamily,afk:cAfk})[b.dataset.k8]()})})(renderCreate);
randomize=(f=>function(){f();const c=CF;c.wealth='';c.sibs=null;c.momN=null;c.dadN=null;c.afk=royLand(c.country)&&chance(.015)?'kon':adelLand(c.country)&&chance(.04)?'adel':'';renderCreate()})(randomize);
startCreated=function(){const c=CF;newLife({first:c.first||'Naamloos',last:c.last||'Onbekend',g:c.g,country:c.country,city:c.city,by:c.by,mode:c.mode,chaos:c.chaos,talent:c.talent,ap:c.ap,attr:c.attr,pref:c.pref,wealth:c.wealth||'',sibs:c.sibs,afk:c.afk||'',momN:c.momN,dadN:c.dadN});
  CF=null;saveLife();show('game');render();if(Q.length)processQ();else introOnce()};
F8.birth.unshift((o,mom,dad)=>{if(o.momN)mom.first=o.momN;if(o.dadN)dad.first=o.dadN});

/* ---------- God-modus ---------- */
const godOn=()=>!!(S&&S.settings&&S.settings.god);
function godMenuRow(s){row(s,{ic:'✨',t:'God-modus',s:godOn()?'Aan · pas jezelf en anderen aan (tik om uit te zetten)':'Uit (tik om aan te zetten)',dots:true,on:()=>{if(godOn()){S.settings.god=0;refreshSheet();saveLife();toast('God-modus staat uit');return}
    ask('God-modus aanzetten?','Met God-modus pas je je eigen eigenschappen en die van anderen aan. Een leven waarin je dat doet, krijgt een ✱ bij de prestaties.','Aanzetten',()=>{S.settings.god=1;refreshSheet();saveLife();toast('God-modus staat aan')},'go','✨')}});
  if(godOn())row(s,{ic:'🧬',t:'Jezelf aanpassen',s:'Eigenschappen, vaardigheden en geld',on:godSelf})}
function godSlider(title,em,cat,fields,save){const v={};for(const f of fields)v[f[0]]=f[3];
  openRaw(`<div class="mhead"><small>${he(cat)}</small><h3>${em} ${he(title)}</h3></div><div class="mbody"><p class="muted" style="margin:0 0 4px">✨ God-modus</p>${fields.map(([k,e,t,val,max])=>`<label class="sl"><span>${e} ${he(t)}</span><b id="gv-${k}">${val}${max?'':'%'}</b><input type="range" min="0" max="${max||100}" step="${max?Math.max(1,Math.round(max/200)):1}" value="${val}" data-k="${k}"></label>`).join('')}
    <div class="choices" style="margin-top:12px"><button class="btn go" id="gsave">Opslaan</button><button class="btn ghost" id="gcan">Annuleren</button></div></div>`);
  document.querySelectorAll('.sl input').forEach(r=>r.oninput=()=>{v[r.dataset.k]=+r.value;const f=fields.find(x=>x[0]===r.dataset.k);$('#gv-'+r.dataset.k).textContent=f[4]?fmt(+r.value):r.value+'%'});
  $('#gsave').onclick=()=>{closeModal();save(v);S.god=1;render();refreshSheet();saveLife()};$('#gcan').onclick=closeModal}
function godSelf(){const st=S.st;godSlider('Jezelf','🧬','Menu',[['happy','😀','Geluk',st.happy],['health','❤️','Gezondheid',st.health],['smarts','🧠','Slimheid',st.smarts],['looks','✨','Uiterlijk',st.looks],['karma','😇','Karma',S.karma],['disc','🎯','Discipline',S.disc??50],['fert','🧬','Vruchtbaarheid',S.fert??60],
  ...Object.keys(S.sk).map(k=>['sk_'+k,'⭐',SKN[k]||k,S.sk[k]])],v=>{for(const k of ['happy','health','smarts','looks'])S.st[k]=clamp(v[k]);S.karma=clamp(v.karma);S.disc=clamp(v.disc);S.fert=clamp(v.fert);for(const k of Object.keys(S.sk))S.sk[k]=clamp(v['sk_'+k]);L('✨ Je past jezelf aan met God-modus.','sys')})}
F8.person.push((el,p)=>{if(!godOn()||!p.alive)return;const s=sec(el,'✨ God-modus');const pet=p.role==='huisdier';
  if(!pet&&p.kt)card(el,`<span class="muted">Karakter: ${TREM[p.kt]||''} ${he(p.kt.toLowerCase())}</span>`);
  row(s,{ic:'🎚️',t:'Eigenschappen aanpassen',s:pet?'Relatie':'Relatie, slimheid, uiterlijk, geld',on:()=>godSlider(p.first,pet?petIcon(p):'🧑',cap(roleLabel(p)),pet?[['rel','❤️','Relatie',Math.round(p.rel)]]:[['rel','❤️','Relatie',Math.round(p.rel)],['smarts','🧠','Slimheid',Math.round(p.smarts)],['looks','✨','Uiterlijk',Math.round(p.looks)],['money','💶','Geld',Math.max(0,Math.round(p.money||0)),Math.max(1e6,Math.round((p.money||0)*2))]],
    v=>{p.rel=clamp(v.rel);if(!pet){p.smarts=clamp(v.smarts);p.looks=clamp(v.looks);p.money=Math.round(v.money)}L(`✨ Je past ${p.first} aan met God-modus.`,'sys')})});
  if(!pet)row(s,{ic:'🎭',t:'Karakter kiezen',s:p.kt?`${TREM[p.kt]} ${p.kt}`:'Nog geen bijzonder karakter',dots:true,on:()=>modal({title:'Karakter',em:'🎭',cat:p.first,text:`Wat voor iemand is ${p.first}?`,choices:opts(GTRAITS.map(t=>({t:`${TREM[t]} ${t}`,cls:p.kt===t?'go':'',on:()=>{p.kt=t;S.god=1;closeModal();L(`✨ ${p.first} is voortaan ${t.toLowerCase()}.`,'sys');refreshSheet();saveLife()}})))})});
  if(!pet&&['vriend','ex','vijand'].includes(p.role)&&!partner()&&ageY()>=16&&pAge(p)>=16)row(s,{ic:'💘',t:'Verliefd op je laten worden',on:()=>doAct('God-modus',()=>{S.god=1;p.role='partner';p.st='relatie';p.since=ageY();p.rel=Math.max(p.rel,85);MS(`Kreeg een relatie met ${p.first}`,1);return `${p.first} kijkt je ineens heel anders aan. Jullie hebben een relatie.`},true,'💘')});
  if(!pet&&p.role==='vijand')row(s,{ic:'🕊️',t:'Vrede sluiten',on:()=>doAct('God-modus',()=>{S.god=1;p.role='vriend';p.rel=70;return `${p.first} staat met een taart voor de deur. Jullie zijn vrienden.`},true,'🕊️')})});
// karakter doet ook echt iets
F8.year.push(()=>{for(const p of S.rel){if(!p.kt||!p.alive||p.born>S.m)continue;
  if(p.kt==='Lief')p.rel=clamp(p.rel+2);else if(p.kt==='Chagrijnig')p.rel=clamp(p.rel-2);else if(p.kt==='Grappig'&&p.rel>=60)hap(1);else if(p.kt==='Ambitieus')p.money=Math.round((p.money||0)*1.04+2000*(S.cpi||1));else if(p.kt==='Lui')p.money=Math.round((p.money||0)*.98);
  if(p.kt==='Jaloers'&&p.role==='partner'&&chance(.25)){p.rel=clamp(p.rel-6);hap(-2);L(`${p.first} is jaloers omdat je te lang met een collega praatte.`,'sys')}}});
if(typeof sheetAch==='function'){sheetAch=(f=>function(el){if(S.god)card(el,'<span class="muted">✱ In dit leven is God-modus gebruikt.</span>');f(el)})(sheetAch)}
