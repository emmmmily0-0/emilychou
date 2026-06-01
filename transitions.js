/* ============================================================================
   Loading veil + page transitions + scroll parallax.
   Runs before portfolio.js. Self-contained.
   ============================================================================ */
(function () {
  'use strict';

  var veil = document.getElementById('page-veil');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Fun facts shown on the loading / transition veil ---------------- */
  var FACTS = [
    { n: 3,  en: "I don't drink coffee.", zh: "我不喝咖啡。" },
    { n: 11, en: "I've never dyed my hair, but I've always wanted to.", zh: "我從沒染過頭髮，但一直很想試試。" },
    { n: 17, en: "I'd been to Mongolia as a volunteer.", zh: "我曾經去外蒙古當志工。" },
    { n: 24, en: "I love online shopping, but I rarely actually order anything.", zh: "我愛逛網購，卻很少真的下單。" },
    { n: 31, en: "My favorite TV show so far is How I Met Your Mother.", zh: "我目前最愛的劇是《老爸老媽浪漫史》。" },
    { n: 8,  en: "I prefer reading books on paper.", zh: "比起電子書我更喜歡紙本。" },
    { n: 15,  en: "I dream nearly everyday.", zh: "我幾乎每天做夢。" },
    { n: 1,  en: "I'd studied Journalism for two years.", zh: "我唸過兩年新聞系。" },
    { n: 29,  en: "I wanna get a cat and hamster as pet.", zh: "我想養貓跟倉鼠。" },
    { n: 4,  en: "Working out brings me joy.", zh: "健身是我的快樂來源之一。" },
    { n: 19,  en: "I believe that aliens actually exist.", zh: "我相信外星人的存在。" },
    { n: 13,  en: "I'm a night owl.", zh: "我是夜貓子。" }
  ];
  function veilLang() {
    try { return localStorage.getItem('ec-lang') === 'zh' ? 'zh' : 'en'; } catch (e) { return 'en'; }
  }
  var lastFact = -1;
  function setFact() {
    var el = document.getElementById('veil-fact');
    if (!el) return;
    var i = Math.floor(Math.random() * FACTS.length);
    if (i === lastFact) i = (i + 1) % FACTS.length;   // avoid immediate repeat
    lastFact = i;
    var lang = veilLang();
    var num = document.getElementById('veil-factnum');
    if (num) {
      num.textContent = lang === 'zh'
        ? ("芳伃的冷知識 #" + FACTS[i].n)
        : ("Emily's Fun Fact #" + FACTS[i].n);
    }
    el.textContent = FACTS[i][lang] || FACTS[i].en;
  }
  setFact();   // first fact (instant — never depends on an animation clock)

  /* ---- Reveal the page (lift the loading veil) ------------------------- */
  var MIN_SHOW = 1100;   // keep the fun fact visible long enough to read
  var started = Date.now();
  function hideFully() { if (veil) veil.classList.add('is-gone'); }
  function openVeil() {
    if (!veil) return;
    var wait = Math.max(0, MIN_SHOW - (Date.now() - started));
    setTimeout(function () {
      veil.classList.add('is-open');
      // Guarantee the veil stops covering even if the transition clock is
      // frozen (some preview/iframe environments never advance transitions).
      var done = false;
      var fin = function () { if (!done) { done = true; hideFully(); } };
      veil.addEventListener('transitionend', fin, { once: true });
      setTimeout(fin, 800);   // > transition duration
    }, wait);
  }
  if (document.readyState === 'complete') openVeil();
  else window.addEventListener('load', openVeil);
  // hard fallback so content is never trapped behind the veil
  setTimeout(function () { if (veil) { veil.classList.add('is-open'); hideFully(); } }, 2600);

  /* ---- Page-transition wipe on internal navigation -------------------- */
  function isInternal(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return false; }
    if (url.origin !== location.origin) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    // pure in-page hash (same path, only fragment) → let it smooth-scroll
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;
    if (url.href === location.href) return false;
    return true;
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href]');
    if (!a || !isInternal(a)) return;
    e.preventDefault();
    var dest = a.href;
    if (reduce || !veil) { location.href = dest; return; }
    document.body.classList.add('is-leaving');
    setFact();                            // fresh fun fact for the transition
    veil.classList.remove('is-gone');     // make it paintable again
    veil.classList.remove('is-open');     // bring it back down to cover
    var go = function () { location.href = dest; };
    var done = false;
    var fire = function () { if (!done) { done = true; go(); } };
    veil.addEventListener('transitionend', fire, { once: true });
    setTimeout(fire, 1150);                // hold the fact briefly, then navigate
  });

  /* ---- Back/forward (bfcache) restore --------------------------------- */
  window.addEventListener('pageshow', function (ev) {
    if (ev.persisted) {
      document.body.classList.remove('is-leaving');
      if (veil) { veil.classList.add('is-open'); veil.classList.add('is-gone'); }
    }
  });

  /* ---- Scroll-linked parallax for the hero glow ----------------------- */
  function initScrollParallax() {
    var glow = document.getElementById('hero-glow');
    if (!glow || reduce) return;
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset || 0;
      glow.style.setProperty('--gsy', (y * 0.18).toFixed(1) + 'px');
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
  if (document.readyState !== 'loading') initScrollParallax();
  else document.addEventListener('DOMContentLoaded', initScrollParallax);
})();
