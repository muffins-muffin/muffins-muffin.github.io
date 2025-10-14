(() => {
  const root = document.getElementById('gtv-carousel');
  if (!root) return;
  const track = root.querySelector('.gtv-track');
  const items = Array.from(root.querySelectorAll('.gtv-item'));
  const btnPrev = root.querySelector('.gtv-prev');
  const btnNext = root.querySelector('.gtv-next');
  let idx = 0;
  let timer = null;

  function update() {
    const itemEl = items[idx];
    const itemWidth = itemEl.getBoundingClientRect().width;
    const gap = 18; // match CSS
    const offset = idx * (itemWidth + gap);
    track.style.transform = `translateX(${-offset}px)`;
  }

  function next(){ idx = (idx + 1) % items.length; update(); }
  function prev(){ idx = (idx - 1 + items.length) % items.length; update(); }

  btnNext.addEventListener('click', () => { next(); resetTimer(); });
  btnPrev.addEventListener('click', () => { prev(); resetTimer(); });

  function startTimer(){ timer = setInterval(next, 3500); }
  function stopTimer(){ if(timer){ clearInterval(timer); timer = null; } }
  function resetTimer(){ stopTimer(); startTimer(); }

  root.addEventListener('mouseenter', stopTimer);
  root.addEventListener('mouseleave', startTimer);

  // touch support
  let sx = 0; let dx = 0; let touching = false;
  root.addEventListener('touchstart', e => { stopTimer(); touching = true; sx = e.touches[0].clientX; });
  root.addEventListener('touchmove', e => { if(!touching) return; dx = e.touches[0].clientX - sx; });
  root.addEventListener('touchend', e => { touching = false; if (Math.abs(dx) > 40){ if (dx < 0) next(); else prev(); } dx = 0; startTimer(); });

  window.addEventListener('resize', update);
  // kick off
  update(); startTimer();
})();
