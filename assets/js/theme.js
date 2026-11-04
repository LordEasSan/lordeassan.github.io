/**
 * Theme manager + mobile navigation.
 * Dark-first: with no saved choice the site stays dark (the inline script in
 * head.html applies it before first paint). The toggle stores the choice.
 * localStorage is guarded because it can throw in some privacy modes.
 */
;(function () {
  'use strict';
  var root = document.documentElement;
  var STORAGE_KEY = 'theme';
  var ICON_DARK = '☽';   // ☽
  var ICON_LIGHT = '☀';  // ☀

  function read() { try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {} }

  function apply(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) write(theme);
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.textContent = theme === 'dark' ? ICON_LIGHT : ICON_DARK;
      btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    }
  }

  var stored = read();
  apply(stored === 'light' ? 'light' : 'dark', false);

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-theme-toggle]')) return;
    apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  // Mobile navigation: toggle, close on Escape, close after choosing a link.
  var navBtn = document.querySelector('.nav-toggle');
  var navList = document.getElementById('nav-list');
  if (!navBtn || !navList) return;

  function setOpen(open) {
    navBtn.setAttribute('aria-expanded', String(open));
    navList.classList.toggle('open', open);
  }
  navBtn.addEventListener('click', function () {
    setOpen(navBtn.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navBtn.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      navBtn.focus();
    }
  });
  navList.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
})();
