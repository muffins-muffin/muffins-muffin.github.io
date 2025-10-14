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
    // center the active item by translating the track
    const itemWidth = items[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 18);
    const visibleWidth = root.getBoundingClientRect().width;
    // compute offset so active item is centered if possible
    const centerOffset = (visibleWidth - itemWidth) / 2;
    let translateX = -(index * itemWidth) + centerOffset;
    // limit translateX so track doesn't leave empty space
    const maxTranslate = 0;
    const minTranslate = Math.min(0, visibleWidth - (items.length * itemWidth));
    if(translateX > maxTranslate) translateX = maxTranslate;
    if(translateX < minTranslate) translateX = minTranslate;
    track.style.transform = `translateX(${translateX}px)`;
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
