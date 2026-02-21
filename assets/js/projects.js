/**
 * Project filter — tag-based filtering for the projects grid.
 * Reads data-tags from .project-card elements and renders
 * filter buttons from the available tags.
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var grid = document.getElementById('projects-grid');
  var filters = document.getElementById('project-filters');
  if (!grid || !filters) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.project-card'));
  var tagSet = {};

  items.forEach(function (item) {
    var tags = (item.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
    tags.forEach(function (t) { tagSet[t] = true; });
  });

  // Render filter buttons
  Object.keys(tagSet).sort().forEach(function (tag) {
    var btn = document.createElement('button');
    btn.className = 'btn ghost';
    btn.textContent = tag;
    btn.dataset.filter = tag;
    filters.appendChild(btn);
  });

  // Filter handler
  filters.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var filter = b.dataset.filter;

    // Toggle active state
    filters.querySelectorAll('button').forEach(function (x) {
      x.classList.remove('primary');
    });
    b.classList.add('primary');

    // Show/hide items
    items.forEach(function (item) {
      if (filter === '*' || (item.getAttribute('data-tags') || '').split(/\s+/).indexOf(filter) !== -1) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
