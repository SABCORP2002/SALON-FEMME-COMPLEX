(function () {
  var services = (window.SALON_DATA && window.SALON_DATA.services) || [];
  var root = document.getElementById('home-signature');
  if (!root) return;
  var cards = services.slice(0, 3).map(function (service) {
    return '<article class="signature-card"><p class="service-category">'+service.category+'</p><h3>'+service.name+'</h3><p>'+service.description+'</p><div><span>$'+service.price+'</span><span>'+service.duration+' min</span></div></article>';
  }).join('');
  root.innerHTML = '<div class="section-heading"><p class="eyebrow">Most Requested</p><h2>Signature Services</h2></div><div class="signature-grid">'+cards+'</div>';

  var statNodes = document.querySelectorAll('.hero-stats strong');
  if (!statNodes.length) return;

  function animateStat(el) {
    var text = el.textContent.trim();
    var match = text.match(/(\d+)/);
    if (!match) return;
    var target = Number(match[1]);
    if (!target) return;
    var suffix = text.replace(String(target), '');
    var start = 0;
    var duration = 900;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var value = Math.floor(start + (target - start) * progress);
      el.textContent = String(value) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statNodes.forEach(function (node) { io.observe(node); });
})();
