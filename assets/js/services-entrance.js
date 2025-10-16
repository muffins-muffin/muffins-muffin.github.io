document.addEventListener('DOMContentLoaded', function () {
  var rows = document.querySelectorAll('.services-row');
  rows.forEach(function(row){
    // mark pre-animate and set left/right classes
    row.classList.add('pre-animate');
    var photos = row.querySelectorAll('.service-photo');
    photos.forEach(function(photo, i){
      // alternate left/right across the row
      if (i % 2 === 0) photo.classList.add('left'); else photo.classList.add('right');
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
