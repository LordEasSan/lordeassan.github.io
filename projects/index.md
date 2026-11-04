---
layout: default
title: Projects
description: "Projects by Alessandro Bragetti — SAP BTP case studies, personal AI and formal-methods experiments, and learning repositories."
scripts: [projects]
---
{%- assign visible = site.data.projects | where: "visibility", "public" -%}
{%- comment -%} Groups: key|heading|intro, separated by ";;" (intros may contain commas). {%- endcomment -%}
{%- assign groups = "professional|Professional case studies|SAP work described in general terms. Client code, data and architecture details are never published.;;experiment|Personal projects & experiments|Things I build on my own time to explore ideas. Experimental by design.;;personal|Personal projects|Self-initiated tools and apps.;;open-source|Open source|Contributions and investigations on community projects.;;learning|Learning & practice|Public repositories from courses and self-study." | split: ";;" -%}

<section class="section fade-in">
  <p class="mono accent hero-prompt">&gt; ls projects/</p>
  <h1>Projects</h1>
  <p class="muted page-intro">Each project is labelled for what it is: professional work, a personal experiment, or a learning exercise.</p>

  <div id="project-filters" class="row filter-bar" role="group" aria-label="Filter projects by category">
    <button type="button" class="btn ghost btn-sm" data-filter="*" aria-pressed="true">All</button>
    {%- for g in groups %}
      {%- assign parts = g | split: "|" -%}
      {%- assign n = visible | where: "category", parts[0] | size -%}
      {%- if n > 0 %}
    <button type="button" class="btn ghost btn-sm" data-filter="{{ parts[0] }}" aria-pressed="false">{{ parts[1] }} <span class="count">({{ n }})</span></button>
      {%- endif -%}
    {%- endfor %}
  </div>

  {%- for g in groups %}
    {%- assign parts = g | split: "|" -%}
    {%- assign items = visible | where: "category", parts[0] -%}
    {%- if items.size > 0 %}
  <section class="project-group" id="{{ parts[0] }}" data-group="{{ parts[0] }}" aria-labelledby="h-{{ parts[0] }}">
    <h2 id="h-{{ parts[0] }}" class="section-title">{{ parts[1] }}</h2>
    <p class="muted group-intro">{{ parts[2] }}</p>
    <div class="projects-grid">
      {%- for p in items %}
        {% include project-card.html project=p %}
      {%- endfor %}
    </div>
  </section>
    {%- endif -%}
  {%- endfor %}

  <p class="muted small-note">More on <a href="{{ site.data.profile.contact.github }}" rel="noopener">GitHub</a>.</p>
</section>
