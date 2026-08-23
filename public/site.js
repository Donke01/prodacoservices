// Prodaco — shared site JS
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
  }

  // Contact form → POST /api/contact
  var form = document.getElementById('contactForm');
  if (!form) return;
  var msg = document.getElementById('formMsg');
  var btn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    msg.className = 'form-msg';
    msg.textContent = '';
    btn.disabled = true;
    var origLabel = btn.textContent;
    btn.textContent = 'Sending…';
    try {
      var data = Object.fromEntries(new FormData(form).entries());
      var r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      var body = await r.json().catch(function () { return {}; });
      if (!r.ok) throw new Error(body.error || 'Something went wrong. Please call us on +254 716 767371.');
      msg.className = 'form-msg ok';
      msg.textContent = "Thanks — we've received your message. We'll call or WhatsApp you back shortly.";
      form.reset();
    } catch (err) {
      msg.className = 'form-msg err';
      msg.textContent = err.message;
    } finally {
      btn.disabled = false;
      btn.textContent = origLabel;
    }
  });
})();
