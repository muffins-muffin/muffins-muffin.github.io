(function(){
  // Simple slider: expects .carousel > .slides > .slide
  const carousels = document.querySelectorAll('.carousel');
  // We continue even if no carousel found because we also add observers for photo-grid cards

  carousels.forEach(carousel => {
    const slidesEl = carousel.querySelector('.slides');
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const left = carousel.querySelector('.arrow.left');
    const right = carousel.querySelector('.arrow.right');
    const dots = Array.from(carousel.querySelectorAll('.dots button'));
    let index = 0;
    let autoplay = true;
    let timer = null;
    const interval = 5000; // 5s

    function update() {
      slidesEl.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((d,i)=> d.classList.toggle('active', i===index));
    }

    function next() { index = (index + 1) % slides.length; update(); }
    function prev() { index = (index - 1 + slides.length) % slides.length; update(); }

    right.addEventListener('click', ()=>{ next(); resetTimer(); });
    left.addEventListener('click', ()=>{ prev(); resetTimer(); });

    dots.forEach(d => d.addEventListener('click', (e) => {
      index = Number(e.currentTarget.dataset.index);
      update();
      resetTimer();
    }));

    // keyboard navigation
    carousel.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowRight') { next(); resetTimer(); }
      if(e.key === 'ArrowLeft') { prev(); resetTimer(); }
    });

    function startTimer(){ if(timer) clearInterval(timer); timer = setInterval(next, interval); }
    function stopTimer(){ if(timer) clearInterval(timer); timer = null; }
    function resetTimer(){ stopTimer(); if(autoplay) startTimer(); }

    // pause on hover/focus
    carousel.addEventListener('mouseenter', ()=>{ stopTimer(); });
    carousel.addEventListener('mouseleave', ()=>{ if(autoplay) startTimer(); });
    carousel.addEventListener('focusin', ()=>{ stopTimer(); });
    carousel.addEventListener('focusout', ()=>{ if(autoplay) startTimer(); });

    // init
    carousel.setAttribute('tabindex','0'); // make it focusable for keyboard
    update();
    if(autoplay) startTimer();
  });

  // Entrance animation for slides on initial load: apply alternating left/right classes
  document.addEventListener('DOMContentLoaded', function(){
    carousels.forEach((carousel)=>{
      const imgs = Array.from(carousel.querySelectorAll('.slide img'));
      imgs.forEach((img, i) => {
        // small timeout to stagger
        setTimeout(()=>{
          img.classList.add(i % 2 === 0 ? 'enter-from-left' : 'enter-from-right');
        }, 120 * i);
      });
    });

    // Reveal photo-grid cards as they scroll into view
    const cards = document.querySelectorAll('.photo-grid .card');
    if('IntersectionObserver' in window && cards.length){
      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      cards.forEach(c => obs.observe(c));
    } else {
      // fallback: add in-view immediately
      cards.forEach(c => c.classList.add('in-view'));
    }
  });
})();
