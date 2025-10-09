// Improved hero animation: IntersectionObserver to reveal elements and lightweight parallax
(function(){
  'use strict';

  var hero = document.querySelector('.page__hero--overlay, .page__hero');
  if(!hero) return;

  var title = hero.querySelector('.page__title');
  var lead = hero.querySelector('.page__lead');

  // Parallax variables
  var speed = 0.18;
  var rafPending = false;

  function onParallax(){
    var offset = window.pageYOffset || document.documentElement.scrollTop || 0;
    // small translate for background effect
    hero.style.backgroundPosition = 'center calc(50% + ' + Math.round(offset * speed) + 'px)';
  }

  function onScrollRaf(){
    if(!rafPending){
      rafPending = true;
      requestAnimationFrame(function(){
        rafPending = false;
        onParallax();
      });
    }
  }

  // IntersectionObserver to add 'in-view' class when hero top area is visible
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        hero.classList.add('in-view');
      } else {
        hero.classList.remove('in-view');
      }
    });
  }, { root: null, threshold: [0, 0.25, 0.5, 0.75, 1] });

  io.observe(hero);

  // listen for scroll/resize for parallax
  document.addEventListener('scroll', onScrollRaf, {passive:true});
  window.addEventListener('resize', onScrollRaf);

  // initial
  document.addEventListener('DOMContentLoaded', function(){
    onParallax();
  });
})();
