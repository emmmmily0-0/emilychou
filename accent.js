/* Accent re-seed — overrides the primary role with a curated future-tech set,
   tuned for the clean light "Aether" surfaces. */
(function () {
  var ACCENTS = {
    '#0A63F2': { onP: '#FFFFFF', pc: '#D8E4FF', opc: '#001A43' }, // electric blue (default)
    '#008BAA': { onP: '#FFFFFF', pc: '#AEECFB', opc: '#001F28' }, // cyan
    '#6A3DE8': { onP: '#FFFFFF', pc: '#E7DEFF', opc: '#21005D' }  // violet
  };
  window.applyAccent = function (hex) {
    var a = ACCENTS[hex] || ACCENTS['#0A63F2'];
    var r = document.documentElement.style;
    r.setProperty('--md-sys-color-primary', hex);
    r.setProperty('--md-sys-color-on-primary', a.onP);
    r.setProperty('--md-sys-color-primary-container', a.pc);
    r.setProperty('--md-sys-color-on-primary-container', a.opc);
    r.setProperty('--md-sys-color-surface-tint', hex);
  };
})();
