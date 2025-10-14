(function(){
  // Simple rectangular slideshow controller for #rect-slideshow
  const root = document.getElementById('rect-slideshow');
  if(!root) return;

  const track = root.querySelector('.rect-track');
  const items = Array.from(root.querySelectorAll('.rect-item'));
  const left = root.querySelector('.rect-arrow.left');
  const right = root.querySelector('.rect-arrow.right');
  let index = items.findIndex(i => i.classList.contains('active'));
  if(index === -1) index = 0;

  const interval = 4000; // 4s
  let timer = null;

  function update(){
    // set active class
    items.forEach((it, i) => it.classList.toggle('active', i === index));
    // compute translation so the active item sits slightly right of center and then moves left
    const itemWidth = items[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 18);
    const viewport = root.querySelector('.rect-viewport');
    const visibleWidth = viewport ? viewport.getBoundingClientRect().width : root.getBoundingClientRect().width;

    // desired position: active item offset from left edge of viewport (start mid-right)
    const offsetFromLeft = Math.round(visibleWidth * 0.5); // place active approx at 50% of viewport
    let translateX = -(index * itemWidth) + offsetFromLeft;

    // clamp so we don't show empty space at the ends
    const maxTranslate = 0 + (viewport ? 0 : 0);
    const minTranslate = Math.min(0, visibleWidth - (items.length * itemWidth));
    if(translateX > maxTranslate) translateX = maxTranslate;
    if(translateX < minTranslate) translateX = minTranslate;
    track.style.transform = `translateX(${translateX}px)`;

    // update left-side text if data attributes exist on the active item
    const active = items[index];
    if(active){
      const titleEl = root.querySelector('.rect-side .rect-title');
      const descEl = root.querySelector('.rect-side .rect-desc');
      if(titleEl && active.dataset.title) titleEl.textContent = active.dataset.title;
      if(descEl && active.dataset.desc) descEl.textContent = active.dataset.desc;
    }
  }

  function next(){ index = (index + 1) % items.length; update(); }
  function prev(){ index = (index - 1 + items.length) % items.length; update(); }

  right.addEventListener('click', ()=>{ next(); resetTimer(); });
  left.addEventListener('click', ()=>{ prev(); resetTimer(); });

  // Auto-advance
  function start(){ stop(); timer = setInterval(next, interval); }
  function stop(){ if(timer) clearInterval(timer); timer = null; }
  function resetTimer(){ stop(); start(); }

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  window.addEventListener('resize', update);
  document.addEventListener('DOMContentLoaded', update);

  // init
  update(); start();
})();
