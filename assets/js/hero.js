// Simple hero scroll fade and light parallax
(function(){
  'use strict';

  function onScroll(){
    var hero = document.querySelector('.page__hero--overlay, .page__hero');
    if(!hero) return;

    var rect = hero.getBoundingClientRect();
    var windowH = window.innerHeight || document.documentElement.clientHeight;
    var visible = Math.max(0, Math.min(rect.bottom, windowH) - Math.max(rect.top, 0));
    var ratio = visible / Math.min(rect.height, windowH);

    // Fade title and lead slightly when scrolled
    var title = hero.querySelector('.page__title');
    var lead = hero.querySelector('.page__lead');
    var caption = hero.querySelector('.page__hero-caption');

    var opacity = Math.max(0, Math.min(1, ratio));
    if(title) title.style.opacity = opacity;
    if(lead) lead.style.opacity = opacity;
    if(caption) caption.style.opacity = opacity;

    // Parallax: move background position a little based on scroll
    var speed = 0.25; // lower is slower
    var offset = (window.scrollY || window.pageYOffset) * speed;
    hero.style.backgroundPosition = 'center calc(50% + ' + (offset * 0.1) + 'px)';
  }

  var rafPending = false;
  function rafScroll(){
    if(!rafPending){
      rafPending = true;
      requestAnimationFrame(function(){ rafPending = false; onScroll(); });
    }
  }

  document.addEventListener('scroll', rafScroll, {passive: true});
  window.addEventListener('resize', rafScroll);
  document.addEventListener('DOMContentLoaded', function(){
    // initial run
    onScroll();
  });
})();
