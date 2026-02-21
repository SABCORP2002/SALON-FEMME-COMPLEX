(function () {
  var services = (window.SALON_DATA && window.SALON_DATA.services) || [];
  var categories = ['All'].concat(Array.from(new Set(services.map(function (s) { return s.category; }))));
  var tagRoot = document.getElementById('service-tags');
  var cardRoot = document.getElementById('services-grid');
  if (!tagRoot || !cardRoot) return;

  function renderCards(filter) {
    var visible = filter === 'All' ? services : services.filter(function (s) { return s.category === filter; });
    cardRoot.innerHTML = visible.map(function (service) {
      return '<article class="service-card reveal"><p class="service-category">'+service.category+'</p><h3>'+service.name+'</h3><p>'+service.description+'</p><div class="service-meta"><span>$'+service.price+'</span><span>'+service.duration+' min</span></div><div class="service-card-actions"><a class="btn service-btn" href="booking.html?service='+encodeURIComponent(service.name)+'">Book This Service</a></div></article>';
    }).join('');
  }

  var active = 'All';
  tagRoot.innerHTML = categories.map(function (category) {
    return '<button type="button" data-category="'+category+'" class="'+(category === active ? 'active' : '')+'">'+category+'</button>';
  }).join('');

  tagRoot.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-category]');
    if (!btn) return;
    active = btn.getAttribute('data-category');
    Array.from(tagRoot.querySelectorAll('button')).forEach(function (b) { b.classList.toggle('active', b === btn); });
    renderCards(active);
  });

  renderCards(active);
})();
