/* Site-wide motion: scroll reveals, scroll progress, header state, lazy image fade.
   Skipped entirely for reduced motion; content is never hidden without this script. */
(function () {
  'use strict';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;

  // Header shadow and the thin progress line under it.
  var header = document.querySelector('.main-header');
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var max = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  if (!('IntersectionObserver' in window)) return;
  root.classList.add('motion');

  // Lazy images fade in once loaded.
  document.querySelectorAll('img[loading=lazy]').forEach(function (img) {
    function done() { img.classList.add('is-loaded'); }
    if (img.complete) done();
    else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
  });

  // Reveal targets. Outer matches win over anything nested inside them.
  var selector = [
    '.section-intro > *', '.split > *:not(.photo-frame) > *', '.split > .photo-frame',
    '.grid-2 > div > *', '.grid-2 > aside > *', '.prose > *', '.content-layout > aside',
    '.section > .container > .eyebrow', '.section > .container > h2', '.section > .container > p',
    '.card', '.coverage-group', '.faq-item', '.photo-strip > a', '.gallery-item', '.finish-card',
    '.finish-pigment', '.form-panel', '.trust-grid > div', '.section-action', '.text-center',
    '.photo-frame', '.footer-grid > div', '.quote-promo .split > *'
  ].join(',');
  var excluded = '.hero, .page-hero, .main-header, .lightbox, dialog, .calculator-flow';
  var all = [].slice.call(document.querySelectorAll(selector)).filter(function (el) {
    return !el.closest(excluded);
  });
  var set = new Set(all);
  var targets = all.filter(function (el) {
    for (var p = el.parentElement; p; p = p.parentElement) if (set.has(p)) return false;
    return true;
  });

  function finish(el) { el.classList.add('is-in', 'is-done'); el.style.removeProperty('--rd'); }

  var io = new IntersectionObserver(function (entries) {
    var batch = 0;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      io.unobserve(el);
      var delay = Math.min(batch++, 6) * 80;
      el.style.setProperty('--rd', delay + 'ms');
      el.classList.add('is-in');
      setTimeout(function () { finish(el); }, delay + 1200);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  var fold = window.innerHeight * 0.92;
  targets.forEach(function (el) {
    el.setAttribute('data-reveal', '');
    // Anything already on screen (or scrolled past) stays put so nothing flashes.
    // Hidden items (gallery "load more", color filters) measure 0x0 and wait to be shown.
    var r = el.getBoundingClientRect();
    if (r.height > 0 && r.top < fold) finish(el);
    else io.observe(el);
  });
})();
