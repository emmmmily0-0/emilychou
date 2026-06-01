/* Work page — category filter + navigate to per-project case study pages. */
(function () {
  'use strict';
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function lang() { return document.body.classList.contains('lang-zh') ? 'zh' : 'en'; }

  ready(function () {
    /* ---- Filter ---- */
    var chips = Array.prototype.slice.call(document.querySelectorAll('.work-toolbar .chip'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('#work-grid .work-card'));
    var countEl = document.querySelector('.work-toolbar .count');
    var emptyEl = document.getElementById('work-empty');

    function updateCount(n) {
      if (!countEl) return;
      countEl.textContent = (lang() === 'zh') ? (n + ' 個項目') : (n + (n === 1 ? ' project' : ' projects'));
    }

    function applyFilter(f) {
      var shown = 0;
      cards.forEach(function (card) {
        var cats = (card.dataset.cat || '').split(' ');
        var match = (f === 'all') || cats.indexOf(f) !== -1;
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      updateCount(shown);
      if (emptyEl) emptyEl.style.display = shown ? 'none' : 'block';
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-on'); });
        chip.classList.add('is-on');
        applyFilter(chip.dataset.filter);
      });
    });
    applyFilter('all');
    window.addEventListener('langchange', function () {
      var active = document.querySelector('.work-toolbar .chip.is-on');
      applyFilter(active ? active.dataset.filter : 'all');
    });

    /* ---- Navigate to the dedicated case study page ---- */
    function go(card) {
      var href = card.dataset.href;
      if (href) { window.location.href = href; return; }
      var id = card.dataset.project;
      if (id) window.location.href = 'case.html?id=' + encodeURIComponent(id);
    }
    cards.forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function () { go(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(card); }
      });
    });
  });
})();
