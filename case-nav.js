/* ============================================================================
   Shared case-study behaviours for the dedicated project pages.
   • Staggered transform reveal for .cs-* blocks (opacity owned by focus-scroll)
   • Left module rail scroll-spy + smooth anchor scroll (rail + mobile chips)
   ============================================================================ */
(function () {
  'use strict';
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Staggered slide-in for content blocks ------------------------- */
    (function () {
      var SEL = [
        '.cs-eyebrow', '.cs-title', '.cs-sub', '.cs-meta__item', '.cs-herofig',
        '.cs-module__num', '.cs-module__title', '.cs-module__intro', '.cs-summary',
        '.cs-h', '.cs-p', '.cs-pain', '.cs-callout', '.cs-figure',
        '.cs-scope__col', '.cs-func', '.cs-code', '.cs-demo',
        '.cs-compare__pane', '.cs-signal', '.cs-status', '.cs-next__item'
      ].join(',');
      var els = Array.prototype.slice.call(document.querySelectorAll('main ' + SEL.split(',').join(', main ')));
      els = els.filter(function (el, i) { return els.indexOf(el) === i; });
      if (!els.length) return;

      if (reduce || !('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('is-shown'); });
        return;
      }
      els.forEach(function (el) { el.classList.add('cs-anim'); });

      var io = new IntersectionObserver(function (entries) {
        var batch = entries.filter(function (e) { return e.isIntersecting; })
                           .map(function (e) { return e.target; })
                           .sort(function (a, b) {
                             return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
                           });
        batch.forEach(function (el, i) {
          var delay = Math.min(i, 6) * 90;
          setTimeout(function () { el.classList.add('is-shown'); }, delay);
          io.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      els.forEach(function (el) { io.observe(el); });
      setTimeout(function () { els.forEach(function (el) { el.classList.add('is-shown'); }); }, 2400);
    })();

    /* ---- Scroll-spy + smooth anchor scroll ----------------------------- */
    var modules = Array.prototype.slice.call(document.querySelectorAll('.cs-module[id]'));
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-spy]'));
    if (!modules.length || !links.length) return;

    function setActive(id) {
      links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('data-spy') === id); });
      var bar = document.querySelector('.cs-rail__mobilebar');
      if (!bar) return;
      var active = bar.querySelector('.cs-mchip.is-active');
      if (!active) return;
      var target = active.offsetLeft - (bar.offsetWidth - active.offsetWidth) / 2;
      bar.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }
    function onScroll() {
      var probe = (window.innerHeight || document.documentElement.clientHeight) * 0.32;
      var current = modules[0].id;
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].getBoundingClientRect().top <= probe) current = modules[i].id;
      }
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 4) {
        current = modules[modules.length - 1].id;
      }
      setActive(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    links.forEach(function (l) {
      l.addEventListener('click', function (e) {
        var id = l.getAttribute('data-spy');
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
        if (l.classList.contains('cs-mchip') && l.parentElement) {
          l.parentElement.scrollTo({ left: l.offsetLeft - 24, behavior: 'smooth' });
        }
      });
    });
  });
})();
