---
layout: default
title: Blog
description: "Thoughts on AI, security, and engineering."
---

<section class="section fade-in">
  <p class="mono accent" style="margin:0 0 8px;font-size:0.85rem">> cat blog/*</p>
  <h1>Blog</h1>

  {% if site.posts.size > 0 %}
  <ul class="post-list">
    {% for post in site.posts %}
    <li class="post-item">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <div class="post-meta">{{ post.date | date: "%B %d, %Y" }}</div>
      {% if post.excerpt %}
      <div class="post-excerpt">{{ post.excerpt | strip_html | truncate: 160 }}</div>
      {% endif %}
    </li>
    {% endfor %}
  </ul>
  {% else %}
  <div class="card" style="margin-top:var(--space-3);text-align:center;padding:var(--space-5)">
    <p class="mono muted" style="margin:0">// No posts yet. Coming soon.</p>
  </div>
  {% endif %}
</section>
