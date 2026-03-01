/**
 * Bio-inspired Neural Graph Background
 * Canvas-based animated network of nodes with connecting edges.
 *
 * Synced with NeuralGraph.tsx from tarological-system.
 * Features:
 *   - 50 floating nodes with proximity edges
 *   - Mouse repulsion + radial-gradient highlight
 *   - Wrap-around edges (no bounce)
 *   - Theme-reactive via CSS custom properties
 *   - Respects prefers-reduced-motion
 *   - Touch support (mobile)
 *   - Pauses when tab hidden
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
  var EDGE_THRESHOLD = 140;
  var MOUSE_RADIUS = 180;
  var MOUSE_REPULSION = 0.8;
  var BASE_SPEED = 0.3;
  var DAMPING = 0.99;
  var animId = null;
  var mouse = null; // null = no cursor on page

  // ── Theme colours ──
  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  function getColors() {
    if (isDark()) {
      return {
        node: 'rgba(0, 255, 198, 0.5)',
        edge: 'rgba(0, 255, 198, ',
        nodeFill: 'rgba(0, 255, 198, 0.15)',
        highlightInner: 'rgba(0,255,198,0.04)',
      };
    }
    return {
      node: 'rgba(0, 102, 255, 0.35)',
      edge: 'rgba(0, 102, 255, ',
      nodeFill: 'rgba(0, 102, 255, 0.08)',
      highlightInner: 'rgba(111,66,193,0.03)',
    };
  }

  // ── Lifecycle ──
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initNodes() {
    nodes = [];
    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * BASE_SPEED * 2,
        vy: (Math.random() - 0.5) * BASE_SPEED * 2,
        r: Math.random() * 2 + 1
      });
    }
  }

  // ── Draw loop ──
  function draw() {
    var w = canvas.width;
    var h = canvas.height;
    var colors = getColors();

    ctx.clearRect(0, 0, w, h);

    // Update positions
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      // Mouse repulsion
      if (mouse) {
        var mdx = n.x - mouse.x;
        var mdy = n.y - mouse.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_RADIUS && mDist > 0) {
          var force = (MOUSE_RADIUS - mDist) / MOUSE_RADIUS * MOUSE_REPULSION;
          n.vx += (mdx / mDist) * force;
          n.vy += (mdy / mDist) * force;
        }
      }

      // Damping
      n.vx *= DAMPING;
      n.vy *= DAMPING;

      // Ensure minimum drift speed
      var speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (speed < BASE_SPEED * 0.5) {
        var angle = Math.atan2(n.vy, n.vx);
        n.vx = Math.cos(angle) * BASE_SPEED * 0.5;
        n.vy = Math.sin(angle) * BASE_SPEED * 0.5;
      }

      n.x += n.vx;
      n.y += n.vy;

      // Wrap-around edges (seamless, no bounce)
      if (n.x < -10) n.x = w + 10;
      if (n.x > w + 10) n.x = -10;
      if (n.y < -10) n.y = h + 10;
      if (n.y > h + 10) n.y = -10;
    }

    // Draw edges (O(n²) but n=50 is fine)
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < EDGE_THRESHOLD) {
          var alpha = (1 - dist / EDGE_THRESHOLD) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = colors.edge + alpha.toFixed(3) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = colors.nodeFill;
      ctx.fill();
      ctx.strokeStyle = colors.node;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Mouse highlight — radial gradient (from tarological-system)
    if (mouse) {
      var gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, MOUSE_RADIUS * 0.5
      );
      gradient.addColorStop(0, colors.highlightInner);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  // ── Input handlers ──
  document.addEventListener('mousemove', function (e) {
    mouse = { x: e.clientX, y: e.clientY };
  });
  document.addEventListener('mouseleave', function () {
    mouse = null;
  });

  // Touch support
  document.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      mouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });
  document.addEventListener('touchend', function () {
    mouse = null;
  });

  // Init
  window.addEventListener('resize', resize);
  resize();
  initNodes();
  draw();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  // Re-check reduced motion
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
