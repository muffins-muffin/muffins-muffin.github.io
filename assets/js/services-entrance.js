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
    });
  });

  // trigger animation after slight delay so CSS transition runs
  setTimeout(function(){
    rows.forEach(function(row){
      row.classList.remove('pre-animate');
      row.classList.add('animate');
    });
  }, 480);
});
