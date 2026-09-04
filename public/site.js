// Prodaco — shared site JS
(function () {
  // Return refreshed internal pages to the homepage.
  var navigationEntry = window.performance && typeof window.performance.getEntriesByType === 'function'
    ? window.performance.getEntriesByType('navigation')[0]
    : null;
  var legacyNavigation = window.performance && window.performance.navigation;
  var isReload = navigationEntry
    ? navigationEntry.type === 'reload'
    : legacyNavigation && legacyNavigation.type === 1;
  var isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';

  if (isReload && !isHome) {
    window.location.replace('/');
    return;
  }

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
  }

  // Field-work carousel
  var carousel = document.querySelector('[data-work-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-work-slide]'));
    var dotsWrap = carousel.querySelector('.work-dots');
    var previous = carousel.querySelector('.work-prev');
    var next = carousel.querySelector('.work-next');
    var current = 0;
    var timer;
    var touchStartX = 0;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      Array.prototype.forEach.call(dotsWrap.children, function (dot, dotIndex) {
        dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
      });
    }

    function stopCarousel() {
      window.clearInterval(timer);
    }

    function startCarousel() {
      stopCarousel();
      if (!reduceMotion) {
        timer = window.setInterval(function () { showSlide(current + 1); }, 4800);
      }
    }

    slides.forEach(function (_, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'work-dot';
      dot.setAttribute('aria-label', 'Show photo ' + (index + 1));
      dot.addEventListener('click', function () {
        showSlide(index);
        startCarousel();
      });
      dotsWrap.appendChild(dot);
    });

    previous.addEventListener('click', function () {
      showSlide(current - 1);
      startCarousel();
    });
    next.addEventListener('click', function () {
      showSlide(current + 1);
      startCarousel();
    });
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    carousel.addEventListener('focusin', stopCarousel);
    carousel.addEventListener('focusout', startCarousel);
    carousel.addEventListener('touchstart', function (event) {
      touchStartX = event.changedTouches[0].clientX;
      stopCarousel();
    }, { passive: true });
    carousel.addEventListener('touchend', function (event) {
      var distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 45) showSlide(current + (distance < 0 ? 1 : -1));
      startCarousel();
    }, { passive: true });

    showSlide(0);
    startCarousel();
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
