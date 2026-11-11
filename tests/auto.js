// gedeelde autospeler voor minigames en modals
window.AUTO=async function(maxMs=60000){const sl=ms=>new Promise(r=>setTimeout(r,ms));const t0=Date.now();let code=null,log=[];
  while(Date.now()-t0<maxMs){const m=document.querySelector('#modal');if(m.hidden)return log;
    const q=s=>m.querySelector(s);
    if(q('#dg')){if(Math.random()<.15)(Math.random()<.5?q('#dgL'):q('#dgR')).click();await sl(60);continue}
    if(q('#rh')){const ns=[...m.querySelectorAll('.rh-n')].map(n=>parseFloat(n.style.top));if(ns.some(y=>Math.abs(y-82)<4))q('#rhb').click();await sl(25);continue}
    if(q('#rc')){if(q('#rc').classList.contains('go'))q('#rcb').click();await sl(40);continue}
    if(q('#dln')){if(Math.random()<.04)q('#dlb').click();await sl(30);continue}
    if(q('#cds')){if(!q('#cds').classList.contains('gone')){code=[...q('#cds').children].map(b=>b.textContent);await sl(50);continue}
      if(code&&q('#cdp')&&!q('#cdp').hidden){for(const v of code){const b=[...m.querySelectorAll('#cdp button')].find(x=>x.dataset.v===v);b&&b.click();await sl(30)}code=null;await sl(1200);continue}await sl(50);continue}
    if(q('#amx')){await sl(300+Math.random()*400);q('#amb')&&q('#amb').click();continue}
    if(q('.pk')){q('.pk').click();await sl(30);q('#pkd').click();await sl(50);continue}
    if(q('.kras')){const b=[...m.querySelectorAll('.kras button:not(.open)')][0];b&&b.click();await sl(80);continue}
    if(q('#amt')){q('#amt').value='100';const b=[...m.querySelectorAll('.btn')].find(x=>/Bevestigen/.test(x.textContent));b.click();await sl(50);continue}
    if(q('#rn')){q('.btn.go').click();await sl(50);continue}
    const t=(q('.ptitle')||q('h3')||{}).textContent||'';log.push(t.trim().slice(0,40));
    const bs=[...m.querySelectorAll('.btn:not([disabled])')].filter(b=>!b.classList.contains('ghost'));if(!bs.length){const g=m.querySelector('.btn.ghost');if(g)g.click();else window.closeModal&&closeModal();await sl(50);continue}
    bs[Math.floor(Math.random()*bs.length)].click();await sl(60)}
  return log.concat(['TIMEOUT'])};
