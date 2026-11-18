/* ================= Fase 18: realisme-check =================
   Keuzes Thijmen: tot je 12e betalen je ouders gewone uitjes en lessen; onder de 18 beslissen je ouders over een huisdier
   (duurder = vaker nee, en zij betalen); clubs (jazzclub, dj-set) pas vanaf 18 (leisure.js).
   De speurtochten staan in tests/review/real18*.js. */
// huisdier onder de 18: kans dat je ouders ja zeggen
function petYes(k){const cp=S.cpi||1;const v=k/cp;return v>=1000?.05:v>=400?.3:v>=150?.5:.7}
// ---- ouders betalen tot 12 jaar bij gewone activiteiten ----
const KIDPAY=['mind','sport','vecht','dokter','ther','spa','conc','resto','reis','bios','zoo','kart','cultuur','buiten','kijk','leren','fest'];
const kidPays=()=>S&&S.alive&&ageY()<12;
let KIDNEXT=false;
for(const A of ACTS){if(!KIDPAY.includes(A[0])||typeof A[5]!=='function')continue;const f=A[5];A[5]=function(){KIDNEXT=true;try{return f.apply(this,arguments)}finally{KIDNEXT=false}}}
const kidCtx=()=>kidPays()&&sheetStack.some(s=>s.kp);
// tijdens het opbouwen van zo'n scherm telt je geld niet mee voor wat er aan kan (je ouders betalen)
openSheet=(f=>function(title,build,push,opt){const kp=kidPays()&&(KIDNEXT||(push&&sheetStack.some(s=>s.kp)));
  const b2=kp&&typeof build==='function'?function(el){const m=S.money;S.money=Math.max(m,1e7);try{return build.apply(this,arguments)}finally{S.money=m}}:build;
  const r=f.call(this,title,b2,push,opt);if(kp&&sheetStack.length)sheetStack[sheetStack.length-1].kp=1;return r})(openSheet);
// de kosten van een actie gaan naar je ouders; wat je verdient houd je
doAct=(f=>function(title,fn,...rest){if(!kidCtx()||typeof fn!=='function')return f.call(this,title,fn,...rest);
  const fn2=function(){const m0=S.money;S.money=m0+1e9;let r,paid=0;try{r=fn.apply(this,arguments)}finally{const now=S.money-1e9;if(now<m0){paid=m0-now;S.money=m0}else S.money=now}
    if(paid>0&&typeof r==='string'&&r)r+=` (Je ouders betalen ${fmt(paid)}.)`;return r};
  return f.call(this,title,fn2,...rest)})(doAct);
