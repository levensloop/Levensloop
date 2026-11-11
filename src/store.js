/* ================= OPSLAG v2 (verbeterplan 2.2) =================
   Indeling in localStorage:
     levensloop.v2          index: {v:2, last, meta, ids:[...]}
     levensloop.v2.l.<id>   één leven (zonder tijdmachine-opnames), of een afgesloten leven (begraafplaats)
     levensloop.v2.s.<id>   de tijdmachine-opnames van dat leven, compact (zie snapPack)
   In het geheugen blijft alles zoals het was: STORE.lives[id] met S.snaps = [{m,ll,d:JSON-tekst}].
   Alleen bij opslaan en laden wordt omgezet. Migratie van levensloop.v1 gebeurt bij de eerste start;
   de oude sleutel gaat pas weg als de nieuwe indeling goed is teruggelezen.

   Compacte opnames: de nieuwste opname wordt bewaard als verschil met het leven zelf, elke oudere als
   verschil met de opname erna. Een verschil (patch) zegt per sleutel wat er anders was:
     waarde       gewone waarde of lijst: zo was het
     {$v:obj}     een object dat in zijn geheel anders was
     {$p:patch}   een object met een paar andere sleutels (verder inzoomen)
     {$x:1}       deze sleutel bestond toen nog niet
   De huizenmarkt (flags.mk) gaat niet mee in opnames; die wordt na terugspoelen opnieuw gemaakt. */
const V2='levensloop.v2',V2L=V2+'.l.',V2S=V2+'.s.';
const isObj_=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function objDiff(a,b){const p={};let n=0;
  for(const k in a){const x=a[k];if(!(k in b)){p[k]=isObj_(x)?{$v:x}:x;n++;continue}const y=b[k];
    if(isObj_(x)&&isObj_(y)){const s=objDiff(x,y);if(s){p[k]={$p:s};n++}}else if(JSON.stringify(x)!==JSON.stringify(y)){p[k]=isObj_(x)?{$v:x}:x;n++}}
  for(const k in b)if(!(k in a)){p[k]={$x:1};n++}
  return n?p:null}
function objApply(b,p){if(!p)return b;for(const k in p){const v=p[k];
    if(isObj_(v)&&v.$x){delete b[k]}else if(isObj_(v)&&'$p' in v){b[k]=objApply(isObj_(b[k])?b[k]:{},v.$p)}else if(isObj_(v)&&'$v' in v){b[k]=v.$v}else b[k]=v}
  return b}
// kale kopie van een leven zoals een opname hem bewaart: zonder opnames, logboek en huizenmarkt
function snapBase(o){const c=Object.assign({},o);delete c.snaps;delete c.log;if(c.flags&&c.flags.mk){c.flags=Object.assign({},c.flags);delete c.flags.mk}return c}
const PACKC={};// per leven: {key, ps:[patches van oudere opnames], newest:{object}}
function snapPack(life,keep){let sn=life.snaps||[];if(keep&&sn.length>keep)sn=life.snaps=sn.slice(-keep);if(!sn.length)return null;
  const key=sn.map(x=>x.m+':'+x.ll+':'+x.d.length).join(',');let C=PACKC[life.id];
  if(!C||C.key!==key){const objs=sn.map(x=>snapBase(JSON.parse(x.d)));C=PACKC[life.id]={key,newest:objs[objs.length-1],ps:objs.slice(0,-1).map((o,i)=>objDiff(o,objs[i+1]))}}
  const cur=JSON.parse(JSON.stringify(snapBase(life)));
  const list=sn.map((x,i)=>({m:x.m,ll:x.ll,p:i===sn.length-1?objDiff(C.newest,cur):C.ps[i]}));
  return {v:2,list}}
function snapUnpack(life,pk){if(!pk||!pk.list||!pk.list.length)return [];
  let o=JSON.parse(JSON.stringify(snapBase(life)));const out=[];
  for(let i=pk.list.length-1;i>=0;i--){const it=pk.list[i];o=objApply(o,it.p);out.unshift({m:it.m,ll:it.ll,d:JSON.stringify(o)});o=JSON.parse(out[0].d)}
  return out}
/* ---------- schrijven ---------- */
const LSW={};// sleutel → laatst geschreven tekst (om onnodig schrijven over te slaan)
let LSFULL=false;
function lsPut(k,v){if(LSW[k]===v)return;localStorage.setItem(k,v);LSW[k]=v}
function lsDel(k){try{localStorage.removeItem(k)}catch(e){}delete LSW[k]}
function lifeStr(l){const c=Object.assign({},l);delete c.snaps;return JSON.stringify(c)}
function writeLife(id){const l=STORE.lives[id];if(!l)return;
  lsPut(V2L+id,lifeStr(l));
  const act=S?S.id:STORE.last;const pk=l.done?null:snapPack(l,act===id?0:3);if(pk)lsPut(V2S+id,JSON.stringify(pk));else if(localStorage.getItem(V2S+id)!=null)lsDel(V2S+id)}
function writeIndex(){lsPut(V2,JSON.stringify({v:2,last:STORE.last,meta:STORE.meta,ids:Object.keys(STORE.lives)}))}
function removeGone(){for(const k of Object.keys(localStorage))if(k.startsWith(V2L)||k.startsWith(V2S)){const id=k.slice(k.startsWith(V2L)?V2L.length:V2S.length);if(!STORE.lives[id])lsDel(k)}}
// alles wegschrijven wat veranderd is; only = alleen dit leven (snel, bij ouder worden)
function lsSave(only){
  if(STORE.v1only){try{const c=Object.assign({},STORE);delete c.v1only;delete c.migrated;localStorage.setItem(LS_KEY,JSON.stringify(c));return true}catch(e){storeFull(e);return false}}
  try{
    if(only)writeLife(only);else for(const id of Object.keys(STORE.lives))writeLife(id);
    writeIndex();if(!only)removeGone();LSFULL=false;return true}
  catch(e){storeFull(e);return false}}
function saveLife(){if(!S)return;S.updated=Date.now();S.q=Q;const prev=STORE.lives[S.id];STORE.lives[S.id]=S;STORE.last=S.id;
  // andere levens die net veranderd zijn (erfenis: het oude leven wordt een grafsteen) ook meenemen
  const others=Object.keys(STORE.lives).filter(id=>id!==S.id&&!LSW[V2L+id]);
  lsSave(others.length||prev!==S?null:S.id);cloudQueue(S.id);cloudQueue('_meta')}
/* ---------- volle opslag: nooit stil ---------- */
function storeFull(e){console.warn('opslag',e);if(LSFULL)return;LSFULL=true;
  const others=Object.values(STORE.lives).filter(l=>!l.done&&(!S||l.id!==S.id)&&(l.snaps||[]).length);
  try{modal({title:'Je opslag is vol',em:'💾',cat:'Opslaan',text:`Dit leven kon niet worden bewaard. Maak ruimte vrij, dan probeer ik het meteen opnieuw.${others.length?` De tijdmachine van je ${others.length} andere ${others.length===1?'leven':'levens'} wissen scheelt het meest.`:''}`,choices:opts([
    ...(others.length?[{t:'Tijdmachine van andere levens wissen',cls:'go',on:()=>{closeModal();for(const l of others){l.snaps=[];delete PACKC[l.id];lsDel(V2S+l.id)}LSFULL=false;if(lsSave())toast('Ruimte gemaakt en opgeslagen')}}]:[]),
    {t:'Naar mijn levens (oude levens verwijderen)',on:()=>{closeModal();LSFULL=false;closeSheet();renderStart();show('start')}},
    {t:'Later',cls:'ghost',on:()=>{closeModal();toast('Let op: je laatste stappen zijn nog niet bewaard')}}])})}catch(x){}}
/* ---------- laden en migreren ---------- */
function lsReadV2(){const ix=JSON.parse(localStorage.getItem(V2)||'null');if(!ix||ix.v!==2)return null;
  const st={lives:{},last:ix.last,meta:ix.meta};
  for(const id of ix.ids||[]){const t=localStorage.getItem(V2L+id);if(t==null)continue;LSW[V2L+id]=t;const l=JSON.parse(t);
    const s=localStorage.getItem(V2S+id);if(s!=null){LSW[V2S+id]=s;try{l.snaps=snapUnpack(l,JSON.parse(s))}catch(e){console.warn('opnames',id,e);l.snaps=[]}}else if(!l.done)l.snaps=[];
    st.lives[id]=l}
  LSW[V2]=localStorage.getItem(V2);return st}
function lsLoad(){try{
    const v2=lsReadV2();if(v2){STORE=v2;return}
    const t=localStorage.getItem(LS_KEY);if(!t)return;const d=JSON.parse(t);if(!(d&&d.lives))return;
    STORE=d;migrateV1()}
  catch(e){console.warn('laden',e);if(typeof errLog==='function')errLog(e,'opgevangen')}}
function migrateV1(){
  const ok=()=>{for(const k of Object.keys(LSW))delete LSW[k];const back=lsReadV2();if(!back)return false;
    for(const id of Object.keys(STORE.lives)){const a=STORE.lives[id],b=back.lives[id];if(!b||lifeStr(a)!==lifeStr(b)||(a.snaps||[]).length&&!(b.snaps||[]).length&&a.id!==STORE.last)return false}return true};
  let saved=false;try{for(const id of Object.keys(STORE.lives))writeLife(id);writeIndex();saved=true}catch(e){
    // te vol voor oud + nieuw naast elkaar: tijdmachine van niet-actieve levens laten vallen (deed de oude versie ook)
    try{for(const l of Object.values(STORE.lives))if(l.id!==STORE.last)l.snaps=[];for(const id of Object.keys(STORE.lives))writeLife(id);writeIndex();saved=true}catch(e2){console.warn('migratie',e2)}}
  if(saved&&ok()){localStorage.removeItem(LS_KEY);STORE.migrated=1;return true}
  // mislukt: nieuwe sleutels weghalen, met de oude gegevens verder (niets kwijt)
  try{localStorage.removeItem(V2);for(const k of Object.keys(localStorage))if(k.startsWith(V2L)||k.startsWith(V2S))localStorage.removeItem(k)}catch(e){}
  for(const k of Object.keys(LSW))delete LSW[k];STORE.v1only=1;return false}
