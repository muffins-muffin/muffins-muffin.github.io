(function(){
  'use strict';
  var popup = document.getElementById('site-popup');
  if(!popup) return;

  var closeBtn = popup.querySelector('.site-popup__close');
  var actionBtn = popup.querySelector('.site-popup__action');
  var backdrop = popup.querySelector('.site-popup__backdrop');

  function showPopup(){
    popup.hidden = false;
    // trap focus
    popup.setAttribute('aria-hidden','false');
    // focus first focusable element
    closeBtn.focus();
  }
  function hidePopup(){
    popup.hidden = true;
    popup.setAttribute('aria-hidden','true');
    try { localStorage.setItem('site_popup_seen','1'); } catch(e){}
  }

  // Expose helpers for console/testing
  window.showSitePopup = function(){
    try{ localStorage.removeItem('site_popup_seen'); }catch(e){}
    showPopup();
  };
  window.resetSitePopupSeen = function(){
    try{ localStorage.removeItem('site_popup_seen'); }catch(e){}
    if(window.alert) console.log('site_popup_seen removed from localStorage');
  };

  closeBtn.addEventListener('click', hidePopup);
  actionBtn.addEventListener('click', hidePopup);
  backdrop.addEventListener('click', hidePopup);

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !popup.hidden){ hidePopup(); }
  });

  // Show once per user (localStorage) unless ?showpopup=1 in URL
  var params = new URLSearchParams(window.location.search);
  var force = params.get('showpopup') === '1';
  var seen = false;
  try{ seen = localStorage.getItem('site_popup_seen') === '1'; }catch(e){}
  if(force || !seen){
    // delay a bit
    setTimeout(showPopup, 900);
  }
})();
