/**
 * Bio-inspired Neural Graph Background
 * Canvas-based animated network of nodes with connecting edges.
 * Features: mouse-reactive nodes, glow effect near cursor.
 * Respects prefers-reduced-motion. Uses theme CSS variables for colours.
 */
;(function () {
  'use strict';

  var canvas = document.getElementById('graph-bg');
  if (!canvas || !canvas.getContext) return;

  // Respect reduced-motion
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;

  var ctx = canvas.getContext('2d');
  var nodes = [];
  var NODE_COUNT = 50;
  var MAX_DIST = 140;
  var MOUSE_RADIUS = 180;
  var animId = null;
  var mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function getColor(prop) {
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || 'rgba(0,255,198,0.8)';
  }

  function initNodes() {
    nodes = [];
    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.5 + Math.random() * 1.5
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var nodeColor = getColor('--graph-node');
    var edgeColor = getColor('--graph-edge');
    var glowColor = getColor('--graph-glow');

    // Update & draw nodes
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      // Mouse repulsion: gently push nodes away from cursor
      var mdx = n.x - mouse.x;
      var mdy = n.y - mouse.y;
      var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < MOUSE_RADIUS && mDist > 0) {
        var force = (1 - mDist / MOUSE_RADIUS) * 0.8;
        n.vx += (mdx / mDist) * force;
        n.vy += (mdy / mDist) * force;
      }

      // Dampen velocity
      n.vx *= 0.98;
      n.vy *= 0.98;

      // Minimum drift speed
      var speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (speed < 0.15) {
        n.vx += (Math.random() - 0.5) * 0.08;
        n.vy += (Math.random() - 0.5) * 0.08;
      }

      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      // Glow effect near mouse
      var glowSize = 0;
      if (mDist < MOUSE_RADIUS) {
        glowSize = (1 - mDist / MOUSE_RADIUS) * 8;
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glowSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      if (glowSize > 0) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.globalAlpha = 0.15;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Draw edges (O(n²) but n is small)
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 0.5;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          var alpha = 1 - (dist / MAX_DIST);

          // Brighter edges near mouse
          var midX = (nodes[i].x + nodes[j].x) * 0.5;
          var midY = (nodes[i].y + nodes[j].y) * 0.5;
          var midDist = Math.sqrt((midX - mouse.x) * (midX - mouse.x) + (midY - mouse.y) * (midY - mouse.y));
          var mouseBoost = midDist < MOUSE_RADIUS ? (1 - midDist / MOUSE_RADIUS) * 0.3 : 0;

          ctx.globalAlpha = alpha * 0.12 + mouseBoost;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    animId = requestAnimationFrame(draw);
  }

  // Mouse tracking (throttled via rAF)
  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Touch support
  document.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });
  document.addEventListener('touchend', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Init
  window.addEventListener('resize', function () {
    resize();
  });
  resize();
  initNodes();
  draw();

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  // Re-check reduce motion if user changes setting
  reduceMotion.addEventListener('change', function (e) {
    if (e.matches) {
      cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      initNodes();
      draw();
    }
  });
})();
