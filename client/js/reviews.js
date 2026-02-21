(function () {
  var STORAGE_KEY = 'salon_femme_reviews';
  var rootList = document.getElementById('reviews-list');
  var form = document.getElementById('review-form');
  var summary = document.getElementById('reviews-summary');
  var msg = document.getElementById('review-status');
  if (!rootList || !form || !summary) return;

  var services = (window.SALON_DATA && window.SALON_DATA.services) || [];
  var starterReviews = (window.SALON_DATA && window.SALON_DATA.reviews) || [];

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return starterReviews;
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : starterReviews;
    } catch (e) {
      return starterReviews;
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function fmtDate(value) {
    return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function render(items) {
    var avg = items.length ? (items.reduce(function (sum, i) { return sum + Number(i.rating || 0); }, 0) / items.length).toFixed(1) : '0.0';
    summary.innerHTML = '<article><strong>'+avg+'</strong><span>Average Rating</span></article><article><strong>'+items.length+'</strong><span>Total Reviews</span></article>';

    rootList.innerHTML = items.map(function (review) {
      var stars = '★'.repeat(Number(review.rating)) + '☆'.repeat(5 - Number(review.rating));
      return '<article class="review-card"><div class="review-head"><h3>'+review.name+'</h3><span>'+fmtDate(review.createdAt)+'</span></div><p class="review-service">Service: '+review.service+'</p><p class="review-stars" aria-label="'+review.rating+' out of 5 stars">'+stars+'</p><p>'+review.comment+'</p></article>';
    }).join('');
  }

  var serviceSelect = form.querySelector('[name="service"]');
  services.forEach(function (service) {
    var option = document.createElement('option');
    option.value = service.name;
    option.textContent = service.name;
    serviceSelect.appendChild(option);
  });

  var state = read();
  render(state);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var fd = new FormData(form);
    var review = Object.fromEntries(fd.entries());
    if (!review.name || !review.service || !review.comment) {
      msg.className = 'message error review-message';
      msg.textContent = 'Please complete all required review fields.';
      return;
    }

    state.unshift({
      id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : String(Date.now()),
      name: review.name.trim(),
      service: review.service,
      rating: Number(review.rating || 5),
      comment: review.comment.trim(),
      createdAt: new Date().toISOString()
    });

    save(state);
    render(state);
    form.reset();
    msg.className = 'message success review-message';
    msg.textContent = 'Thank you. Your review has been added.';
  });
})();
