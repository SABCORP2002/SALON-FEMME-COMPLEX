(function () {
  var items = (window.SALON_DATA && window.SALON_DATA.gallery) || [];
  var filters = ['All'].concat(Array.from(new Set(items.map(function (i) { return i.category; }))));
  var filterRoot = document.getElementById('gallery-filters');
  var gridRoot = document.getElementById('gallery-grid');
  var lightbox = document.getElementById('lightbox');
  var active = 'All';
  if (!filterRoot || !gridRoot || !lightbox) return;

  function render() {
    var visible = active === 'All' ? items : items.filter(function (i) { return i.category === active; });
    gridRoot.innerHTML = visible.map(function (item) {
      return '<button type="button" class="gallery-card reveal" data-src="'+item.src+'" data-title="'+item.title+'"><img src="'+item.src+'" alt="'+item.title+'" loading="lazy" /><span>'+item.title+'</span></button>';
    }).join('');
  }

  filterRoot.innerHTML = filters.map(function (f) {
    return '<button type="button" data-filter="'+f+'" class="'+(f===active?'active':'')+'">'+f+'</button>';
  }).join('');

  filterRoot.addEventListener('click', function (event) {
    var btn = event.target.closest('button[data-filter]');
    if (!btn) return;
    active = btn.getAttribute('data-filter');
    Array.from(filterRoot.querySelectorAll('button')).forEach(function (b) { b.classList.toggle('active', b === btn); });
    render();
  });

  gridRoot.addEventListener('click', function (event) {
    var card = event.target.closest('.gallery-card');
    if (!card) return;
    var src = card.getAttribute('data-src');
    var title = card.getAttribute('data-title');
    lightbox.innerHTML = '<div class="lightbox-content"><button type="button" class="lightbox-close" id="lightbox-close">Close</button><img src="'+src+'" alt="'+title+'" /><p>'+title+'</p></div>';
    lightbox.hidden = false;
  });

  lightbox.addEventListener('click', function (event) {
    if (event.target.id === 'lightbox' || event.target.id === 'lightbox-close') {
      lightbox.hidden = true;
      lightbox.innerHTML = '';
    }
  });

  render();
})();
