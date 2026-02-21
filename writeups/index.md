---
layout: default
title: Writeups
description: "CTF writeups — HackTheBox and TryHackMe challenge solutions."
---

<section class="section fade-in">
  <p class="mono accent" style="margin:0 0 8px;font-size:0.85rem">> cat /writeups/*</p>
  <h1>CTF Writeups</h1>
  <p class="muted" style="max-width:640px">My solutions and walkthroughs for HackTheBox and TryHackMe machines and challenges. Documenting the methodology, tools, and thought process behind each box.</p>

  <!-- Platform filter tabs -->
  <div id="writeup-filters" class="row" style="gap:8px;margin-top:var(--space-3);flex-wrap:wrap">
    <button class="btn ghost primary" data-filter="all">All</button>
    <button class="btn ghost" data-filter="hackthebox" style="gap:6px">
      <span style="color:#9FF300;font-weight:700">■</span> HackTheBox
    </button>
    <button class="btn ghost" data-filter="tryhackme" style="gap:6px">
      <span style="color:#C11111;font-weight:700">■</span> TryHackMe
    </button>
  </div>

  {% assign writeups = site.writeups | sort: 'date' | reverse %}

  {% if writeups.size > 0 %}
  <!-- ─── HackTheBox ─── -->
  {% assign htb = writeups | where: "platform", "hackthebox" %}
  {% if htb.size > 0 %}
  <div class="writeup-platform-section" data-platform="hackthebox">
    <h2 class="section-title" style="margin-top:var(--space-5)">
      <span style="color:#9FF300">⬡</span> HackTheBox
    </h2>
    <div class="writeup-grid stagger">
      {% for w in htb %}
      <a href="{{ w.url | relative_url }}" class="writeup-card card" data-platform="hackthebox">
        <div class="writeup-card-header">
          <span class="badge" style="background:rgba(159,243,0,0.12);color:#9FF300">HTB</span>
          {% if w.difficulty %}
          <span class="badge {% if w.difficulty == 'Easy' %}diff-easy{% elsif w.difficulty == 'Medium' %}diff-medium{% else %}diff-hard{% endif %}">{{ w.difficulty }}</span>
          {% endif %}
          {% if w.os %}<span class="badge">{{ w.os }}</span>{% endif %}
        </div>
        <h3>{{ w.title }}</h3>
        <p class="muted" style="font-size:0.85rem;margin:4px 0 0">{{ w.excerpt | strip_html | truncate: 120 }}</p>
        <p class="mono muted" style="font-size:0.75rem;margin:8px 0 0">{{ w.date | date: "%Y-%m-%d" }}</p>
      </a>
      {% endfor %}
    </div>
  </div>
  {% endif %}

  <!-- ─── TryHackMe ─── -->
  {% assign thm = writeups | where: "platform", "tryhackme" %}
  {% if thm.size > 0 %}
  <div class="writeup-platform-section" data-platform="tryhackme">
    <h2 class="section-title" style="margin-top:var(--space-5)">
      <span style="color:#C11111">◉</span> TryHackMe
    </h2>
    <div class="writeup-grid stagger">
      {% for w in thm %}
      <a href="{{ w.url | relative_url }}" class="writeup-card card" data-platform="tryhackme">
        <div class="writeup-card-header">
          <span class="badge" style="background:rgba(193,17,17,0.12);color:#C11111">THM</span>
          {% if w.difficulty %}
          <span class="badge {% if w.difficulty == 'Easy' %}diff-easy{% elsif w.difficulty == 'Medium' %}diff-medium{% else %}diff-hard{% endif %}">{{ w.difficulty }}</span>
          {% endif %}
          {% if w.os %}<span class="badge">{{ w.os }}</span>{% endif %}
        </div>
        <h3>{{ w.title }}</h3>
        <p class="muted" style="font-size:0.85rem;margin:4px 0 0">{{ w.excerpt | strip_html | truncate: 120 }}</p>
        <p class="mono muted" style="font-size:0.75rem;margin:8px 0 0">{{ w.date | date: "%Y-%m-%d" }}</p>
      </a>
      {% endfor %}
    </div>
  </div>
  {% endif %}

  {% else %}
  <div class="card" style="margin-top:var(--space-3);text-align:center;padding:var(--space-5)">
    <p class="mono muted" style="margin:0">// No writeups yet. Coming soon.</p>
  </div>
  {% endif %}
</section>

<script>
document.addEventListener('DOMContentLoaded', function () {
  var filters = document.getElementById('writeup-filters');
  if (!filters) return;
  var sections = document.querySelectorAll('.writeup-platform-section');
  filters.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var f = btn.dataset.filter;
    filters.querySelectorAll('button').forEach(function (b) { b.classList.remove('primary'); });
    btn.classList.add('primary');
    sections.forEach(function (s) {
      s.style.display = (f === 'all' || s.dataset.platform === f) ? '' : 'none';
    });
  });
});
</script>
