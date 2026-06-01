/* ============================================================================
   Emily Chou — Portfolio. Shared interactions.
   Scroll progress · sticky nav · mobile menu · scroll-reveal · counters ·
   ripple · EN/中 language toggle.
   ============================================================================ */
(function () {
  'use strict';

  /* ---- Language (EN / 中文) --------------------------------------------- */
  var LANG_KEY = 'ec-lang';
  function applyLang(lang) {
    // Anchor the viewport to the element closest to the top of the visible area
    // so that layout shifts from text-height differences don't scroll the page.
    var anchorEl = null, anchorTop = 0;
    var candidates = document.querySelectorAll(
      'main section[id], main [id], main .cs-module, main .reveal, main h2, main h3'
    );
    Array.prototype.forEach.call(candidates, function (el) {
      var t = el.getBoundingClientRect().top;
      if (anchorEl === null && t >= -1) { anchorEl = el; anchorTop = t; }
    });
    if (!anchorEl) anchorTop = window.scrollY;

    document.body.classList.toggle('lang-zh', lang === 'zh');
    document.documentElement.lang = lang === 'zh' ? 'zh' : 'en';
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    // refresh dynamic strings that depend on language (e.g. work count)
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));

    // Restore viewport after the browser has recalculated layout (two rAF
    // passes ensure reflow is complete before we correct the scroll offset).
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (anchorEl) {
          var delta = anchorEl.getBoundingClientRect().top - anchorTop;
          if (delta !== 0) window.scrollBy(0, delta);
        } else {
          window.scrollTo(0, anchorTop);
        }
      });
    });
  }
  function initLang() {
    var saved = 'en';
    try { saved = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) {}
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.dataset.lang); });
    });
    applyLang(saved);
  }

  /* ---- Scroll progress bar --------------------------------------------- */
  function initProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
      bar.style.width = pct.toFixed(2) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---- Sticky nav scrolled state + mobile menu ------------------------- */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    var btn = nav.querySelector('.nav__menu-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        var open = nav.classList.toggle('menu-open');
        btn.querySelector('.material-symbols-outlined').textContent = open ? 'close' : 'menu';
      });
      nav.querySelectorAll('.nav__link').forEach(function (l) {
        l.addEventListener('click', function () {
          nav.classList.remove('menu-open');
          var i = btn.querySelector('.material-symbols-outlined'); if (i) i.textContent = 'menu';
        });
      });
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('menu-open') && !nav.contains(e.target)) {
          nav.classList.remove('menu-open');
          var i = btn.querySelector('.material-symbols-outlined'); if (i) i.textContent = 'menu';
        }
      });
    }
  }

  /* ---- Word-by-word text reveal on scroll ------------------------------ */
  function initTextReveal() {
    var blocks = Array.prototype.slice.call(document.querySelectorAll('[data-text-reveal]'));
    if (!blocks.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Split a single text node into word/character spans (CJK splits per char).
    function splitNode(node) {
      var text = node.nodeValue;
      if (!text || !text.trim()) return;
      var tokens = text.match(/\s+|[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]|[^\s\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]+/g);
      if (!tokens) return;
      var frag = document.createDocumentFragment();
      tokens.forEach(function (tok) {
        if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
        var s = document.createElement('span');
        s.className = 'tr-word';
        s.textContent = tok;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    }
    // Recurse into language spans / inline tags, but never into rotating or typed bits.
    function walk(el) {
      var kids = Array.prototype.slice.call(el.childNodes);
      kids.forEach(function (n) {
        if (n.nodeType === 3) splitNode(n);
        else if (n.nodeType === 1 && !n.classList.contains('rotate') && !n.classList.contains('type')) walk(n);
      });
    }

    blocks.forEach(function (b) { walk(b); });
    if (reduce) { blocks.forEach(function (b) { b.classList.add('is-revealed'); }); return; }

    // Index words per block so the stagger restarts each block.
    blocks.forEach(function (b) {
      var ws = b.querySelectorAll('.tr-word');
      for (var i = 0; i < ws.length; i++) ws[i].style.setProperty('--tr-i', i);
    });

    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].getBoundingClientRect().top < vh * 0.88) {
          blocks[i].classList.add('is-revealed');
          blocks.splice(i, 1);
        }
      }
    }
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    window.addEventListener('load', check);
    setTimeout(function () { blocks.slice().forEach(function (b) { b.classList.add('is-revealed'); }); }, 1600);
  }

  /* ---- Focus-scroll: content brightens in the center band -------------- */
  /* Opacity is driven by each element's distance from the viewport centre.
     Centre band (30%–70% of the viewport) = full opacity; it falls off to a
     0.2 floor at the very top and bottom edges. Entrance animations only move
     elements (translate), so opacity is exclusively owned here — no conflict. */
  function initFocusScroll() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var els = Array.prototype.slice.call(
      document.querySelectorAll('main .reveal, main [data-text-reveal], main .cs-anim')
    );
    // drop nested duplicates: if an ancestor is also tracked, skip the child
    // (group opacity on the ancestor already dims the subtree)
    els = els.filter(function (el) {
      for (var i = 0; i < els.length; i++) {
        if (els[i] !== el && els[i].contains(el)) return false;
      }
      return true;
    });
    if (!els.length) return;

    var FLOOR = 0.2, BAND_LO = 0.3, BAND_HI = 0.7;
    var ticking = false;

    function opacityFor(c) {                 // c = element centre as fraction of viewport height
      if (c >= BAND_LO && c <= BAND_HI) return 1;
      if (c < BAND_LO) return c <= 0 ? FLOOR : FLOOR + (1 - FLOOR) * (c / BAND_LO);
      return c >= 1 ? FLOOR : FLOOR + (1 - FLOOR) * ((1 - c) / (1 - BAND_HI));
    }
    function compute() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < els.length; i++) {
        var r = els[i].getBoundingClientRect();
        if (r.height === 0) continue;
        var c = (r.top + r.height / 2) / vh;
        els[i].style.opacity = opacityFor(c).toFixed(3);
      }
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(compute); } }

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', compute);
  }

  /* ---- Typewriter reveal: body text types out (no caret) when it scrolls
         into the 30%–70% viewport band -------------------------------------- */
  function initTypewriter() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var SEL = '.section-lead, .feature p, .work-card__desc, .cs-summary, .cs-module__intro';
    var els = Array.prototype.slice.call(document.querySelectorAll('main ' + SEL.split(',').join(', main ')));
    els = els.filter(function (el, i) { return els.indexOf(el) === i; });
    if (!els.length) return;

    function isVisible(t) { return t.offsetParent !== null && getComputedStyle(t).display !== 'none'; }

    els.forEach(function (el) {
      var spans = el.querySelectorAll('[data-lang-en],[data-lang-zh]');
      var targets = spans.length ? Array.prototype.slice.call(spans) : [el];
      // reserve current height so clearing text doesn't shift the layout
      el.style.minHeight = el.offsetHeight + 'px';
      targets.forEach(function (t) {
        if (t.getAttribute('data-tw-full') == null) t.setAttribute('data-tw-full', t.textContent);
        t.textContent = '';
      });
      el._twTargets = targets;
      el._twDone = false;
    });
    // re-measure once fonts/layout settle so reserved height isn't short
    window.addEventListener('load', function () {
      els.forEach(function (el) {
        var prev = parseFloat(el.style.minHeight) || 0;
        el.style.minHeight = '';
        var nat = el.scrollHeight;
        el.style.minHeight = Math.max(prev, nat) + 'px';
      });
    });

    function typeTarget(t) {
      var full = t.getAttribute('data-tw-full') || '';
      var len = full.length;
      if (t._twTimer) { clearInterval(t._twTimer); t._twTimer = null; }
      if (!len) { t.textContent = ''; return; }
      var total = Math.min(1100, Math.max(300, len * 22));
      var iv = Math.max(8, Math.round(total / len));
      var i = 0;
      t.textContent = '';
      t._twTimer = setInterval(function () {
        i++;
        t.textContent = full.slice(0, i);
        if (i >= len) { clearInterval(t._twTimer); t._twTimer = null; }
      }, iv);
    }
    function fill(el) {
      el._twTargets.forEach(function (t) {
        if (t._twTimer) { clearInterval(t._twTimer); t._twTimer = null; }
        t.textContent = t.getAttribute('data-tw-full') || '';
      });
    }
    function typeEl(el) {
      el._twTargets.forEach(function (t) {
        if (isVisible(t)) typeTarget(t);
        else t.textContent = t.getAttribute('data-tw-full') || '';
      });
    }

    var ticking = false;
    function compute() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      els.forEach(function (el) {
        if (el._twDone) return;
        var r = el.getBoundingClientRect();
        if (r.height === 0) return;
        var c = (r.top + r.height / 2) / vh;
        if (c >= 0.3 && c <= 0.7) { el._twDone = true; typeEl(el); }
        else if (c < 0.3) { el._twDone = true; fill(el); }   // scrolled past above — just show it
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(compute); } }
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', compute);

    // Language switch: typed elements show the now-visible language in full;
    // untyped ones reset to empty until they reach the band.
    window.addEventListener('langchange', function () {
      els.forEach(function (el) {
        if (el._twDone) fill(el);
        else el._twTargets.forEach(function (t) { if (isVisible(t)) t.textContent = ''; });
      });
    });
  }

  /* ---- Scroll reveal (rect-based — reliable inside iframes) ------------- */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!els.length) return;
    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = els.length - 1; i >= 0; i--) {
        if (els[i].getBoundingClientRect().top < vh * 0.9) {
          els[i].classList.add('is-in');
          els.splice(i, 1);
        }
      }
    }
    check();
    requestAnimationFrame(check);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    window.addEventListener('load', check);
    // Failsafe: if anything is still hidden shortly after load (frozen
    // animation clock, observer that never fired), reveal it all.
    setTimeout(function () {
      els.slice().forEach(function (el) { el.classList.add('is-in'); });
    }, 1200);
  }

  /* ---- Animated counters ----------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = (el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var dur = 1500, start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      el.innerHTML = prefix + val + (suffix ? '<span class="suffix">' + suffix + '</span>' : '');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function initCounters() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    if (!els.length) return;
    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = els.length - 1; i >= 0; i--) {
        if (els[i].getBoundingClientRect().top < vh * 0.85) {
          animateCount(els[i]);
          els.splice(i, 1);
        }
      }
    }
    check();
    requestAnimationFrame(check);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    window.addEventListener('load', check);
  }

  /* ---- Ripple ----------------------------------------------------------- */
  function initRipple() {
    document.addEventListener('pointerdown', function (e) {
      var host = e.target.closest('.btn, .js-ripple');
      if (!host) return;
      var rect = host.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 2;
      var span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size / 2) + 'px';
      span.style.top = (e.clientY - rect.top - size / 2) + 'px';
      host.appendChild(span);
      span.addEventListener('animationend', function () { span.remove(); });
    });
  }

  /* ---- Year ------------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---- Animated typed wordmark (footer) — cycles through names --------- */
  function initTypeword() {
    var el = document.querySelector('.footer__wordmark .type');
    if (!el) return;
    var words;
    try { words = JSON.parse(el.getAttribute('data-type-list')); } catch (e) { words = null; }
    if (!words || !words.length) {
      words = [el.getAttribute('data-type-text') || el.textContent || 'Emmmmily'];
    }
    var idx = 0, i = 0, dir = 1;
    el.textContent = '';
    function tick() {
      var full = words[idx];
      el.textContent = full.slice(0, i);
      if (dir > 0) {
        i++;
        if (i > full.length) {            // fully typed → hold, then delete
          dir = -1; i = full.length; setTimeout(tick, 2200); return;
        }
        setTimeout(tick, 150);
      } else {
        i--;
        if (i < 0) {                       // fully deleted → next name
          dir = 1; i = 0; idx = (idx + 1) % words.length; setTimeout(tick, 600); return;
        }
        setTimeout(tick, 70);
      }
    }
    setTimeout(tick, 600);
  }

  /* ---- Rotating fill-in words (hero headline) -------------------------- */
  function initRotate() {
    var els = document.querySelectorAll('.rotate');
    if (!els.length) return;
    els.forEach(function (el) {
      var items;
      try { items = JSON.parse(el.getAttribute('data-rotate')); } catch (e) { items = null; }
      if (!items || !items.length) return;
      var idx = 0, ch = 0, dir = 1;
      el.textContent = '';
      function tick() {
        var word = items[idx];
        el.textContent = word.slice(0, ch);
        if (dir > 0) {
          ch++;
          if (ch > word.length) { dir = -1; ch = word.length; setTimeout(tick, 1700); return; }
          setTimeout(tick, 85);
        } else {
          ch--;
          if (ch < 0) { dir = 1; ch = 0; idx = (idx + 1) % items.length; setTimeout(tick, 380); return; }
          setTimeout(tick, 42);
        }
      }
      setTimeout(tick, 500);
    });
  }

  /* ---- Hero glow: cursor parallax -------------------------------------- */
  function initGlow() {
    var glow = document.getElementById('hero-glow');
    if (!glow) return;
    var hero = glow.closest('.hero') || glow.parentElement;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    var REACH = 70; // px the glow field shifts at the edges
    function apply() {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      glow.style.setProperty('--gx', (cx * REACH).toFixed(1) + 'px');
      glow.style.setProperty('--gy', (cy * REACH).toFixed(1) + 'px');
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
        raf = requestAnimationFrame(apply);
      } else { raf = null; }
    }
    function onMove(e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    }
    function onLeave() { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); }
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
  }

  /* ---- Interactive hero blobs: hover-skew, drag, click-pulse ----------- */
  function initBlobs() {
    var blobs = Array.prototype.slice.call(document.querySelectorAll('.hero__glow .blob'));
    if (!blobs.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    blobs.forEach(function (blob) {
      var dx = 0, dy = 0;             // persisted drag offset
      var dragging = false, moved = false;
      var sx = 0, sy = 0;             // pointer start
      var ox = 0, oy = 0;             // offset at drag start

      function setVar(k, v) { blob.style.setProperty(k, v); }

      // Hover: skew + swell toward the cursor (skip while dragging)
      blob.addEventListener('pointermove', function (e) {
        if (dragging || reduce) return;
        var r = blob.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
        var ny = (e.clientY - r.top) / r.height - 0.5;
        setVar('--skx', (-ny * 14).toFixed(1) + 'deg');
        setVar('--sky', (nx * 14).toFixed(1) + 'deg');
        setVar('--s', '1.14');
      });
      blob.addEventListener('pointerleave', function () {
        if (dragging) return;
        setVar('--skx', '0deg'); setVar('--sky', '0deg'); setVar('--s', '1');
      });

      // Drag: move the blob, keep it where dropped
      blob.addEventListener('pointerdown', function (e) {
        dragging = true; moved = false;
        sx = e.clientX; sy = e.clientY; ox = dx; oy = dy;
        blob.classList.add('is-dragging');
        setVar('--skx', '0deg'); setVar('--sky', '0deg'); setVar('--s', '0.96');
        try { blob.setPointerCapture(e.pointerId); } catch (err) {}
      });
      blob.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        dx = ox + (e.clientX - sx);
        dy = oy + (e.clientY - sy);
        if (Math.abs(e.clientX - sx) > 3 || Math.abs(e.clientY - sy) > 3) moved = true;
        setVar('--dx', dx.toFixed(1) + 'px');
        setVar('--dy', dy.toFixed(1) + 'px');
      });
      function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        blob.classList.remove('is-dragging');
        setVar('--s', '1');
        try { blob.releasePointerCapture(e.pointerId); } catch (err) {}
        if (!moved) {                 // a tap/click → pulse
          blob.classList.add('is-pulsing');
          setTimeout(function () { blob.classList.remove('is-pulsing'); }, 560);
        }
      }
      blob.addEventListener('pointerup', endDrag);
      blob.addEventListener('pointercancel', endDrag);
    });
  }

  /* ---- Reactive pointer interactions: tilt, spotlight, magnetic -------- */
  function initReactive() {
    var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    // Tilt + spotlight on cards
    var tiltEls = document.querySelectorAll('.work-card, .feature');
    Array.prototype.forEach.call(tiltEls, function (el) {
      var MAX = el.classList.contains('feature') ? 5 : 6; // degrees
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;   // 0..1
        var py = (e.clientY - r.top) / r.height;   // 0..1
        el.style.setProperty('--ry', ((px - 0.5) * 2 * MAX).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - py) * 2 * MAX).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        el.style.transition = 'transform .09s linear, box-shadow .3s var(--md-sys-motion-easing-standard)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.style.transition = ''; // ease back via stylesheet default
      });
    });

    // Magnetic buttons
    var mags = document.querySelectorAll('.btn--filled, .btn--outlined, .btn--tonal');
    Array.prototype.forEach.call(mags, function (btn) {
      var PULL = 0.32, MAXP = 9;
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * PULL;
        var dy = (e.clientY - (r.top + r.height / 2)) * PULL;
        dx = Math.max(-MAXP, Math.min(MAXP, dx));
        dy = Math.max(-MAXP, Math.min(MAXP, dy));
        btn.style.setProperty('--bx', dx.toFixed(1) + 'px');
        btn.style.setProperty('--by', dy.toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.setProperty('--bx', '0px');
        btn.style.setProperty('--by', '0px');
      });
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    initLang(); initProgress(); initNav(); initReveal(); initTextReveal(); initTypewriter();
    initCounters(); initRipple(); initYear(); initTypeword(); initRotate(); initGlow(); initBlobs();
    initReactive();
  });
})();
