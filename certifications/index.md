---
layout: default
title: Certifications
description: "Certifications, language qualifications and training courses of Alessandro Bragetti — Trinity College London GESE Grade 7 (CEFR B2.1) and SAP Integration Suite, React, Python and cybersecurity courses."
---
{%- assign all = site.data.certifications | where: "public", true -%}
{%- comment -%} category key|heading|note ; separated by ";;" {%- endcomment -%}
{%- assign groups = "formal-certification|Certifications|Vendor or industry certifications with an issuing body.;;language-qualification|Language qualifications|Externally assessed language exams.;;course-completion|Course completions|Courses completed with a completion certificate.;;training-course|Training courses|Courses I took for skills development. These are training courses, not vendor certifications.;;self-directed|Self-directed learning|Topics studied independently." | split: ";;" -%}
{%- assign months = "January,February,March,April,May,June,July,August,September,October,November,December" | split: "," -%}

<section class="section fade-in about-section">
  <p class="mono accent hero-prompt">&gt; cat credentials.yml</p>
  <h1>Certifications &amp; training</h1>
  <p class="muted page-intro">Grouped by what each item is. Certificate numbers are never published; verification details are available on request.</p>

  {%- for g in groups %}
    {%- assign parts = g | split: "|" -%}
    {%- assign items = all | where: "category", parts[0] -%}
    {%- if items.size > 0 %}
  <section class="cert-group" aria-labelledby="c-{{ parts[0] }}">
    <h2 id="c-{{ parts[0] }}" class="section-title">{{ parts[1] }}</h2>
    <p class="muted group-intro">{{ parts[2] }}</p>
    <ul class="cert-list">
      {%- for c in items %}
      <li class="cert-item">
        <h3 class="cert-title">{{ c.title }}</h3>
        {%- if c.subtitle %}<p class="cert-sub">{{ c.subtitle }}</p>{% endif %}
        {%- if c.qualification %}<p class="muted cert-detail">{{ c.qualification }}</p>{% endif %}
        <p class="mono muted cert-meta">
          {%- if c.issuer != "" and c.issuer %}{{ c.issuer }}{% endif -%}
          {%- if c.date != "" and c.date -%}
            {%- assign d = c.date | split: "-" -%}
            {%- if c.issuer != "" and c.issuer %} · {% endif -%}
            {%- if d.size > 1 -%}{%- assign mi = d[1] | plus: 0 | minus: 1 -%}<time datetime="{{ c.date }}">{{ months[mi] }} {{ d[0] }}</time>{%- else -%}<time datetime="{{ c.date }}">{{ d[0] }}</time>{%- endif -%}
          {%- endif -%}
        </p>
        {%- if c.skills %}
        <ul class="tag-list" aria-label="Skills">{% for s in c.skills %}<li class="badge">{{ s }}</li>{% endfor %}</ul>
        {%- endif %}
        {%- if c.credential_url != "" and c.credential_url %}<p><a href="{{ c.credential_url }}" rel="noopener">Verify credential<span class="sr-only"> — {{ c.title }}</span></a></p>{% endif %}
      </li>
      {%- endfor %}
    </ul>
  </section>
    {%- endif -%}
  {%- endfor %}
</section>
