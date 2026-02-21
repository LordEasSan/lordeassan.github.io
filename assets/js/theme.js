/**
 * Theme Manager — dark-first with localStorage persistence.
 * Default is dark. Toggle via [data-theme-toggle] button.
 */
;(function () {
  'use strict';
  var root = document.documentElement;
  var STORAGE_KEY = 'theme';
  var ICON_DARK = '\u263D';   // ☽
  var ICON_LIGHT = '\u2600';  // ☀

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    // Update toggle button icon
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.textContent = theme === 'dark' ? ICON_LIGHT : ICON_DARK;
      btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    }
  }

  // Determine initial theme: stored > system > dark (default)
  var stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    apply(stored);
  } else {
    // Dark-first: if no preference stored, always dark
    apply('dark');
  }

  // Toggle handler — delegated
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-theme-toggle]');
    if (!t) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
  });

  // Nav toggle for mobile
  var navBtn = document.querySelector('.nav-toggle');
  var navList = document.getElementById('nav-list');
  if (navBtn && navList) {
    navBtn.addEventListener('click', function () {
      var expanded = navBtn.getAttribute('aria-expanded') === 'true';
      navBtn.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });
  }
})();
