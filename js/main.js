/* Portfólio | Victor Lima */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Ano do rodapé */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Menu fixo: desce quando o menu do início sai da tela ---------- */
  var topbar = document.getElementById('topbar');
  var heroNav = document.getElementById('heroNav');
  var toggle = document.getElementById('menuToggle');
  var topnav = document.getElementById('topnav');

  function setMenu(open) {
    topnav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  if ('IntersectionObserver' in window && heroNav) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      var passou = !e.isIntersecting && e.boundingClientRect.bottom < 0;
      topbar.classList.toggle('is-visible', passou);
      if (!passou) setMenu(false);
    }).observe(heroNav);
  } else {
    topbar.classList.add('is-visible');
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  topnav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- Destaca no menu a seção que está na tela ---------- */
  var links = Array.prototype.slice.call(topnav.querySelectorAll('a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + entry.target.id));
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Certificado: aparece ao rolar ---------- */
  var cert = document.querySelector('.cert');
  if (cert) {
    if ('IntersectionObserver' in window) {
      var certObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { cert.classList.add('in'); obs.disconnect(); }
        });
      }, { threshold: 0.3 });
      certObs.observe(cert);
    } else {
      cert.classList.add('in');
    }
  }

  /* ---------- Projetos: cartas empilhadas ----------
     O empilhamento em si é CSS (position: sticky). Aqui só adicionamos
     profundidade: quem fica para trás encolhe um pouco e escurece. */
  var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
  var ticking = false;

  /* Reflexo de cor acompanha o ponteiro em cada cartão. */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', (event.clientX - rect.left) + 'px');
        card.style.setProperty('--pointer-y', (event.clientY - rect.top) + 'px');
      });
      card.addEventListener('pointerleave', function () {
        card.style.removeProperty('--pointer-x');
        card.style.removeProperty('--pointer-y');
      });
    });
  }

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  function updateStack() {
    ticking = false;
    var vh = window.innerHeight;
    var progress = cards.map(function (card, i) {
      if (i === 0) return 0;
      var stuckTop = parseFloat(getComputedStyle(card).top) || 0;
      var dist = card.getBoundingClientRect().top - stuckTop;
      return clamp(1 - dist / (vh * 0.55), 0, 1);
    });
    cards.forEach(function (card, i) {
      var total = 0;
      for (var j = i + 1; j < cards.length; j++) total += progress[j];
      card.style.setProperty('--s', (1 - Math.min(total * 0.035, 0.1)).toFixed(4));
      card.style.setProperty('--dim', Math.min(total * 0.22, 0.6).toFixed(4));
    });
  }

  function requestUpdate() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateStack); }
  }

  if (cards.length && !reduceMotion) {
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    updateStack();
  }
})();
