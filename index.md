---
layout: default
title: Home
description: "AI Engineer · Security Mindset · Systems Thinking — Building intelligent, secure, and scalable systems."
---

<section class="hero">
  <div class="hero-inner">
    <div class="hero-copy fade-in">
      <p class="mono accent" style="margin:0 0 8px;font-size:0.85rem">> hello_world</p>
      <h1>Building <span class="accent">Intelligent</span> Systems</h1>
      <p class="lead">AI Engineer &amp; Security Researcher. I design systems that think, defend, and scale — with a security-first mindset and a passion for what's next.</p>
      <div class="row" style="margin-top:var(--space-3);gap:12px;flex-wrap:wrap">
        <a class="btn primary" href="{{ '/projects/' | relative_url }}">View Projects</a>
        <a class="btn ghost" href="{{ '/about/' | relative_url }}">About Me</a>
        <a class="btn ghost" href="{{ '/blog/' | relative_url }}">Read Blog</a>
      </div>
    </div>
    <div class="photo-frame fade-in" style="animation-delay:200ms">
      <img src="{{ '/assets/images/profile.jpg' | relative_url }}" alt="Profile photo" loading="eager" width="200" height="200" fetchpriority="high">
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">Core Focus Areas</h2>
    <div class="features-grid stagger">
      <div class="feature-card">
        <h3><span class="accent">◈</span> AI Engineering</h3>
        <p class="muted">Designing and deploying ML pipelines, orchestration layers, and intelligent automation systems.</p>
      </div>
      <div class="feature-card">
        <h3><span class="accent">◈</span> Security Architecture</h3>
        <p class="muted">Threat modeling, static analysis, and building systems that are secure by design.</p>
      </div>
      <div class="feature-card">
        <h3><span class="accent">◈</span> Systems Thinking</h3>
        <p class="muted">Scalable architectures, performance optimization, and infrastructure that grows with the mission.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap">
      <h2 class="section-title" style="margin:0">Featured Projects</h2>
      <a class="btn ghost" href="{{ '/projects/' | relative_url }}" style="font-size:0.85rem">View all →</a>
    </div>
    <div class="projects-grid stagger" style="margin-top:var(--space-3)">
      {% for p in site.data.projects limit:3 %}
      <article class="project-card card">
        <div class="project-thumb">
          <img src="{{ p.thumbnail }}" alt="{{ p.title }}" loading="lazy">
        </div>
        <div class="project-body">
          <h3><a href="{{ p.github }}" target="_blank" rel="noopener">{{ p.title }}</a></h3>
          <p>{{ p.excerpt }}</p>
          <div class="row" style="margin-top:8px;gap:6px;flex-wrap:wrap">
            {% for tag in p.tags %}<span class="badge">{{ tag }}</span>{% endfor %}
          </div>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
</section>
