(function () {
  var currentYear = document.getElementById('current-year');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  var path = window.location.pathname.toLowerCase();
  var links = document.querySelectorAll('.nav-link');
  links.forEach(function (link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    if ((path.endsWith('/') && href === 'index.html') || path.endsWith(href)) {
      link.classList.add('active');
    }
  });
})();
