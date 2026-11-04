---
layout: default
title: About
description: "About Alessandro Bragetti — SAP developer since 2020: ABAP on SAP ERP/ECC, SAP BTP and Integration Suite, now SAP BTP full-stack development at Accenture."
---
{%- assign pr = site.data.profile -%}

<section class="section fade-in about-section" aria-labelledby="about-title">
  <p class="mono accent hero-prompt">&gt; whoami</p>
  <h1 id="about-title">About</h1>

  <div class="about-intro">
    {% include profile-photo.html size=160 %}
    <div>
      <p class="lead">I'm {{ pr.name }}, an SAP developer based in {{ pr.location }}. I have worked in the SAP ecosystem since 2020: ABAP on SAP ERP/ECC first, then SAP BTP and enterprise integration, and since May 2025 full-stack development on SAP BTP at Accenture.</p>
      <p class="muted">Outside client work I write about and experiment with AI systems, and I practise security through CTF labs. Those are personal interests and learning, not professional roles, and the site keeps them clearly separate.</p>
    </div>
  </div>
</section>

<section class="section about-section" id="experience" aria-labelledby="exp-title">
  <h2 id="exp-title" class="section-title">Experience</h2>
  <ol class="timeline">
    {%- for job in pr.experience %}
    <li class="timeline-item{% if job.current %} is-current{% endif %}">
      <p class="timeline-date"><time datetime="{{ job.start_iso }}">{{ job.start }}</time> – {% if job.end_iso %}<time datetime="{{ job.end_iso }}">{{ job.end }}</time>{% else %}{{ job.end }}{% endif %}</p>
      <h3>{{ job.role }} <span class="timeline-company">· {{ job.company }}</span></h3>
      <p class="muted">{{ job.summary }}</p>
      <ul class="timeline-highlights">
        {%- for h in job.highlights %}<li>{{ h }}</li>{% endfor %}
      </ul>
      <ul class="tag-list" aria-label="Technologies at {{ job.company }}">
        {%- for t in job.stack %}<li class="badge">{{ t }}</li>{% endfor %}
      </ul>
    </li>
    {%- endfor %}
  </ol>
</section>

<section class="section about-section" aria-labelledby="skills-title">
  <h2 id="skills-title" class="section-title">Skills</h2>
  <div class="skills-groups">
    {%- for g in pr.skills %}
    <div class="skills-group">
      <h3 class="mono skills-heading">// {{ g.group }}</h3>
      <ul class="skills-list">
        {%- for s in g.items %}<li class="badge">{{ s }}</li>{% endfor %}
      </ul>
    </div>
    {%- endfor %}
  </div>
  <p class="muted small-note">No self-rated levels: the experience above shows where each skill was used.</p>
</section>

<section class="section about-section" aria-labelledby="edu-title">
  <h2 id="edu-title" class="section-title">Education, languages &amp; certifications</h2>
  <div class="facts-grid">
    <div>
      <h3 class="mono skills-heading">// education</h3>
      {%- for e in pr.education %}
      <p><strong>{{ e.title }}</strong><br><span class="muted">{{ e.school }} · {{ e.year }}</span></p>
      {%- endfor %}
    </div>
    <div>
      <h3 class="mono skills-heading">// languages</h3>
      <ul class="plain-list">
        {%- for l in pr.languages %}<li><strong>{{ l.name }}</strong> — <span class="muted">{{ l.level }}</span></li>{% endfor %}
      </ul>
    </div>
    <div>
      <h3 class="mono skills-heading">// certifications</h3>
      {%- assign lang_q = site.data.certifications | where: "category", "language-qualification" | where: "public", true %}
      <ul class="plain-list">
        {%- for c in lang_q %}<li><strong>{{ c.title }}</strong><br><span class="muted">{{ c.subtitle }}</span></li>{% endfor %}
      </ul>
      <p><a href="{{ '/certifications/' | relative_url }}">Certifications &amp; training →</a></p>
    </div>
  </div>
</section>

<section class="section about-section" aria-labelledby="approach-title">
  <h2 id="approach-title" class="section-title">How I work</h2>
  <ul class="approach-list">
    <li><strong>Model first.</strong> On SAP BTP I start from the CDS model and the service contract, because the Fiori app, the OData API and the S/4HANA integration all depend on it.</li>
    <li><strong>Integration is part of the feature.</strong> Years of IDoc, RFC, OData and Integration Suite work taught me that most production issues live between systems, so I design for errors, monitoring and traceability.</li>
    <li><strong>Close to the functional side.</strong> Requirements, estimates and test cases are shared work with functional colleagues, not a handover.</li>
  </ul>
</section>

<section class="section about-section" id="contact" aria-labelledby="contact-title">
  <div class="card contact-card">
    <h2 id="contact-title" class="section-title">Contact</h2>
    <p class="muted">For SAP BTP roles and collaborations, LinkedIn or email is the quickest way to reach me.</p>
    <div class="row contact-actions">
      <a class="btn primary" href="{{ pr.contact.linkedin }}" rel="noopener me">LinkedIn</a>
      <a class="btn ghost" href="mailto:{{ pr.contact.email }}">{{ pr.contact.email }}</a>
      <a class="btn ghost" href="{{ pr.contact.github }}" rel="noopener me">GitHub</a>
    </div>
  </div>
</section>
