/* ================= FASE 8: gedeelde haakjes voor de nieuwe onderdelen =================
   Elk nieuw onderdeel (koningshuis, bijzondere loopbanen, schoolleven, identiteit, erfstukken,
   spookhuizen en exotische dieren, editor en God-modus) meldt zich hier aan. De kern van het spel
   roept alleen deze functies aan, altijd met typeof-controle, zodat oude levens gewoon blijven werken. */
const F8={year:[],inc:[],busy:[],birth:[],inherit:[],sub:[],pre:[],ach:[],job:[],special:[],person:[]};
// jaarlijks, aan het eind van birthday()
function f8Year(a){for(const f of F8.year)safe(()=>f(a))}
// extra inkomsten: [naam, bedrag per jaar]
function f8Inc(){const out=[];for(const f of F8.inc){const r=safe(()=>f());if(r)out.push(...r)}return out}
// heeft de speler werk of inkomen buiten de gewone baan (dan geen uitkering)
function f8Busy(){return F8.busy.some(f=>safe(()=>f()))}
// bij een nieuw leven, vóór de eerste logregels
function f8Birth(o,mom,dad){for(const f of F8.birth)safe(()=>f(o,mom,dad))}
// bij verder spelen als kind: old = vorig leven, n = nieuw leven (S is al n)
function f8Inherit(old,n,ch,age){for(const f of F8.inherit)safe(()=>f(old,n,ch,age))}
// ondertitel onder je naam; de eerste die iets teruggeeft wint
function f8Sub(){for(const f of F8.sub){const x=safe(()=>f());if(x)return x}return ''}
// voorvoegsel voor je naam (adellijke titel)
function f8Pre(){for(const f of F8.pre){const x=safe(()=>f());if(x)return x}return ''}
function f8Ach(add){for(const f of F8.ach)safe(()=>f(add))}
// rijen bovenaan het tabblad Beroep; true als er iets is getoond
function f8JobRows(el){let any=false;for(const f of F8.job)if(safe(()=>f(el)))any=true;return any}
function f8Special(el,a){for(const f of F8.special)safe(()=>f(el,a))}
function f8Person(el,p){for(const f of F8.person)safe(()=>f(el,p))}
// hulpjes
const f8Hij=g=>g==='v'?'ze':g==='m'?'hij':'die';
const f8Zijn=g=>g==='v'?'haar':g==='m'?'zijn':'hun';
const f8Name=g=>{const N=NAMES[C().r];return pick(N[g==='x'?pick(['m','v']):g])};
const f8List=a=>a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' en '+a[a.length-1];
// eenmalig per leven
const f8Once=k=>{S.flags.f8=S.flags.f8||{};if(S.flags.f8[k])return false;S.flags.f8[k]=1;return true};
