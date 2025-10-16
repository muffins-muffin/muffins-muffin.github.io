document.addEventListener('DOMContentLoaded', function () {
  var rows = document.querySelectorAll('.services-row');
  rows.forEach(function(row){
    // mark pre-animate and set left/right classes
    row.classList.add('pre-animate');
    var photos = row.querySelectorAll('.service-photo');
    photos.forEach(function(photo, i){
      // for rows of three: 0=left, 1=center, 2=right — fallback to alternating for other counts
      if (photos.length === 3) {
        if (i === 0) photo.classList.add('left');
        else if (i === 1) photo.classList.add('center');
        else photo.classList.add('right');
      } else {
        if (i % 2 === 0) photo.classList.add('left'); else photo.classList.add('right');
      }
      // compute an exact off-screen translate so the photo begins outside the viewport
      try {
        var rect = photo.getBoundingClientRect();
        var vw = window.innerWidth || document.documentElement.clientWidth;
        if (photo.classList.contains('left')) {
          // distance from left edge to move the photo fully off-screen (negative)
          var dist = -(rect.left + rect.width + 8); // extra 8px buffer
          photo.style.setProperty('--initial-transform', 'translateX(' + dist + 'px)');
        } else if (photo.classList.contains('right')) {
          // move to right off-screen: remaining distance to right edge plus width
          var distR = (vw - rect.left) + rect.width + 8;
          photo.style.setProperty('--initial-transform', 'translateX(' + distR + 'px)');
        } else if (photo.classList.contains('center')) {
          photo.style.setProperty('--initial-transform', 'scale(0.86)');
        }
      } catch (e) {
        // ignore if layout not ready; fallback CSS variable will be used
      }
    });
  });

  // trigger animation after slight delay so CSS transition runs
  setTimeout(function(){
    rows.forEach(function(row){
      row.classList.remove('pre-animate');
      row.classList.add('animate');
    });
  }, 120);
});
