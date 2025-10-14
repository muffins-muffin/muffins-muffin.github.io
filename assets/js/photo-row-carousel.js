(function(){
  const root = document.getElementById('photo-row-carousel');
  if(!root) return;
  const track = root.querySelector('.photo-row-track');
  const items = Array.from(track.children);
  const prev = root.querySelector('.photo-row-prev');
  const next = root.querySelector('.photo-row-next');
  let idx = 0;
  const visibleCount = Math.floor(root.getBoundingClientRect().width / (items[0].getBoundingClientRect().width + 14));
  const interval = 3500;
  let timer = null;

  function scrollToIndex(i){
    const itemWidth = items[0].getBoundingClientRect().width + 14;
    const left = i * itemWidth;
    track.scrollTo({ left, behavior: 'smooth' });
  }
  function nextItem(){ idx = (idx + 1) % items.length; scrollToIndex(idx); }
  function prevItem(){ idx = (idx - 1 + items.length) % items.length; scrollToIndex(idx); }
  if(next) next.addEventListener('click', ()=>{ nextItem(); reset(); });
  if(prev) prev.addEventListener('click', ()=>{ prevItem(); reset(); });
  function start(){ stop(); timer = setInterval(nextItem, interval); }
  function stop(){ if(timer) clearInterval(timer); timer=null; }
  function reset(){ stop(); start(); }
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  // touch support: quick swipe
  let startX=null;
  track.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; stop(); });
  track.addEventListener('touchend', e=>{ if(startX!==null){ const dx = startX - e.changedTouches[0].clientX; if(Math.abs(dx)>30){ if(dx>0) nextItem(); else prevItem(); } startX=null; reset(); }});
  window.addEventListener('resize', ()=>{ /* recalc if needed */ });
  start();
})();