---
layout: default
title: Projects
description: "Selected projects — AI, security, and systems engineering."
---

<section class="section fade-in">
  <div class="row" style="justify-content:space-between;align-items:center;flex-wrap:wrap">
    <div>
      <p class="mono accent" style="margin:0 0 8px;font-size:0.85rem">> ls projects/</p>
      <h1 style="margin:0">Projects</h1>
    </div>
    <div id="project-filters" class="row" style="gap:6px;flex-wrap:wrap">
      <button class="btn ghost primary" data-filter="*">All</button>
    </div>
  </div>

  <div class="projects-grid stagger" id="projects-grid">
    {% for p in site.data.projects %}
    <article class="project-card card" data-tags="{{ p.tags | join: ' ' }}">
      <div class="project-thumb">
        <img src="{{ p.thumbnail }}" alt="{{ p.title }}" loading="lazy">
      </div>
      <div class="project-body">
        <h3><a href="{{ p.github }}" target="_blank" rel="noopener">{{ p.title }}</a></h3>
        <p>{{ p.excerpt }}</p>
        <div class="row" style="margin-top:8px;gap:6px;flex-wrap:wrap">
          {% for tag in p.tags %}
          <span class="badge">{{ tag }}</span>
          {% endfor %}
        </div>
      </div>
    </article>
    {% endfor %}
  </div>
</section>
