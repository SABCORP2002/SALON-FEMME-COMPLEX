(function () {
  var items = (window.SALON_DATA && window.SALON_DATA.gallery) || [];
  var filters = ['All'].concat(Array.from(new Set(items.map(function (i) { return i.category; }))));
  var filterRoot = document.getElementById('gallery-filters');
  var gridRoot = document.getElementById('gallery-grid');
  var lightbox = document.getElementById('lightbox');
  var currentVisible = [];
  var currentIndex = -1;
  var active = 'All';
  if (!filterRoot || !gridRoot || !lightbox) return;
  lightbox.hidden = true;
  lightbox.innerHTML = '';

  function render() {
    currentVisible = active === 'All' ? items.slice() : items.filter(function (i) { return i.category === active; });
    gridRoot.innerHTML = currentVisible.map(function (item, idx) {
      return '<button type="button" class="gallery-card reveal" data-index="'+idx+'" data-src="'+item.src+'" data-title="'+item.title+'"><img src="'+item.src+'" alt="'+item.title+'" loading="lazy" /><span>'+item.title+'</span></button>';
    }).join('');
  }

  function openAt(index) {
    if (index < 0 || index >= currentVisible.length) return;
    currentIndex = index;
    var item = currentVisible[currentIndex];
    lightbox.innerHTML = '<div class="lightbox-content"><div class="lightbox-toolbar"><button type="button" class="lightbox-nav" id="lightbox-prev" aria-label="Previous image">Prev</button><button type="button" class="lightbox-close" id="lightbox-close">Close</button><button type="button" class="lightbox-nav" id="lightbox-next" aria-label="Next image">Next</button></div><img src="'+item.src+'" alt="'+item.title+'" /><p>'+item.title+'</p></div>';
    lightbox.hidden = false;
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
    openAt(Number(card.getAttribute('data-index')));
  });

  lightbox.addEventListener('click', function (event) {
    if (event.target.id === 'lightbox-prev') {
      openAt((currentIndex - 1 + currentVisible.length) % currentVisible.length);
      return;
    }
    if (event.target.id === 'lightbox-next') {
      openAt((currentIndex + 1) % currentVisible.length);
      return;
    }
    if (event.target.id === 'lightbox' || event.target.id === 'lightbox-close') {
      lightbox.hidden = true;
      lightbox.innerHTML = '';
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !lightbox.hidden) {
      lightbox.hidden = true;
      lightbox.innerHTML = '';
      return;
    }
    if (!lightbox.hidden && event.key === 'ArrowLeft') {
      openAt((currentIndex - 1 + currentVisible.length) % currentVisible.length);
      return;
    }
    if (!lightbox.hidden && event.key === 'ArrowRight') {
      openAt((currentIndex + 1) % currentVisible.length);
    }
  });

  render();
})();
