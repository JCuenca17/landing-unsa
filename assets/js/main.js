/* =========================================================
   UNSA Market — Landing interactions
   Vanilla JS, sin dependencias.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Año dinámico ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: fondo al hacer scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      nav.classList.toggle('open-menu', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        nav.classList.remove('open-menu');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Marquee de categorías ---------- */
  var marquee = document.getElementById('marquee');
  if (marquee) {
    var items = [
      { t: 'Libros y apuntes', d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
      { t: 'Tecnología', d: 'M4 4h16v12H4zM2 20h20M9 20v-4M15 20v-4' },
      { t: 'Comida y snacks', d: 'M3 2v7c0 1.1.9 2 2 2h0V2M7 2v20M11 2v7a4 4 0 0 1-4 4M17 2c-1.7 0-3 2.7-3 6s.5 4 1.5 4V22' },
      { t: 'Tutorías', d: 'M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5' },
      { t: 'Programación', d: 'M16 18l6-6-6-6M8 6l-6 6 6 6' },
      { t: 'Diseño gráfico', d: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z' },
      { t: 'Idiomas', d: 'M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6' },
      { t: 'Intercambios', d: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3' }
    ];
    var svg = function (d) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        d.split('M').filter(Boolean).map(function (p) { return '<path d="M' + p + '"/>'; }).join('') + '</svg>';
    };
    var html = '';
    // duplicado para loop continuo
    for (var pass = 0; pass < 2; pass++) {
      items.forEach(function (it) {
        html += '<span class="chip">' + svg(it.d) + it.t + '</span>';
      });
    }
    marquee.innerHTML = html;
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Contadores animados ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- FAQ acordeón ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var ans = item.querySelector('.faq-a');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // cerrar los demás
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        if (o !== item) {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = null;
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        ans.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Parallax sutil del teléfono del hero ---------- */
  var heroPhone = document.querySelector('.hero-phone');
  if (heroPhone && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < 900) heroPhone.style.transform = 'translateY(' + (y * 0.04) + 'px)';
    }, { passive: true });
  }

})();
