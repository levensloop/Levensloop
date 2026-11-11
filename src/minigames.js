/* ================= MINIGAMES die passen bij wat je doet ================= */
const mgHead=(t,d,em)=>`<div class="mhead dark"><small>Minigame</small><h3>${em?em+' ':''}${he(t)}</h3></div><div class="mbody mg"><p>${he(d)}</p>`;
const alive_=id=>!!document.getElementById(id);
// 1) Uitwijken: rijden, vluchten, karten, skiën. cb(over, totaal)
function mgDodge(o,cb){PREPAID=1;const lives=o.lives||3,secs=o.secs||12;
  openRaw(mgHead(o.title,o.desc,o.em)+`<div class="dodge" id="dg"><i></i><i></i><div class="dg-me" id="dgme">${o.me||'🚗'}</div></div><div class="dg-hud"><span id="dgl">${'❤️'.repeat(lives)}</span><span id="dgt">${secs}s</span></div><div class="dg-ctl"><button class="btn" id="dgL" aria-label="Links">◀</button><button class="btn" id="dgR" aria-label="Rechts">▶</button></div></div>`);
  let lane=1,left=lives,obs=[],t0=performance.now(),last=t0,spawn=0,done=false;const box=$('#dg'),me=$('#dgme');const sp=(o.speed||1)*(.55+(o.hard||0)*.25);
  const place=()=>{me.style.left=(lane*33.33+16.66)+'%'};place();
  const mv=d=>{if(done)return;lane=Math.max(0,Math.min(2,lane+d));place();haptic(4)};
  $('#dgL').onclick=()=>mv(-1);$('#dgR').onclick=()=>mv(1);
  let sx=null;box.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});box.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>25)mv(dx>0?1:-1);sx=null});
  const key=e=>{if(e.key==='ArrowLeft')mv(-1);if(e.key==='ArrowRight')mv(1)};document.addEventListener('keydown',key);
  const end=()=>{done=true;document.removeEventListener('keydown',key);setTimeout(()=>{closeModal();cb(left,lives)},450)};
  function loop(t){if(done||!alive_('dg'))return document.removeEventListener('keydown',key);const dt=Math.min(3,(t-last)/16.7);last=t;const el=(t-t0)/1000;
    $('#dgt').textContent=Math.max(0,Math.ceil(secs-el))+'s';if(el>=secs)return end();
    spawn-=dt;if(spawn<=0){const l=ri(0,2);const d=document.createElement('div');d.className='dg-ob';d.textContent=pick(o.obs||['🚧']);d.style.left=(l*33.33+16.66)+'%';box.appendChild(d);obs.push({l,y:-8,d,hit:0});
      if(chance(.25+(o.hard||0)*.1)){const l2=(l+ri(1,2))%3;const d2=document.createElement('div');d2.className='dg-ob';d2.textContent=pick(o.obs||['🚧']);d2.style.left=(l2*33.33+16.66)+'%';box.appendChild(d2);obs.push({l:l2,y:-8,d:d2,hit:0})}
      spawn=Math.max(18,46-el*1.6)/(o.speed||1)}
    for(const b of obs){b.y+=sp*dt*(1+el/30);b.d.style.top=b.y+'%';if(!b.hit&&b.l===lane&&b.y>=74&&b.y<=90){b.hit=1;left--;haptic(30);box.classList.add('hurt');setTimeout(()=>box.classList.remove('hurt'),200);$('#dgl').textContent='❤️'.repeat(Math.max(0,left))+'🖤'.repeat(lives-Math.max(0,left));if(left<=0)return end()}}
    obs=obs.filter(b=>{if(b.y>108){b.d.remove();return false}return true});requestAnimationFrame(loop)}
  requestAnimationFrame(loop)}
// 2) Op de maat: muziek, dansen, zingen. cb(score 0..1)
function mgRhythm(o,cb){PREPAID=1;const n=o.n||10;
  openRaw(mgHead(o.title,o.desc,o.em)+`<div class="rhy" id="rh"><div class="rh-line"></div><div class="rh-fb" id="rhf"></div></div><div class="dg-hud"><span id="rhs">0 / ${n}</span><span id="rhc"></span></div><button class="btn go" id="rhb">${he(o.btn||'Tik!')}</button></div>`);
  const box=$('#rh');let notes=[],made=0,score=0,judged=0,last=performance.now(),next=20,done=false,combo=0;const sp=.85*(o.speed||1);
  const fb=(t,c)=>{const f=$('#rhf');f.textContent=t;f.className='rh-fb '+c;setTimeout(()=>{if(alive_('rhf'))f.className='rh-fb'},260)};
  const judge=n_=>{judged++;$('#rhs').textContent=`${judged} / ${n}`;if(judged>=n&&!done){done=true;setTimeout(()=>{closeModal();cb(score/n)},500)}};
  $('#rhb').onclick=()=>{if(done)return;const c=notes.filter(x=>!x.j).sort((a,b)=>Math.abs(a.y-82)-Math.abs(b.y-82))[0];if(!c||Math.abs(c.y-82)>16){fb('Mis','bad');combo=0;haptic(20);return}
    const d=Math.abs(c.y-82);c.j=1;c.d.remove();if(d<=5){score+=1;combo++;fb(combo>=3?`Perfect ×${combo}`:'Perfect!','good')}else{score+=.6;combo=0;fb('Goed','ok')}haptic(6);judge()};
  function loop(t){if(done||!alive_('rh'))return;const dt=Math.min(3,(t-last)/16.7);last=t;next-=dt;
    if(made<n&&next<=0){const d=document.createElement('div');d.className='rh-n';d.textContent=pick(o.notes||['🎵','🎶']);box.appendChild(d);notes.push({y:-6,d,j:0});made++;next=ri(22,40)/(o.speed||1)}
    for(const x of notes){if(x.j)continue;x.y+=sp*dt;x.d.style.top=x.y+'%';if(x.y>98){x.j=1;x.d.remove();fb('Mis','bad');combo=0;judge()}}
    requestAnimationFrame(loop)}
  requestAnimationFrame(loop)}
// 3) Het juiste moment: zakkenrollen, winkeldiefstal, vissen, sprintstart. cb(raak, rondes)
function mgReact(o,cb){PREPAID=1;const rounds=o.rounds||3;
  openRaw(mgHead(o.title,o.desc,o.em)+`<div class="react" id="rc"><div class="rc-e" id="rce">${o.idle}</div><div class="rc-t" id="rct">Wacht…</div></div><div class="dots" id="rcd">${'<i></i>'.repeat(rounds)}</div><button class="btn go" id="rcb">${he(o.btn||'Nu!')}</button></div>`);
  let r=0,hits=0,state='wait',timer=null,t0=0,done=false;const dots=[...$('#rcd').children],win=o.win||650;
  const set=(e,t,c)=>{$('#rce').textContent=e;$('#rct').textContent=t;$('#rc').className='react '+(c||'')};
  const nextR=()=>{if(r>=rounds){done=true;setTimeout(()=>{closeModal();cb(hits,rounds)},500);return}state='wait';set(o.idle,o.waitTxt||'Wacht…');
    const fake=o.fake&&chance(.35);timer=setTimeout(()=>{if(!alive_('rc'))return;if(fake){set(o.fake,'Nog niet…','fake');timer=setTimeout(()=>{if(!alive_('rc'))return;go()},ri(700,1400))}else go()},ri(1100,3000))};
  const go=()=>{state='go';t0=performance.now();set(o.go,o.goTxt||'NU!','go');timer=setTimeout(()=>{if(state==='go'&&alive_('rc'))res(false,'Te laat!')},win)};
  const res=(ok,t)=>{state='res';clearTimeout(timer);dots[r].className=ok?'hit':'miss';if(ok)hits++;r++;set(ok?(o.okEm||'✅'):(o.badEm||'❌'),t,ok?'go':'bad');haptic(ok?8:25);setTimeout(()=>{if(alive_('rc'))nextR()},750)};
  $('#rcb').onclick=()=>{if(done||state==='res')return;if(state==='wait'){res(false,'Te vroeg!');return}res(true,`${Math.round(performance.now()-t0)} ms`)};
  nextR()}
// 4) Draaiknop/slot: inbreken, kluis, auto openbreken. cb(raak, rondes)
function mgDial(o,cb){PREPAID=1;const rounds=o.rounds||3;
  openRaw(mgHead(o.title,o.desc,o.em)+`<div class="dial"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#1b2633" stroke="#3a4a5c" stroke-width="5"/><path id="dla" fill="none" stroke="#3ccf6e" stroke-width="7" stroke-linecap="round"/><line id="dln" x1="50" y1="50" x2="50" y2="14" stroke="#ffcf3f" stroke-width="3.5" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="#ffcf3f"/></svg><div class="dl-c">${o.mid||'🔒'}</div></div><div class="dots" id="dld">${'<i></i>'.repeat(rounds)}</div><button class="btn go" id="dlb">${he(o.btn||'Vastzetten')}</button></div>`);
  let r=0,hits=0,ang=0,sp=2,arc=[0,0],last=performance.now(),done=false;const dots=[...$('#dld').children];
  const pt=a=>{const rad=(a-90)*Math.PI/180;return [50+40*Math.cos(rad),50+40*Math.sin(rad)]};
  const setup=()=>{const w=Math.max(18,48-r*10-(o.hard||0)*6);const s=ri(0,359);arc=[s,s+w];const [x1,y1]=pt(s),[x2,y2]=pt(s+w);$('#dla').setAttribute('d',`M${x1} ${y1} A40 40 0 0 1 ${x2} ${y2}`);sp=(2.2+r*.9+(o.hard||0)*.6)*(chance(.5)?1:-1)};
  function loop(t){if(done||!alive_('dln'))return;const dt=Math.min(3,(t-last)/16.7);last=t;ang=(ang+sp*dt+360)%360;$('#dln').setAttribute('transform',`rotate(${ang} 50 50)`);requestAnimationFrame(loop)}
  $('#dlb').onclick=()=>{if(done)return;const a=((ang-arc[0])%360+360)%360;const hit=a<=arc[1]-arc[0];dots[r].className=hit?'hit':'miss';if(hit)hits++;haptic(hit?8:25);r++;if(r>=rounds){done=true;setTimeout(()=>{closeModal();cb(hits,rounds)},450)}else setup()};
  setup();requestAnimationFrame(loop)}
// 5) Code onthouden: kluis kraken, alarm, recept. cb(goed, lengte)
function mgCode(o,cb){PREPAID=1;const len=o.len||4,sy=o.sym||['1','2','3','4','5','6','7','8','9','0'];const seq=Array.from({length:len},()=>pick(sy));let inp=[],done=false;
  openRaw(mgHead(o.title,o.desc,o.em)+`<div class="code"><div class="cd-show" id="cds">${seq.map(x=>`<b>${x}</b>`).join('')}</div><div class="cd-in" id="cdi">${'<b>·</b>'.repeat(len)}</div><div class="cd-msg" id="cdm">Onthoud dit!</div><div class="cd-pad" id="cdp" hidden>${sy.map(x=>`<button class="btn" data-v="${x}">${x}</button>`).join('')}<button class="btn ghost" data-v="⌫">⌫</button></div></div></div>`);
  const showMs=o.show||(900+len*450);
  setTimeout(()=>{if(!alive_('cds'))return;$('#cds').classList.add('gone');$('#cdm').textContent='Voer de code in';$('#cdp').hidden=false},showMs);
  document.querySelectorAll('#cdp button').forEach(b=>b.onclick=()=>{if(done)return;const v=b.dataset.v;if(v==='⌫')inp.pop();else if(inp.length<len)inp.push(v);haptic(5);
    $('#cdi').innerHTML=Array.from({length:len},(_,i)=>`<b>${inp[i]??'·'}</b>`).join('');
    if(inp.length===len){done=true;const ok=inp.filter((v,i)=>v===seq[i]).length;$('#cdi').innerHTML=seq.map((v,i)=>`<b class="${inp[i]===v?'ok':'no'}">${inp[i]}</b>`).join('');$('#cdm').textContent=ok===len?'Helemaal goed!':`${ok} van de ${len} goed`;setTimeout(()=>{closeModal();cb(ok,len)},900)}})}
// 6) Mikken: darts, schieten, bowlen. cb(punten, max)
function mgAim(o,cb){PREPAID=1;const n=o.n||3;
  openRaw(mgHead(o.title,o.desc,o.em)+`<div class="aim" id="am"><svg class="am-t" viewBox="0 0 100 100">${Array.from({length:10},(_,i)=>{const k=10-i;return `<circle cx="50" cy="50" r="${k*4.2}" fill="${k===1?'#e53935':k%2?(o.c1||'#f3efe6'):(o.c2||'#22303f')}"/>`}).join('')}</svg><div class="am-x" id="amx">${o.cross||'✛'}</div></div><div class="dg-hud"><span id="ams">0 punten</span><span id="amn">${n} over</span></div><button class="btn go" id="amb">${he(o.btn||'Gooi!')}</button></div>`);
  let left=n,pts=0,t0=performance.now(),done=false,x=50,y=50;const fa=1.1+R()*.5,fb=1.6+R()*.6;
  function loop(t){if(done||!alive_('amx'))return;const s=(t-t0)/1000*(o.speed||1);x=50+40*Math.sin(s*fa);y=50+40*Math.sin(s*fb+1);const e=$('#amx');e.style.left=x+'%';e.style.top=y+'%';requestAnimationFrame(loop)}
  $('#amb').onclick=()=>{if(done)return;const d=Math.hypot(x-50,y-50);const p=Math.max(0,10-Math.floor(d/4.2));pts+=p;left--;haptic(p>=8?8:20);
    const m=document.createElement('div');m.className='am-hit';m.style.left=x+'%';m.style.top=y+'%';m.textContent=p;$('#am').appendChild(m);$('#ams').textContent=`${pts} punten`;$('#amn').textContent=`${left} over`;
    if(left<=0){done=true;setTimeout(()=>{closeModal();cb(pts,n*10)},700)}};
  requestAnimationFrame(loop)}
