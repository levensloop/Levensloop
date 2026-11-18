/* ================= FASE 9.9: rustiger pop-ups =================
   "Minder maar groter": kleine gebeurtenissen worden een regel in het logboek in plaats van een pop-up.
   Het spel kiest dan zelf een redelijke keuze (een nummer = die keuze, 'r' = willekeurig, 'f' = zonder keuze).
   Grote momenten (geld, liefde, familie, gezondheid die ertoe doet) blijven een pop-up. */
const LOGEV={
  // baby en peuter
  woordje:'r',k_stapjes:0,bijten:'r',waterpokken:0,verdwaald:'r',k_nachtmerrie:'r',tand:'f',k_zwemles:0,k_sint:'r',k_logeren:'r',
  // klein ongemak
  griep:0,gevallen:0,m3_rug:0,m3_bril:0,o_valpartij:0,m3_wifi:'r',wasmachine:1,energie:'f',pe_energie:0,war_hamster:1,tandarts:'f',
  // buurt en vrije tijd van ouderen
  nb_nieuw:0,nb_hulp:0,o_bingo:'r',o_computerles:'r',o_dansles:'r',o_wandelclub:'r',
  // school: het rapport staat ook in het logboek
  sc_rapport:'f'};
function autoEv(q){const e=EV[q.id],c=q.c||{};if(!e)return;
  if((e.need&&!safe(()=>e.need(c)))||(e.jail&&!inJail()))return;if(!e.sys&&e.c&&!safe(()=>e.c()))return;
  const em=(EVMETA[q.id]||['','📌'])[1];let r='';
  if(e.f&&!e.ch)r=safe(()=>e.f(c))||'';
  else{const chs=(e.ch||[]).filter(ch=>!ch[2]||safe(()=>ch[2](c)));if(!chs.length)return;const v=LOGEV[q.id];const ch=v==='r'?pick(chs):chs[Math.min(+v||0,chs.length-1)];
    r=safe(()=>ch[1](c))||'';if(r&&r.go){Q.unshift(Object.assign({},q,{pop:1}));return}}
  if(typeof r==='string'&&r&&!c.nolog)L(`${em} ${e.t.replace(/[?!.…]$/,'')}: ${r}`)}
processQ=(f=>function(){let n=0;while(Q.length&&LOGEV[Q[0].id]!=null&&!Q[0].pop&&n++<20){const q=Q.shift();safe(()=>autoEv(q))}return f.apply(this,arguments)})(processQ);
// iets minder willekeurige gebeurtenissen (doel: ongeveer 2 schermen per jaar)
rollEvent=(f=>function(){if(!chance(.9))return null;return f.apply(this,arguments)})(rollEvent);
