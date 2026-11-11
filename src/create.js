/* ---------- nieuw leven: knoppenscherm zoals in BitLife ---------- */
let CF=null;
const ATTR=[['happy','😀','Geluk'],['health','❤️','Gezondheid'],['smarts','🧠','Slimheid'],['looks','✨','Uiterlijk'],['karma','😇','Karma'],['disc','🎯','Discipline'],['fert','🧬','Vruchtbaarheid']];
const PREFN={mannen:'Mannen',vrouwen:'Vrouwen',beide:'Iedereen','':'Kies ik later'};
function randAttr(){return {happy:ri(62,95),health:ri(75,100),smarts:ri(15,95),looks:ri(15,95),karma:ri(40,70),disc:ri(25,75),fert:ri(40,95)}}
function randomize(){const ks=Object.keys(COUNTRIES);const k=chance(.5)?'NL':pick(ks),c=COUNTRIES[k];const g=pick(['m','v','m','v','x']);const N=NAMES[c.r];
  CF=Object.assign(CF||{mode:'year',chaos:1,by:new Date().getFullYear()},{g,country:k,city:pick(c.cities),first:pick(N[g==='x'?pick(['m','v']):g]),last:pick(N.l),talent:'geen',ap:randAp(g),attr:randAttr(),pref:''});
  renderCreate()}
function openCreate(){closeSheet();closeModal();show('create');if(!CF)randomize();else renderCreate()}
function initCreate(){$('#c-rand').onclick=()=>{haptic(10);randomize()};$('#c-back').onclick=()=>{renderStart();show('start')}}
function renderCreate(){const c=CF,C_=COUNTRIES[c.country],T=TAL(c.talent);
  const tile=(cls,val,lab,id)=>`<button class="cbtn ${cls}" data-k="${id}"><b>${val}</b>${lab?`<small>${he(lab)}</small>`:''}</button>`;
  $('#cbody').innerHTML=`<div class="cprev">${avatarSvg(c.ap,25,c.g)}</div>
    <button class="cbtn go" id="c-start"><b>Start het leven van ${he(c.first||'Naamloos')}!</b></button>
    ${tile('blue',he(`${c.first} ${c.last}`),'Naam','name')}
    ${tile('blue',{m:'♂ Man',v:'♀ Vrouw',x:'⚧ Non-binair'}[c.g],'Geslacht','g')}
    ${tile('blue',`${flag(c.country)} ${he(C_.n)}`,'Land','country')}
    ${tile('blue',`${flag(c.country)} ${he(c.city)}`,'Stad','city')}
    ${tile('blue',c.by,'Geboortejaar','by')}
    ${tile('blue',c.mode==='month'?'Per maand':'Per jaar','Tijd','mode')}
    ${tile('blue',['Rustig','Normaal','Chaos'][c.chaos],'Hoeveel rare dingen er gebeuren','chaos')}
    ${tile('orange',c.talent==='geen'?'Kies je speciale talent':`${T[1]} ${T[2]}`,c.talent==='geen'?'':'Speciaal talent','talent')}
    ${tile('yellow','🪞 Kies je uiterlijk','','ap')}
    ${tile('yellow','🎚️ Kies je eigenschappen','','attr')}`;
  $('#cbody').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{haptic(6);({name:cName,g:cGender,country:cCountry,city:cCity,by:cYear,mode:cMode,chaos:cChaos,talent:cTalent,ap:cLook,attr:cAttr})[b.dataset.k]()});
  $('#c-start').onclick=startCreated}
function startCreated(){const c=CF;newLife({first:c.first||'Naamloos',last:c.last||'Onbekend',g:c.g,country:c.country,city:c.city,by:c.by,mode:c.mode,chaos:c.chaos,talent:c.talent,ap:c.ap,attr:c.attr,pref:c.pref});
  CF=null;saveLife();show('game');render()}
const done_=()=>{closeModal();renderCreate()};
function cName(){modal({title:'Naam',em:'🍼',cat:'Nieuw leven',html:`<label class="lab" for="cn1">Voornaam</label><input class="inp" id="cn1" maxlength="24" value="${he(CF.first)}"><label class="lab" for="cn2" style="margin-top:8px">Achternaam</label><input class="inp" id="cn2" maxlength="28" value="${he(CF.last)}">`,
  choices:[{t:'Opslaan',cls:'go',on:()=>{CF.first=$('#cn1').value.trim()||CF.first;CF.last=$('#cn2').value.trim()||CF.last;done_()}},{t:'🎲 Willekeurige naam',cls:'ghost',on:()=>{const N=NAMES[COUNTRIES[CF.country].r];$('#cn1').value=pick(N[CF.g==='x'?pick(['m','v']):CF.g]);$('#cn2').value=pick(N.l)}}]})}
function cGender(){modal({title:'Geslacht',em:'🍼',cat:'Nieuw leven',text:'Kies je geslacht.',choices:[['m','♂ Man','gm'],['v','♀ Vrouw','gv'],['x','⚧ Non-binair','gx']].map(([g,t,cls])=>({t,cls,on:()=>{if(CF.g!==g){CF.g=g;if(g==='v')CF.ap.beard=0}done_()}}))})}
function cCountry(){modal({title:'Land',em:'🍼',cat:'Nieuw leven',text:'Waar word je geboren?',choices:opts(Object.entries(COUNTRIES).map(([k,c])=>({t:`${flag(k)} ${c.n}`,on:()=>{CF.country=k;CF.city=pick(c.cities);done_()}})))})}
function cCity(){const c=COUNTRIES[CF.country];modal({title:'Stad',em:'🍼',cat:c.n,text:'In welke stad?',choices:opts(c.cities.map(x=>({t:x,on:()=>{CF.city=x;done_()}})))})}
function cYear(){const y=new Date().getFullYear();modal({title:'Geboortejaar',em:'🍼',cat:'Nieuw leven',html:`<input class="inp num" id="cy" type="number" min="1900" max="2100" value="${CF.by}">`,choices:[{t:'Opslaan',cls:'go',on:()=>{CF.by=clamp(parseInt($('#cy').value)||y,1900,2100);done_()}}].concat([1950,1980,2000,y].map(v=>({t:String(v),cls:'ghost',on:()=>{CF.by=v;done_()}})))})}
function cMode(){modal({title:'Tijd',em:'🍼',cat:'Nieuw leven',text:'Speel je jaar voor jaar of maand voor maand? Je kunt dit later in het menu wisselen.',choices:[{t:'Per jaar',s:'Snel door je leven',on:()=>{CF.mode='year';done_()}},{t:'Per maand',s:'Meer details, langer spelen',on:()=>{CF.mode='month';done_()}}]})}
function cChaos(){modal({title:'Chaos',em:'🍼',cat:'Nieuw leven',text:'Hoe vaak gebeuren er rare dingen?',choices:[[0,'Rustig','Een realistisch leven'],[1,'Normaal','Af en toe iets geks'],[2,'Chaos','Onverwachte erfenissen, virale filmpjes, tijdreizigers']].map(([v,t,s])=>({t,s,on:()=>{CF.chaos=v;done_()}}))})}
function cTalent(){modal({title:'Speciaal talent',em:'🍼',cat:'Nieuw leven',text:'Waar heb je aanleg voor? Met een talent begin je beter en leer je het veel sneller.',choices:TALENTS.map(([id,em,t,d])=>({t:`${em} ${t}`,s:d,cls:id==='geen'?'tgeen':'',on:()=>{CF.talent=id;done_()}}))})}
// uiterlijk: tabbladen met 10 opties elk
function cLook(){let tab='skin';const ap=Object.assign({},CF.ap);
  const tabs=[['skin','Huid'],['eye','Ogen'],['hair','Kapsel'],['hc','Haarkleur']].concat(CF.g==='v'?[]:[['beard','Baard']]);
  const paint=()=>{const opt=tab==='skin'?SKINS.map((c,i)=>[i,`<i style="background:${c}"></i>`,SKINN[i]]):tab==='eye'?EYEC.map((c,i)=>[i,`<i style="background:${c}"></i>`,EYECN[i]]):tab==='hc'?HAIRC.map((c,i)=>[i,`<i style="background:${c}"></i>`,HAIRCN[i]]):
      (tab==='hair'?HAIRN:BEARDN).map((n,i)=>[i,avatarSvg(Object.assign({},ap,{[tab]:i,hair:tab==='hair'?i:ap.hair,beard:tab==='beard'?i:0}),25,CF.g),n]);
    openRaw(`<div class="mhead"><small>Nieuw leven</small><h3>🍼 Uiterlijk</h3></div><div class="mbody lookb"><div class="ltabs">${tabs.map(([k,t])=>`<button data-t="${k}" aria-pressed="${k===tab}">${t}</button>`).join('')}</div>
      <div class="lprev">${avatarSvg(ap,25,CF.g)}</div><p class="lname">${he([SKINN,EYECN,HAIRN,HAIRCN,BEARDN][['skin','eye','hair','hc','beard'].indexOf(tab)][ap[tab]]||'')}</p>
      <div class="lopts ${['hair','beard'].includes(tab)?'shapes':''}">${opt.map(([i,h,n])=>`<button data-i="${i}" aria-pressed="${ap[tab]===i}" aria-label="${he(n)}">${h}</button>`).join('')}</div>
      <div class="choices"><button class="btn go" id="lsave">Opslaan</button><button class="btn ghost" id="lrand">🎲 Willekeurig</button></div></div>`);
    document.querySelectorAll('.ltabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;paint()});
    document.querySelectorAll('.lopts button').forEach(b=>b.onclick=()=>{haptic(5);ap[tab]=+b.dataset.i;paint();const sel=document.querySelector('.lopts [aria-pressed="true"]');sel&&sel.scrollIntoView({inline:'center',block:'nearest'})});
    $('#lsave').onclick=()=>{CF.ap=ap;done_()};$('#lrand').onclick=()=>{Object.assign(ap,randAp(CF.g));paint()}};
  paint();const sel=document.querySelector('.lopts [aria-pressed="true"]');sel&&sel.scrollIntoView({inline:'center',block:'nearest'})}
// eigenschappen: schuifjes voor je startwaarden
function cAttr(){const at=Object.assign({},CF.attr);let pref=CF.pref;
  const paint=()=>{openRaw(`<div class="mhead"><small>Nieuw leven</small><h3>🍼 Eigenschappen</h3></div><div class="mbody"><p class="muted" style="margin:0 0 4px">Zo begin je aan je leven.</p>
      ${ATTR.map(([k,e,t])=>`<label class="sl"><span>${e} ${t}</span><b id="v-${k}">${at[k]}%</b><input type="range" min="0" max="100" value="${at[k]}" data-k="${k}"></label>`).join('')}
      <div class="sl"><span>🌈 Valt op</span></div><div class="seg" id="cpref">${Object.entries(PREFN).map(([k,t])=>`<button data-v="${k}" aria-pressed="${pref===k}">${t}</button>`).join('')}</div>
      <div class="choices" style="margin-top:12px"><button class="btn go" id="asave">Opslaan</button><button class="btn ghost" id="arand">🎲 Willekeurig</button></div></div>`);
    document.querySelectorAll('.sl input').forEach(r=>r.oninput=()=>{at[r.dataset.k]=+r.value;$('#v-'+r.dataset.k).textContent=r.value+'%'});
    document.querySelectorAll('#cpref button').forEach(b=>b.onclick=()=>{pref=b.dataset.v;document.querySelectorAll('#cpref button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
    $('#asave').onclick=()=>{CF.attr=at;CF.pref=pref;done_()};$('#arand').onclick=()=>{Object.assign(at,randAttr());paint()}};paint()}
