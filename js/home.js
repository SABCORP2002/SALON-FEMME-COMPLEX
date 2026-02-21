(function () {
  var services = (window.SALON_DATA && window.SALON_DATA.services) || [];
  var root = document.getElementById('home-signature');
  if (!root) return;
  var cards = services.slice(0, 3).map(function (service) {
    return '<article class="signature-card"><p class="service-category">'+service.category+'</p><h3>'+service.name+'</h3><p>'+service.description+'</p><div><span>$'+service.price+'</span><span>'+service.duration+' min</span></div></article>';
  }).join('');
  root.innerHTML = '<div class="section-heading"><p class="eyebrow">Most Requested</p><h2>Signature Services</h2></div><div class="signature-grid">'+cards+'</div>';
})();
