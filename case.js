/* Case study page — render a single project from window.PROJECTS by ?id=. */
(function () {
  'use strict';
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function lang() { return document.body.classList.contains('lang-zh') ? 'zh' : 'en'; }
  function L(obj) { return obj ? (obj[lang()] || obj.en) : ''; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Bilingual section labels
  var T = {
    role: { en: 'Role', zh: '角色' },
    timeline: { en: 'Timeline', zh: '周期' },
    team: { en: 'Team', zh: '團隊' },
    overview: { en: 'Overview', zh: '概述' },
    problem: { en: 'The problem', zh: '問題' },
    approach: { en: 'Approach', zh: '方法' },
    outcome: { en: 'Outcome', zh: '成果' },
    impact: { en: 'Impact', zh: '影響' },
    nextLabel: { en: 'Next project', zh: '下一個項目' }
  };

  // Stable project order for next-project nav
  var ORDER = ['atlas', 'loop', 'pulse', 'forge', 'nomi', 'spectra'];

  function getId() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('project') || '';
  }

  function render(id) {
    var root = document.getElementById('case-root');
    var p = window.PROJECTS && window.PROJECTS[id];
    var cta = document.getElementById('case-cta');
    var missing = document.getElementById('case-missing');

    if (!p) {
      root.style.display = 'none';
      missing.style.display = 'block';
      if (cta) cta.style.display = 'none';
      document.title = 'Case study — Emily Chou';
      return;
    }
    root.style.display = '';
    missing.style.display = 'none';
    if (cta) cta.style.display = '';

    document.title = L(p.title).replace(/\s+—.*$/, '') + ' — Emily Chou';

    var metrics = p.metrics.map(function (m) {
      return '<div class="case-metric"><b>' + esc(m.n) + '</b><span>' + esc(L(m.label)) + '</span></div>';
    }).join('');
    var tags = p.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');

    function section(key, text) {
      return '<div class="case-section"><h4>' + esc(L(T[key])) + '</h4><p>' + esc(L(text)) + '</p></div>';
    }

    // next project
    var idx = ORDER.indexOf(id);
    var nextId = ORDER[(idx + 1) % ORDER.length];
    var np = window.PROJECTS[nextId];
    var nextHTML = np ? (
      '<a class="case-next" href="case.html?id=' + nextId + '">' +
        '<div><div class="label">' + esc(L(T.nextLabel)) + '</div><div class="title">' + esc(L(np.title)) + '</div></div>' +
        '<span class="btn btn--tonal"><span class="material-symbols-outlined">arrow_forward</span></span>' +
      '</a>'
    ) : '';

    root.innerHTML =
      '<div class="case-head">' +
        '<div class="case-cat">' + esc(L(p.cat)) + '</div>' +
        '<h1 class="case-title">' + esc(L(p.title)) + '</h1>' +
        '<p class="case-lead">' + esc(L(p.overview)) + '</p>' +
      '</div>' +
      '<div class="case-banner" style="margin-top:36px"><span class="material-symbols-outlined">' + esc(p.icon) + '</span></div>' +
      '<div class="case-meta" style="margin-top:36px">' +
        '<div><span>' + esc(L(T.role)) + '</span><b>' + esc(L(p.role)) + '</b></div>' +
        '<div><span>' + esc(L(T.timeline)) + '</span><b>' + esc(L(p.timeline)) + '</b></div>' +
        '<div><span>' + esc(L(T.team)) + '</span><b>' + esc(L(p.team)) + '</b></div>' +
      '</div>' +
      section('problem', p.problem) +
      section('approach', p.approach) +
      section('outcome', p.outcome) +
      '<div class="case-section"><h4>' + esc(L(T.impact)) + '</h4><div class="case-metrics">' + metrics + '</div></div>' +
      '<div style="padding:36px 0 8px"><div class="case-tags">' + tags + '</div></div>' +
      '<div style="padding:8px 0 8px">' + nextHTML + '</div>';
  }

  ready(function () {
    var id = getId();
    render(id);
    // re-render on language switch so labels + prose follow the toggle
    window.addEventListener('langchange', function () { render(getId()); });
  });
})();
