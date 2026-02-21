(function () {
  var services = (window.SALON_DATA && window.SALON_DATA.services) || [];
  var form = document.getElementById('booking-form');
  var summary = document.getElementById('booking-summary');
  var status = document.getElementById('booking-status');
  if (!form || !summary) return;

  var serviceSelect = form.querySelector('[name="service"]');
  var dateInput = form.querySelector('[name="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  services.forEach(function (service) {
    var opt = document.createElement('option');
    opt.value = service.name;
    opt.textContent = service.name + ' ($' + service.price + ')';
    serviceSelect.appendChild(opt);
  });

  var params = new URLSearchParams(window.location.search);
  var preselected = params.get('service');
  if (preselected && services.some(function (s) { return s.name === preselected; })) {
    serviceSelect.value = preselected;
  }

  function validate(data) {
    if (!data.clientName || data.clientName.trim().length < 2) return 'Please enter a valid full name.';
    if (!/^[0-9+\-()\s]{7,20}$/.test(data.phone || '')) return 'Please enter a valid phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) return 'Please enter a valid email address.';
    if (!data.service || !data.date || !data.time) return 'Please select a service, date, and time.';
    var selected = new Date(data.date + 'T' + data.time + ':00');
    if (Number.isNaN(selected.getTime()) || selected < new Date()) return 'Please choose a future appointment time.';
    return '';
  }

  function updateSummary(data) {
    var selected = services.find(function (s) { return s.name === data.service; });
    var details = selected ? '<div class="summary-service"><p><strong>Estimated Duration:</strong> '+selected.duration+' min</p><p><strong>Price:</strong> $'+selected.price+'</p></div>' : '';
    summary.innerHTML = '<h2>Appointment Snapshot</h2><p><strong>Service:</strong> '+(data.service || 'Not selected')+'</p><p><strong>Date:</strong> '+(data.date || 'Not selected')+'</p><p><strong>Time:</strong> '+(data.time || 'Not selected')+'</p><p><strong>Stylist:</strong> '+(data.stylist || 'No preference')+'</p><p><strong>Delivery:</strong> Owner Email</p>'+details+'<p class="summary-note">Configure owner email and EmailJS keys in <code>js/config.js</code> for direct delivery.</p><p class="summary-email">Current receiver: '+window.SALON_CONFIG.ownerEmail+'</p>';
  }

  function toData() {
    var fd = new FormData(form);
    return Object.fromEntries(fd.entries());
  }

  function buildMailto(data) {
    var subject = encodeURIComponent('New Booking Request - ' + data.service);
    var body = encodeURIComponent([
      'Client Name: ' + data.clientName,
      'Phone: ' + data.phone,
      'Email: ' + data.email,
      'Service: ' + data.service,
      'Date: ' + data.date,
      'Time: ' + data.time,
      'Preferred Stylist: ' + (data.stylist || 'No preference'),
      'Notes: ' + (data.notes || 'N/A')
    ].join('\n'));
    return 'mailto:' + window.SALON_CONFIG.ownerEmail + '?subject=' + subject + '&body=' + body;
  }

  form.addEventListener('input', function () { updateSummary(toData()); });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = toData();
    var err = validate(data);
    if (err) {
      status.className = 'message error';
      status.textContent = err;
      return;
    }

    var hasEmailJs = window.emailjs && window.SALON_CONFIG.emailjsServiceId && window.SALON_CONFIG.emailjsTemplateId && window.SALON_CONFIG.emailjsPublicKey;
    if (hasEmailJs) {
      window.emailjs.send(window.SALON_CONFIG.emailjsServiceId, window.SALON_CONFIG.emailjsTemplateId, data, { publicKey: window.SALON_CONFIG.emailjsPublicKey })
        .then(function () {
          status.className = 'message success';
          status.textContent = 'Booking request sent successfully to the salon owner email.';
          form.reset();
          updateSummary(toData());
        })
        .catch(function () {
          status.className = 'message error';
          status.textContent = 'Unable to send booking request. Check email service settings and try again.';
        });
      return;
    }

    window.location.href = buildMailto(data);
    status.className = 'message success';
    status.textContent = 'Your mail app has been opened to complete the booking email.';
  });

  updateSummary(toData());
})();
