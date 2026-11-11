/* ================= OVERLIJDEN EN ERVEN: testament, erfbelasting, uitvaart, doodsscherm ================= */
// erfbelasting zoals in Nederland: [vrijstelling, tarief schijf 1, tarief daarboven]
const ERFT={partner:[723526,.1,.2],kind:[22918,.1,.2],kleinkind:[22918,.18,.36],overig:[2658,.3,.4],goed:[1e15,0,0]};
const ERFGRENS=152368;
const erfKind=p=>!p?'goed':p.role==='partner'&&(p.st==='getrouwd'||p.wid)?'partner':p.role==='kind'?'kind':p.role==='kleinkind'?'kleinkind':'overig';
function erfTax(amt,kind){if(typeof noTax==='function'&&noTax())return 0;const c=S.cpi||1;const [vr,t1,t2]=ERFT[kind]||ERFT.overig;const x=Math.max(0,amt-vr*c);const g=ERFGRENS*c;const m=law('erf');return Math.round((Math.min(x,g)*t1+Math.max(0,x-g)*t2)*m)}
const GOED=['KWF Kankerbestrijding','het Rode Kruis','de Dierenbescherming','Artsen zonder Grenzen','het Wereld Natuur Fonds','een kinderziekenhuis','de Voedselbank'];
function willInit(){if(!S.will)S.will={sh:{},goed:null,gp:0,voogd:null};return S.will}
// wie kan iets erven
const heirPool=()=>living(['partner','kind','kleinkind','moeder','vader','broer','zus','vriend']).filter(p=>p.role!=='partner'||p.st);
function defaultShares(){const pt=living('partner').find(p=>p.st==='getrouwd');const ks=living('kind').filter(k=>!k.disown);const o={};
  if(pt||ks.length){const n=(pt?1:0)+ks.length;if(pt)o[pt.id]=1/n;for(const k of ks)o[k.id]=1/n;return o}
  const par=living(['moeder','vader','broer','zus']);for(const p of par)o[p.id]=1/par.length;return o}
// de verdeling: [{id,p,naam,pct,bruto,tax,net,kind}]
function estatePlan(est){const W=willInit();if(est==null){const bz=S.biz.reduce((a,b)=>a+b.value*b.eq/100,0);est=Math.max(0,netWorth()-bz)}
  const custom=Object.keys(W.sh).some(id=>W.sh[id]>0)||W.gp>0;let sh={};
  if(custom){for(const [id,v] of Object.entries(W.sh)){const p=P(id);if(p&&p.alive&&v>0&&!p.disown)sh[id]=v}}else sh=defaultShares();
  // onterfde kinderen houden recht op hun legitieme portie: de helft van wat ze normaal zouden krijgen
  const out=[];const tot=Object.values(sh).reduce((a,b)=>a+b,0)+(W.gp||0);if(!tot)return out;
  for(const [id,v] of Object.entries(sh)){const p=P(id);const pct=v/tot;const bruto=Math.round(est*pct);const k=erfKind(p);const tax=erfTax(bruto,k);out.push({id,p,naam:p.first,pct,bruto,tax,net:bruto-tax,kind:k})}
  if(W.gp>0&&W.goed){const pct=W.gp/tot;const bruto=Math.round(est*pct);out.push({id:'goed',p:null,naam:W.goed,pct,bruto,tax:0,net:bruto,kind:'goed'})}
  return out.sort((a,b)=>b.pct-a.pct)}
const roleNm=p=>p?(p.role==='partner'?partnerWord(p):relWord(p)):'goed doel';

/* ---------- het testament ---------- */
function will(){openSheet('Testament',sheetWill,true)}
function sheetWill(el){const W=willInit();const plan=estatePlan();const est=plan.reduce((a,x)=>a+x.bruto,0);const custom=Object.keys(W.sh).some(id=>W.sh[id]>0)||W.gp>0;
  card(el,`<h3>📝 Je testament</h3><span class="muted">${custom?'Je hebt zelf bepaald wie wat krijgt.':'Je hebt nog niets geregeld, dus de wet bepaalt het: je partner en kinderen krijgen gelijke delen.'} Over wat iemand erft, betaalt die erfbelasting. Een goed doel betaalt niets.</span>${kv([['Je nalatenschap nu',fmt(est)],...plan.map(x=>[`${x.p?'':'💝 '}${he(x.naam)} · ${Math.round(x.pct*100)}%`,`${fmt(x.net)}<br><small class="muted">${x.tax?`na ${fmt(x.tax)} erfbelasting`:'geen erfbelasting'}</small>`])])}`);
  const s=sec(el,'Wie krijgt wat?');const hp=heirPool();if(!hp.length)empty(s,'Er is niemand om iets na te laten.');
  for(const p of hp){const v=W.sh[p.id]||0;row(s,{ic:faceOf(p),t:`${p.first} · ${roleNm(p)}`,s:p.disown?'Onterfd · houdt recht op de legitieme portie':custom?`${v} delen`:'Wettelijk erfdeel',dots:true,on:()=>shareModal(p)})}
  row(s,{ic:'💝',t:W.goed?`Goed doel: ${W.goed}`:'Een goed doel',s:W.gp?`${W.gp} delen · zonder erfbelasting`:'Laat iets na aan een goed doel',dots:true,on:goedModal});
  const ks=living('kind').filter(k=>pAge(k)<18);
  if(ks.length){const v=sec(el,'Voogd voor je minderjarige kinderen');const g=W.voogd&&P(W.voogd);const opts_=living(['moeder','vader','broer','zus','opa','oma','oom','tante','vriend']).filter(p=>pAge(p)>=21);
    row(v,{ic:g?faceOf(g):'🧑‍⚖️',t:g?`${g.first} (${roleNm(g)})`:'Nog niemand gekozen',s:'Wie zorgt er voor je kinderen als jij er niet meer bent?',dots:true,on:()=>modal({title:'Voogd kiezen',em:'🧑‍⚖️',cat:'Testament',choices:opts(opts_.map(p=>({t:`${p.first} · ${roleNm(p)}`,ic:faceOf(p),on:()=>{closeModal();W.voogd=p.id;toast(`${p.first} wordt de voogd`);refreshSheet();saveLife()}})))})})}
  const z=sec(el,'');row(z,{ic:'🔄',t:'Terug naar de wettelijke verdeling',dis:!custom,on:()=>{W.sh={};W.gp=0;refreshSheet();toast('Je testament is gewist')}})}
function shareModal(p){const W=willInit();const v=W.sh[p.id]||0;const cust=Object.keys(W.sh).some(id=>W.sh[id]>0)||W.gp>0;
  if(!cust){const d=defaultShares();for(const [id,x] of Object.entries(d))W.sh[id]=Math.round(x*12)}
  modal({title:p.first,em:faceOf(p),cat:'Testament',text:`Hoeveel delen krijgt ${p.first}? Iedereen krijgt naar verhouding: wie 2 delen heeft, krijgt twee keer zoveel als iemand met 1 deel.`,choices:opts([...[0,1,2,3,6,12].map(n=>({t:n?`${n} ${n===1?'deel':'delen'}`:'Niets',cls:(W.sh[p.id]||0)===n?'go':'',on:()=>{closeModal();notaris(()=>{W.sh[p.id]=n})}})),...(p.role==='kind'?[{t:p.disown?'🤝 Weer opnemen':'🚫 Onterven',s:p.disown?'':'Je kind krijgt dan alleen de legitieme portie, als het die opeist',on:()=>{closeModal();notaris(()=>{p.disown=!p.disown;if(p.disown){W.sh[p.id]=0;p.rel=clamp(p.rel-20)}})}}]:[])])})}
function goedModal(){const W=willInit();modal({title:'Goed doel',em:'💝',cat:'Testament',text:'Aan welk goed doel laat je iets na?',choices:opts(GOED.map(g=>({t:g,cls:W.goed===g?'go':'',on:()=>{closeModal();modal({title:g,em:'💝',cat:'Testament',text:'Hoeveel delen?',choices:opts([0,1,2,3,6,12].map(n=>({t:n?`${n} ${n===1?'deel':'delen'}`:'Niets',on:()=>{closeModal();notaris(()=>{W.goed=g;W.gp=n;if(n)kar(3)})}})))})}})))})}
function notaris(fn){const k=Math.round(750*(S.cpi||1));if(S.acts.notaris){fn();refreshSheet();saveLife();return}if(S.money<k){toast('Een notaris kost '+fmt(k));return}S.acts.notaris=1;cash(-k);fn();L(`Je laat je testament bij de notaris vastleggen (${fmt(k)}).`);refreshSheet();saveLife()}

/* ---------- uitvaart en afscheid ---------- */
const AFSCHEID=['moeder','vader','partner','kind','broer','zus','opa','oma','vriend'];
E('uv_afscheid',{sys:1,need:()=>S.alive,t:'Afscheid',x:c=>{const p=P(c.id);const org=c.org;return p?`De uitvaart van ${p.first}. ${org?'Jij regelt het afscheid.':'De familie heeft alles geregeld.'} ${inJail()?'Je zit vast, maar je mag een verlofaanvraag doen.':''}`:'De uitvaart.'},
 ch:[
  ['🕯️ Een sober afscheid regelen',c=>uvOrg(c,4000,0,'Een klein, intiem afscheid. Precies goed.'),c=>c.org&&!inJail()],
  ['💐 Een mooie uitvaart regelen',c=>uvOrg(c,9500,2,'Bloemen, mooie muziek en een volle aula. Een waardig afscheid.'),c=>c.org&&!inJail()],
  ['🎺 Een groots afscheid regelen',c=>uvOrg(c,26000,4,`Een koets met paarden, een orkest en honderden gasten. Iedereen heeft het er nog jaren over.`),c=>c.org&&!inJail()&&S.money>=20000],
  ['🎤 Een toespraak houden 🎮',c=>({go:()=>mgMemory('Je toespraak','Onthoud de volgorde van je herinneringen.',4,ok=>{const p=P(c.id);const t=ok?`Je vertelt over ${p?p.first:'hem'} zoals ${p&&p.g==='v'?'ze':'hij'} was. Er wordt gehuild en gelachen. Na afloop komt iedereen je bedanken.`:'Halverwege je toespraak breek je. Iemand slaat een arm om je heen. Het is goed zo.';if(ok){kar(2);hap(3);for(const x of living(['moeder','vader','broer','zus','kind','partner']))x.rel=clamp(x.rel+3)}else hap(1);uvCost(c);result('Afscheid',t,'',processQ,{cat:'Afscheid',em:'🎤'})})}),c=>!inJail()],
  ['🙏 Erbij zijn',c=>{uvCost(c);hap(2);return pick(['Je staat achterin en neemt in stilte afscheid.','Je legt een bloem neer. Je bent blij dat je er was.'])},c=>!inJail()],
  ['📝 Verlof aanvragen',c=>{if(chance(.6)){hap(3);return 'Je mag onder begeleiding naar de uitvaart. Even ben je er gewoon bij.'}hap(-5);return 'Je verlof wordt afgewezen. Je neemt afscheid in je cel.'},c=>inJail()],
  ['🚫 Niet gaan',c=>{for(const x of living(['moeder','vader','broer','zus','kind','partner']))x.rel=clamp(x.rel-8);hap(-3);return 'Je blijft weg. Het wordt je kwalijk genomen.'},c=>!inJail()]]});
function uvCost(c){if(c.org&&!c.paid){c.paid=1;const k=Math.round(4000*(S.cpi||1));cash(-k)}}
function uvOrg(c,k,h,t){c.paid=1;cash(-Math.round(k*(S.cpi||1)));hap(h);for(const x of living(['moeder','vader','broer','zus','kind']))x.rel=clamp(x.rel+Math.round(h/2));return t+` Kosten: ${fmt(Math.round(k*(S.cpi||1)))}.`}
function uvAfterDeath(p){if(!S.alive||ageY()<6||!AFSCHEID.includes(p.role))return;if(p.role==='vriend'&&p.rel<50)return;
  const org=ageY()>=18&&(p.role==='partner'||p.role==='kind'||((p.role==='moeder'||p.role==='vader')&&!living(['moeder','vader']).length));
  if(!Q.some(q=>q.id==='uv_afscheid'))Q.push({id:'uv_afscheid',c:{id:p.id,org}})}

/* ---------- na je dood: wie krijgt wat ---------- */
function legacyHtml(){const plan=estatePlan();if(!plan.length)return '';
  return `<div class="dsec"><p class="sec-l">Nalatenschap</p><div class="card" style="margin:0">${kv(plan.map(x=>[`${x.p?'':'💝 '}${he(x.naam)} · ${he(roleNm(x.p))}`,`${fmt(x.net)}<br><small class="muted">${Math.round(x.pct*100)}%${x.tax?` · ${fmt(x.tax)} erfbelasting`:''}</small>`]))}${S.biz.length?`<span class="muted">Je bedrijven gaan naar het kind met wie je verder speelt.</span>`:''}</div></div>`}
function timelineHtml(){const ms=(S.ms||[]).slice(-40);if(!ms.length)return '';
  return `<div class="dsec"><p class="sec-l">Tijdlijn</p><div class="tline">${ms.map(m=>`<div><b>${m.a}</b><span>${he(m.t)}</span></div>`).join('')}</div></div>`}
function numbersHtml(){const n=[['💼','Banen',(S.jobs||[]).length+(S.job?1:0)],['❤️','Partners',S.rel.filter(p=>['partner','ex'].includes(p.role)||p.wid).length],['👶','Kinderen',people('kind').length],['🧑‍🤝‍🧑','Vrienden',people('vriend').length],['🏠','Huizen',(S.props||[]).length+(S.re||[]).length],['🏢','Bedrijven',(S.biz||[]).length],['👥','Volgers',Math.round(S.foll||0).toLocaleString('nl-NL')],['⚖️','Veroordelingen',(S.crim&&S.crim.rec||[]).length]];
  return `<div class="dsec"><p class="sec-l">In cijfers</p><div class="nums">${n.map(([e,t,v])=>`<div><span>${e}</span><b>${v}</b><small>${t}</small></div>`).join('')}</div></div>`}
// ruzie over de erfenis in je nieuwe leven
E('er_ruzie',{sys:1,need:c=>!!P(c.id),t:'Ruzie om de erfenis',x:c=>{const p=P(c.id);return `${p.first} vindt de verdeling van de erfenis oneerlijk${c.dis?' en eist als onterfd kind de legitieme portie op':''}: ${fmt(c.a)}.`},ch:[
 ['🤝 Betalen en de vrede bewaren',c=>{const p=P(c.id);cash(-c.a);p.rel=clamp(p.rel+15);return `Je betaalt ${p.first} ${fmt(c.a)}. Het blijft even stil, maar jullie praten weer.`}],
 ['⚖️ Naar de rechter',c=>{const p=P(c.id);const k=Math.round(8000*(S.cpi||1));cash(-k);p.rel=clamp(p.rel-25);if(c.dis||chance(.5)){cash(-c.a);return `De rechter geeft ${p.first} gelijk. Je betaalt ${fmt(c.a)} plus ${fmt(k)} advocaatkosten.`}return `De rechter geeft jou gelijk. Je houdt alles, maar ${p.first} spreekt je niet meer.`}],
 ['🙅 Weigeren',c=>{const p=P(c.id);p.rel=5;p.role='vijand';hap(-6);return `${p.first} verbreekt het contact. De familie is gebroken.`}]]});
function inheritFeud(old,plan,cid,n){const ks=old.rel.filter(p=>p.role==='kind'&&p.alive&&p.id!==cid);if(!ks.length)return;const est=plan.reduce((a,x)=>a+x.bruto,0);const eq=est/((old.rel.some(p=>p.role==='partner'&&p.alive&&p.st==='getrouwd')?1:0)+ks.length+1);
  for(const k of ks){const got=(plan.find(x=>x.id===k.id)||{bruto:0}).bruto;if(got<eq*.5&&eq>20000){const sib=n.rel.find(x=>(x.role==='broer'||x.role==='zus')&&x.first===k.first);if(sib){Q.push({id:'er_ruzie',c:{id:sib.id,a:Math.round(Math.min(eq*.5-got,Math.max(0,S.money))),dis:!!k.disown}});break}}}}
Object.assign(EVMETA,{uv_afscheid:['Afscheid','🕯️'],er_ruzie:['Erfenis','⚖️']});
