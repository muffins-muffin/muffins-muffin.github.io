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

  // Always show popup on page load (per request)
  setTimeout(showPopup, 900);
})();
