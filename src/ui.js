/* ================= UI ================= */
let afterModal=null, curScreen='start';
const $=s=>document.querySelector(s);
function show(name){curScreen=name;for(const s of ['start','create','game','death'])$('#scr-'+s).hidden=s!==name}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2200)}
const barCol=v=>v<25?'var(--bad)':v<50?'var(--warn)':v<75?'var(--mid)':'var(--good)';
const statCol=v=>v<20?'var(--bad)':v<45?'var(--mid)':'var(--good)';
const bar=(v,col)=>`<div class="bar"><i style="width:${clamp(v)}%;background:${col||barCol(v)}"></i></div>`;
const initials=p=>((p.first||'?')[0]+((p.last||'').split(' ').pop()[0]||'')).toUpperCase();
const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
const PETEM={hond:'🐕',kat:'🐈',konijn:'🐇',hamster:'🐹',papegaai:'🦜',paard:'🐴',schildpad:'🐢'};
function faceOf(p){if(p.alive===false)return'💀';if(p.role==='huisdier')return petIcon(p);if(typeof avatarSvg!=='function')return'🙂';return avatarSvg(apOf(p),p.born!=null?pAge(p):30,p.g==='x'?'m':p.g,{head:1})}
function faceEmoji(){const a=ageY(),g=S.p.g;if(!S.alive)return'💀';if(a<3)return'👶';if(a<13)return g==='v'?'👧':g==='m'?'👦':'🧒';if(a<60)return g==='v'?'👩':g==='m'?'👨':'🧑';return g==='v'?'👵':g==='m'?'👴':'🧓'}
function flag(code){const c=code==='UK'?'GB':code;return String.fromCodePoint(...[...c].map(ch=>127397+ch.charCodeAt(0)))}
const JOBEM={prosport:'🏆',krant:'📰',oppas:'🍼',vakken:'🛒',kassa:'🧾',afwas:'🍽️',bezorg:'🛵',bedien:'☕',schoon:'🧹',magazijn:'📦',call:'🎧',bouw:'🏗️',kok:'👨‍🍳',beveil:'🛡️',hotel:'🛎️',taxi:'🚕',vracht:'🚚',soldaat:'🪖',sales:'🤝',makelaar:'🏘️',verpleeg:'🩺',elektro:'⚡',monteur:'🔧',kapper:'💇',politie:'👮',leraar:'🧑‍🏫',marketing:'📣',accountant:'🧮',dev:'💻',designer:'🎨',journalist:'📰',hr:'🗂️',architect:'📐',ingenieur:'⚙️',advocaat:'⚖️',rechter:'👨‍⚖️',arts:'🩻',psycholoog:'🛋️',consultant:'📊',bankier:'🏦',wetensch:'🔬',politiek:'🏛️',muzikant:'🎸',acteur:'🎬',model:'📸',voetbal:'⚽',schrijver:'✍️'};
const jobEm=id=>JOBEM[id]||NJEM[id]||'💼';

/* ---------- hoofdscherm ---------- */
function subtitle(){const a=ageY();if(!S.alive)return'Overleden';if(inJail())return'Gevangene';
  if(S.edu.cur)return`Student ${S.edu.cur.ty==='phd'?'(promovendus)':S.edu.cur.ty}${S.job?' · '+jobTitle():''}`;
  {const P=S.pol;if(P&&P.lvl!=='lid'&&typeof polT==='function'){const t=polTitle(P);if(POLO[P.lvl].ft||!S.job)return t;return jobTitle()+' · '+polTl(P.lvl)}}
  if(S.mil)return milTitle()+(S.mil.st==='opl'?' · '+MBR[S.mil.br].school:' · '+MSPEC(S.mil.spec).n);
  if(S.job)return jobTitle()+(S.job.co?' · '+S.job.co:'');if(S.biz.length)return(S.biz[0].ceo===false?'Aandeelhouder · ':'Directeur-eigenaar · ')+S.biz[0].name;
  if(S.pension)return'Gepensioneerd';if(S.edu.stage==='basis')return'Basisschool';if(S.edu.stage==='middel')return`Middelbare school (${S.edu.lvl})`;
  if(a<4)return a<1?'Baby':'Peuter';return a<18?'Scholier':'Werkzoekend'}
function profInner(){return `<span class="who"><span class="face">${playerFace()}</span><span class="who-t"><span class="nm">${flag(S.p.country)} <span class="u">${he(S.p.first+' '+S.p.last)}</span></span><span class="sub">${he(subtitle())}</span></span></span><div class="money"><b${S.money<0?' style="color:var(--bad)"':''}>${fmt(S.money)}</b><small>Saldo</small></div>`}
function render(){
  if(!S)return;
  $('#h-av').innerHTML=playerFace();$('#h-flag').textContent=flag(S.p.country);$('#h-name').textContent=`${S.p.first} ${S.p.last}`;
  $('#h-sub').textContent=subtitle();
  if(S.energy==null)S.energy=energyMax();$('#h-year').textContent=`${S.settings.mode==='month'?MONTHS[monthIdx()]+' ':''}${year()}`;
  animMoney(S.money);$('#h-money').style.color=S.money<0?'var(--bad)':'';
  const h=S.st.happy;const rows=[['Geluk','happy',h>=75?'😄':h>=50?'🙂':h>=25?'😐':'😖'],['Gezondheid','health','❤️'],['Slimheid','smarts','💡'],['Uiterlijk','looks','🔥']];
  const vals={...S.st,fame:S.fame};if(S.fame>0)rows.push(['Roem','fame','⭐']);
  renderStats(rows,vals);
  $('#t-age-l').textContent=S.settings.mode==='month'?'Maand':'Leeftijd';
  {const sch=(S.edu.stage==='basis'||S.edu.stage==='middel'||!!S.edu.cur)&&!(S.job&&!S.job.part),tj=$('#t-job');tj.classList.toggle('school',sch);tj.lastChild.textContent=sch?'School':S.job&&S.job.id==='prosport'?'Sport':S.job||S.biz.length?'Werk':'Beroep'}
  $('#t-age').disabled=!S.alive;
  renderLog();
  if(!$('#sheet').hidden&&!sheetStack[0]?.dark)$('#sheet-prof').innerHTML=profInner();
}
let shownMoney=null,moneyFor=null,moneyRaf=0,logSeen={id:null,n:0};
const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();
function haptic(ms){try{navigator.vibrate&&navigator.vibrate(ms||8)}catch(e){}}
function animMoney(to){const el=$('#h-money');el.classList.toggle('long',Math.abs(to)>=1e6);if(moneyFor!==S.id){moneyFor=S.id;shownMoney=to;el.textContent=fmt(to);return}
  const from=shownMoney??to;shownMoney=to;cancelAnimationFrame(moneyRaf);if(RM||Math.abs(to-from)<1){el.textContent=fmt(to);return}
  const t0=performance.now(),d=650;const step=t=>{const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*e);if(k<1)moneyRaf=requestAnimationFrame(step)};moneyRaf=requestAnimationFrame(step)}
function renderStats(rows,vals){const el=$('#stats');const key=rows.map(r=>r[1]).join();
  if(el.dataset.k!==key){el.dataset.k=key;el.innerHTML=rows.map(()=>`<div class="srow"><span class="sl"></span><span class="se"></span><span class="sb"><i></i></span><span class="sv"></span></div>`).join('')}
  rows.forEach(([n,k,e],i)=>{const v=Math.round(vals[k]),r=el.children[i];r.querySelector('.sl').innerHTML=`${v<10?'<i>⚠</i>':''}${n}`;r.querySelector('.se').textContent=e;const b=r.querySelector('.sb i');b.style.width=v+'%';b.style.background=k==='fame'?'var(--mid)':statCol(v);r.querySelector('.sv').textContent=v+'%'})}
function renderLog(){
  const el=$('#log');let html='',cur=null;const lg=S.log;const start=Math.max(0,lg.length-700);
  const fresh=logSeen.id===S.id&&lg.length>logSeen.n?logSeen.n:lg.length;logSeen={id:S.id,n:lg.length};
  for(let i=start;i<lg.length;i++){const e=lg[i];if(e.a!==cur){if(cur!==null)html+='</div>';cur=e.a;html+=`<div class="agegrp"><div class="age-h"><b>Leeftijd: ${e.a} jaar</b><span>${e.y}</span></div>`}
    html+=`<p class="ln ${e.c}${i>=fresh?' new':''}"${i>=fresh?` style="animation-delay:${Math.min(8,i-fresh)*45}ms"`:''}>${e.mo!=null?`<span class="mo">${MONTHS[e.mo]}</span>`:''}${he(e.t)}</p>`}
  if(cur!==null)html+='</div>';el.innerHTML=html;el.scrollTop=el.scrollHeight}

/* ---------- pop-ups ---------- */
function openRaw(html,cls){const m=$('#mcard');m.className='mcard'+(cls?' '+cls:'');m.innerHTML=html;m.scrollTop=0;$('#modal').hidden=false}
function closeModal(){$('#modal').hidden=true;$('#mcard').innerHTML=''}
function modal(o){
  const pr=o.person,green=o.green||!!pr;const label=o.cat||o.sub||'';
  let h='';if(o.close)h+=`<button class="pclose" id="pclose" aria-label="Sluiten">✕</button>`;
  if(label||pr)h+=`<div class="band">${pr?`<span class="bface">${o.pface||faceOf(pr)}</span><span class="bname">${he(pr.first+' '+(pr.last||''))}</span>`:''}<i>${he(label)}</i></div>`;
  h+=`<h3 class="ptitle">${o.em?`<span>${o.em}</span>`:''}${he(o.title)}</h3><div class="pbody">`;
  if(o.text)h+=`<p>${he(o.text)}</p>`;if(o.html)h+=o.html;if(o.chips)h+=`<div class="chips">${o.chips}</div>`;
  h+=`<div class="choices" id="mch"></div>`;if(o.surprise)h+=`<button class="surprise" id="msur"><span>🎲</span>Verras me!</button>`;h+='</div>';
  openRaw(h,green?'green':'');
  const box=$('#mch'),live=[];
  for(const c of o.choices||[]){const b=document.createElement('button');b.className='btn'+(c.cls?' '+c.cls:'')+(c.s||c.ic?' sub':'');if(c.s||c.ic)b.innerHTML=`${c.ic?`<span class="cic">${c.ic}</span>`:''}<span class="ctx"><span>${he(c.t)}</span>${c.s?`<small>${he(c.s)}</small>`:''}</span>`;else b.textContent=c.t;if(c.dis)b.disabled=true;else if(c.cls!=='ghost')live.push(c);b.onclick=()=>c.on();box.appendChild(b)}
  if(o.surprise)$('#msur').onclick=()=>pick(live).on();
  if(o.close)$('#pclose').onclick=()=>{closeModal();o.onClose&&o.onClose()};
  if(o.after)o.after();
}
const snapSt=()=>({h:S.st.happy,he:S.st.health,sm:S.st.smarts,lk:S.st.looks,m:S.money});
function chipsFrom(b){const a=snapSt(),out=[];for(const [k,n] of [['h','Geluk'],['he','Gezondheid'],['sm','Slimheid'],['lk','Uiterlijk']]){const d=a[k]-b[k];if(d)out.push(`<span class="chip ${d>0?'up':'dn'}">${n} ${d>0?'+':''}${d}%</span>`)}
  const dm=a.m-b.m;if(Math.abs(dm)>=1)out.push(`<span class="chip ${dm>0?'up':'dn'}">${dm>0?'+':'-'}${fmt(Math.abs(dm))}</span>`);return out.join('')}
function result(title,text,chips,next,o={}){modal({title,text,chips,cat:o.cat,em:o.em,person:o.person,green:o.green,choices:[{t:'OK',cls:'go',on:()=>{closeModal();next&&next()}}]})}
let PREPAID=0;
const FREE=new Set(['Keuring','Herstel','Huurverhoging','Kortverhuur','Gekocht!','Gekocht','Verkocht','Afgelost','Lening','Garage','Verhuisd','Verhuur','Winst uitkeren','Geld inleggen','Personeel','Spaarrekening','Indexfonds','Losse aandelen','Crypto','Pensioen','Thuisblijven','Werkplaats','Marketing','Testament','Uitzendbureau','Plan','Sponsordeal']);
const ECOST={'Harder werken':2,'Harder studeren':2,'Harder leren':2,'Studentenleven':2,'Hard werken':2,'Tijd met iedereen':2,'Weekendje Ardennen':2,'Zon in Spanje':2,'Stedentrip New York':3,'Rondreis Japan':3,'Malediven':3,'Wereldreis van een jaar':6,'IVF':2,'Rechtszaak':2};
const eCost=t=>FREE.has(t)?0:(ECOST[t]??1);
function hasE(){return true}
function spendE(){return true}
const curCat=()=>sheetStack.length?sheetStack[sheetStack.length-1].title:'';
function doAct(title,fn,logIt=true,em){const cat=curCat();const pre=PREPAID;const cost=pre?0:eCost(title);PREPAID=0;if(!spendE(cost))return;const b=snapSt();let r;BUY=1;try{r=fn()}catch(e){BUY=0;if(e===NOMONEY){toast(S.money<=0?'Je hebt geen geld. Dit kun je niet betalen.':`Te duur: je hebt maar ${fmt(S.money)}.`);haptic(30);return}throw e}BUY=0;if(r==null)return;if(logIt&&r)L(r);const ch=chipsFrom(b);checkAch();result(title,r,ch,()=>{if(!S.alive){closeSheet();afterQ();return}refreshSheet();render();saveLife();if(afterModal){const f=afterModal;afterModal=null;f()}},{cat,em})}
function ask(title,text,yes,fn,cls,em){modal({title,text,em,cat:curCat(),choices:[{t:yes,cls:cls||'bad',on:()=>{closeModal();fn()}},{t:'Annuleren',cls:'ghost',on:closeModal}]})}

/* ---------- gebeurtenissen ---------- */
const EVMETA={g_jaloers:['Gevangenis','😠'],j_overplaats:['Gevangenis','🏢'],p_eerstedag:['Vrij','🌅'],p_oudemaat:['Misdaad','📞'],k_stapjes:['Baby','👣'],k_nachtmerrie:['Jeugd','👻'],k_logeren:['Familie','🍪'],k_ruzie_sib:['Familie','📺'],k_kinderfeest:['Jeugd','🎂'],k_zwemles:['Jeugd','🏊'],k_sint:['Jeugd','🎁'],k_zakgeld:['Jeugd','💶'],t_bijbaan:['Werk','🧹'],t_avondklok:['Familie','🌙'],t_vriendprobleem:['Vrienden','🫂'],t_eerstekus:['Liefde','💋'],s_tentamen:['Studie','📚'],s_kamer:['Studie','🏠'],w_zorg:['Werk','🏥'],w_horeca:['Werk','🍽️'],w_tech:['Werk','💻'],w_kantoor:['Werk','📊'],w_onderwijs:['Werk','🏫'],w_handwerk:['Werk','🏗️'],w_ziekcollega:['Werk','🤒'],w_rivaal:['Werk','🏁'],r_partnerjarig:['Liefde','🎂'],r_jubileum:['Liefde','💍'],r_schoonmoeder:['Familie','🍲'],r_verhuizen:['Vrienden','📦'],r_ouderziek:['Familie','🏥'],r_kinddiploma:['Familie','🎓'],r_kleinkinderen:['Familie','🧸'],b_kras:['Bezit','🚗'],b_schutting:['Bezit','🏡'],b_goeddoel:['Geld','💝'],b_incasso:['Geld','📬'],b_storm:['Bezit','🌊'],o_keuring:['Gezondheid','🚦'],o_vergeten:['Gezondheid','🔑'],l_koningsdag:['Nederland','👑'],l_fiets:['Nederland','🚲'],p_weggelopen:['Huisdier','🐾'],h_kans:['Hobby','🎨'],m_water:['Heldendaad','🌊'],m_reanimatie:['Heldendaad','❤️'],m_inbreker:['Heldendaad','🥷'],m_tasjesdief:['Heldendaad','👜'],m_brand:['Heldendaad','🔥'],m_kat:['Heldendaad','🐈'],m_overval:['Heldendaad','🔫'],ouderruzie:['Familie','😠'],verliefd:['Liefde','💘'],spieken:['School','📝'],spijbelen:['School','🏖️'],onlinedrama:['School','📱'],feestje:['Jeugd','🎉'],overwerk:['Werk','💼'],collegaflirt:['Werk','😍'],tip:['Werk','📈'],c_fiod:['Misdaad','🚔'],c_maffia:['Misdaad','🤵'],c_bende:['Misdaad','🏴'],h_hulp:['Gezondheid','🫂'],h_sigaret:['Gezondheid','🚬'],l_pil:['Uitgaan','💊'],f_scheiding:['Familie','💔'],f_betrapt:['Liefde','📱'],f_jaloers:['Liefde','😒'],f_kattenkwaad:['Kinderen','😈'],f_studie:['Kinderen','🎓'],f_voogdij:['Familie','⚖️'],a_ongeluk:['Bezit','💥'],a_diefstal:['Bezit','🚨'],c_papa:['Roem','📸'],c_roddel:['Roem','🗞️'],c_haat:['Social media','💬'],c_fans:['Roem','🏠'],c_stalker:['Roem','👁️'],c_hack:['Roem','📱'],c_afpers:['Roem','✉️'],c_gala:['Roem','🥂'],c_ambassadeur:['Roem','❤️'],c_deal:['Roem','✍️'],c_herkend:['Roem','⭐'],sp_dope:['Sport','💉'],pestkop:['School','😠'],kroeg:['Op straat','👊'],s_gezond:['Gezondheid','🩺'],s_zkh:['Ziekenhuis','🏥'],s_geluk:['Geluk','😔'],oom:['Familie','📜'],h_gebrek:['Wonen','🏚️'],h_laat:['Verhuur','💸'],h_klacht:['Verhuur','📞'],h_schade:['Verhuur','🔨'],h_koop:['Verhuur','🤝'],h_air:['Verhuur','🧳'],woordje:['Baby','👶'],bijten:['Opvang','😬'],waterpokken:['Gezondheid','🤒'],verdwaald:['Avontuur','🛒'],tand:['Jeugd','🦷'],pestkop:['School','😠'],huisdiervragen:['Familie','🐶'],spreekbeurt:['School','🎤'],sportclub:['Sport','⚽'],muziekles:['Muziek','🎹'],ouderruzie:['Familie','🗯️'],scheiding:['Familie','💔'],rekenwedstrijd:['School','🧮'],verliefd:['Liefde','💘'],feestje:['Vrije tijd','🎉'],spieken:['School','📝'],puistjes:['Uiterlijk','😖'],schoolreis:['School','🗼'],spijbelen:['School','🏖️'],onlinedrama:['Online','📱'],scout:['Sport','⚽'],modellen:['Carrière','📸'],talentenjacht:['Roem','🎤'],vereniging:['Studie','🍻'],huisgenoot:['Wonen','🍽️'],overwerk:['Werk','💼'],reorganisatie:['Werk','📉'],headhunter:['Werk','📞'],burnout:['Gezondheid','🔥'],collegaflirt:['Liefde','😍'],bekeuring:['Verkeer','📸'],ongeluk:['Verkeer','🚗'],lekkage:['Wonen','💧'],belasting:['Geld','✉️'],buren:['Wonen','🔊'],lenen:['Geld','💸'],terugbetaald:['Geld','💸'],bruiloft:['Feest','💒'],kinderwens:['Liefde','👶'],vreemdgaan:['Liefde','💔'],verrassing:['Liefde','🎁'],griep:['Gezondheid','🤧'],gevallen:['Gezondheid','🩹'],midlife:['Leven','🏎️'],kleinkind:['Familie','👶'],reunie:['Vrije tijd','🎓'],tip:['Geld','📈'],oplichter:['Geld','☎️'],dierziek:['Huisdier','🐾'],kindschool:['Familie','🏫'],kindgeld:['Familie','🏠'],mantelzorg:['Familie','🤝'],lastminute:['Vakantie','✈️'],vrijwilliger:['Goed doel','🤲'],portemonnee:['Karma','👛'],daklozen:['Karma','🥪'],investeerder:['Bedrijf','💼'],grotklant:['Bedrijf','🤝'],rechtszaakbiz:['Bedrijf','⚖️'],concurrent:['Bedrijf','🏪'],steelt:['Bedrijf','🕵️'],oom:['Bizar','📜'],viraal:['Bizar','🐦'],eendjes:['Bizar','🦆'],raket:['Bizar','🚀'],tijdreiziger:['Bizar','🛸'],ikea:['Bizar','🛋️'],quiz:['Bizar','📺'],schatkaart:['Bizar','🗺️'],duif:['Bizar','🕊️'],reality:['Bizar','🏝️'],bijen:['Bizar','🐝'],krant:['Bizar','📰'],burgemeester:['Bizar','🎖️'],meteoriet:['Bizar','☄️'],kraslot:['Bizar','🎟️'],dubbelganger:['Bizar','👯'],lottowin:['Geluk','💰'],s_18:['Volwassen','🎂'],s_klaar:['Diploma','🎓'],s_master:['Studie','🎓'],s_phd:['Studie','🔬'],s_pensioen:['Pensioen','🏖️'],s_bizcash:['Bedrijf','📉'],s_trial:['Rechtbank','⚖️'],s_baby:['Familie','👶'],s_arrest:['Politie','🚨'],s_caught:['Politie','🚔'],j_cel:['Gevangenis','🛏️'],j_bende:['Gevangenis','🦹'],j_yard:['Luchtplaats','🏋️'],j_inspectie:['Gevangenis','🔦'],j_smokkel:['Gevangenis','📱'],j_rel:['Gevangenis','🔥'],j_bezoek:['Bezoekuur','🤝'],j_eten:['Gevangenis','🤢'],j_plan:['Celgenoot','🕳️'],j_cursus:['Gevangenis','🎓'],j_brief:['Post','✉️'],sp_academy:['Sport','🔭'],sp_next:['Sport','🏆'],sp_draft:['Sport','✍️'],sp_offer:['Transfer','💰'],sp_cut:['Sport','📄'],sp_retire:['Sport','👋'],sp_injury:['Blessure','🤕'],eindexamen:['School','📝'],w_review:['Werk','🗣️'],w_conflict:['Werk','😤'],w_ziek:['Werk','🤒'],b_plan:['Bedrijf','📋'],crash:['Beurs','📉'],wasmachine:['Huishouden','🔧'],apk:['Auto','🚗'],tandarts:['Gezondheid','🦷'],huurverhoging:['Wonen','🏠'],inbraakthuis:['Wonen','🚨'],energie:['Huishouden','⚡'],s_weg:['Liefde','💔']};
function evMeta(id,c){const m=EVMETA[id]||['Gebeurtenis','📌'];const pr=c&&c.id?(typeof findAny==='function'?findAny(c.id):P(c.id)):null;return pr&&pr.role&&pr.alive?{cat:cap(pr.role==='partner'?partnerWord(pr):relWord(pr)),em:m[1],person:pr}:{cat:m[0],em:m[1]}}
function processQ(){
  if(!Q.length)return afterQ();
  const q=Q[0],e=EV[q.id],c=q.c||{};if(!e){Q.shift();return processQ()}
  if((e.need&&!safe(()=>e.need(c)))||(e.jail&&!inJail())){Q.shift();return processQ()}
  // de situatie kan veranderd zijn sinds de gebeurtenis in de wachtrij kwam (bijv. ontslagen): opnieuw controleren
  if(!e.sys&&e.c&&!safe(()=>e.c())){Q.shift();return processQ()}
  if(q.id==='s_baby')return babyModal(q);
  const txt=typeof e.x==='function'?safe(()=>e.x(c)):e.x;const meta=evMeta(q.id,c);
  if(e.f&&!e.ch){const b=snapSt();const r=safe(()=>e.f(c))||'';Q.shift();if(r&&!c.nolog)L(r);result(e.t,r,chipsFrom(b),processQ,meta);return}
  const chs=(e.ch||[]).filter(ch=>!ch[2]||safe(()=>ch[2](c)));const run=ch=>{const b=snapSt();const r=safe(()=>ch[1](c))||'';Q.shift();if(r&&r.go){closeModal();r.go();return}if(r)L(`${e.t.replace(/[?!.]$/,'')}: ${r}`);if(r)result(e.t,r,chipsFrom(b),processQ,meta);else{closeModal();processQ()}};
  modal({title:e.t,text:txt,...meta,surprise:chs.length>1,choices:chs.map(ch=>({t:ch[0],on:()=>run(ch)}))});
}
function afterQ(){render();saveLife();if(!S.alive){showDeath();return}if(afterModal){const f=afterModal;afterModal=null;f()}}
function onAge(){if(!S||!S.alive)return;if(Q.length){if($('#modal').hidden)processQ();return}PREPAID=0;haptic(12);closeSheet();advance();render();processQ()}
function babyModal(q){const k=P(q.c.id);const def=k.first;
  modal({title:q.c.adopt?'Adoptie':'Een baby!',em:'👶',cat:'Familie',text:q.c.adopt?`Je adopteert een ${k.g==='v'?'meisje':'jongen'} van ${pAge(k)} jaar. Hoe heet je kind?`:`${S.p.g==='v'?'Je bent bevallen van':partner()?partner().first+' is bevallen van':'Je hebt'} een ${k.g==='v'?'dochter':'zoon'}! Hoe noem je ${k.g==='v'?'haar':'hem'}?`,
    html:`<div class="inrow"><input class="inp" id="bname" maxlength="24" value="${he(def)}"><button class="btn ghost sm" id="brand" style="width:auto">🎲</button></div>`,
    choices:[{t:'Bevestigen',cls:'go',on:()=>{const v=$('#bname').value.trim()||def;k.first=v;Q.shift();L(q.c.adopt?`Je hebt ${v} geadopteerd.`:`Je ${relWord(k)} ${v} is geboren!`,'good big');MS(q.c.adopt?`Adopteerde ${v}`:`Kreeg een ${relWord(k)}: ${v}`,2);closeModal();processQ()}}],
    after:()=>{$('#brand').onclick=()=>{$('#bname').value=rname(k.g)}}})}

/* ---------- schermen ---------- */
const sheetStack=[];let sheetCloseT=0;
const XSVG='<svg viewBox="0 0 24 24"><path d="M5 2.9 12 9.9l7-7L21.1 5l-7 7 7 7-2.1 2.1-7-7-7 7L2.9 19l7-7-7-7z"/></svg>',BACKSVG='<svg viewBox="0 0 24 24"><path d="M15.4 3.6 7 12l8.4 8.4 1.7-1.7L10.4 12l6.7-6.7z"/></svg>';
function openSheet(title,build,push,opt){const sh=$('#sheet');clearTimeout(sheetCloseT);const wasOpen=!sh.hidden&&!sh.classList.contains('closing')&&sheetStack.length>0;sh.classList.remove('closing');
  if(!push)sheetStack.length=0;sheetStack.push({title,build,dark:!!(opt&&opt.dark)});drawSheet(true,wasOpen?(push?'push':''):'up')}
function drawSheet(top,anim){const t=sheetStack[sheetStack.length-1];if(!t)return closeSheet();const dark=!!sheetStack[0].dark;const sh=$('#sheet');
  sh.hidden=false;$('#sheet-t').textContent=t.title;$('#sheet-bar').className='ptbar gut'+(dark?' dark':'');
  const x=$('#sheet-x');if(sheetStack.length>1){x.className='backlink';x.setAttribute('aria-label','Terug');x.innerHTML=BACKSVG+`<span>${he(sheetStack[sheetStack.length-2].title)}</span>`}else{x.className='xbtn';x.setAttribute('aria-label','Sluiten');x.innerHTML=XSVG}
  const pf=$('#sheet-prof');pf.hidden=dark;if(!dark)pf.innerHTML=profInner();$('#sheet-en').textContent='';
  const b=$('#sheet-b');const sc=b.scrollTop;b.innerHTML='';t.build(b);b.scrollTop=top?0:sc;
  if(anim==='push'||anim==='pop'){b.classList.remove('nav-push','nav-pop');void b.offsetWidth;b.classList.add('nav-'+anim)}
  if(anim==='up'){const pi=$('#sheet .panel-in');pi.style.transform='';pi.classList.remove('rise');void pi.offsetWidth;pi.classList.add('rise')}}
function refreshSheet(){if(!$('#sheet').hidden&&sheetStack.length&&!$('#sheet').classList.contains('closing'))drawSheet(false)}
function backSheet(){haptic(5);sheetStack.pop();sheetStack.length?drawSheet(true,'pop'):closeSheet()}
function closeSheet(){sheetStack.length=0;const sh=$('#sheet');if(sh.hidden)return;if(RM){sh.hidden=true;return}sh.classList.add('closing');clearTimeout(sheetCloseT);sheetCloseT=setTimeout(()=>{sh.hidden=true;sh.classList.remove('closing');$('#sheet .panel-in').style.transform=''},280)}
function initSwipe(){const pi=$('#sheet .panel-in');let y0=null,dy=0,t0=0;
  const start=e=>{if(e.target.closest('.pscroll'))return;y0=e.touches[0].clientY;dy=0;t0=Date.now();pi.classList.add('dragging')};
  const move=e=>{if(y0==null)return;dy=Math.max(0,e.touches[0].clientY-y0);pi.style.transform=`translateY(${dy}px)`};
  const end=()=>{if(y0==null)return;y0=null;pi.classList.remove('dragging');const v=dy/Math.max(1,Date.now()-t0);if(dy>120||(dy>40&&v>.6)){haptic(6);closeSheet()}else pi.style.transform=''};
  pi.addEventListener('touchstart',start,{passive:true});pi.addEventListener('touchmove',move,{passive:true});pi.addEventListener('touchend',end);pi.addEventListener('touchcancel',end)}
function closeSheetLevel(){if(sheetStack.length>1)sheetStack.pop()}
function sec(el,label){const d=document.createElement('div');if(label){const h=document.createElement('div');h.className='shead';h.textContent=label;d.appendChild(h)}el.appendChild(d);return d}
function row(el,o){const b=document.createElement('button');b.className='mrow'+(o.cls?' '+o.cls:'');if(o.dis)b.disabled=true;
  const sub=o.bar?`<small class="rbar">${he(o.bar.l)} <span class="minibar"><i style="width:${clamp(o.bar.v)}%;background:${o.bar.c||'var(--good)'}"></i></span></small>`:o.s?`<small>${he(o.s)}</small>`:'';
  b.innerHTML=`<span class="mic">${o.ic||'•'}</span><span class="mtx"><b>${he(o.t)}${o.role?` <em>(${he(o.role)})</em>`:''}</b>${sub}</span>${o.r!=null?`<span class="rt">${o.r}</span>`:''}${o.on&&!o.dis?(o.dots?'<span class="mdots">•••</span>':'<span class="mchev"></span>'):''}`;
  if(o.on&&!o.dis)b.onclick=o.on;el.appendChild(b);return b}
function foot(el,ic,t,on,dis){const b=document.createElement('button');b.className='mfoot';b.innerHTML=`<span>${ic}</span>${he(t)}`;if(dis)b.disabled=true;else b.onclick=on;el.appendChild(b)}
function card(el,html){const d=document.createElement('div');d.className='card';d.innerHTML=html;el.appendChild(d);return d}
function empty(el,t){const p=document.createElement('p');p.className='empty';p.textContent=t;el.appendChild(p)}
const kv=pairs=>`<dl class="kv">${pairs.map(([k,v])=>`<dt>${he(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
const pkv=pairs=>`<dl class="pkv">${pairs.map(([k,v])=>`<dt>${he(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
const usedUp=k=>(S.acts[k]||0)>=6;
// zoals BitLife: alleen de eerste 3 keer per jaar heeft effect (beetje, meer, beetje)
function use(k){S.acts[k]=(S.acts[k]||0)+1;const n=S.acts[k];return n===1?.6:n===2?1:n===3?.5:0}
const once=k=>{if(S.acts[k])return false;S.acts[k]=1;return true};
const opts=(list,cancel=true)=>list.concat(cancel?[{t:'Annuleren',cls:'ghost',on:closeModal}]:[]);

/* ================= BEROEP ================= */
function eduSub(){const E=S.edu;if(E.cur)return cap(E.cur.name);if(E.stage==='basis')return'Basisschool';if(E.stage==='middel')return`Middelbare school (${E.lvl})`;return ageY()<4?'Vanaf 4 jaar':'Ga (weer) naar school'}
function sheetJob(el){
  const a=ageY();if(typeof polMigrate==='function')polMigrate();if(typeof milMigrate==='function')milMigrate();
  if(a<4){card(el,`<h3>👶 Nog even geduld</h3><p class="muted" style="margin:0">Je bent nog te klein voor school of werk. Vanaf 4 jaar ga je naar de basisschool, en later kies je zelf een opleiding en een baan.</p>`);return}
  if(inJail()){card(el,`<h3>Je zit vast</h3><p class="muted" style="margin:0">Nog ${S.crim.jail.left} maanden te gaan. Werken en studeren kan pas weer na je vrijlating. Kijk bij Activiteiten wat je in de gevangenis kunt doen.</p>`);return}
  // bovenaan: waar je nu mee bezig bent (zoals BitLife)
  const top=sec(el,'');let any=0;const E=S.edu;
  if(E.stage==='basis'||E.stage==='middel'){any=1;row(top,{ic:'🏫',t:eduSub(),s:`Gemiddeld cijfer ${nl1(gradeAvg())}`,cls:'cur',on:()=>openSheet(eduSub(),sheetSchool,true)})}
  if(E.cur){any=1;const c=E.cur;row(top,{ic:'🎓',t:cap(c.name),s:`Jaar ${c.y+1} van ${c.len} · voortgang ${Math.round(c.perf)}%`,cls:'cur',on:()=>openSheet('Opleiding',sheetEdu,true)})}
  if(S.job){any=1;row(top,{ic:jobEm(S.job.id),t:jobTitle(),s:`${S.job.co?S.job.co+' · ':''}${fmt(salary())} per jaar`,cls:'cur',on:()=>openSheet(jobTitle(),sheetMyJob,true)})}
  for(const b of S.biz){any=1;row(top,{ic:BIZEM[b.type],t:b.name,s:`${BIZ[b.type].t} · eigen bedrijf`,cls:'cur',on:()=>openSheet(b.name,el=>sheetBiz(el,b),true)})}
  if(S.sport&&!['gestopt'].includes(S.sport.st)&&!(S.job&&S.job.id==='prosport')){any=1;row(top,{ic:SPORTS[S.sport.id].em,t:SPORTS[S.sport.id].n,s:stageLabel(),cls:'cur',on:()=>openSheet('Sport',sheetSport,true)})}
  if(typeof occMe==='function'&&occMe()&&a>=12){any=1;row(top,{ic:'🕯️',t:'Bezetting',s:S.occ&&S.occ.ond?'Je bent ondergedoken':'Verzet, onderduiken of meewerken',cls:'cur',on:()=>openSheet('Bezetting',sheetOcc,true)})}
  if(S.mil){any=1;row(top,{ic:MSPEC(S.mil.spec).em,t:milTitle(),s:`${MBR[S.mil.br].k} · ${fmt(milSal())} per jaar`,cls:'cur',on:()=>openSheet('Defensie',sheetMil,true)})}
  if(S.pol){polMigrate();any=1;const p=PTY(S.pol.party);row(top,{ic:'🏛️',t:polT(S.pol.lvl),s:`${p.n}${POLO[S.pol.lvl].sal?' · '+fmt(polSal())+' per jaar':''}`,cls:'cur',on:()=>openSheet('Politiek',sheetPol,true)})}
  if(S.pension&&!S.job){any=1;row(top,{ic:'🏖️',t:'Met pensioen',s:`${fmt(S.pension)} per jaar`,cls:'cur'})}
  if(!any&&a<4){empty(el,'Je bent nog te jong voor school of werk.');return}
  // daaronder: de mogelijkheden
  const s=sec(el,any?'':'');
  if(a>=18)row(s,{ic:'💼',t:'Banen',s:'Fulltime vacatures',on:()=>openSheet('Banen',el=>sheetOpenings(el,'full'),true)});
  if(a>=12)row(s,{ic:'🕐',t:'Bijbanen',s:'Parttime vacatures',on:()=>openSheet('Bijbanen',el=>sheetOpenings(el,'part'),true)});
  if(a>=8)row(s,{ic:'🧢',t:'Freelance',s:'Losse klusjes voor snel geld',on:()=>openSheet('Freelance',sheetGigs,true)});
  if(a>=5)row(s,{ic:'⭐',t:'Speciale carrières',s:'Sport, ondernemen, roem en politiek',cls:'special',on:()=>openSheet('Speciale carrières',sheetSpecial,true)});
  if(a>=17)row(s,{ic:'🪖',t:'Defensie',s:S.mil?milTitle():'Landmacht, Marine, Luchtmacht of Marechaussee',on:()=>openSheet('Defensie',sheetMil,true)});
  if(a>=16&&!E.cur&&E.stage!=='basis'&&E.stage!=='middel')row(s,{ic:'🎓',t:'Opleiding',s:'Mbo, hbo, universiteit of avondschool',on:()=>openSheet('Opleiding',sheetEdu,true)});
  if(a>=18)row(s,{ic:'📞',t:'Uitzendbureau',s:S.acts.rec?'Belt je volgend jaar weer':'Laat een recruiter iets voor je zoeken',dis:!!S.acts.rec,dots:true,on:recruiter});
}
function sheetSpecial(el){const a=ageY();const s=sec(el,'');
  row(s,{ic:'🏆',t:'Sportcarrière',s:a<5?'Vanaf 5 jaar':S.sport&&S.sport.st!=='gestopt'?`${SPORTS[S.sport.id].em} ${SPORTS[S.sport.id].n} · ${stageLabel()}`:'Van amateurclub tot prof',dis:a<5,on:()=>openSheet('Sport',sheetSport,true)});
  row(s,{ic:'🏢',t:'Ondernemer',s:a<16?'Vanaf 16 jaar':S.biz.length?`${S.biz.length} ${S.biz.length>1?'bedrijven':'bedrijf'}`:'Start je eigen bedrijf',dis:a<16,on:()=>openSheet('Ondernemen',sheetBizList,true)});
  row(s,{ic:'🥋',t:'Vechtsportschool',s:a<6?'Vanaf 6 jaar':fightSub(),dis:a<6,on:()=>openSheet('Vechtsport',sheetFight,true)});
  row(s,{ic:'🏛️',t:'Politiek',s:a<12?'Vanaf 12 jaar':S.pol?`${polT(S.pol.lvl)} · ${PTY(S.pol.party).n}`:'Word lid van een partij',dis:a<12,cls:'special',on:()=>openSheet('Politiek',sheetPol,true)});
  const SPN={muzikant:'Muzikant',acteur:'Acteur',model:'Model',politiek:'Politicus'};
  for(const j of JOBS.filter(j=>!j.hide&&j.id!=='voetbal'&&(j.fame||j.pol))){const min=j.req.age[0];
    row(s,{ic:jobEm(j.id),t:SPN[j.id]||cap(j.lad[0]),s:a<min?`Vanaf ${min} jaar`:S.job&&S.job.id===j.id?'Dit doe je nu':`Begin als ${j.lad[0].toLowerCase()} · ${fmt(jsal(j,0))} per jaar`,dis:a<min||(S.job&&S.job.id===j.id),cls:'special',on:()=>applyJob(j)})}}
function sheetEdu(el){const a=ageY(),E=S.edu;
  if(E.stage==='basis'||E.stage==='middel'){sheetSchool(el);return}
  if(E.cur){const c=E.cur;
    card(el,`<h3>${he(cap(c.name))}</h3><span class="muted">Jaar ${c.y+1} van ${c.len} · ${{lening:'studielening',ouders:'betaald door je ouders',zelf:'zelf betaald',beurs:'met beurs'}[c.fund]}</span><div class="stat"><span>Studievoortgang</span><span></span><span class="v">${Math.round(c.perf)}%</span>${bar(c.perf)}</div>`);circRow(el,'school');
    if(typeof studyRows==='function')studyRows(el,c);
    const s=sec(el,'Leren');
    row(s,{ic:'📚',t:'Harder leren',s:'Naar de bieb in plaats van de kroeg',on:()=>doAct('Harder leren',()=>{const m=use('studie');c.perf=clamp(c.perf+7*m);sma(1*m);return pickF('studie',['Je haalt al je deadlines.','Je zit elke avond in de bieb. Het werkt.','Je samenvattingen worden legendarisch onder je studiegenoten.','Je haalt je achterstand in.','Je docent noemt je opdracht een voorbeeld voor de groep.'])},true,'📚')});
    row(s,{ic:'📝',t:'Tentamen oefenen',s:'Minigame',on:()=>mgExam(sc=>doAct('Tentamen',()=>{c.perf=clamp(c.perf+(sc-.5)*22);sma(Math.round(sc*3));return sc>=.5?'Voldoende! Weer studiepunten binnen.':'Onvoldoende. Herkansing in juli.'},true,'📝'))});
    row(s,{ic:'🍻',t:'Studentenleven',s:'Feesten, borrels, nieuwe mensen',on:()=>doAct('Studentenleven',()=>{use('feest');hap(5);c.perf=clamp(c.perf-4);sk('sociaal',2);if(chance(.3))addFriend();return 'Wat een avond. Je college van 9 uur mis je.'},true,'🍻')});
    row(s,{ic:'🚪',t:'Stoppen met je studie',dots:true,on:()=>ask('Stoppen?','Je stopt met je opleiding. Je studieschuld blijft staan.','Stoppen',()=>{L(`Je bent gestopt met ${c.name}.`,'bad');MS(`Stopte met ${c.name}`,0);E.cur=null;refreshSheet();render()})});
    return}
  if(a<16){empty(el,'Je bent nog te jong om een opleiding te kiezen.');return}
  const s=sec(el,'Opleiding kiezen');const hasMid=E.deg.some(d=>['vmbo','havo','vwo'].includes(d.ty));
  row(s,{ic:'🏫',t:'Mbo, hbo of universiteit',s:'Kies een studie',on:()=>openStudy(true)});
  if(!hasMid&&a>=18)row(s,{ic:'🌙',t:'Avondschool',s:'In 2 jaar alsnog je havo-diploma',dots:true,on:()=>{E.cur={ty:'havo',f:'',y:0,len:2,fee:900,fund:'zelf',perf:55,name:'avondschool (havo)'};L('Je begint aan de avondschool.');refreshSheet();render();saveLife()}});
  const d=sec(el,'Diploma\'s');if(!E.deg.length)empty(d,'Nog geen diploma\'s.');for(const x of E.deg)row(d,{ic:'📜',t:cap(`${ENAME[x.ty]||x.ty}${x.f?' '+STUDIES.find(y=>y.id===x.f).t:''}`)});
}
function clubPick(){const o=[['🎸','Schoolband','muziek'],['⚽','Sportteam','sport'],['🗣️','Debatclub','sociaal'],['🍳','Kookclub','koken'],['💻','Programmeerclub','tech'],['🎭','Toneelclub','kunst'],['💼','Ondernemersclub','zaken']];
  modal({title:'Naschoolse club',em:'🎭',cat:'School',text:'Welke club kies je dit jaar?',choices:opts(o.map(([e,n,k])=>({t:`${e} ${n}`,dis:!!S.acts.club,on:()=>{closeModal();doAct(n,()=>{S.acts.club=1;sk(k,ri(5,10));hap(2);if(chance(.3))addFriend();return `Je doet mee met de ${n.toLowerCase()}. ${SKN[k]} gaat vooruit.`},true,e)}})))})}
function sheetMyJob(el){if(!S.job){empty(el,'Je hebt geen baan.');return}if(S.job.id==='prosport'){sheetSport(el);return}const j=JOB(S.job.id),a=ageY();
  card(el,`<h3>${he(jobTitle())}</h3><span class="muted">${S.job.co?he(S.job.co)+' · ':''}${S.job.yrs} jaar in dienst</span>${kv([['Salaris',fmt(salary())+' per jaar'],['Niveau',`${S.job.lvl+1} van ${j.lad.length}`]])}<div class="stat"><span>Prestaties</span><span></span><span class="v">${Math.round(S.job.perf)}%</span>${bar(S.job.perf)}</div>`);
  circRow(el,'work');
  const s=sec(el,'Acties');
  row(s,{ic:jobEm(S.job.id),t:'Werkdag',s:'Minigame · los situaties op je werk op',dots:true,on:workDay});
  {const [e,t,d]=SIG[jobGroup(S.job.id)];row(s,{ic:e,t,s:d,dots:true,on:sigAction})}
  row(s,{ic:'💪',t:'Harder werken',s:'Je baas ziet het',on:()=>doAct('Harder werken',()=>{const m=use('werk');(S.job&&(S.job.perf=clamp(S.job.perf+7*m)));return 'Je blijft elke dag wat langer.'},true,'💪')});
  row(s,{ic:'💶',t:'Opslag vragen',dis:!!S.acts.opslag,dots:true,on:()=>doAct('Opslag vragen',()=>{S.acts.opslag=1;if(chance(S.job.perf/130)){const p=ri(4,10);S.job.mult*=1+p/100;hap(5);return `Je krijgt ${p}% opslag!`}(S.job&&(S.job.perf=clamp(S.job.perf-4)));hap(-1);return 'Je leidinggevende zegt nee.'},true,'💶')});
  if(S.job.lvl<j.lad.length-1)row(s,{ic:'📈',t:'Promotie vragen',s:`Presentatie voor ${j.lad[S.job.lvl+1].toLowerCase()} · minigame`,dis:!!S.acts.promo,dots:true,on:()=>mgMemory('Presentatie voor je baas','Onthoud de volgorde van je presentatie en geef hem foutloos.',4+Math.min(3,S.job.lvl),(ok,fr)=>doAct('Promotie vragen',()=>{S.acts.promo=1;const base=S.job.lyrs>=1?(S.job.perf-40)/100:-.2;if(chance(clamp(base+(ok?.35:fr*.15-.1),0,.9))){const fl=promoTxt(S.job.id);promote();return `${fl} Je bent nu ${jobTitle().toLowerCase()}!`}(S.job&&(S.job.perf=clamp(S.job.perf+(ok?3:-4))));const r=ok?'Sterke presentatie, maar er is nu geen plek. Volgend jaar maak je meer kans.':'Je raakt de draad kwijt. Geen promotie dit jaar.';L(`Promotie gevraagd: ${r}`);return r},false,'📈'))});
  row(s,{ic:'🍻',t:'Borrelen met collega\'s',on:()=>doAct('Borrel',()=>{const m=use('borrel');hap(3*m);(S.job&&(S.job.perf=clamp(S.job.perf+2*m)));sk('sociaal',2*m);return 'Gezellig. Je leert je collega\'s beter kennen.'},true,'🍻')});
  if(a>=60)row(s,{ic:'🏖️',t:'Met pensioen gaan',dots:true,on:()=>ask('Met pensioen?','Je stopt met werken en krijgt pensioen.','Met pensioen',()=>doAct('Pensioen',()=>{retire();return `Je ontvangt voortaan ${fmt(S.pension)} per jaar.`},true,'🏖️'),'go')});
  row(s,{ic:'🚪',t:'Ontslag nemen',dots:true,on:()=>ask('Ontslag nemen?',`Je stopt als ${jobTitle().toLowerCase()}.`,'Ontslag nemen',()=>{L(`Je hebt ontslag genomen als ${jobTitle().toLowerCase()}.`);endJob();backSheet();render();saveLife()})});
}
const GIGS=[['📰','Folders rondbrengen',8,25],['🧽','Auto\'s wassen',10,40],['🌱','Gras maaien',10,45],['🐕','Honden uitlaten',10,40],['🍼','Oppassen',13,60],['📦','Pakketjes sorteren',16,120],['🪛','Kasten in elkaar zetten',16,110],['📚','Bijles geven',16,160,()=>S.st.smarts>=60,'Slimheid 60+'],['💻','Een website bouwen',16,700,()=>S.sk.tech>=40,'Techniek 40+'],['🎸','Optreden op een bruiloft',16,400,()=>S.sk.muziek>=45,'Muziek 45+']];
function sheetGigs(el){const a=ageY();const s=sec(el,'Beschikbare klusjes');
  GIGS.forEach(([e,t,min,pay,c,req],i)=>{const ok=a>=min&&(!c||c());row(s,{ic:e,t,s:a<min?`Vanaf ${min} jaar`:!ok?`Vereist: ${req}`:`Ongeveer ${fmt(pay)}`,dis:!ok,dots:true,on:()=>doAct(t,()=>{const m=use('gig'+i);if(m<.2)return 'Er is dit jaar geen werk meer te vinden.';const g=Math.round(pay*(.7+R()*.6)*m);cash(g);hap(1);if(e==='💻')sk('tech',2);if(e==='🎸')sk('muziek',2);return `Je verdient ${fmt(g)}.`},true,e)})})}
function recruiter(){if(S.acts.rec){toast('Het uitzendbureau belt je volgend jaar weer');return}S.acts.rec=1;
  const list=JOBS.filter(j=>!j.part&&!j.fame&&!j.pol&&!jobReqs(j).length&&(!S.job||j.id!==S.job.id));
  if(!list.length){modal({title:'Uitzendbureau',em:'📞',cat:'Beroep',text:'De recruiter heeft niets voor je. Haal eerst een diploma of bouw ervaring op.',choices:[{t:'OK',cls:'go',on:closeModal}]});return}
  const mine=list.filter(inMySector);const j=mine.length&&chance(.7)?pick(mine):pick(list),co=company(),st=startFor(j),lvl=st?st.lvl:0;
  modal({title:'Uitzendbureau',em:jobEm(j.id),cat:'Beroep',text:`De recruiter heeft een vacature${inMySector(j)?' in jouw vakgebied':''}: ${j.lad[lvl].toLowerCase()} bij ${co}, voor ${fmt(jsal(j,lvl))} per jaar.${st&&lvl>0?` Je start op dat niveau dankzij ${st.why}.`:''}${S.job?' Je stopt dan met je huidige baan.':''}`,choices:opts([{t:'Ik doe het',on:()=>{closeModal();doAct('Uitzendbureau',()=>{if(chance(.8)){if(S.job)endJob();setJob(j.id,lvl,co);hap(5);return `Aangenomen! Je begint als ${j.lad[lvl].toLowerCase()}.`}return 'Op het laatste moment kiezen ze toch iemand anders.'},false,'📞')}}],true)})}
function foldSec(el,label,n,build,openNow){const s=sec(el,'');const box=document.createElement('div');let open=!!openNow;box.hidden=!open;
  const r=row(s,{ic:open?'▾':'▸',t:`${label} (${n})`,s:open?'Tik om te verbergen':'Tik om te tonen',on:()=>{open=!open;box.hidden=!open;r.querySelector('.mic').textContent=open?'▾':'▸';r.querySelector('small').textContent=open?'Tik om te verbergen':'Tik om te tonen'}});s.appendChild(box);build(box)}
// vacatures van dit jaar: elk jaar een andere selectie, zoals in BitLife
function vacList(kind){const y=year();if(!S.vac||S.vac.y!==y)S.vac={y,co:{}};
  const f=j=>kind==='part'?j.part:kind==='mil'?j.id==='soldaat':(!j.part&&!j.fame&&!j.pol&&j.id!=='soldaat');
  if(!S.vac[kind])S.vac[kind]=JOBS.filter(j=>!j.hide&&j.id!=='voetbal'&&j.id!=='prosport'&&f(j)).filter(j=>kind==='mil'||chance(inMySector(j)&&!jobReqs(j).length?.9:.6)).map(j=>j.id);
  return S.vac[kind].map(JOB).filter(j=>j&&!(S.job&&S.job.id===j.id))}
const vacCo=j=>j.fame||j.pol?'':((S.vac||(S.vac={y:year(),co:{}})).co[j.id]=S.vac.co[j.id]||company());
function sheetOpenings(el,kind){const a=ageY();
  const list=vacList(kind).map(j=>{const st=startFor(j),l=st?st.lvl:0;return {j,l,t:j.lad[l]}}).sort((p,q)=>p.t.localeCompare(q.t,'nl'));
  const s=sec(el,kind==='part'?'Bijbanen dit jaar':kind==='mil'?'Defensie':'Vacatures dit jaar');
  if(!list.length)empty(s,'Er zijn dit jaar geen vacatures. Kijk volgend jaar weer.');
  for(const x of list)row(s,{ic:jobEm(x.j.id),t:x.t,s:`${fmt(jsal(x.j,x.l))} per jaar${inMySector(x.j)?' · jouw vak':''}`,on:()=>applyJob(x.j)})}
const ELVL=['','basisschool','middelbare school','havo','mbo','hbo','universiteit','master','promotie'];
function eduNeed(j){const r=j.req;if(j.np&&j.via&&j.via.length)return cap(pathNeed(j));if(r.f)return 'Diploma '+r.f.map(f=>STUDIES.find(s=>s.id===f).t).join(' of ');if(r.e>=2)return 'Diploma '+ELVL[r.e];return 'Geen'}
function applyJob(j){const co=vacCo(j);const st=startFor(j),lvl=st?st.lvl:0,t=j.lad[lvl],miss=jobReqs(j);
  const rows=[['Functie',t],...(co?[['Bedrijf',co]]:[]),['Salaris',fmt(jsal(j,lvl))+' per jaar'],['Opleiding',eduNeed(j)],['Werktijd',j.part?'Parttime':'Fulltime']];
  const note=miss.length?`<p class="jmiss">Je mist: ${he(miss.join(', '))}</p>`:`<p class="jok">${degSec(j)?'Dit is jouw vakgebied: grotere kans om aangenomen te worden.':'Je voldoet aan de eisen.'}${st&&lvl>0?` Je start als ${he(t.toLowerCase())} dankzij ${he(st.why)}.`:''}${overQ(j)?' Let op: met jouw opleiding vinden ze je misschien overgekwalificeerd.':''}</p>`;
  modal({title:t,em:jobEm(j.id),cat:co||'Vacature',html:kv(rows)+note+(S.job&&!j.part?`<p class="muted" style="margin:6px 0 0">Je stopt dan als ${he(jobTitle().toLowerCase())}.</p>`:''),choices:opts([
    {t:'Solliciteren',cls:'go',on:()=>{closeModal();if(miss.length){doAct('Sollicitatie',()=>{hap(-1);return `${co||'Ze'} ${co?'wijst':'wijzen'} je af. Je mist: ${miss.join(', ')}.`},false,jobEm(j.id));return}mgInterview(t,sc=>hire(j,(sc-.5)*.6,co),j.sec)}}])})}
function promoTxt(id){const g=typeof jobGroup==='function'?jobGroup(id):'';if(['soldaat','politie','beveil'].includes(id))return 'Je commandant ziet je inzet.';if(id==='voetbal'||id==='prosport'||id==='sport')return 'Je speelt het seizoen van je leven.';
  return {zorg:'Je supervisor is onder de indruk.',horeca:'De chef ziet wat je kunt.',tech:'Jouw oplossing redt het project.',kantoor:'Je presentatie maakt indruk op de directie.',onderwijs:'De schoolleiding is onder de indruk van je lessen.',fame:'Je grote doorbraak is daar.',politiek:'Je partij schuift je naar voren.'}[g]||'Je vakmanschap valt op.'}
function hire(j,bonus,co){const st=startFor(j),lvl=st?st.lvl:0;doAct('Sollicitatie',()=>{if(chance(hireChance(j,bonus))){if(S.job)endJob();setJob(j.id,lvl,co);if(S.vac&&S.vac.full)S.vac.full=S.vac.full.filter(x=>x!==j.id);hap(6);return `Aangenomen! Je bent nu ${j.lad[lvl].toLowerCase()}.`}hap(-1);return overQ(j)&&chance(.6)?'Ze vinden je overgekwalificeerd. "Je verveelt je hier binnen een maand."':'Helaas, ze hebben voor iemand anders gekozen.'},false,jobEm(j.id))}
function openStudy(push){openSheet('Studie kiezen',el=>{
  for(const ty of ['mbo','hbo','wo']){if(!canEnter(ty))continue;const s=sec(el,{mbo:'Mbo · 3 jaar',hbo:'Hbo · 4 jaar',wo:'Universiteit · bachelor'}[ty]);
    for(const st of STUDIES.filter(x=>x.ty.includes(ty))){const pb=typeof profBlock==='function'?profBlock(st,ty):'';const dis=(st.sm&&S.st.smarts<st.sm)||(st.clean&&S.crim.rec.length)||!!pb;row(s,{ic:'📘',t:st.t,s:dis?(pb||(st.clean&&S.crim.rec.length?'Niet met een strafblad':'Je bent niet slim genoeg')):`${ty==='wo'&&st.len?st.len:{mbo:3,hbo:4,wo:3}[ty]} jaar · ${SECN[st.sec]} · ${leadsTo(st.id,ty)}`,dis,dots:true,on:()=>fundPick(ty,st.id)})}}
  if(canEnter('master')){const s=sec(el,'Master · 1 tot 2 jaar');const fs=[...new Set(S.edu.deg.filter(d=>['wo','hbo'].includes(d.ty)&&d.f).map(d=>d.f))];let n=0;for(const f of fs){if(S.edu.deg.some(d=>d.ty==='master'&&d.f===f))continue;n++;row(s,{ic:'🎓',t:'Master '+STUDIES.find(x=>x.id===f).t,s:leadsTo(f,'master'),dots:true,on:()=>fundPick('master',f)})}if(!n)empty(s,'Je hebt een bachelor nodig.')}
  if(canEnter('phd')&&S.st.smarts>=60){const s=sec(el,'Promoveren · 4 jaar');for(const d of S.edu.deg.filter(d=>d.ty==='master'||d.f==='geneeskunde'))row(s,{ic:'🔬',t:'Promotieonderzoek '+STUDIES.find(x=>x.id===d.f).t,s:'Met beurs',dots:true,on:()=>{enroll('phd',d.f,'beurs');closeSheet();render();saveLife();toast('Je bent begonnen met promoveren')}})}
  if(S.edu.cur)empty(el,'Je bent al aan het studeren.');
},push)}
function fundPick(ty,f){const fee=ty==='mbo'?1300:2600;
  modal({title:'Studiefinanciering',em:'🎓',cat:'Opleiding',text:`Collegegeld: ${fmt(fee)} per jaar. Hoe betaal je het?`,choices:opts([
    {t:'Studielening',on:()=>go('lening')},{t:'Je ouders vragen',dis:!living(['moeder','vader']).length,on:()=>{const w=S.flags.wealth;const ok=chance(w==='rijk'?.9:w==='midden'?.5:.12);go(ok?'ouders':'lening',ok?null:'Je ouders kunnen het niet betalen. Je sluit een studielening af.')}},
    {t:`Zelf betalen (${fmt(fee)}/jaar)`,on:()=>go('zelf')}])});
  function go(fund,msg){closeModal();enroll(ty,f,fund);closeSheet();render();saveLife();if(msg)L(msg);toast(msg||'Ingeschreven!')}}
const BIZEM={foodtruck:'🚚',restaurant:'🍝',cafe:'🍺',webshop:'🛒',saas:'☁️',bouwbedrijf:'🏗️',kapsalon:'💇',consultancy:'📊',hotel:'🏨',app:'📱'};
/* ================= BEZIT ================= */
const SHOP={spullen:[['🚲','Fiets',600],['💻','Laptop',1200,'tech'],['🎮','Spelcomputer',550],['📺','Smart-tv',900],['🎸','Elektrische gitaar',650,'muziek'],['🕶️','Designer zonnebril',350]],
  luxe:[['⌚','Rolex',14000],['👜','Designer handtas',4500],['💍','Diamanten ring',25000],['🖼️','Kunstwerk',60000,null,1],['🚤','Speedboot',90000],['🛥️','Jacht',2500000],['🛩️','Privéjet',18000000]]};
const carEm=c=>carIcon(c);
function finPopup(){const inv=Object.values(S.inv).reduce((x,y)=>x+y,0),pr=S.props.reduce((x,p)=>x+p.value-p.mort,0),cr=S.cars.reduce((x,c)=>x+c.value,0),it=S.items.reduce((x,i)=>x+i.value,0),bz=S.biz.reduce((x,b)=>x+b.value*b.eq/100,0);const a=ageY();
  const cap_=Math.round(Math.max(0,salary()*.8+Math.max(0,netWorth())*.3-S.loan));
  modal({title:'Financiën',em:'💰',cat:'Bezit',html:pkv([['Saldo',fmt(S.money)],...incomeParts().map(([k,v])=>[k,fmt(v)+' / jaar']),['Totaal inkomen',`<b>${fmt(incomeParts().reduce((x,[,v])=>x+v,0))} / jaar</b>`],['Beleggingen',fmt(inv)],['Vastgoed (na hypotheek)',fmt(pr)],['Voertuigen',fmt(cr)],['Bezittingen',fmt(it)],['Bedrijven (jouw deel)',fmt(bz)],['Studieschuld',fmt(-S.debt)],['Leningen',fmt(-S.loan)],['Belasting per jaar (geschat)',fmt(taxOn(taxable()))],['Economie',econLabel()],['Prijzen sinds je geboorte',`+${Math.round(((S.cpi||1)-1)*100)}%`],['Netto vermogen',`<b>${fmt(netWorth())}</b>`]]),
    choices:[{t:'Lening afsluiten',dis:a<18||cap_<=500||inJail()||bkr(),on:()=>{closeModal();amountModal('Lenen',cap_,x=>doAct('Lening',()=>{S.loan+=x;cash(x);return `De bank leent je ${fmt(x)} tegen 6% rente.`},true,'🏦'))}},
      {t:'Studieschuld aflossen',dis:S.debt<=0||S.money<=0,on:()=>{closeModal();amountModal('Studieschuld aflossen',Math.min(S.money,S.debt),x=>doAct('Afgelost',()=>{cash(-x);S.debt-=x;return `${fmt(x)} studieschuld afgelost.`},true,'✅'))}},
      {t:'Lening aflossen',dis:S.loan<=0||S.money<=0,on:()=>{closeModal();amountModal('Lening aflossen',Math.min(S.money,S.loan),x=>doAct('Afgelost',()=>{cash(-x);S.loan-=x;return `${fmt(x)} afgelost.`},true,'✅'))}},
      {t:'Sluiten',cls:'ghost',on:closeModal}]})}
const invIn=k=>S.invIn&&S.invIn[k]!=null?S.invIn[k]:S.inv[k];
function sheetInv(el){const s=sec(el,'Je rekeningen');const em={spaar:'🐷',index:'📊',aandelen:'📈',crypto:'🪙'};
  for(const [k,[n,mu,sd]] of Object.entries(INV))row(s,{ic:em[k],t:n,s:`Gemiddeld ${Math.round(mu*100)}% per jaar · risico ${sd<.01?'geen':sd<.2?'gemiddeld':sd<.5?'hoog':'extreem'}`,r:fmt(S.inv[k]),dots:true,on:()=>modal({title:n,em:em[k],cat:'Beleggingen',html:pkv([['Ingelegd',fmt(invIn(k))],['Waarde nu',fmt(S.inv[k])],...(S.inv[k]>0?plRow(S.inv[k],invIn(k)):[])]),choices:opts([{t:'Storten',dis:S.money<=0,on:()=>{closeModal();amountModal('Storten',S.money,x=>doAct(n,()=>{cash(-x);S.invIn=S.invIn||{};S.invIn[k]=invIn(k)+x;S.inv[k]+=x;return `${fmt(x)} gestort.`},true,em[k]))}},{t:'Opnemen',dis:S.inv[k]<=0,on:()=>{closeModal();amountModal('Opnemen',S.inv[k],x=>doAct(n,()=>{const basis=invIn(k)*(x/Math.max(1,S.inv[k]));cash(x);S.invIn=S.invIn||{};S.invIn[k]=Math.max(0,invIn(k)-basis);S.inv[k]-=x;const d=Math.round(x-basis);return `${fmt(x)} opgenomen. Daarvan was ${fmt(basis)} ingelegd: ${d>=0?'winst':'verlies'} van ${fmt(Math.abs(d))}.`},true,em[k]))}}])})})}
const boughtFor=x=>x.buy!=null?fmt(x.buy):'onbekend';
const plTxt=(now,buy)=>{if(buy==null)return'';const d=Math.round(now-buy);return d===0?'Quitte':`${d>0?'+':'-'}${fmt(Math.abs(d))} (${d>0?'+':''}${Math.round(d/Math.max(1,buy)*100)}%)`};
const plRow=(now,buy)=>buy==null?[]:[[now-buy>=0?'Winst bij verkoop':'Verlies bij verkoop',`<span style="color:${now-buy>=0?'var(--good)':'var(--bad)'}">${plTxt(now,buy)}</span>`]];
const soldTxt=(sale,buy)=>buy==null?'':` Je kocht het voor ${fmt(buy)}: ${sale>=buy?'winst':'verlies'} van ${fmt(Math.abs(sale-buy))}.`;
function carPopup(c){const cond=c.cond??100;const rep=Math.round((100-cond)*c.value*.004+80);const sale=Math.round(c.value*(.5+cond/200));
  modal({title:c.name,em:carEm(c),cat:'Voertuig',html:pkv([['Gekocht voor',boughtFor(c)],['Waarde nu',fmt(c.value)],['Verkoopprijs',fmt(sale)],...plRow(sale,c.buy),['Conditie',cond+'%']]),choices:opts([{t:`Laten repareren (${fmt(rep)})`,dis:cond>=98||S.money<rep,on:()=>{closeModal();doAct('Garage',()=>{cash(-rep);c.cond=100;return `Je ${c.name} is weer als nieuw.`},true,'🔧')}},{t:`Verkopen (${fmt(sale)})`,on:()=>{closeModal();doAct('Verkocht',()=>{cash(sale);S.cars=S.cars.filter(x=>x!==c);return `Je hebt je ${c.name} verkocht voor ${fmt(sale)}.${soldTxt(sale,c.buy)}`},true,'🏷️')}}])})}
function itemPopup(it){const sale=Math.round(it.value*(.7+(it.cond??100)/400));
  modal({title:it.name,em:itemIcon(it),cat:'Bezitting',html:pkv([...(it.variant?[['Uitvoering',he(it.variant)]]:[]),['Gekocht voor',boughtFor(it)],['Waarde nu',fmt(it.value)],['Verkoopprijs',fmt(sale)],...plRow(sale,it.buy),['Conditie',(it.cond??100)+'%']]),choices:opts([{t:`Verkopen (${fmt(sale)})`,on:()=>{closeModal();doAct('Verkocht',()=>{cash(sale);S.items=S.items.filter(x=>x!==it);return `Je hebt je ${it.name} verkocht voor ${fmt(sale)}.${soldTxt(sale,it.buy)}`},true,'🏷️')}}])})}
function sheetShop(el,kind){if(inJail()){empty(el,'Winkelen kan pas weer als je vrij bent.');return}const a=ageY();const s=sec(el,kind==='luxe'?'Luxe':'Categorieën');
  for(const [k,c] of Object.entries(CATALOG)){if(kind==='luxe'&&!c.lux)continue;const n=Object.values(c.brands).reduce((x,b)=>x+b.length,0);
    row(s,{ic:catIcon(k),t:c.n,s:a<(c.min||0)?`Vanaf ${c.min} jaar`:`${Object.keys(c.brands).length} merken · ${n} modellen`,dis:a<(c.min||0),on:()=>openSheet(c.n,el=>sheetBrands(el,k),true)})}}
const BRANDEM={autos:b=>b==='Klassiekers'?'🚙':['Ferrari','Lamborghini','Porsche'].includes(b)?'🏎️':b==='Tesla'?'🔋':'🚗'};
const catEm=(k,b)=>BRANDEM[k]?BRANDEM[k](b):CATALOG[k].em;
function sheetBrands(el,k){const c=CATALOG[k];const s=sec(el,'Merken');
  for(const [b,ms] of Object.entries(c.brands)){const min=Math.min(...ms.map(m=>m[1]))*Math.min(...c.vars(b).map(v=>v[1]));row(s,{ic:brandIcon(k,b),t:b,s:`${ms.length} model${ms.length>1?'len':''} · vanaf ${fmt(min)}`,on:()=>openSheet(b,el=>sheetModels(el,k,b),true)})}}
function sheetModels(el,k,b){const c=CATALOG[k];card(el,kv([['Saldo',fmt(S.money)]]));const s=sec(el,'Modellen');
  for(const m of c.brands[b]){const ap=m[2]??c.ap??-.1;row(s,{ic:icShop(k,b,m[0]),t:m[0],s:ap>0?'Wordt waarschijnlijk meer waard':ap>-.05?'Houdt redelijk zijn waarde':'Verliest waarde',r:fmt(m[1]),dots:true,on:()=>variantPopup(k,b,m)})}}
function variantPopup(k,b,m){const c=CATALOG[k];
  modal({title:`${b} ${m[0]}`,em:icShop(k,b,m[0]),cat:c.n,text:`Kies je uitvoering. Je saldo: ${fmt(S.money)}.`,choices:opts(c.vars(b).map(([v,f])=>{const p=Math.round(m[1]*f);return{t:v,s:fmt(p),ic:icShop(k,b,m[0],v),dis:S.money<p,on:()=>{closeModal();k==='autos'?carColor(k,b,m,v,p):buyCat(k,b,m,v,p)}}}))})}
/* ================= RELATIES ================= */
const roleLabel=p=>cap(p.role==='partner'?partnerWord(p):p.role==='vijand'?'vijand':p.role==='huisdier'?petDesc(p):relWord(p));
function personRow(el,p){if(!p.alive){const ago=ageY()-(p.died??ageY());row(el,{ic:'💀',t:`${p.first} ${p.last||''}`.trim(),role:roleLabel(p),s:ago<=0?'Dit jaar overleden':ago===1?'Vorig jaar overleden':`${ago} jaar geleden overleden`,dots:true,on:()=>modal({title:`${p.first} ${p.last||''}`,em:'🪦',cat:'In herinnering',text:`Je ${roleLabel(p).toLowerCase()} ${p.first} is ${ago<=0?'dit jaar':ago+' jaar geleden'} overleden.`,choices:opts([{t:'Graf bezoeken',on:()=>{closeModal();doAct('Graf bezoeken',()=>{use('graf'+p.id);hap(2);kar(1);return `Je legt bloemen bij het graf van ${p.first}.`},true,'💐')}}])})});return}
  row(el,{ic:faceOf(p),t:`${p.first} ${p.last||''}`.trim(),role:roleLabel(p),bar:{l:'Relatie',v:p.rel,c:statCol(p.rel)},on:()=>openSheet(p.first,el=>sheetPerson(el,p),true)})}
function sheetPerson(el,p){const a=pAge(p);
  card(el,`<h3>${faceOf(p)} ${he(p.first+' '+(p.last||''))}</h3><span class="muted">${roleLabel(p)} · ${a} jaar${p.job&&p.role!=='huisdier'?' · '+he(p.job):''}</span><div class="stat"><span>Relatie</span><span></span><span class="v">${Math.round(p.rel)}%</span>${bar(p.rel)}</div>${p.role!=='huisdier'?`<div class="stat"><span>Slimheid</span><span></span><span class="v">${Math.round(p.smarts)}%</span>${bar(p.smarts,'var(--brand)')}</div><div class="stat"><span>Uiterlijk</span><span></span><span class="v">${Math.round(p.looks)}%</span>${bar(p.looks,'var(--brand)')}</div>`:''}`);
  if(typeof pJailed==='function'&&pJailed(p)){jailedPersonRows(el,p);return}
  if(inJail()){const s=sec(el,'Vanuit de gevangenis');if(p.role==='huisdier'){empty(s,`${p.first} wordt verzorgd tot je terug bent.`);return}
    row(s,{ic:'📞',t:'Bellen',s:'Tien minuten belminuten',on:()=>doAct('Bellen',()=>{use('bel'+p.id);p.rel=clamp(p.rel+ri(3,8));hap(3);return `Je belt met ${p.first}. Het doet je goed.`},true,'📞')});
    row(s,{ic:'✉️',t:'Brief schrijven',on:()=>doAct('Brief',()=>{use('brief'+p.id);p.rel=clamp(p.rel+ri(4,9));kar(1);return `Je schrijft ${p.first} een lange brief.`},true,'✉️')});
    row(s,{ic:'🤝',t:'Uitnodigen voor bezoekuur',s:S.acts['bez'+p.id]?'Al op bezoek geweest dit jaar':'',dis:!!S.acts['bez'+p.id],on:()=>doAct('Bezoek',()=>{S.acts['bez'+p.id]=1;if(chance(p.rel/100)){p.rel=clamp(p.rel+8);hap(8);return `${p.first} komt op bezoek. Een uur lang voelt het even normaal.`}p.rel=clamp(p.rel-3);hap(-1);return `${p.first} komt niet opdagen.`},true,'🤝')});return}
  const s=sec(el,'Acties');const r=p.role,my=ageY();
  const A=(ic,t,fn,o={})=>row(s,{ic,t,s:o.s,dis:o.dis,on:()=>doAct(t,fn,true,ic)});
  const bump=(k,lo,hi,txt)=>()=>{const m=use(k+p.id);p.rel=clamp(p.rel+Math.round(ri(lo,hi)*m));return txt};
  if(r==='huisdier'){A('🎾','Spelen',bump('spel',3,10,`${p.first} is dolblij.`));A(p.sp==='hond'?'🦮':'🪮',p.sp==='hond'?'Uitlaten':'Verzorgen',()=>{bump('zorg',3,8,'')();hea(1);hap(2);return `Je zorgt goed voor ${p.first}.`});A('🩺','Naar de dierenarts',()=>{cash(-ri(1,4)*50);p.life++;return `${p.first} is weer helemaal gezond.`});row(s,{ic:'🏠',t:'Weggeven',dots:true,on:()=>ask('Weggeven?',`${p.first} gaat naar een nieuw baasje.`,'Weggeven',()=>{p.alive=false;p.gone=1;L(`Je hebt ${p.first} weggegeven.`);kar(-2);hap(-5);backSheet();render()})});return}
  A('☕','Tijd samen doorbrengen',()=>{bump('tijd',4,12,'')();hap(2);return pick(['wandelen','een film kijken','koffie drinken en bijpraten','koken']).replace(/^/,`Jij en ${p.first} gaan samen `)+'.'});
  row(s,{ic:'💬',t:'Gesprek voeren',s:'Kies een onderwerp',dots:true,on:()=>talk(p)});
  A('🌹','Compliment geven',()=>{bump('comp',2,6,'')();kar(1);return `${p.first} bloost.`});
  A('🎁','Cadeau geven',()=>{const k=my<12?5:my<18?25:Math.round(clamp((netWorth()-(S.swiss||0))*.002,50,5000));cash(-k);bump('cad',5,15,'')();return `Je geeft ${p.first} een cadeau van ${fmt(k)}.`},{dis:S.money<5,s:'Kost geld'});
  if(['moeder','vader'].includes(r)){A('💶','Om geld vragen',()=>{S.acts['geld'+p.id]=(S.acts['geld'+p.id]||0)+1;if(S.acts['geld'+p.id]>2){p.rel=clamp(p.rel-6);return `${p.first}: "Je hebt dit jaar al genoeg gehad."`}if(chance(p.rel/130)){const g=Math.round(Math.min(Math.max(5,p.money*.01),my<12?10:my<18?100:5000));cash(g);p.money-=g;return `${p.first} geeft je ${fmt(g)}.`}p.rel=clamp(p.rel-3);return `${p.first} zegt nee.`});
    if(my<18&&!living('huisdier').length)A('🐶','Om een huisdier vragen',()=>parentPet(pick(['hond','kat','konijn','hamster'])))}
  if(r==='partner'){
    A('🍝','Op date gaan',()=>{cash(my>=18?-ri(40,150):-10);bump('date',5,12,'')();hap(4);return pick(['Jullie eten bij een Italiaans restaurant.','Jullie gaan schaatsen.','Jullie maken een lange fietstocht langs de rivier.','Jullie gaan naar een concert.'])});
    if(p.st==='relatie')A('💍','Ten huwelijk vragen',()=>{if(chance(p.rel/110+(p.rel>70?.15:0))){p.st='verloofd';hap(12);MS(`Verloofde zich met ${p.first}`,2);return `${p.first} zegt JA!`}p.rel=clamp(p.rel-15);hap(-10);return `${p.first} wil nog niet trouwen.`},{dis:my<18,s:my<18?'Vanaf 18 jaar':''});
    if(p.st==='verloofd')row(s,{ic:'💒',t:'Trouwen',dots:true,on:()=>modal({title:'Jullie bruiloft',em:'💒',cat:'Liefde',text:'Wat voor bruiloft wordt het?',choices:opts([['Klein, op het gemeentehuis',3000],['Groot feest met 150 gasten',35000],['Spontaan in Las Vegas',2500],['Sprookjesbruiloft in een kasteel',120000]].map(([t,k])=>({t:`${t} (${fmt(k)})`,dis:S.money<k,on:()=>{closeModal();doAct('Getrouwd!',()=>{cash(-k);p.st='getrouwd';p.rel=clamp(p.rel+10);S.flags.getrouwd=1;hap(15);MS(`Trouwde met ${p.first}`,3);if(S.home.k==='ouders')setRent('Appartement',16500);return `Je bent getrouwd met ${p.first}!`},true,'💒')}})))})});
    if(my>=18)row(s,{ic:'👶',t:'Kind proberen te krijgen',dis:!!S.preg,dots:true,on:()=>doAct('Kinderwens',()=>tryBaby(),true,'👶')});
    row(s,{ic:'💔',t:p.st==='getrouwd'?'Scheiden':'Uit elkaar gaan',dots:true,on:()=>ask(p.st==='getrouwd'?'Scheiden?':'Uit elkaar?',p.st==='getrouwd'?'Je verliest de helft van je saldo.':`Je maakt het uit met ${p.first}.`,'Doorzetten',()=>{breakUp();render();saveLife();backSheet()})});
  }
  if(r==='kind'||r==='kleinkind'){if(a<12)A('📖','Voorlezen',bump('voor',4,10,`${p.first} valt halverwege het verhaal in slaap.`));if(a>=6&&a<18)A('✏️','Helpen met huiswerk',()=>{bump('hw',2,6,'')();p.smarts=clamp(p.smarts+ri(1,3));return `${p.first} snapt de breuken nu.`});
    A('💶','Geld geven',()=>{const k=a<12?10:a<18?50:Math.round(clamp(S.money*.05,100,50000));cash(-k);p.money=(p.money||0)+k;bump('gg',3,10,'')();return `Je geeft ${p.first} ${fmt(k)}.`},{dis:S.money<10})}
  if(['vriend','broer','zus'].includes(r)&&my>=14)A('🍻','Samen uitgaan',()=>{cash(-ri(20,80));bump('uit',4,12,'')();hap(4);if(chance(.15)&&!partner()&&my>=16){addPartner();return 'Je ontmoet iemand leuks die avond!'}return 'Een geweldige avond.'});
  if(r==='ex')A('🔁','Terug proberen te krijgen',()=>{if(partner())return 'Je hebt al een relatie.';if(chance(p.rel/160)){p.role='partner';p.st='relatie';hap(8);return `${p.first} geeft je nog een kans!`}p.rel=clamp(p.rel-8);return `${p.first} wil je niet meer terug.`});
  if(r==='vijand')A('🕊️','Het bijleggen',()=>{if(chance(.35+S.sk.sociaal/250)){p.role='vriend';p.rel=45;kar(3);return `Jullie leggen het bij. ${p.first} is nu een vriend.`}p.rel=clamp(p.rel-5);return `${p.first} wil er niets van weten.`});
  A('🗯️','Ruzie maken',()=>{use('ruzie'+p.id);p.rel=clamp(p.rel-ri(6,18));if(p.rel<=5&&['vriend','broer','zus'].includes(r)&&r==='vriend'){p.role='vijand';return `Het loopt volledig uit de hand. ${p.first} is nu je vijand.`}return 'Jullie hebben een flinke ruzie.'});
  A('🤬','Beledigen',()=>{p.rel=clamp(p.rel-ri(10,25));kar(-3);if(p.rel<=5&&r==='vriend'){p.role='vijand';return `${p.first} is je vijand geworden.`}return `${p.first} is diep gekwetst.`});
  if(r==='vriend')row(s,{ic:'✂️',t:'Vriendschap verbreken',dots:true,on:()=>ask('Vriendschap verbreken?',`Je stopt de vriendschap met ${p.first}.`,'Verbreken',()=>{S.rel=S.rel.filter(x=>x!==p);L(`Je bent geen vrienden meer met ${p.first}.`);backSheet();render()})});
  if(typeof personExtra==='function')personExtra(el,p);
}
function dating(){if(inJail()){toast('Daten kan niet vanuit de gevangenis');return}
  if(!S.flags.pref){modal({title:'Daten',em:'❤️',cat:'Liefde',text:'Op wie val je?',choices:[['Mannen','mannen'],['Vrouwen','vrouwen'],['Iedereen','beide']].map(([t,v])=>({t,on:()=>{S.flags.pref=v;closeModal();dating()}}))});return}
  let n=0;const next=()=>{if(n++>=5){closeModal();toast('Genoeg geswiped voor nu');return}const c=candidate();
    modal({title:`${c.first} ${c.last}`,em:faceOf(c),cat:'Liefde',text:`${pAge(c)} jaar · ${c.job}. Houdt van ${TRAITS[c.tr]||'gezelligheid'}.`,html:`<div class="pstats"><span>Uiterlijk</span><i><b style="width:${c.looks}%;background:var(--good)"></b></i><span>Slimheid</span><i><b style="width:${c.smarts}%;background:var(--good)"></b></i></div>`,choices:[
      {t:'Mee uit vragen',cls:'go',on:()=>{const p=clamp(.5+(S.st.looks-c.looks)/150+(S.st.happy-50)/300+S.fame/300+(S.money>50000?.05:0),.05,.95);closeModal();if(chance(p)){if(!spendE(1))return;dateGame(c)}else doAct('Daten',()=>{hap(-2);return `${c.first} heeft geen interesse.`},false,'💔')}},
      {t:'Volgende',on:next},{t:'Stoppen',cls:'ghost',on:closeModal}]})};next()}

/* ================= ACTIVITEITEN ================= */
function cellmate(){const J=S.crim.jail,c=J.cell;
  modal({title:c.first,em:'🧑',cat:'Celgenoot',text:`Zit hier voor ${c.w}. Jullie relatie: ${Math.round(c.rel)}%.`,choices:opts([
    {t:'💬 Praten',on:()=>{closeModal();doAct('Celgenoot',()=>{use('cpraat');c.rel=clamp(c.rel+ri(3,10));hap(2);return `${c.first} vertelt over het leven buiten. Jullie lachen veel.`},true,'💬')}},
    {t:'🃏 Kaarten',on:()=>{closeModal();doAct('Kaarten',()=>{use('ckaart');c.rel=clamp(c.rel+ri(2,6));if(chance(.5)){cash(ri(1,5)*10);return 'Je wint een paar potjes.'}cash(-ri(1,5)*10);return 'Je verliest een paar potjes.'},true,'🃏')}},
    {t:'😤 Intimideren',on:()=>{closeModal();doAct('Intimideren',()=>{c.rel=clamp(c.rel-ri(10,20));if(chance(.6)){J.resp+=6;return `${c.first} doet voortaan wat jij zegt.`}hea(-ri(5,12));return `${c.first} slaat terug. Hard.`},true,'😤')}},
    {t:'🕳️ Samen een ontsnapping plannen',dis:c.rel<60,on:()=>{closeModal();doAct('Plan',()=>{J.tunnel=Math.max(J.tunnel,40);return 'Jullie beginnen elke nacht te graven achter de wc.'},true,'🕳️')}}])})}
function sheetLove(el){const a=ageY();const s=sec(el,'');
  row(s,{ic:'💘',t:'Daten',s:partner()?'Je hebt al een relatie':a<16?'Vanaf 16 jaar':'Swipe door de datingapp',dis:!!partner()||a<16,dots:true,on:dating});
  row(s,{ic:'🤝',t:'Vrienden maken',s:'Ga naar plekken waar je mensen ontmoet',dis:a<5,on:()=>doAct('Vrienden maken',()=>{const m=use('vrienden');if(chance((.35+S.sk.sociaal/200)*m)){const f=addFriend();sk('sociaal',2);return f?`Je raakt aan de praat met ${f.first}. Een nieuwe vriend!`:'Je hebt al genoeg vrienden.'}hap(-1);return 'Het klikt met niemand.'},true,'🤝')});
  row(s,{ic:'🥂',t:'Speeddaten',s:a<18?'Vanaf 18 jaar':`Kost ${fmt(35)}`,dis:!!partner()||a<18,dots:true,on:()=>doAct('Speeddaten',()=>{cash(-35);use('speed');if(chance(.3+S.st.looks/300)){addPartner();hap(6);return 'Na tien dates van vier minuten is er één die je mee uit vraagt. Het klikt!'}hap(-1);return 'Tien dates, nul klik.'},true,'🥂')})}
function sheetMind(el){const a=ageY();const s=sec(el,'');
  const items=[
    ['🏋️','Sportschool','Gezondheid, uiterlijk, sport',12,()=>{const m=use('gym');if(a>=18)cash(-35);hea(ri(1,4)*m);loo(ri(0,2)*m);sk('sport',3*m);hap(1);return pick(['Je traint benen. Morgen kun je niet lopen.','Je haalt een persoonlijk record.','Je loopt 5 kilometer op de loopband.'])}],
    ['🏃','Hardlopen','Een rondje door het park',6,()=>{const m=use('run');hea(ri(1,3)*m);sk('sport',2*m);hap(2*m);return 'Je rent een rondje door het park.'}],
    ['🧘','Mediteren','Rust in je hoofd',8,()=>{const m=use('med');hap(ri(2,5)*m);hea(1*m);return 'Tien minuten rust in je hoofd.'}],
    ['📚','Bibliotheek','Lees een boek',5,()=>{const k=use('bieb');sma(ri(1,3)*k);return pick(['Je leest een boek over de Romeinen.','Je leent een stapel strips. Telt dat ook?','Je leest over zwarte gaten.'])}],
    ['🥗','Gezonder eten','Meer groente, minder chips',10,()=>{const m=use('eten');hea(2*m);loo(1*m);return 'Meer groente, minder chips.'}],
    ['🎹','Instrument oefenen','Word beter in muziek',6,()=>{const k=use('muz');sk('muziek',ri(2,5)*k);return pickF('muz',['Je oefent een uur.','Je speelt eindelijk dat lastige stuk foutloos.','De buren kloppen op de muur, maar je wordt beter.','Je leert een nieuw nummer uit je hoofd.','Je oefent toonladders tot je vingers pijn doen.'])}],
    ['🧑‍🏫','Cursus volgen','Bouw een vaardigheid op',14,null],
    ['🧩','Puzzelen','Train je hersenen',6,()=>{const k=use('puz');sma(ri(1,2)*k);hap(1);return 'Je maakt een puzzel van 1000 stukjes.'}],
    ['🧗','Klimmen','Een uitdaging in de klimhal',12,()=>{const m=use('klim');cash(-15);sk('sport',3*m);hea(1);if(chance(.05)){hea(-8);return 'Je valt en verstuikt je enkel.'}return 'Je haalt de top van de moeilijkste route.'}]];
  const TAP={Sportschool:['Training','Tik zo snel als je kunt: elke tik is een herhaling.','tapgym'],Hardlopen:['Sprint','Tik zo snel als je kunt om de finish te halen.','taprun']};
  for(const [ic,t,sub,min,fn] of items)row(s,{ic,t,s:a<min?`Vanaf ${min} jaar`:TAP[t]?sub+' · minigame':sub,dis:a<min,dots:!fn||!!TAP[t]||t==='Instrument oefenen',on:t==='Instrument oefenen'?()=>mgRhythm({title:'Oefenen',desc:'Speel de noten op de maat. Hoe zuiverder, hoe sneller je beter wordt.',em:'🎹',btn:'Speel!'},sc=>doAct(t,()=>{const k=use('muz');sk('muziek',Math.round((1+sc*5)*k));hap(sc>.7?2:1);return sc>=.8?'Foutloos! Dat lastige stuk zit er eindelijk in.':sc>=.5?'Je oefent een uur. Het klinkt steeds beter.':'Veel valse noten. De buren kloppen op de muur.'},true,ic)):TAP[t]?()=>mgTap(TAP[t][0],TAP[t][1],(sc,n)=>doAct(t,()=>{use(TAP[t][2]);if(t==='Sportschool'&&a>=18)cash(-35);hea(Math.round(1+sc*4));if(t==='Sportschool')loo(Math.round(sc*2));sk('sport',Math.round(1+sc*4));hap(sc>.6?3:1);return sc>.8?`${n} herhalingen. Beest! Je voelt je sterker dan ooit.`:sc>.5?`${n} herhalingen. Een degelijke training.`:`${n} herhalingen. Je was er met je hoofd niet bij.`},true,ic)):fn?()=>doAct(t,fn,true,ic):coursePick})}
function coursePick(){const a=ageY();modal({title:'Cursus',em:'🧑‍🏫',cat:'Geest & lichaam',text:`Kosten: ${fmt(350)}. Welke cursus?`,choices:opts(Object.entries({tech:'💻 Programmeren',koken:'🍳 Koken',muziek:'🎸 Muziekinstrument',kunst:'🎨 Tekenen en design',zaken:'💼 Ondernemen',sociaal:'🎤 Presenteren',sport:'🏋️ Personal training'}).map(([k,t])=>({t,dis:S.money<350&&a>=18,on:()=>{closeModal();doAct(t.slice(3),()=>{if(a>=18)cash(-350);const mm=use('cur'+k);sk(k,ri(5,10)*mm);sma(1);return `${SKN[k]} gaat flink vooruit.`},true,t.split(' ')[0])}})))})}
function sheetSpa(el){const a=ageY();const s=sec(el,'');
  const it=[['🧖','Spa-dag',150,()=>{const m=use('spa');hap(5*m);loo(1*m);return 'Sauna, massage en een fluffy badjas.'}],['💇','Kapper',45,()=>{const m=use('kap');loo(ri(1,3)*m);hap(1);return pick(['Een strakke nieuwe coupe.','De kapper knipt er iets te veel af, maar het staat je.'])}],['💅','Manicure',35,()=>{use('mani');loo(1);hap(2);return 'Je nagels glanzen.'}],['💆','Massage',70,()=>{const m=use('mass');hap(4*m);hea(1*m);return 'Alle knopen zijn eruit.'}],['🖋️','Tatoeage',300,()=>{hap(3);return `Je laat ${pick(['een anker','de naam van je moeder','een roos','een draak','een bitterbal'])} zetten.`},18]];
  for(const [ic,t,k,fn,min] of it){const mi=min||12;row(s,{ic,t,s:a<mi?`Vanaf ${mi} jaar`:fmt(k),dis:a<mi||S.money<k,on:()=>doAct(t,()=>{cash(-k);return fn()},true,ic)})}}
function sheetEmigrate(el){const s=sec(el,'Kies een land');for(const [k,c] of Object.entries(COUNTRIES)){if(k===S.p.country)continue;row(s,{ic:flag(k),t:c.n,s:(typeof cntLbl==='function'?cntLbl(k)+' · ':'')+c.cities.slice(0,3).join(', '),dots:true,on:()=>ask(`Naar ${c.n}?`,`Je verkoopt je huizen en auto's, zegt je baan op en begint opnieuw. Verhuizen kost ongeveer ${fmt(5000)}.`,'Emigreren',()=>{emigrate(k);closeSheet();render();saveLife();toast(`Welkom in ${c.n}!`)},'go',flag(k))})}}
function emigrate(k){const o=C(),n=COUNTRIES[k];const f=(o.k/o.rate)/(n.k/n.rate);
  for(const p of S.props)cash(p.value*.97-p.mort);for(const c of S.cars)cash(c.value);S.props=[];S.cars=[];endJob();cash(-5000);
  S.money=Math.round(S.money*f);S.debt=Math.round(S.debt*f);S.loan=Math.round(S.loan*f);for(const i in S.inv)S.inv[i]=Math.round(S.inv[i]*f);for(const it of S.items)it.value=Math.round(it.value*f);
  for(const x of S.angel||[]){x.v*=f;x.in*=f}  for(const b of S.biz){b.cash*=f;b.value*=f;b.demand*=f}if(S.pension)S.pension*=f;
  if(typeof polEmig==='function')polEmig(k);S.p.bc=S.p.bc||o0bc();S.p.country=k;S.p.city=pick(n.cities);S.home={k:'huur',name:'Appartement',rent:16500};S.flags.wereld=1;S.flags.mk=null;
  L(`Je bent geëmigreerd naar ${S.p.city}, ${n.n}.`,'big');MS(`Emigreerde naar ${n.n}`,2);hap(6)}
function sheetFame(el){const jt=jobFameT();
  card(el,`<h3>⭐ Roem</h3>${kv([['Roem',Math.round(S.fame)+'%'],['Volgers',Math.round(S.foll).toLocaleString('nl-NL')],['Bekend als',jt?jobTitle():S.foll>=1e4?'Influencer':S.fame>0?'Een bekend gezicht':'Niemand kent je'],['Beveiliging',S.flags.bg?`Bodyguard · ${fmt(bgCost())} per jaar`:'Geen']])}<span class="muted">${famous()?'Bekend zijn heeft voordelen (gratis spullen, VIP-behandeling, deals) en nadelen (paparazzi, roddels, fans voor de deur, stalkers).':'Hoe bekender je bent, hoe meer volgers je vanzelf krijgt.'}</span>`);
  const s=sec(el,'Acties');
  const A=(ic,t,fn,o={})=>row(s,{ic,t,s:o.s,dis:o.dis,on:()=>doAct(t,fn,true,ic)});
  A('🎙️','Interview geven',()=>{const m=use('intv');S.fame=clamp(S.fame+Math.round(ri(1,4)*m));cash(Math.round(S.fame*40*m));return pick(['Je vertelt openhartig over je jeugd.','Je zegt iets doms. Het gaat viraal.','De journalist is fan van je.'])});
  A('📺','Langs bij een talkshow',()=>{const m=use('talk');S.foll+=Math.round((S.foll*.03+ri(500,5000))*m);S.fame=clamp(S.fame+Math.round(2*m));if(chance(.15)){hap(-1);return 'Je zegt iets ongelukkigs aan tafel. Morgen staat het in de krant.'}return 'Je bent grappig en ontspannen. Het publiek is fan.'},{dis:S.fame<20,s:S.fame<20?'Roem 20+':''});
  A('📸','Fotoshoot',()=>{const m=use('shoot');cash(Math.round(S.fame*120*m));loo(1);return 'Je staat op de cover van een tijdschrift.'});
  A('🤝','Meet & greet',()=>{const m=use('meet');const k=Math.round(S.fame*S.fame*3*m*(S.cpi||1));cash(k);hap(2);return `Honderden fans staan in de rij. Je verdient ${fmt(k)}.`},{dis:S.fame<30,s:S.fame<30?'Roem 30+':''});
  A('✍️','Handtekeningen uitdelen',()=>{const m=use('sign');S.foll+=Math.round(S.foll*.01*m+50);kar(1);hap(2);return 'Je fans zijn dolblij.'});
  A('📖','Autobiografie schrijven',()=>{if(S.flags.boek)return 'Je hebt je biografie al geschreven.';S.flags.boek=1;const g=Math.round(S.fame*S.fame*30);cash(g);MS('Schreef een autobiografie',2);return `Je boek wordt een bestseller en levert ${fmt(g)} op.`},{dis:S.fame<30||S.flags.boek,s:S.fame<30?'Roem 30+':''});
  A('🧴','Eigen parfumlijn',()=>{if(S.flags.parfum)return 'Je hebt al een parfumlijn.';S.flags.parfum=1;const g=Math.round(S.fame*S.fame*60);cash(g);MS('Lanceerde een eigen parfum',2);return `Je parfum verkoopt goed: ${fmt(g)}.`},{dis:S.fame<50||S.flags.parfum,s:S.fame<50?'Roem 50+':''});
  const b=sec(el,'Privacy');
  row(b,{ic:'🛡️',t:S.flags.bg?'Bodyguard ontslaan':'Bodyguard inhuren',s:S.flags.bg?`Je betaalt ${fmt(bgCost())} per jaar`:`${fmt(bgCost())} per jaar · minder last van fans en stalkers`,dots:true,on:()=>doAct('Beveiliging',()=>{S.flags.bg=S.flags.bg?0:1;return S.flags.bg?'Je bodyguard begint morgen.':'Je bodyguard vertrekt.'},true,'🛡️')});
}
function sheetIdentity(el){const s=sec(el,'');row(s,{ic:'🪪',t:'Naam veranderen',s:`${S.p.first} ${S.p.last}`,dots:true,on:()=>modal({title:'Nieuwe naam',em:'🪪',cat:'Identiteit',html:`<div class="inrow"><input class="inp" id="nf" value="${he(S.p.first)}" maxlength="24"><input class="inp" id="nl" value="${he(S.p.last)}" maxlength="28"></div>`,choices:opts([{t:'Opslaan',cls:'go',on:()=>{const f=$('#nf').value.trim(),l=$('#nl').value.trim();if(f)S.p.first=f;if(l)S.p.last=l;closeModal();L(`Je heet voortaan ${S.p.first} ${S.p.last}.`);render();refreshSheet();saveLife()}}])})})}
function sheetLic(el){const s=sec(el,'');const a=ageY();
  row(s,{ic:'🚗',t:'Rijbewijs',s:S.lic?'Je hebt je rijbewijs':a<17?'Vanaf 17 jaar':`Lessen en examen: ${fmt(2600)} · minigame`,dis:S.lic||a<17||S.money<2600,dots:true,on:()=>{if(!hasE())return;cash(-2600);mgDodge({title:'Rijexamen',desc:'Rijd veilig door het verkeer. Je mag maximaal één fout maken.',em:'🚗',me:'🚗',obs:['🚙','🚲','🚸','🚧'],secs:14,speed:.9},(h,tot)=>doAct('Rijexamen',()=>{if(h>=2){S.lic=true;hap(8);MS('Haalde het rijbewijs',1);return 'Geslaagd! Je hebt je rijbewijs.'}hap(-2);return 'Gezakt. De examinator schudt zijn hoofd.'},true,'🚗'))}});
  row(s,{ic:'🏍️',t:'Motorrijbewijs',s:S.flags.motor?'Je hebt je motorrijbewijs':a<18?'Vanaf 18 jaar':`${fmt(2200)} · minigame`,dis:!!S.flags.motor||a<18||S.money<2200,dots:true,on:()=>{if(!hasE())return;cash(-2200);mgDodge({title:'Motorexamen',desc:'Slalom tussen de pionnen en het verkeer door.',em:'🏍️',me:'🏍️',obs:['🔶','🚗','🚧'],secs:12},(h,tot)=>doAct('Motorexamen',()=>{if(h>=2){S.flags.motor=1;hap(6);return 'Geslaagd!'}return 'Gezakt bij de uitwijkoefening.'},true,'🏍️'))}});
  row(s,{ic:'⛵',t:'Vaarbewijs',s:S.flags.vaar?'Je hebt je vaarbewijs':a<18?'Vanaf 18 jaar':fmt(400),dis:!!S.flags.vaar||a<18||S.money<400,dots:true,on:()=>doAct('Vaarbewijs',()=>{cash(-400);if(chance(.4+S.st.smarts/200)){S.flags.vaar=1;return 'Geslaagd voor je theorie-examen!'}return 'Net gezakt. Volgende keer beter.'},true,'⛵')})}
function sheetMovies(el){const s=sec(el,'Wat draait er?');for(const [ic,t,txt] of [['💥','Actiefilm','Veel explosies, weinig verhaal.'],['😂','Komedie','Je lacht zo hard dat je popcorn morst.'],['👻','Horrorfilm','Je slaapt vannacht met het licht aan.'],['💕','Romantische film','Je pinkt een traantje weg.'],['🧸','Animatiefilm','Leuker dan verwacht.'],['📽️','Arthousefilm','Je snapt er niks van, maar voelt je cultureel.']])
  row(s,{ic,t,s:fmt(13),dis:S.money<13&&ageY()>=18,on:()=>doAct(t,()=>{if(ageY()>=18)cash(-13);const m=use('film');hap(ri(2,5)*m);return txt},true,ic)})}
function sheetSurgery(el){const s=sec(el,'Behandelingen');for(const [ic,t,k] of [['👃','Neuscorrectie',6000],['🫃','Liposuctie',4500],['🧑','Facelift',12000],['💇','Haartransplantatie',5000],['😁','Tanden bleken',600],['💉','Botox',400]])
  row(s,{ic,t,s:fmt(k),dis:S.money<k,dots:true,on:()=>doAct(t,()=>{cash(-k);if(chance(k<1000?.05:.12)){loo(-ri(5,15));hap(-8);return 'Het is mislukt. Je ziet er slechter uit dan eerst.'}loo(k<1000?ri(1,4):ri(6,15));hap(4);return 'De behandeling is geslaagd!'},true,ic)})}
function adoptPopup(){modal({title:'Adoptie',em:'🧸',cat:'Activiteiten',text:`Een kind adopteren kost ${fmt(15000)} aan procedures.`,choices:opts([{t:'Adopteren',cls:'go',dis:S.money<15000,on:()=>{closeModal();adopt();closeSheet();processQ()}}])})}
function fertility(){modal({title:'Vruchtbaarheidskliniek',em:'🧬',cat:'Activiteiten',text:`Een IVF-traject kost ${fmt(9000)}.${partner()?'':' Je gaat het alleen doen, met een donor.'}`,choices:opts([{t:'Behandeling starten',dis:S.money<9000||!!S.preg,on:()=>{closeModal();doAct('IVF',()=>{cash(-9000);const f=partner()?fertile():(S.p.g==='v'?(ageY()<35?.5:ageY()<42?.3:.08):.35);if(chance(Math.min(.85,f+.3))){S.preg={due:S.m+9,twins:chance(.12)};hap(10);return 'Het is gelukt! Er is een baby onderweg.'}hap(-6);return 'Helaas, de behandeling slaagt niet.'},true,'🧬')}}])})}
function fightBet(){const a=pick(['"De Hamer" Jansen','Lisa "Lightning" Vos','"Beer" Bakker','Mo "De Tornado" Idrissi']),b=pick(['"Ijzeren" Henk','Sanne "Storm" Mulder','"Kleine" Kees','"De Muur" Meijer']);const oa=+(1.4+R()*1.6).toFixed(1),ob=+(1.4+R()*1.6).toFixed(1);
  modal({title:'Gevechten wedden',em:'🥊',cat:'Activiteiten',text:`${a} (${oa}×) tegen ${b} (${ob}×). Op wie zet je in?`,choices:opts([[a,oa],[b,ob]].map(([n,o])=>({t:`${n} · ${o}×`,on:()=>{closeModal();amountModal('Inzet',Math.min(S.money,100000),v=>doAct('Gevechten wedden',()=>{cash(-v);if(chance(.92/o)){const w=Math.round(v*o);cash(w);hap(5);return `${n} wint! Je krijgt ${fmt(w)}.`}hap(-1);return `${n} gaat knock-out. Je inzet is weg.`},true,'🥊'))}})))})}
function horses(){const hs=['Bliksem','Zwarte Parel','Stoere Sjaak','Gouden Hoef','Mistral','Lucky Lucy'].map(n=>({n,o:+(1.8+R()*9).toFixed(1)}));
  modal({title:'Paardenrennen',em:'🏇',cat:'Activiteiten',text:'Op welk paard zet je in?',choices:opts(hs.map(h=>({t:`${h.n} · ${h.o}×`,on:()=>{closeModal();amountModal('Inzet',Math.min(S.money,100000),v=>doAct('Paardenrennen',()=>{cash(-v);if(chance(.9/h.o)){const w=Math.round(v*h.o);cash(w);hap(6);return `${h.n} komt als eerste over de streep! Je wint ${fmt(w)}.`}hap(-1);return `${h.n} eindigt ergens in de achterhoede.`},true,'🏇'))}})))})}
function lawsuit(){const targets=[['Je buren','🏘️',.35,[2,20]],['Een fastfoodketen','🍔',.15,[20,500]],['Je werkgever','💼',.3,[5,80]],['Een ziekenhuis','🏥',.2,[10,300]]];const ex=pickLiving('ex');if(ex)targets.push([`Je ex ${ex.first}`,'💔',.3,[1,30]]);
  modal({title:'Rechtszaak',em:'⚖️',cat:'Activiteiten',text:`Een advocaat kost ${fmt(2500)}. Wie klaag je aan?`,choices:opts(targets.map(([t,ic,p,[lo,hi]])=>({t:`${ic} ${t}`,dis:S.money<2500,on:()=>{closeModal();doAct('Rechtszaak',()=>{cash(-2500);use('law');if(chance(p)){const w=ri(lo,hi)*1000;cash(w);hap(6);return `De rechter geeft je gelijk! Je krijgt ${fmt(w)}.`}hap(-2);return 'De rechter wijst je eis af.'},true,'⚖️')}})))})}
function lottery(){modal({title:'Loterij',em:'💰',cat:'Activiteiten',text:'Hoeveel loten koop je?',choices:opts([[1,'1 lot'],[10,'10 loten'],[100,'100 loten']].map(([n,t])=>({t:`${t} (${fmt(n*3)})`,dis:S.money<n*3,on:()=>{closeModal();doAct('Loterij',()=>{cash(-n*3);S.flags.lotto=1;const jp=[1/3e6,1/1.5e6,1/1e5][S.settings.chaos];let w=0;for(let i=0;i<n;i++){if(chance(jp)){const big=ri(1,30)*1e6;cash(big);S.flags.jackpot=1;MS(`Won ${fmt(big)} in de loterij`,4);hap(25);return `JACKPOT! Je wint ${fmt(big)}!`}if(chance(1/40))w+=ri(1,10)*5}cash(w);return w?`Je wint ${fmt(w)}.`:'Niks gewonnen.'},true,'💰')}})))})}
function pray(){doAct('Bidden',()=>{const m=use('pray');const r=R();if(r<.08*m){const k=pick(['happy','health','smarts','looks']);st(k,ri(3,8));return 'Je gebed wordt verhoord!'}return pick(['Je bidt, maar er gebeurt niks.','Je voelt een vreemde rust.','Ergens lacht een programmeur.'])},true,'🙏')}
function sweep(){doAct('Winactie',()=>{if(S.acts.sweep)return 'Je hebt dit jaar al meegedaan.';S.acts.sweep=1;if(chance(1/60)){const w=pick([500,2500,10000]);cash(w);hap(8);return `Je wint ${fmt(w)}!`}return 'Helaas, geen prijs. Wel een nieuwsbrief.'},true,'🎁')}
function volunteer(){doAct('Vrijwilligerswerk',()=>{const k=use('vrij');kar(4*k);hap(2*k);sk('sociaal',1);return pick(['Je helpt in een buurthuis.','Je leest voor aan ouderen.','Je ruimt zwerfafval op.'])},true,'🤲')}
function zoo(){doAct('Dierentuin',()=>{if(ageY()>=18)cash(-28);const k=use('zoo');hap(3*k);return pick(['De pinguïns zijn je favoriet.','Een aap gooit iets naar je. Je wil niet weten wat.','De leeuw kijkt je recht in de ogen.'])},true,'🦓')}

/* ================= PROFIEL & MENU ================= */
function eduLabel(){let best=null;for(const d of S.edu.deg)if(!best||(ERANK[d.ty]||0)>(ERANK[best.ty]||0))best=d;if(S.edu.cur&&!best)return 'Bezig: '+S.edu.cur.name;if(!best)return S.edu.stage==='basis'?'Basisschool':S.edu.stage==='middel'?'Middelbare school':'Geen';return cap(`${ENAME[best.ty]||best.ty}${best.f?' '+STUDIES.find(x=>x.id===best.f).t:''}`)}
function profilePopup(){const pt=partner();const ms=pt?(pt.st==='getrouwd'?'Getrouwd met '+pt.first:pt.st==='verloofd'?'Verloofd met '+pt.first:'Relatie met '+pt.first):S.rel.some(p=>p.wid)?'Weduwe/weduwnaar':'Single';
  const rows=[['Geslacht',{m:'Man',v:'Vrouw',x:'Non-binair'}[S.p.g]],['Leeftijd',ageY()],...(S.talent&&S.talent!=='geen'?[['Talent',TAL(S.talent)[1]+' '+TAL(S.talent)[2]]]:[]),['Discipline',(S.disc??50)+'%'],['Burgerlijke staat',ms],['Opleiding',eduLabel()],['Beroep',S.job?jobTitle():subtitle()],['Woonplaats',`${S.p.city}, ${C().n}`]];
  const st=[['Geluk',S.st.happy],['Gezondheid',S.st.health],['Slimheid',S.st.smarts],['Uiterlijk',S.st.looks]];if(S.fame>0)st.push(['Roem',S.fame]);
  modal({title:'Profiel',em:'🔍',cat:'Jij',person:{first:S.p.first,last:S.p.last},pface:playerFace(),close:true,
    html:`<div class="ptable">${rows.map(([k,v])=>`<div><b>${k}:</b> ${he(v)}</div>`).join('')}</div><div class="pstats">${st.map(([k,v],i)=>`<span>${k}</span><i><b style="width:${Math.round(v)}%;background:${i===4?'var(--mid)':statCol(v)}"></b></i>`).join('')}</div>`,
    choices:[{t:'Meer details',cls:'ghost',on:()=>{closeModal();openSheet('Profiel',sheetProfile)}}]})}
function sheetProfile(el){
  const k=S.karma;const kd=k>80?'Een heilige':k>60?'Een goed mens':k>40?'Gemiddeld':k>20?'Twijfelachtig':'Door en door slecht';
  card(el,`<h3>${playerFace()} ${he(S.p.first+' '+S.p.last)}</h3><span class="muted">${ageY()} jaar · ${he(S.p.city)}, ${C().n} · generatie ${S.gen}</span>${kv([['Karma',kd],['Roem',Math.round(S.fame)+'%'],['Volgers',Math.round(S.foll).toLocaleString('nl-NL')],['Netto vermogen',fmt(netWorth())],['Rijbewijs',S.lic?'Ja':'Nee']])}`);
  card(el,`<h3>Vaardigheden</h3>${Object.entries(SKN).map(([k,n])=>`<div class="stat"><span>${n}</span><span></span><span class="v">${S.sk[k]}</span>${bar(S.sk[k],'var(--brand)')}</div>`).join('')}`);
  const j=sec(el,'Loopbaan');const hs=S.jobs.slice().reverse();if(S.job)row(j,{ic:jobEm(S.job.id),t:jobTitle(),s:`${S.job.co||'Huidige baan'} · ${S.job.yrs} jaar`});for(const h of hs)row(j,{ic:'📁',t:h.t,s:`${h.co||''}${h.co?' · ':''}${h.y} jaar`});if(!S.job&&!hs.length)empty(j,'Nog geen werkervaring.');
  if(S.ill.length){const i=sec(el,'Gezondheid');for(const il of S.ill)row(i,{ic:'🤒',t:cap(il.n),s:'Ga naar de dokter bij Activiteiten'})}
  if(S.crim.rec.length){const c=sec(el,'Strafblad');for(const r of S.crim.rec)row(c,{ic:'🚨',t:r.w,s:`Op ${r.a}-jarige leeftijd`})}
}
function sheetMain(el){
  let s=sec(el,'Mijn levens');
  row(s,{ic:'💥',t:'Nieuw leven',s:'Bewaar dit leven en begin een nieuw',dots:true,on:()=>{saveLife();closeSheet();openCreate()}});
  row(s,{ic:'💾',t:'Leven opslaan',s:'Sla dit leven op',dots:true,on:()=>{saveLife();toast(CL.ready?'Opgeslagen in je account':'Opgeslagen op dit apparaat')}});
  row(s,{ic:'👥',t:'Lopende levens',s:'Laad een opgeslagen leven',on:()=>openSheet('Lopende levens',sheetLives,true)});
  s=sec(el,'Spel');
  row(s,{ic:'⏱️',t:'Tempo',s:S.settings.mode==='year'?'Per jaar (tik om te wisselen)':'Per maand (tik om te wisselen)',dots:true,on:()=>{S.settings.mode=S.settings.mode==='year'?'month':'year';render();refreshSheet();saveLife();toast(S.settings.mode==='year'?'Je speelt nu per jaar':'Je speelt nu per maand')}});
  row(s,{ic:'👨‍👩‍👧‍👦',t:'Grote familie',s:(S.settings.bigFam?'Aan':'Uit')+' · grootouders, ooms, tantes, neven, nichten, schoonfamilie (tik om te wisselen)',dots:true,on:()=>{S.settings.bigFam=S.settings.bigFam?0:1;if(S.settings.bigFam)ensureBigFam();refreshSheet();saveLife();toast(S.settings.bigFam?'Grote familie staat aan':'Grote familie staat uit')}});
  row(s,{ic:'⭐',t:'Favoriete activiteiten',s:`${favs().length} van 5 gekozen · deze staan bovenaan bij Activiteiten`,on:()=>openSheet('Favorieten',sheetFavs,true)});
  row(s,{ic:'🌀',t:'Chaos',s:['Rustig','Normaal','Chaos'][S.settings.chaos]+' (tik om te wisselen)',dots:true,on:()=>{S.settings.chaos=(S.settings.chaos+1)%3;refreshSheet();saveLife()}});
  row(s,{ic:'🌪️',t:'Tijdmachine',s:'Spoel 1, 3, 5 of 10 jaar terug',on:()=>openSheet('Tijdmachine',sheetRewind,true)});
  s=sec(el,'Verzameling');checkAch();const M=meta();
  row(s,{ic:'🏆',t:`Prestaties (${(S.ach||[]).length}/${ACH.length})`,s:'Behaal ze allemaal',on:()=>openSheet('Prestaties',sheetAch,true)});
  row(s,{ic:'💼',t:`Carrières (${M.careers.length}/${JOBS.length})`,s:'Verzamel ze allemaal, over al je levens',on:()=>openSheet('Carrières',sheetCareers,true)});
  row(s,{ic:'🎗️',t:`Linten (${M.ribbons.length}/${RIB.length})`,s:'Verdien ze allemaal met je levens',on:()=>openSheet('Linten',sheetRibbons,true)});
  s=sec(el,'Statistieken');
  row(s,{ic:'💀',t:'Begraafplaats',s:'Vergelijk je vorige levens',on:()=>openSheet('Begraafplaats',sheetCemetery,true)});
  row(s,{ic:'🌳',t:'Stamboom',s:`Generatie ${S.gen}`,on:()=>openSheet('Stamboom',sheetTree,true)});
  row(s,{ic:'🔎',t:'Profiel',s:'Vaardigheden, loopbaan, strafblad',on:()=>openSheet('Profiel',sheetProfile,true)});
  {const n=errList().length;row(sec(el,'Hulp'),{ic:'🩺',t:'Foutenlog',s:n?`${n} ${n===1?'fout':'fouten'} opgevangen · stuur een schermafbeelding naar Claude`:'Geen fouten opgevangen',on:()=>openSheet('Foutenlog',sheetErrors,true)})}
  versionLine(el);
}
function sheetLives(el){const s=sec(el,'');const ls=Object.values(STORE.lives).filter(l=>!l.done&&l.alive).sort((a,b)=>(b.updated||0)-(a.updated||0));
  for(const l of ls)row(s,{ic:l.id===S.id?'▶️':'🧑',t:`${l.p.first} ${l.p.last}`,s:`${Math.floor(l.m/12)} jaar · ${COUNTRIES[l.p.country].n} · generatie ${l.gen}${l.id===S.id?' · nu bezig':''}`,on:l.id===S.id?null:()=>{saveLife();closeSheet();loadLife(l.id)}})}
function sheetAch(el){const got=S.ach||[];const s=sec(el,'');for(const [k,n,d] of ACH)row(s,{ic:got.includes(k)?'🏆':'🔒',t:n,s:d,cls:got.includes(k)?'':'',dis:!got.includes(k)})}
function sheetCareers(el){const M=meta();const s=sec(el,'');for(const j of JOBS.filter(x=>x.id!=='voetbal')){const has=M.careers.includes(j.id);row(s,{ic:has?jobEm(j.id):'❓',t:has?j.lad[0]:'???',s:has?(j.lad.length>1?'Top: '+j.lad[j.lad.length-1]:'Ontdekt'):'Nog niet ontdekt',dis:!has})}}
function sheetRibbons(el){const M=meta();const s=sec(el,'');for(const [n,ic,d] of RIB){const has=M.ribbons.includes(n);row(s,{ic:has?ic:'🔒',t:n,s:d,dis:!has})}}
function sheetCemetery(el){const s=sec(el,'');const ls=Object.values(STORE.lives).filter(l=>l.done||!l.alive).map(l=>l.done?l:{id:l.id,name:`${l.p.first} ${l.p.last}`,by:l.p.by,age:l.died,score:'?',ribbon:l.ribbon}).sort((a,b)=>(+b.score||0)-(+a.score||0));
  if(!ls.length)empty(s,'Nog niemand begraven.');for(const l of ls)row(s,{ic:'💀',t:l.name,s:`${l.by} · ${l.age} jaar · score ${l.score}${l.ribbon?' · '+l.ribbon:''}`,on:l.story?()=>storyModal(l):null})}
function sheetRewind(el){const s=sec(el,'Hoe ver terug?');for(const n of [1,3,5,10]){const t=rewindTarget(n);row(s,{ic:'⏪',t:`${n} jaar terug`,s:t?`Terug naar je ${t.m/12}e verjaardag`:'Nog niet zo ver mogelijk',dis:!t,dots:true,on:()=>{rewind(n);closeSheet();show('game');render();saveLife();toast(`Teruggespoeld naar je ${ageY()}e`)}})}
  empty(el,'Je kunt tot 10 jaar terugspoelen, ook nadat je overleden bent.')}
function sheetTree(el){const s=sec(el,'Generaties');for(const g of S.gens)row(s,{ic:'💀',t:g.name,s:`${g.by} · ${g.age} jaar · score ${g.score}`,on:STORE.lives[g.id]&&STORE.lives[g.id].done?()=>storyModal(STORE.lives[g.id]):null});row(s,{ic:faceEmoji(),t:`${S.p.first} ${S.p.last}`,s:`${S.p.by} · nu ${ageY()} jaar`})}

/* ================= DOOD ================= */
const RIB=[['Opgegeven','🏳️','Geef het op'],['Staatsman','🏛️','Word minister-president'],['Legende','⭐','Sterf zeer beroemd'],['Crimineel','🦹','Word drie keer veroordeeld'],['Steenrijk','💎','Sterf met 10 miljoen of meer'],['Familiemens','👨‍👩‍👧‍👦','Krijg 4 of meer kinderen'],['Heilige','😇','Sterf met heel veel karma'],['Schurk','😈','Sterf met heel weinig karma'],['Ongelukkig','😢','Leef een ongelukkig leven'],['Gelukzalig','😊','Leef een heel gelukkig leven'],['Jong gestorven','🥀','Sterf voor je 30e'],['Taai','🐢','Word 95 of ouder'],['Topper','🏆','Bereik de top van je vak'],['Blut','🪙','Sterf met schulden'],['Gewoon','🙂','Leef een doodgewoon leven']];
function epithet(){const nw=netWorth(),avg=S.hist.n?S.hist.happy/S.hist.n:S.st.happy;
  if(S.cause==='opgegeven')return'Opgegeven';if(S.flags.premier)return'Staatsman';if(S.fame>=80)return'Legende';if(S.crim.rec.length>=3)return'Crimineel';if(nw>=1e7)return'Steenrijk';if(people('kind').length>=4)return'Familiemens';
  if(S.karma>=85)return'Heilige';if(S.karma<=15)return'Schurk';if(avg<35)return'Ongelukkig';if(avg>=75)return'Gelukzalig';if(S.died<30)return'Jong gestorven';if(S.died>=95)return'Taai';if(S.flags.top)return'Topper';if(nw<0)return'Blut';return'Gewoon'}
let deathView='stone';
function showDeath(){closeSheet();closeModal();show('death');deathView='stone';drawDeath();saveLife()}
function drawDeath(){deathView==='stone'?drawStone():drawStory()}
function drawStone(){
  const rib=epithet();S.ribbon=rib;const M=meta();if(!M.ribbons.includes(rib)){M.ribbons.push(rib);lsSave()}const ribEm=(RIB.find(r=>r[0]===rib)||[])[1]||'';
  const hij=S.p.g==='v'?'Haar':S.p.g==='m'?'Zijn':'Diens';
  const zn=S.p.g==='v'?'haar':S.p.g==='m'?'zijn':'diens';const lst=a=>a.length>1?a.slice(0,-1).join(', ')+' en '+a[a.length-1]:a[0];const names=ps=>lst(ps.map(p=>p.first));
  const grp=[];const pa=people('partner').filter(p=>p.alive)[0];if(pa)grp.push(`${zn} ${partnerWord(pa)} ${pa.first}`);
  const ks=living('kind');if(ks.length)grp.push(`${zn} ${ks.length===1?(ks[0].g==='v'?'dochter':'zoon'):'kinderen'} ${names(ks)}`);
  const ou=living(['moeder','vader']);if(ou.length)grp.push(ou.length===2?`${zn} ouders`:`${zn} ${ou[0].role} ${ou[0].first}`);
  const sb=living(['broer','zus']);if(sb.length)grp.push(sb.length===1?`${zn} ${sb[0].role} ${sb[0].first}`:`${sb.length} broers en zussen`);
  const kk=living('kleinkind');if(kk.length)grp.push(`${kk.length} kleinkind${kk.length===1?'':'eren'}`);
  const vr=living('vriend');if(vr.length)grp.push(vr.length===1?`${zn} vriend${vr[0].g==='v'?'in':''} ${vr[0].first}`:`${vr.length} vrienden`);
  const fun=grp.length?`${hij} uitvaart werd bijgewoond door ${lst(grp)}.`:S.fame>=40?'Er kwamen vooral fans en journalisten naar de uitvaart.':'Er kwam bijna niemand naar de uitvaart.';
  const adj=[S.st.looks>70?'knappe':S.st.looks<30?'onopvallende':'',S.st.smarts>70?'slimme':S.st.smarts<30?'eenvoudige':''].filter(Boolean).join(' en ')||'bijzondere';
  const who=S.p.g==='v'?'vrouw':S.p.g==='m'?'man':'persoon';const car=(S.pex&&S.pex.r>=3?S.pex.t:null)||S.hist.topJob||(S.job?jobTitle():S.jobs.length?S.jobs[S.jobs.length-1].t:'');
  const epi=`Een ${adj} ${who}${car?`, die het bracht tot ${car.toLowerCase()}`:''}${S.fame>=50?' en wereldberoemd werd':''}.`;
  const cause=S.cause==='opgegeven'?`${S.p.first} gaf het op, ${S.died} jaar oud.`:`${S.p.first} overleed op ${S.died}-jarige leeftijd ${causeTxt(S.cause)}.`;
  const lovers=S.rel.filter(p=>p.role==='partner'||(p.role==='ex'&&p.lost)).length;const avg=S.hist.n?S.hist.happy/S.hist.n:S.st.happy;
  $('#death').innerHTML=`<div class="grave gut"><div class="stone"><div class="ribbon">${he(rib)}</div><div class="skull">💀</div><h1>${he(S.p.first+' '+S.p.last)}</h1><h2>${S.died} jaar oud</h2>
    <div class="sstats"><div><b>Vermogen:</b> ${fmt(netWorth())}</div><div><b>Woonplaats:</b> ${he(S.p.city)}, ${C().n}</div><div><b>Carrière:</b> ${he(car||'Geen')}</div><div><b>Opleiding:</b> ${he(eduLabel())}</div><div><b>Geliefden:</b> ${lovers}</div></div>
    <p class="sdesc">${he(cause)} ${he(fun)}</p><p class="sdesc">${he(epi)}</p><div class="shap"><span>Geluk</span><span class="sbar"><i style="width:${Math.round(avg)}%"></i></span></div></div>
    <button class="gbtn" id="d-cont">Verder</button><button class="undo" id="d-undo">Maak je dood ongedaan met de tijdmachine!</button></div>`;
  $('#death').scrollTop=0;
  $('#d-cont').onclick=()=>{deathView='story';drawDeath()};
  $('#d-undo').onclick=()=>modal({title:'Tijdmachine',em:'🌪️',cat:'Terugspoelen',text:'Hoe ver wil je terug?',choices:opts([1,3,5,10].map(n=>{const t=rewindTarget(n);return{t:t?`${n} jaar terug (naar je ${t.m/12}e)`:`${n} jaar terug`,dis:!t,on:()=>{closeModal();rewind(n);show('game');render();saveLife();toast(`Teruggespoeld naar je ${ageY()}e`)}}}))});
}
function drawStory(){
  const sc=lifeScore(),stry=story();checkAch();const got=S.ach||[];
  let h=`<div class="rip gut"><small>Levensverhaal</small><h1>${he(S.p.first+' '+S.p.last)}</h1><span class="dates">${S.p.by} – ${year()} · ${S.died} jaar</span><div class="score" style="--p:${sc}"><b>${sc}<em>score</em></b></div></div>
  <div class="gut"><div class="story">${stry.map((p,i)=>`<p class="${i?'':'first'}">${he(p)}</p>`).join('')}</div>`;
  h+=`<div class="dsec"><p class="sec-l">Prestaties</p><div class="achs">${got.length?got.map(k=>`<span class="ach">${ACH.find(a=>a[0]===k)[1]}</span>`).join(''):'<span class="muted">Geen prestaties behaald.</span>'}</div></div>`;
  h+=`<div class="dsec"><p class="sec-l">Terugspoelen</p><div class="btnrow">${[1,3,5,10].map(n=>`<button class="btn sm" data-rw="${n}" ${rewindTarget(n)?'':'disabled'}>${n} jaar</button>`).join('')}</div></div>`;
  if(typeof legacyHtml==='function')h+=timelineHtml()+numbersHtml()+legacyHtml();
  const PL=typeof estatePlan==='function'?estatePlan():[];
  const hs=living('kind');h+=`<div class="dsec"><p class="sec-l">Verder spelen als je kind</p>${hs.length?hs.map(k=>`<button class="savecard" data-heir="${k.id}"><span class="av" style="background:var(--good-soft);font-size:26px">${faceOf(k)}</span><span class="meta"><b>${he(k.first)}${k.disown?' · onterfd':''}</b><small>${relWord(k)} · ${pAge(k)} jaar${k.job?' · '+he(k.job):''}${(PL.find(x=>x.id===k.id)||{}).net?` · erft ${fmt(PL.find(x=>x.id===k.id).net)}`:''}</small></span><span class="mchev"></span></button>`).join(''):'<p class="muted" style="margin:0">Geen kinderen om het leven mee voort te zetten.</p>'}</div>`;
  h+=`<div class="dsec" style="padding-bottom:12px"><button class="btn go" id="d-new">Nieuw leven beginnen</button><button class="btn ghost" id="d-home">Mijn levens</button></div></div>`;
  const el=$('#death');el.innerHTML=h;el.scrollTop=0;
  el.querySelectorAll('[data-rw]').forEach(b=>b.onclick=()=>{rewind(+b.dataset.rw);show('game');render();saveLife();toast(`Teruggespoeld naar je ${ageY()}e`)});
  el.querySelectorAll('[data-heir]').forEach(b=>b.onclick=()=>{const k=P(b.dataset.heir);modal({title:`Verder als ${k.first}?`,em:faceOf(k),cat:'Erfenis',text:`Je speelt verder als ${k.first} (${pAge(k)}) en erft ${(()=>{const x=(estatePlan().find(y=>y.id===k.id));return x?`${Math.round(x.pct*100)}% van de nalatenschap: ${fmt(x.net)}${x.tax?` na ${fmt(x.tax)} erfbelasting`:''}${x.pct>=.5&&S.props.length?', inclusief de huizen':''}`:'niets: niet genoemd in het testament'})()}. ${S.p.first}s leven wordt bewaard in de stamboom.`,choices:opts([{t:'Verder spelen',cls:'go',on:()=>{closeModal();inherit(k.id)}}])})});
  $('#d-new').onclick=()=>openCreate();$('#d-home').onclick=()=>{renderStart();show('start')};
}
function inherit(cid){
  const old=S,ch=old.rel.find(p=>p.id===cid);const age=pAge(ch);
  const sp=partner();const PLAN=estatePlan();const mine=PLAN.find(x=>x.id===cid)||{pct:0,net:0,tax:0};const takeAssets=mine.pct>=.5;
  const assetNet=takeAssets?old.props.reduce((a,p)=>a+p.value-p.mort,0)+(old.re||[]).reduce((a,p)=>a+p.value-p.mort,0):0;let share=Math.max(0,Math.round(mine.net-assetNet));const tax=mine.tax;
  const rec={done:true,id:old.id,fam:old.fam,gen:old.gen,name:`${old.p.first} ${old.p.last}`,by:old.p.by,age:old.died,cause:old.cause,story:story(),score:lifeScore(),ach:old.ach||[],ribbon:old.ribbon||epithet(),updated:Date.now(),country:old.p.country,city:old.p.city};
  const curY=year(),curMo=monthIdx();const nm=old.m-ch.born;const bm=((curMo-nm)%12+12)%12+1;
  const n=blankState({first:ch.first,last:ch.last,g:ch.g,country:old.p.country,city:old.p.city,by:curY-Math.floor((bm-1+nm)/12),bm,gen:old.gen+1,fam:old.fam,mode:old.settings.mode,chaos:old.settings.chaos,gens:old.gens.concat([{name:rec.name,by:rec.by,age:rec.age,score:rec.score,id:old.id,ap:old.ap,g:old.p.g,job:old.hist&&old.hist.topJob||'',partner:(old.rel.find(p=>p.role==='partner'||p.wid)||{}).first||'',kids:old.rel.filter(p=>p.role==='kind').length}]),bigFam:old.settings.bigFam});
  n.m=nm;n.st={happy:50,health:ri(70,95),smarts:ch.smarts,looks:ch.looks};n.karma=55;n.cpi=old.cpi||1;n.ap=ch.ap||apMix(old.ap,null,ch.g);n.talent='geen';n.disc=ri(30,70);n.fert=ri(45,90);n.econ=Object.assign({},old.econ||{s:'normaal',y:0});share+=Math.max(0,Math.round(ch.money||0));
  const sh=b=>b-ch.born;
  n.rel.push({id:uid(),ap:old.ap,role:old.p.g==='v'?'moeder':'vader',g:old.p.g==='v'?'v':'m',first:old.p.first,last:old.p.last,born:sh(0),rel:ch.rel,alive:false,died:Math.floor(nm/12),looks:old.st.looks,smarts:old.st.smarts,money:0,job:''});
  const op=ch.op&&old.rel.find(p=>p.id===ch.op);
  if(op)n.rel.push(Object.assign({},op,{id:uid(),role:op.g==='v'?'moeder':'vader',born:sh(op.born),st:'',rel:ri(55,85),money:sp&&sp.id===op.id?share:op.money}));
  for(const o of old.rel.filter(p=>p.role==='kind'&&p.id!==cid))n.rel.push(Object.assign({},o,{id:uid(),role:o.g==='v'?'zus':'broer',born:sh(o.born),rel:ri(45,80)}));
  for(const o of old.rel.filter(p=>p.role==='kleinkind'&&p.par===cid))n.rel.push(Object.assign({},o,{id:uid(),role:'kind',born:sh(o.born),rel:ri(65,90)}));
  if(old.settings.bigFam){n.flags.bigGen=1;const map={broer:'oom',zus:'tante',moeder:'oma',vader:'opa',neefje:'neef',nichtje:'nicht'};for(const o of old.rel.filter(p=>map[p.role]&&(p.alive||['moeder','vader'].includes(p.role))))n.rel.push(Object.assign({},o,{id:uid(),role:o.role==='neefje'||o.role==='nichtje'?(o.g==='v'?'nicht':'neef'):map[o.role],born:sh(o.born),died:o.alive?o.died:(o.died!=null?o.died-Math.floor(ch.born/12):undefined),rel:ri(40,75)}))}
  for(const o of old.rel.filter(p=>p.role==='huisdier'&&p.alive))n.rel.push(Object.assign({},o,{id:uid(),born:sh(o.born)}));
  if(age<18){n.money=0;n.trust=share}else n.money=share;n.biz=old.biz;n.flags.wealth=share>500000?'rijk':share>20000?'midden':'arm';
  S=n;
  if(!(typeof dictInherit==='function'&&dictInherit(old,cid,age))){if(old.dict&&old.dict.heir&&old.dict.heir!==cid){const h=old.rel.find(p=>p.id===old.dict.heir&&p.alive!==false);if(h){n.dfam={cc:old.p.country,t:old.dict.title,n:`${h.first} ${h.last||old.p.last}`};L(`Je ${h.g==='v'?'zus':'broer'} ${h.first} volgt je ${old.p.g==='v'?'moeder':'vader'} op als ${old.dict.title.toLowerCase()}. Als familie van het regime betaal je geen belasting.`,'big')}}else if(old.dfam&&!old.dfam.lost)n.dfam=old.dfam;
    if(old.pw)n.pw=old.pw;if(old.eco)n.eco=old.eco;if(old.war){n.war=old.war;n.war.blameY=0}}
  const E=n.edu;if(age>=4)E.stage=age<12?'basis':age<18?'middel':'klaar';
  if(age>=12&&age<18){E.lvl=ch.smarts>=66?'vwo':ch.smarts>=47?'havo':'vmbo';E.len={vmbo:4,havo:5,vwo:6}[E.lvl];E.yrs=Math.min(E.len-1,age-12)}
  if(age>=18){const lv=ch.smarts>=66?'vwo':ch.smarts>=47?'havo':'vmbo';E.deg.push({ty:lv});if(age>=22){const f=pick(STUDIES);if(ch.smarts>=66&&f.ty.includes('wo'))E.deg.push({ty:'wo',f:f.id});else if(ch.smarts>=50&&f.ty.includes('hbo'))E.deg.push({ty:'hbo',f:f.id});else E.deg.push({ty:'mbo',f:pick(STUDIES.filter(x=>x.ty.includes('mbo'))).id})}}
  if(age>=18)n.home={k:'huur',name:'Appartement',rent:Math.round(16500*n.cpi)};
  if(age>=22&&age<67){const o=JOBS.filter(j=>!j.part&&!j.fame&&!j.pol&&!jobReqs(j).length);const mine=o.filter(inMySector);const pool=mine.length?mine:o;if(pool.length){const j=pick(pool);const st=startFor(j);setJob(j.id,Math.min(j.lad.length-1,(st?st.lvl:0)+Math.floor((age-22)/8)));S.job.yrs=Math.max(0,age-22)}}
  if(age>=aowAge())setPension();if(old.lic&&age>=18)n.lic=true;
  if(takeAssets){n.props=old.props;n.re=old.re||[];if(age>=18&&old.home.k==='eigen'&&old.props.some(p=>p.id===old.home.pid))n.home={k:'eigen',pid:old.home.pid}}
  if(old.will&&old.will.voogd&&age<18){const v=old.rel.find(p=>p.id===old.will.voogd);if(v)L(`${v.first} wordt je voogd, zoals in het testament stond.`)}
  L(`Je speelt verder als ${ch.first} ${ch.last}, ${age} jaar oud, ${relWord(ch)} van ${old.p.first}.`,'big');
  const sold=[old.props.length?`${old.props.length} ${old.props.length===1?'huis':'huizen'}`:'',old.cars.length?`${old.cars.length} ${old.cars.length===1?'auto':'auto\'s'}`:'',old.items.length?`${old.items.length} bezitting${old.items.length===1?'':'en'}`:''].filter(Boolean);
  L(`Van de nalatenschap van ${old.p.first} erf je ${Math.round(mine.pct*100)}%: ${fmt(share)}${tax?` (na ${fmt(tax)} erfbelasting)`:''}.${takeAssets&&old.props.length?` Je krijgt ook ${old.props.length===1?'het huis':'de huizen'}.`:''}${sold.length&&!takeAssets?` De ${sold.join(', ')} ${sold.length>1||/huizen|auto's|bezittingen/.test(sold[0])?'zijn':'is'} verkocht en verdeeld; hypotheken zijn eerst afgelost.`:''}${age<18?' Je erfdeel staat vast tot je 18 bent.':''}${n.biz.length?' Je neemt ook het familiebedrijf over: '+n.biz.map(b=>b.name).join(', ')+'.':''}`,'good');
  MS(`Begon als ${relWord(ch)} van ${old.p.first} ${old.p.last}`,0);
  Q=[];if(typeof inheritFeud==='function')inheritFeud(old,PLAN,cid,n);snap();STORE.lives[old.id]=rec;cloudQueue(old.id);
  saveLife();show('game');render();if(Q.length)processQ();
}
function storyModal(r){modal({title:r.name,em:'📜',cat:`${r.by} · ${r.age} jaar`,html:r.story.map(p=>`<p style="font-size:15.5px;text-align:left;margin:0">${he(p)}</p>`).join('')+`<p style="margin:0"><b>Score ${r.score}${r.ribbon?' · '+he(r.ribbon):''}</b></p>`,choices:[{t:'Sluiten',cls:'ghost',on:closeModal}]})}

/* ================= MINIGAMES ================= */
function mgTap(title,desc,cb){if(!spendE(1))return;PREPAID=1;let n=0,started=false,done=false,t0=0,raf=0;
  openRaw(`<div class="mhead dark"><small>Minigame · 6 seconden</small><h3>${he(title)}</h3></div><div class="mbody"><p>${he(desc)}</p><div class="big-n" id="tn" style="text-align:center">0</div><div class="timer"><i id="tt" style="width:100%;transition:none"></i></div><button class="btn go tapbtn" id="tb">Tik zo snel als je kunt!</button></div>`);
  const tb=$('#tb');
  const tick=()=>{if(!$('#tt')){done=true;return}const el=(performance.now()-t0)/1000;$('#tt').style.width=Math.max(0,100-el/6*100)+'%';if(el>=6)end();else raf=requestAnimationFrame(tick)};
  const end=()=>{if(done)return;done=true;cancelAnimationFrame(raf);tb.disabled=true;tb.textContent=`${n} keer!`;setTimeout(()=>{closeModal();cb(Math.min(1,n/45),n)},700)};
  tb.addEventListener('pointerdown',e=>{e.preventDefault();if(done)return;if(!started){started=true;t0=performance.now();raf=requestAnimationFrame(tick)}n++;$('#tn').textContent=n;haptic(4)})}
function mgMemory(title,desc,len,cb){if(!spendE(1))return;PREPAID=1;const sy=['📊','💡','🤝','📈','🎯','🚀'];const seq=Array.from({length:len},()=>pick(sy));let i=0,phase='show',done=false;
  openRaw(`<div class="mhead dark"><small>Minigame · geheugen</small><h3>${he(title)}</h3></div><div class="mbody"><p>${he(desc)}</p><div class="memshow" id="ms">👀</div><div class="dots" id="md">${'<i></i>'.repeat(len)}</div><div class="memgrid">${sy.map(s=>`<button class="memb" data-s="${s}" disabled>${s}</button>`).join('')}</div><p class="muted" id="mt" style="text-align:center;margin:0">Onthoud de volgorde…</p></div>`);
  const ms=$('#ms'),dots=[...$('#md').children],btns=[...document.querySelectorAll('.memb')];let k=0;
  const iv=setInterval(()=>{if(!document.body.contains(ms)){clearInterval(iv);return}if(k<seq.length){ms.textContent=seq[k];ms.classList.remove('pulse');void ms.offsetWidth;ms.classList.add('pulse');k++}else{clearInterval(iv);ms.textContent='❓';phase='input';btns.forEach(b=>b.disabled=false);$('#mt').textContent=`Tik de ${len} symbolen in dezelfde volgorde`}},850);
  const fin=ok=>{if(done)return;done=true;btns.forEach(b=>b.disabled=true);setTimeout(()=>{closeModal();cb(ok,i/len)},600)};
  btns.forEach(b=>b.onclick=()=>{if(phase!=='input'||done)return;if(b.dataset.s===seq[i]){dots[i].className='hit';i++;haptic(5);if(i===len)fin(true)}else{dots[i].className='miss';haptic(25);fin(false)}})}
const DATEQ=[
 ['Waar wil je heen voor de date?',[['Een escaperoom','avontuurlijk'],['Een restaurant bij kaarslicht','romantisch'],['Een comedyclub','grappig'],['Een museum met een wijnbar','intellectueel'],['Samen bowlen','sportief']]],
 ['Je date vraagt wat je in het weekend doet.',[['Spontaan een stedentrip boeken','avontuurlijk'],['Uitslapen en ontbijt op bed','romantisch'],['Memes sturen naar vrienden','grappig'],['Een podcast over geschiedenis luisteren','intellectueel'],['Een halve marathon lopen','sportief']]],
 ['Er valt een stilte. Wat zeg je?',['"Zullen we morgen gaan parachutespringen?"','"Je ogen zijn trouwens prachtig."','Je vertelt een flauwe woordgrap','"Wat is het laatste boek dat je las?"','"Doe jij eigenlijk aan sport?"'].map((t,i)=>[t,Object.keys(TRAITS)[i]])],
 ['Het is tijd om af te rekenen.',[['Voorstellen om nog ergens anders heen te gaan','avontuurlijk'],['Alles betalen en een roos meegeven','romantisch'],['Als grap doen alsof je je portemonnee kwijt bent','grappig'],['Netjes uitrekenen wie wat had','intellectueel'],['Voorstellen om naar huis te fietsen','sportief']]],
 ['Je date vertelt over een droom voor later.',[['"Laten we samen de wereld rondreizen!"','avontuurlijk'],['"Dat klinkt als iets om samen te doen."','romantisch'],['"Mag ik dan je assistent zijn?"','grappig'],['Doorvragen naar het waarom','intellectueel'],['"Daar moet je dan wel fit voor zijn!"','sportief']]]];
function dateGame(c){const qs=DATEQ.slice().sort(()=>R()-.5).slice(0,3);let i=0,chem=S.st.looks>=c.looks?1:0;
  const step=()=>{if(i>=3)return finish();const [q,op]=qs[i];const match=op.find(o=>o[1]===c.tr);const others=op.filter(o=>o!==match).sort(()=>R()-.5).slice(0,2);const ch=[match,...others].sort(()=>R()-.5);
    modal({title:'Eerste date',em:'💘',cat:`Ronde ${i+1} van 3`,person:c,text:q,html:`<div class="chem"><span>Klik</span><i><b style="width:${clamp(chem/7*100)}%"></b></i></div>`,choices:ch.map(o=>({t:o[0],on:()=>{const d=o[1]===c.tr?2:R()<.3?-1:0;chem+=d;i++;toast(d>0?`${c.first} straalt`:d<0?`${c.first} kijkt ongemakkelijk`:`${c.first} glimlacht beleefd`);step()}}))})};
  const finish=()=>{closeModal();PREPAID=1;doAct('Eerste date',()=>{use('date');if(chem>=3){addPartner(c);hap(8);return `Het klikt enorm! ${c.first} wil je weer zien. Jullie hebben een relatie.`}hap(-1);return `Gezellig, maar er is geen klik. ${c.first} stuurt de volgende dag dat het niet verder gaat.`},false,chem>=3?'💞':'💔')};step()}
const TOPICS=[['💼','Werk en school'],['👪','Familie'],['🎮','Hobby\'s'],['🗳️','Politiek'],['🍿','Roddels'],['🔮','Dromen voor later'],['⚽','Sport']];
function topicPref(p){let h=0;for(const ch of p.id)h=(h*31+ch.charCodeAt(0))>>>0;const like=h%7;let dis=(h>>>5)%7;if(dis===like)dis=(dis+3)%7;return[like,dis]}
function talk(p){const [like,dis]=topicPref(p);p.tk=p.tk||{};
  modal({title:`Gesprek met ${p.first}`,em:'💬',cat:roleLabel(p),person:p,text:'Waar wil je het over hebben? Wat iemand leuk vindt, ontdek je door het te proberen.',choices:opts(TOPICS.map(([e,t],i)=>({t:`${e} ${t}${p.tk[i]===1?'  ❤️':p.tk[i]===-1?'  👎':''}`,on:()=>{closeModal();doAct('Gesprek',()=>{use('praat'+p.id);let d;if(i===like){d=ri(8,14);p.tk[i]=1;hap(3)}else if(i===dis){d=-ri(5,10);p.tk[i]=-1;hap(-1)}else{d=ri(1,4);p.tk[i]=p.tk[i]||0}p.rel=clamp(p.rel+d);
    return i===like?`${p.first} gaat helemaal los over ${t.toLowerCase()}. Wat een gesprek!`:i===dis?`${p.first} zucht. ${t} is echt niet ${p.g==='v'?'haar':'zijn'} onderwerp.`:`Een prima gesprek over ${t.toLowerCase()}.`},true,e)}})))})}
function mgTiming(title,desc,rounds,cb){if(!spendE(1))return;PREPAID=1;
  openRaw(`<div class="mhead dark"><small>Minigame</small><h3>${he(title)}</h3></div><div class="mbody"><p>${he(desc)}</p><div class="tbar"><div class="tzone" id="tz"></div><div class="tmark" id="tm"></div></div><div class="dots" id="td">${'<i></i>'.repeat(rounds)}</div><button class="btn go" id="tstop">Stop!</button></div>`);
  let r=0,hits=0,pos=0,dir=1,speed=1,zone=[0,0],raf,last=performance.now(),done=false;
  const tz=$('#tz'),tm=$('#tm'),dots=[...$('#td').children];
  function setup(){const w=Math.max(9,24-r*6);const s=ri(8,92-w);zone=[s,s+w];tz.style.left=s+'%';tz.style.width=w+'%';speed=1+r*.5;pos=R()*20;dir=1}
  function loop(t){const dt=Math.min(3,(t-last)/16.7);last=t;pos+=dir*speed*dt;if(pos>=100){pos=100;dir=-1}if(pos<=0){pos=0;dir=1}if(!tm.isConnected){done=true;return}tm.style.left=pos+'%';if(!done)raf=requestAnimationFrame(loop)}
  $('#tstop').onclick=()=>{if(done)return;const hit=pos>=zone[0]&&pos<=zone[1];dots[r].className=hit?'hit':'miss';if(hit)hits++;r++;if(r>=rounds){done=true;cancelAnimationFrame(raf);setTimeout(()=>{closeModal();cb(hits)},500)}else setup()};
  setup();raf=requestAnimationFrame(loop)}
function mgExam(cb){if(!spendE(1))return;PREPAID=1;
  const a=ageY(),lv=a<10?0:a<14?1:2;const qs=[];for(let i=0;i<6;i++){let q,ans;const t=ri(0,2);
    if(lv===0){const x=ri(2,20),y=ri(1,15);if(t){q=`${x} + ${y}`;ans=x+y}else{const b=Math.max(x,y),s=Math.min(x,y);q=`${b} − ${s}`;ans=b-s}}
    else if(lv===1){const x=ri(3,12),y=ri(3,12);if(t===0){q=`${x} × ${y}`;ans=x*y}else if(t===1){q=`${x*y} ÷ ${x}`;ans=y}else{const b=ri(40,150),s=ri(11,39);q=`${b} − ${s}`;ans=b-s}}
    else{if(t===0){const x=ri(12,25),y=ri(3,9);q=`${x} × ${y}`;ans=x*y}else if(t===1){const p=pick([10,20,25,50]),nn=ri(2,20)*20;q=`${p}% van ${nn}`;ans=nn*p/100}else{const x=ri(100,600),y=ri(100,600);q=`${x} + ${y}`;ans=x+y}}
    qs.push([q,ans])}
  let i=0,ok=0,left=30,done=false;
  openRaw(`<div class="mhead dark"><small>Minigame · 30 seconden</small><h3>Toets</h3></div><div class="mbody"><div class="timer"><i id="xt" style="width:100%"></i></div><p class="muted num" id="xn" style="text-align:center;margin:0">Vraag 1 van 6</p><div class="examq" id="xq"></div><form id="xf" class="inrow"><input class="inp num" id="xa" inputmode="numeric" autocomplete="off" aria-label="Antwoord"><button class="btn go" style="width:auto;padding:0 20px">OK</button></form></div>`);
  const show_=()=>{$('#xq').textContent=qs[i][0]+' =';$('#xn').textContent=`Vraag ${i+1} van 6`;$('#xa').value='';$('#xa').focus()};
  const end=()=>{if(done)return;done=true;clearInterval(tk);closeModal();cb(ok/6)};
  const tk=setInterval(()=>{if(!$('#xf')){done=true;clearInterval(tk);return}left--;const t=$('#xt');if(t)t.style.width=(left/30*100)+'%';if(left<=0)end()},1000);
  $('#xf').onsubmit=e=>{e.preventDefault();if(done)return;const v=parseFloat($('#xa').value.replace(',','.'));if(v===qs[i][1])ok++;i++;if(i>=6)end();else show_()};show_()}
function mgInterview(t,cb,sec){if(!spendE(1))return;PREPAID=1;const qs=(SECQ[sec]||[]).slice(0,1).concat(INTERVIEW.slice().sort(()=>R()-.5)).slice(0,3).sort(()=>R()-.5);let i=0,pts=0;
  const step=()=>{if(i>=3){closeModal();cb(pts/6);return}const [q,ans]=qs[i];modal({title:q,em:'🤝',cat:`Vraag ${i+1} van 3`,choices:ans.slice().sort(()=>R()-.5).map(([a,p])=>({t:a,on:()=>{pts+=p;i++;step()}}))})};step()}
function mgBlackjack(){
  const suits=['♠','♥','♦','♣'],ranks=['A','2','3','4','5','6','7','8','9','10','B','V','H'];let deck,pl,dl,bet=0,phase='bet',msg='Plaats je inzet.',net=0;
  const val=h=>{let v=0,a=0;for(const c of h){if(c.r==='A'){a++;v+=11}else v+=['B','V','H'].includes(c.r)?10:+c.r}while(v>21&&a){v-=10;a--}return v};
  const draw=()=>deck.pop();const cardH=(c,hide)=>hide?'<div class="pc back"></div>':`<div class="pc ${c.s==='♥'||c.s==='♦'?'red':''}"><span>${c.r}${c.s}</span><span>${c.r}${c.s}</span></div>`;
  function deal(b){bet=b;deck=[];for(const s of suits)for(const r of ranks)deck.push({s,r});deck.sort(()=>R()-.5);pl=[draw(),draw()];dl=[draw(),draw()];phase='play';msg='Kaart of passen?';if(val(pl)===21)finish();else paint()}
  function finish(){while(phase!=='done'&&val(dl)<17&&val(pl)<=21)dl.push(draw());const p=val(pl),d=val(dl);let w;
    if(p>21){w=-bet;msg=`Dood! Je verliest ${fmt(bet)}.`}else if(p===21&&pl.length===2&&!(d===21&&dl.length===2)){w=Math.round(bet*1.5);msg=`Blackjack! Je wint ${fmt(w)}.`}else if(d>21||p>d){w=bet;msg=`Je wint ${fmt(bet)}!`}else if(p===d){w=0;msg='Gelijkspel.'}else{w=-bet;msg=`De bank wint. Je verliest ${fmt(bet)}.`}
    cash(w);net+=w;phase='done';paint();render()}
  function paint(){const bets=[10,100,1000,10000,100000].filter(b=>b<=S.money);
    openRaw(`<div class="mhead dark"><small>Casino · saldo ${fmt(S.money)}</small><h3>Blackjack</h3></div><div class="mbody">${phase==='bet'?'':`<div><p class="sec-l">Bank${phase==='done'?' · '+val(dl):''}</p><div class="hand">${dl.map((c,i)=>cardH(c,phase==='play'&&i===1)).join('')}</div></div><div><p class="sec-l">Jij · ${val(pl)}</p><div class="hand">${pl.map(c=>cardH(c)).join('')}</div></div>`}<p><b>${he(msg)}</b></p><div class="choices" id="bj"></div></div>`);
    const box=$('#bj');const B_=(t,f,cls)=>{const b=document.createElement('button');b.className='btn '+(cls||'');b.textContent=t;b.onclick=f;box.appendChild(b)};
    if(phase==='play'){B_('Kaart',()=>{pl.push(draw());if(val(pl)>21)finish();else paint()},'go');B_('Passen',()=>finish())}
    else{if(!bets.length)box.insertAdjacentHTML('beforeend','<p class="muted">Je hebt niet genoeg geld om in te zetten.</p>');const g=document.createElement('div');g.className='btnrow';for(const b of bets){const x=document.createElement('button');x.className='btn sm';x.textContent=fmt(b);x.onclick=()=>deal(b);g.appendChild(x)}box.appendChild(g);B_('Stoppen',quit,'ghost')}}
  function quit(){closeModal();if(net!==0){L(`Casino: je ${net>0?'wint':'verliest'} ${fmt(Math.abs(net))} met blackjack.`,net>0?'good':'bad');hap(net>0?4:-3)}render();saveLife();refreshSheet()}
  paint()}
function mgSlots(){const sy=['🍒','🍋','🔔','⭐','7️⃣','💎'],pay={'🍒':5,'🍋':8,'🔔':12,'⭐':20,'7️⃣':50,'💎':100};let net=0,bet=10,reels=['🍒','🍋','🔔'],msg='Kies je inzet en draai.',spinning=false;
  function paint(){const bets=[1,10,100,1000,10000].filter(b=>b<=S.money);if(!bets.includes(bet))bet=bets[bets.length-1]||0;
    openRaw(`<div class="mhead dark"><small>Casino · saldo ${fmt(S.money)}</small><h3>Gokkast</h3></div><div class="mbody"><div class="reels">${reels.map(r=>`<div class="reel ${spinning?'spin':''}">${r}</div>`).join('')}</div><p><b>${he(msg)}</b></p><div class="seg" id="sb">${bets.map(b=>`<button aria-pressed="${b===bet}" data-b="${b}">${fmt(b)}</button>`).join('')}</div><div class="choices"><button class="btn go" id="sg" ${!bet||spinning?'disabled':''}>Draaien</button><button class="btn ghost" id="sq">Stoppen</button></div><p class="hint">3 dezelfde: 🍒 5× · 🍋 8× · 🔔 12× · ⭐ 20× · 7️⃣ 50× · 💎 100×. Twee kersen: 2×.</p></div>`);
    document.querySelectorAll('#sb button').forEach(b=>b.onclick=()=>{bet=+b.dataset.b;paint()});
    $('#sg').onclick=()=>{if(spinning||S.money<bet)return;cash(-bet);net-=bet;spinning=true;msg='...';paint();const tk=setInterval(()=>{document.querySelectorAll('.reel').forEach(r=>r.textContent=pick(sy))},90);
      setTimeout(()=>{clearInterval(tk);if(!$('#sg')){spinning=false;return}const w=()=>{const r=R();return r<.3?'🍒':r<.55?'🍋':r<.73?'🔔':r<.87?'⭐':r<.96?'7️⃣':'💎'};reels=[w(),w(),w()];spinning=false;let win=0;
        if(reels[0]===reels[1]&&reels[1]===reels[2])win=bet*pay[reels[0]];else if(reels.filter(x=>x==='🍒').length===2)win=bet*2;cash(win);net+=win;msg=win?`Je wint ${fmt(win)}!`:'Helaas.';render();paint()},900)};
    $('#sq').onclick=()=>{if(spinning)return;closeModal();if(net!==0){L(`Casino: je ${net>0?'wint':'verliest'} ${fmt(Math.abs(net))} op de gokkast.`,net>0?'good':'bad');hap(net>0?4:-3)}render();saveLife();refreshSheet()}}
  paint()}

/* ================= START & AANMAKEN ================= */
function renderStart(){
  const el=$('#saves');const all=Object.values(STORE.lives).sort((a,b)=>(b.updated||0)-(a.updated||0));
  if(!all.length){el.innerHTML='<p class="muted" style="margin:0">Nog geen levens. Begin je eerste leven hierboven.</p>';return}
  el.innerHTML=all.map(l=>{if(l.done)return `<button class="savecard" data-id="${l.id}"><span class="av" style="background:#eceef3;font-size:24px">💀</span><span class="meta"><b>${he(l.name)}</b><small>${l.by} · ${l.age} jaar · score ${l.score}${l.ribbon?' · '+he(l.ribbon):''}</small></span><span class="pill dead">Gen ${l.gen}</span></button>`;
    const a=Math.floor(l.m/12);const sub=l.alive?`${a} jaar · ${COUNTRIES[l.p.country].n}`:`Overleden op ${l.died??a} · terugspoelen kan nog`;
    return `<button class="savecard" data-id="${l.id}"><span class="av" style="background:${l.alive?'var(--brand-soft)':'#eceef3'};font-size:24px">${l.alive?(l.ap?avatarSvg(l.ap,Math.floor(l.m/12),l.p.g):'🧑'):'💀'}</span><span class="meta"><b>${he(l.p.first+' '+l.p.last)}</b><small>${he(sub)}</small></span><span class="pill ${l.alive?'good':'dead'}">${l.alive?'Gen '+l.gen:'†'}</span></button>`}).join('');
  el.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{const l=STORE.lives[b.dataset.id];
    const del=()=>{modal({title:'Verwijderen?',em:'🗑️',text:`${l.done?l.name:l.p.first+' '+l.p.last} wordt definitief verwijderd.`,choices:opts([{t:'Verwijderen',cls:'bad',on:()=>{closeModal();delete STORE.lives[l.id];lsSave();cloudQueue(l.id);renderStart()}}])})};
    if(l.done)modal({title:l.name,em:'📜',cat:`${l.by} · ${l.age} jaar`,html:l.story.map(p=>`<p style="font-size:15.5px;text-align:left;margin:0">${he(p)}</p>`).join(''),choices:[{t:'Sluiten',cls:'ghost',on:closeModal},{t:'Verwijderen',cls:'bad',on:del}]});
    else modal({title:l.p.first+' '+l.p.last,em:l.alive?'🧑':'💀',cat:l.alive?`${Math.floor(l.m/12)} jaar`:'Overleden',choices:[{t:l.alive?'Verder spelen':'Bekijken',cls:'go',on:()=>{closeModal();loadLife(l.id)}},{t:'Verwijderen',cls:'bad',on:del},{t:'Annuleren',cls:'ghost',on:closeModal}]})})}
function migrate(s){if(s.energy==null)s.energy=12;s.cpi=s.cpi||1;s.econ=s.econ||{s:'normaal',y:0};s.crim=Object.assign({heat:0,open:[]},s.crim||{});if(s.crim.jail)s.crim.jail=Object.assign({resp:10,gb:50,gang:null,work:false,tunnel:0,study:0,cell:null,contra:0},s.crim.jail);s.items=s.items||[];s.fights=s.fights||{w:0,l:0};for(const c of s.cars||[])if(c.cond==null)c.cond=100;s.flags=s.flags||{};if(!s.ap)s.ap=randAp(s.p.g);if(s.disc==null)s.disc=50;if(s.fert==null)s.fert=65;if(!s.talent)s.talent='geen';if(!s.flags.ingMig){if(s.job&&s.job.id==='ingenieur')s.job.lvl=Math.min(s.job.lvl+1,3);s.flags.ingMig=1}if(!s.flags.salCpi){if(s.job&&s.cpi>1)s.job.mult/=s.cpi;s.flags.salCpi=1}return s}
function loadLife(id){S=STORE.lives[id];if(!S||S.done)return;migrate(S);Q=S.q||[];STORE.last=id;
  if(!S.alive){showDeath();return}show('game');render();if(Q.length)processQ()}
/* ================= OPSLAAN ================= */
const LS_KEY='levensloop.v1';let STORE={lives:{}};
function meta(){if(!STORE.meta)STORE.meta={careers:[],ribbons:[]};STORE.meta.careers=STORE.meta.careers||[];STORE.meta.ribbons=STORE.meta.ribbons||[];return STORE.meta}
function collectCareer(id){const M=meta();if(!M.careers.includes(id)){M.careers.push(id)}}
function lsLoad(){try{const t=localStorage.getItem(LS_KEY);if(t){const d=JSON.parse(t);if(d&&d.lives)STORE=d}}catch(e){}}
function lsSave(){try{localStorage.setItem(LS_KEY,JSON.stringify(STORE))}catch(e){try{for(const l of Object.values(STORE.lives))if(l.snaps&&l.id!==(S&&S.id))l.snaps=[];localStorage.setItem(LS_KEY,JSON.stringify(STORE))}catch(e2){}}}
function saveLife(){if(!S)return;S.updated=Date.now();S.q=Q;STORE.lives[S.id]=S;STORE.last=S.id;lsSave();cloudQueue(S.id);cloudQueue('_meta')}
const CL={col:null,ready:false,pending:new Set(),busy:false,t:null};
function setSync(t){const e=$('#sync');if(e)e.textContent=t}
const withTimeout=(p,ms)=>Promise.race([p,new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
async function cloudInit(){
  try{if(!window.claude||typeof window.claude.use!=='function')return;
    const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);if(!db||!user){setSync('Opgeslagen op dit apparaat');return}
    const id=await user.id();if(!id){setSync('Opgeslagen op dit apparaat');return}
    CL.col=db.doc('data/users/'+id+'/game').collection('lives');setSync('Verbinden met je account…');
    const snap=await withTimeout(CL.col.get(),10000);let changed=false;const seen=new Set();
    for(const d of snap.docs){seen.add(d.id);const x=d.data();if(!x||!x.json)continue;
      if(d.id==='_meta'){try{const m=JSON.parse(x.json);const M=meta();for(const c of m.careers||[])if(!M.careers.includes(c))M.careers.push(c);for(const r of m.ribbons||[])if(!M.ribbons.includes(r))M.ribbons.push(r);changed=true}catch(e){}continue}
      const loc=STORE.lives[d.id];
      if(!loc||(x.updated||0)>(loc.updated||0)){try{const v=JSON.parse(x.json);if(!(S&&S.id===d.id)){STORE.lives[d.id]=v;changed=true}}catch(e){}}}
    for(const k in STORE.lives)if(!seen.has(k))CL.pending.add(k);CL.pending.add('_meta');
    CL.ready=true;if(changed){lsSave();if(curScreen==='start')renderStart()}setSync('Opgeslagen in je account, ook op je andere apparaten');cloudFlush();
  }catch(e){setSync('Opgeslagen op dit apparaat (account even niet bereikbaar)')}}
function cloudQueue(id){if(!CL.col)return;CL.pending.add(id);clearTimeout(CL.t);CL.t=setTimeout(cloudFlush,1500)}
async function cloudFlush(){if(!CL.ready||CL.busy)return;CL.busy=true;
  try{for(const id of [...CL.pending]){CL.pending.delete(id);const ref=CL.col.doc(id);
    if(id==='_meta'){await ref.set({updated:Date.now(),json:JSON.stringify(meta())});continue}
    const l=STORE.lives[id];if(!l){await ref.delete();continue}
    let json=JSON.stringify(l);if(json.length>240000)json=JSON.stringify(Object.assign({},l,{snaps:(l.snaps||[]).slice(-3),log:(l.log||[]).slice(-500)}));if(json.length>250000)json=JSON.stringify(Object.assign({},l,{snaps:[],log:(l.log||[]).slice(-300)}));
    await ref.set({updated:l.updated||Date.now(),json})}}catch(e){console.warn('cloud',e)}
  CL.busy=false;if(CL.pending.size)CL.t=setTimeout(cloudFlush,3000)}

/* ================= BOOT ================= */
function boot(data){
  lsLoad();meta();initCreate();
  $('#btn-new').onclick=openCreate;$('#t-age').onclick=onAge;$('#t-back').onclick=()=>openSheet('Tijdmachine',sheetRewind);
  $('#t-job').onclick=()=>openSheet('Beroep',sheetJob);$('#t-assets').onclick=()=>openSheet('Bezit',sheetAssets);
  $('#t-rel').onclick=()=>openSheet('Relaties',sheetRel);$('#t-act').onclick=()=>openSheet('Activiteiten',sheetAct);
  $('#h-who').onclick=profilePopup;$('#stats').onclick=profilePopup;$('#h-menu').onclick=()=>openSheet('Hoofdmenu',sheetMain,false,{dark:true});
  $('#sheet-x').onclick=backSheet;initSwipe();
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#sheet').hidden&&$('#modal').hidden)backSheet()});
  window.claude?.hot?.snapshot?.(()=>({sid:S&&S.id,screen:curScreen}));
  renderStart();
  const sid=data&&data.sid;if(sid&&STORE.lives[sid]&&!STORE.lives[sid].done&&data.screen!=='start'){loadLife(sid)}else show('start');
  setTimeout(cloudInit,0);
}
window.claude?.hot?.ready?window.claude.hot.ready(boot):boot(window.claude?.hot?.data??{});
