---
layout: default
title: About
description: "About me — background, skills, and experience in AI engineering and cybersecurity."
---

<section class="section fade-in">
  <div class="about-section">
    <p class="mono accent" style="margin:0 0 8px;font-size:0.85rem">> whoami</p>
    <h1>About Me</h1>

    <div class="row" style="gap:var(--space-4);flex-wrap:wrap;margin-top:var(--space-3);align-items:flex-start">
      <div class="photo-frame" style="width:160px;height:160px;flex-shrink:0">
        <img src="{{ '/assets/images/profile.jpg' | relative_url }}" alt="Profile photo" width="160" height="160">
      </div>
      <div style="flex:1;min-width:280px">
        <p class="lead" style="margin-top:0">AI Engineer with a security-first mindset. I design and build intelligent systems that are scalable, resilient, and meaningful — bridging machine learning with cybersecurity to solve real-world problems.</p>
        <p class="muted">Based in Italy. Working at the intersection of artificial intelligence, security research, and systems architecture. I believe technology should serve people — not the other way around.</p>
      </div>
    </div>

    <h2 class="section-title" style="margin-top:var(--space-5)">Skills & Technologies</h2>
    <div style="display:flex;flex-direction:column;gap:var(--space-3)">
      <div>
        <h3 class="mono muted" style="font-size:0.8rem;margin:0 0 8px">// languages & frameworks</h3>
        <ul class="skills-list">
          <li class="badge">Python</li>
          <li class="badge">PyTorch</li>
          <li class="badge">TensorFlow</li>
          <li class="badge">scikit-learn</li>
          <li class="badge">JavaScript</li>
          <li class="badge">Go</li>
          <li class="badge">SQL</li>
        </ul>
      </div>
      <div>
        <h3 class="mono muted" style="font-size:0.8rem;margin:0 0 8px">// security & infrastructure</h3>
        <ul class="skills-list">
          <li class="badge">Threat Modeling</li>
          <li class="badge">Penetration Testing</li>
          <li class="badge">SIEM / SOC</li>
          <li class="badge">Docker / K8s</li>
          <li class="badge">Terraform</li>
          <li class="badge">CI/CD</li>
          <li class="badge">AWS</li>
        </ul>
      </div>
      <div>
        <h3 class="mono muted" style="font-size:0.8rem;margin:0 0 8px">// ai & data</h3>
        <ul class="skills-list">
          <li class="badge">ML Pipelines</li>
          <li class="badge">NLP</li>
          <li class="badge">Computer Vision</li>
          <li class="badge">Anomaly Detection</li>
          <li class="badge">MLOps</li>
          <li class="badge">Data Engineering</li>
        </ul>
      </div>
    </div>

    <h2 class="section-title" style="margin-top:var(--space-5)">Timeline</h2>
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-date">2024 – Present</div>
        <h3>AI Engineer</h3>
        <p class="muted">Designing production ML systems, orchestration pipelines, and adversarial robustness frameworks. Focus on secure-by-design AI infrastructure.</p>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">2022 – 2024</div>
        <h3>Security Researcher</h3>
        <p class="muted">Threat modeling for cloud architectures, vulnerability assessment, static analysis tooling, and quantum-safe cryptographic evaluation.</p>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">2020 – 2022</div>
        <h3>Full-Stack Developer</h3>
        <p class="muted">Building web applications, REST APIs, and cloud-native microservices. Introduced DevSecOps practices and IaC workflows.</p>
      </div>
      <div class="timeline-item">
        <div class="timeline-date">2018 – 2020</div>
        <h3>CS Student & Self-taught Hacker</h3>
        <p class="muted">Computer Science studies, CTF competitions, open-source contributions, and first steps in machine learning research.</p>
      </div>
    </div>

    <div class="card" style="margin-top:var(--space-5);text-align:center;padding:var(--space-4)">
      <h2 class="section-title" style="margin:0 0 var(--space-2)">Let's Connect</h2>
      <p class="muted" style="margin:0 0 var(--space-3)">Interested in collaborating on AI or security projects? Let's talk.</p>
      <div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap">
        <a class="btn primary" href="mailto:{{ site.email }}">Get in Touch</a>
        <a class="btn ghost" href="{{ site.social[0].url }}" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  </div>
</section>
