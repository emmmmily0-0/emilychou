/* ============================================================================
   AI Smart Scheduling System case study — page behaviours.
   • Active module tracking on the left rail (scroll-spy)
   • Smooth anchor scroll for rail + mobile chip bar
   • Interactive "delete member → one-click handoff" edge-case demo
   ============================================================================ */
(function () {
  'use strict';
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* ---- Staggered "line-by-line" reveal on scroll ---------------------- */
    (function initLineReveal() {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var SEL = [
        '.cs-eyebrow', '.cs-title', '.cs-sub', '.cs-meta__item', '.cs-herofig',
        '.cs-module__num', '.cs-module__title', '.cs-module__intro', '.cs-summary',
        '.cs-h', '.cs-p', '.cs-pain', '.cs-callout', '.cs-figure',
        '.cs-scope__col', '.cs-func', '.cs-code', '.cs-demo',
        '.cs-compare__pane', '.cs-signal', '.cs-status', '.cs-next__item'
      ].join(',');
      var els = Array.prototype.slice.call(document.querySelectorAll('main ' + SEL.split(',').join(', main ')));
      // de-dupe while keeping document order
      els = els.filter(function (el, i) { return els.indexOf(el) === i; });
      if (!els.length) return;

      if (reduce || !('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('is-shown'); });
        return;
      }
      els.forEach(function (el) { el.classList.add('cs-anim'); });

      var io = new IntersectionObserver(function (entries) {
        // batch everything that crossed in this tick, cascade by document order
        var batch = entries.filter(function (e) { return e.isIntersecting; })
                           .map(function (e) { return e.target; })
                           .sort(function (a, b) {
                             return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
                           });
        batch.forEach(function (el, i) {
          var delay = Math.min(i, 6) * 90; // cap the cascade so long blocks don't lag
          setTimeout(function () { el.classList.add('is-shown'); }, delay);
          io.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      els.forEach(function (el) { io.observe(el); });

      // Failsafe: never leave content hidden if the observer/clock misbehaves.
      setTimeout(function () {
        els.forEach(function (el) { el.classList.add('is-shown'); });
      }, 2400);
    })();

    /* ---- Scroll-spy: highlight the module currently in view ------------- */
    var modules = Array.prototype.slice.call(document.querySelectorAll('.cs-module[id]'));
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-spy]'));
    if (modules.length && links.length) {
      function setActive(id) {
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('data-spy') === id);
        });
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
        // near the very bottom, force the last module active
        var sc = window.scrollY + window.innerHeight;
        if (sc >= document.body.scrollHeight - 4) current = modules[modules.length - 1].id;
        setActive(current);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();

      /* ---- Smooth anchor scroll (rail + mobile chips) ------------------- */
      links.forEach(function (l) {
        l.addEventListener('click', function (e) {
          var id = l.getAttribute('data-spy');
          var target = document.getElementById(id);
          if (!target) return;
          e.preventDefault();
          var top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
          // keep the active mobile chip in view
          if (l.classList.contains('cs-mchip') && l.parentElement) {
            var bar = l.parentElement;
            bar.scrollTo({ left: l.offsetLeft - 24, behavior: 'smooth' });
          }
        });
      });
    }

    /* ---- Edge-case demo: delete member → handoff popup ------------------ */
    var demo = document.getElementById('cs-demo');
    if (demo) {
      var del = demo.querySelector('.cs-member__del');
      var pop = demo.querySelector('.cs-pop');
      var closeBtn = demo.querySelector('.cs-pop__hd button');
      var cancelBtn = demo.querySelector('[data-demo="cancel"]');
      var confirmBtn = demo.querySelector('[data-demo="confirm"]');
      var select = demo.querySelector('.cs-pop__select');
      var csel = demo.querySelector('.cs-csel');
      var cselVal = demo.querySelector('.cs-csel__val');
      var cselList = demo.querySelector('.cs-csel__list');
      var toast = demo.querySelector('.cs-toast');
      var member = demo.querySelector('.cs-member');

      /* ---- Custom dropdown ------------------------------------------------ */
      if (csel && cselList) {
        csel.addEventListener('click', function () {
          var open = cselList.classList.toggle('is-open');
          csel.setAttribute('aria-expanded', String(open));
          if (pop) pop.classList.toggle('csel-open', open);
        });
        Array.prototype.slice.call(cselList.querySelectorAll('li')).forEach(function (li) {
          li.addEventListener('click', function () {
            var val = li.getAttribute('data-value');
            var lang = document.body.classList.contains('lang-zh') ? 'zh' : 'en';
            var text = li.getAttribute('data-' + lang) || li.textContent.trim();
            if (cselVal) {
              cselVal.textContent = text;
              cselVal.setAttribute('data-en', li.getAttribute('data-en') || '');
              cselVal.setAttribute('data-zh', li.getAttribute('data-zh') || '');
            }
            csel.classList.remove('is-placeholder');
            csel.style.borderColor = '';
            cselList.classList.remove('is-open');
            csel.setAttribute('aria-expanded', 'false');
            if (pop) pop.classList.remove('csel-open');
            if (select) {
              select.value = val;
              select.classList.remove('is-placeholder');
              select.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        });
        document.addEventListener('click', function (e) {
          if (csel && !csel.contains(e.target) && cselList && !cselList.contains(e.target)) {
            cselList.classList.remove('is-open');
            csel.setAttribute('aria-expanded', 'false');
            if (pop) pop.classList.remove('csel-open');
          }
        });
      }

      function openPop() {
        if (toast) toast.classList.remove('is-on');
        if (member) member.style.display = '';
        if (select) { select.value = ''; select.style.borderColor = ''; select.classList.add('is-placeholder'); }
        if (csel) { csel.classList.add('is-placeholder'); csel.style.borderColor = ''; }
        if (cselList) { cselList.classList.remove('is-open'); csel && csel.setAttribute('aria-expanded', 'false'); }
        if (cselVal) {
          var lang = document.body.classList.contains('lang-zh') ? 'zh' : 'en';
          cselVal.textContent = lang === 'zh' ? '點擊選擇' : 'Click to choose';
        }
        if (confirmBtn) confirmBtn.disabled = true;
        if (pop) pop.classList.add('is-open');
      }
      function closePop() { if (pop) pop.classList.remove('is-open'); }
      function confirmHandoff() {
        if (!select) return;
        if (!select.value) {
          if (csel) { csel.style.borderColor = 'var(--md-sys-color-error)'; csel.focus(); }
          return;
        }
        closePop();
        if (member) member.style.display = 'none';
        if (toast) {
          var who = select.options[select.selectedIndex].getAttribute('data-zh') || select.options[select.selectedIndex].textContent.trim();
          var en = toast.querySelector('[data-lang-en]');
          var zh = toast.querySelector('[data-lang-zh]');
          var whoEn = select.options[select.selectedIndex].getAttribute('data-en') || who;
          if (en) en.textContent = '1 task handed off to ' + whoEn + ' · member removed';
          if (zh) zh.textContent = '已將 1 項任務移交給 ' + who + '，並刪除成員';
          toast.classList.add('is-on');
        }
      }

      function updateSelectLang(lang) {
        var attr = lang === 'zh' ? 'data-zh' : 'data-en';
        if (select) {
          Array.prototype.slice.call(select.querySelectorAll('option')).forEach(function (opt) {
            var text = opt.getAttribute(attr); if (text) opt.textContent = text;
          });
        }
        if (cselList) {
          Array.prototype.slice.call(cselList.querySelectorAll('li')).forEach(function (li) {
            var text = li.getAttribute(attr); if (text) li.textContent = text;
          });
        }
        if (cselVal) {
          if (csel && csel.classList.contains('is-placeholder')) {
            cselVal.textContent = lang === 'zh' ? '點擊選擇' : 'Click to choose';
          } else {
            var text = cselVal.getAttribute(attr);
            if (text) cselVal.textContent = text;
          }
        }
      }

      if (del) del.addEventListener('click', openPop);
      if (closeBtn) closeBtn.addEventListener('click', closePop);
      if (cancelBtn) cancelBtn.addEventListener('click', closePop);
      if (confirmBtn) confirmBtn.addEventListener('click', confirmHandoff);
      if (select) select.addEventListener('change', function () {
        select.style.borderColor = '';
        select.classList.toggle('is-placeholder', !select.value);
        if (confirmBtn) confirmBtn.disabled = !select.value;
      });

      window.addEventListener('langchange', function (e) {
        updateSelectLang(e.detail.lang);
      });
      updateSelectLang(document.body.classList.contains('lang-zh') ? 'zh' : 'en');
    }

    /* ---- Image carousels ------------------------------------------------ */
    Array.prototype.slice.call(document.querySelectorAll('[data-carousel]')).forEach(function (car) {
      var slides = Array.prototype.slice.call(car.querySelectorAll('.cs-carousel__slide'));
      var dots   = Array.prototype.slice.call(car.querySelectorAll('.cs-carousel__dot'));
      var idx = 0;
      function goTo(n) {
        slides[idx].classList.remove('is-active');
        dots[idx].classList.remove('is-active');
        idx = (n + slides.length) % slides.length;
        slides[idx].classList.add('is-active');
        dots[idx].classList.add('is-active');
      }
      var prev = car.querySelector('.cs-carousel__btn--prev');
      var next = car.querySelector('.cs-carousel__btn--next');
      if (prev) prev.addEventListener('click', function () { goTo(idx - 1); });
      if (next) next.addEventListener('click', function () { goTo(idx + 1); });
      dots.forEach(function (dot, i) { dot.addEventListener('click', function () { goTo(i); }); });
    });
  });
})();
