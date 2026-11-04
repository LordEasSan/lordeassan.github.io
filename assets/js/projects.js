/**
 * Project filter — shows/hides project groups by category.
 * Buttons are server-rendered (progressive enhancement: without JS every
 * group is visible). State is exposed with aria-pressed.
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var filters = document.getElementById('project-filters');
  if (!filters) return;
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));

  filters.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-filter]');
    if (!b) return;
    var f = b.getAttribute('data-filter');

    filters.querySelectorAll('button[data-filter]').forEach(function (x) {
      x.setAttribute('aria-pressed', String(x === b));
    });
    groups.forEach(function (g) {
      g.hidden = !(f === '*' || g.getAttribute('data-group') === f);
    });
  });
});
