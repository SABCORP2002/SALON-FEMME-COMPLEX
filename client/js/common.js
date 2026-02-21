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

  var menuToggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('main-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('menu-open', open);
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1040) {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  }
})();
