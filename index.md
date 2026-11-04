---
layout: default
title: Home
description: "Alessandro Bragetti — SAP BTP & Full Stack Developer at Accenture: SAP CAP, Node.js, CDS, SAPUI5/Fiori, OData and SAP Integration Suite. Also exploring AI engineering and cybersecurity."
---
{%- assign pr = site.data.profile -%}

<section class="hero" aria-labelledby="hero-title">
  <div class="hero-inner">
    <div class="hero-copy fade-in">
      <p class="mono accent hero-prompt">&gt; hello_world</p>
      <h1 id="hero-title"><span class="accent">SAP BTP</span> &amp; Full Stack Developer</h1>
      <p class="hero-secondary mono">{{ pr.secondary }}</p>
      <p class="lead">{{ pr.intro }}</p>
      <div class="row hero-actions">
        <a class="btn primary" href="{{ '/about/#experience' | relative_url }}">Experience</a>
        <a class="btn ghost" href="{{ '/projects/' | relative_url }}">Projects</a>
        <a class="btn ghost" href="{{ pr.contact.linkedin }}" rel="noopener me">LinkedIn</a>
      </div>
    </div>
    <div class="fade-in hero-photo">
      {% include profile-photo.html size=200 eager=true %}
      <p class="hero-name">{{ pr.name }}</p>
      <p class="mono muted hero-meta">Based in {{ pr.location }}</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="path-title">
  <h2 id="path-title" class="section-title">Career path</h2>
  <ol class="career-path">
    {%- for step in pr.path %}
    <li class="career-step{% if forloop.last %} is-current{% endif %}">
      <span class="career-years mono">{{ step.years }}</span>
      <span class="career-label">{{ step.label }}</span>
    </li>
    {%- endfor %}
  </ol>
  <p class="muted path-note">From ABAP on SAP ERP/ECC, through SAP BTP and integration work, to full-stack development on SAP BTP. <a href="{{ '/about/#experience' | relative_url }}">Full timeline →</a></p>
</section>

<section class="section" aria-labelledby="focus-title">
  <h2 id="focus-title" class="section-title">What I work on</h2>
  <div class="focus-grid">
    <div class="focus-item">
      <p class="focus-kind mono">Professional</p>
      <h3>Enterprise SAP development</h3>
      <p class="muted">CAP and Node.js services with CDS models, SAPUI5/Fiori interfaces, REST and OData APIs, SAP S/4HANA integration and Cloud Foundry deployment. Before that: SAP Integration Suite, API Management, PI/PO migrations and ABAP on ERP/ECC.</p>
    </div>
    <div class="focus-item">
      <p class="focus-kind mono">Research &amp; experiments</p>
      <h3>AI engineering &amp; intelligent systems</h3>
      <p class="muted">Personal experiments and writing on AI-assisted development, adversarial robustness and secure ML pipelines, plus the <a href="{{ '/projects/#experiment' | relative_url }}">MTPS</a> formal-methods experiment.</p>
    </div>
    <div class="focus-item">
      <p class="focus-kind mono">Learning &amp; practice</p>
      <h3>Cybersecurity &amp; systems thinking</h3>
      <p class="muted">Networking and Linux fundamentals, Cisco NetAcad training and hands-on lab <a href="{{ '/writeups/' | relative_url }}">CTF writeups</a> from HackTheBox and TryHackMe.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="work-title">
  <div class="row section-head">
    <h2 id="work-title" class="section-title">Selected work</h2>
    <a class="btn ghost btn-sm" href="{{ '/projects/' | relative_url }}">All projects →</a>
  </div>
  {%- assign featured = site.data.projects | where: "visibility", "public" | where: "featured", true %}
  <div class="projects-grid">
    {%- for p in featured limit:3 %}
      {% include project-card.html project=p %}
    {%- endfor %}
  </div>
</section>

<section class="section" aria-labelledby="writing-title">
  <div class="row section-head">
    <h2 id="writing-title" class="section-title">Writing</h2>
    <a class="btn ghost btn-sm" href="{{ '/blog/' | relative_url }}">Blog →</a>
  </div>
  <ul class="post-list">
    {%- for post in site.posts limit:2 %}
    <li class="post-item">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <div class="post-meta"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time> · Blog</div>
    </li>
    {%- endfor %}
    {%- assign latest_w = site.writeups | sort: 'date' | reverse | first %}
    {%- if latest_w %}
    <li class="post-item">
      <a href="{{ latest_w.url | relative_url }}">{{ latest_w.title }}</a>
      <div class="post-meta"><time datetime="{{ latest_w.date | date_to_xmlschema }}">{{ latest_w.date | date: "%B %d, %Y" }}</time> · CTF writeup</div>
    </li>
    {%- endif %}
  </ul>
</section>
