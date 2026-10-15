(() => {
  "use strict";
  const { profiles, projects } = window.PORTFOLIO_DATA;
  const main = document.querySelector("main");
  const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]));
  const labels = {all:"All",quant:"Quant Finance",data:"Data Science & AI",digital:"IT & Digital Transformation",fullstack:"Full-Stack Development"};
  const lenses = window.PORTFOLIO_DATA.lenses, lensKeys = Object.keys(lenses);
  // In-memory only: never written to storage, the URL or the network. A reload returns to the selector.
  const personalization = {audience:null,focus:null};
  const audience = () => personalization.audience || "visitor";
  const profileKey = path => path === "/quant" ? "quant" : path === "/data-ai" ? "data" : path === "/digital-transformation" ? "digital" : null;
  const cleanPath = () => (location.pathname.replace(/\/$/, "") || "/");
  const initialPath = cleanPath();
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const chips = values => `<div class="chips">${values.map(v=>`<span>${escapeHtml(v)}</span>`).join("")}</div>`;
  const projectMark = p => p.title.split(/[\s&/–—-]+/).filter(Boolean).map(word=>word[0]).join("").slice(0,3).toUpperCase();
  const projectCard = (p, i=0) => `<article class="project-card reveal" data-project="${p.slug}" style="--i:${i};--cover-tone:${(i*47+112)%360}">
    <a class="card-hit route-link" href="/projects/${p.slug}" aria-label="Read ${escapeHtml(p.title)} case study"></a>
    <div class="card-top"><span>${String(i+1).padStart(2,"0")} / ${escapeHtml(labels[p.categories[0]] || "Project")}</span><span>${p.date}</span></div>
    ${p.image ? `<div class="project-cover image-cover"><img src="${p.cardImage||p.image}" alt="${escapeHtml(p.imageAlt||"")}" loading="lazy" width="900" height="540"></div>` : `<div class="project-cover generated-cover" aria-hidden="true"><span>${escapeHtml(labels[p.categories[0]]||"Engineering")}</span><strong>${projectMark(p)}</strong><small>${escapeHtml(p.title)}</small><i></i></div>`}
    <div class="card-copy"><p class="kicker">${escapeHtml(p.status)}</p><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.summary)}</p>${chips(p.stack.slice(0,4))}</div>
    <span class="card-arrow" aria-hidden="true">↗</span></article>`;

  function shell(content){ return `${content}${internshipSection()}${footer()}`; }
  function internshipSection(){return `<section class="internship"><div><p class="eyebrow"><span>AVAILABLE / JAN 2027</span> INTERNSHIP SEARCH</p><h2>Looking for the next<br><em>serious problem.</em></h2></div><div><p>I’m seeking an internship starting <strong>January 2027</strong> where I can contribute through one of three complementary roles:</p><ul><li><span>01</span> Quantitative Finance</li><li><span>02</span> Data Science &amp; AI</li><li><span>03</span> IT Project Management &amp; Digital Transformation</li></ul><a class="button primary" href="mailto:elkadirisifeddine@gmail.com?subject=January%202027%20Internship%20Opportunity">Discuss an opportunity <span>↗</span></a></div></section>`;}
  function footer(){return `<section class="contact"><p class="eyebrow"><span>OPEN CHANNEL</span> / CASABLANCA</p><h2>Build something<br><em>useful.</em></h2><p>Quantitative research, intelligent systems or practical digital transformation—if the problem is real, I’d like to hear about it.</p><div class="contact-links"><a href="mailto:elkadirisifeddine@gmail.com">Email ↗</a><a href="https://www.linkedin.com/in/sifeddine-el-kadiri-097235390/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/addicteduser04" target="_blank" rel="noreferrer">GitHub ↗</a></div>${siteFooter()}</section>`;}
  function siteFooter(){return `<footer><span>© ${new Date().getFullYear()} SIFEDDINE EL KADIRI</span><span>ENGINEERING ACROSS DISCIPLINES</span><a href="#main">BACK TO TOP ↑</a></footer>`;}

  function home(){
    return shell(`<section class="hero home-hero"><canvas id="signal-canvas" aria-hidden="true"></canvas><div class="grid-bg"></div><div class="hero-copy reveal"><p class="eyebrow"><span>SEK / 2026</span> MULTIDISCIPLINARY ENGINEERING</p><h1>Three lenses.<br>One way of<br><em>building.</em></h1><p class="intro">I’m Sifeddine EL KADIRI, an ENSIAS Data & Finance engineering student. I model markets, build intelligent systems and turn operational friction into production software.</p><a class="button primary route-link" href="/projects">Explore all projects <span>↘</span></a></div><div class="hero-readout"><span>SELECT A PROFILE</span><strong>03</strong><small>CONNECTED DISCIPLINES</small></div></section>
    <section class="profile-intro bone"><div class="section-heading"><div class="section-index">01 / PROFILES</div><h2>Choose the signal<br>that matters.</h2><p>The same engineering foundation, reframed for each professional context.</p></div><div class="profile-grid">${Object.values(profiles).map((p,i)=>`<a class="profile-card route-link reveal" href="${p.path}"><span>0${i+1} / ${p.code}</span><h3>${p.label}</h3><p>${p.intro}</p><b>Enter profile ↗</b></a>`).join("")}</div></section>
    <section class="about"><div class="portrait"><img src="/assets/sifeddine-profile.jpg" alt="Portrait of Sifeddine EL KADIRI" width="896" height="1200"><span>CASABLANCA, MOROCCO</span></div><div><p class="kicker">THE ENGINEER BEHIND THE WORK</p><h2>Finance gives me the questions. Data gives me evidence. Software makes the answer useful.</h2><p>At ENSIAS, I specialize in Data and Finance. My experience spans fixed-income quantitative research at Sterling Asset Management, data analysis at AKWA GROUP, and production applications used by real businesses.</p><div class="facts"><span><b>2027</b> ENSIAS graduation</span><span><b>03</b> professional profiles</span><span><b>${projects.length}</b> documented projects</span></div></div></section>
    <section class="selected"><div class="section-heading"><div class="section-index">02 / PROOF</div><h2>Selected systems<br>& research.</h2><a class="text-link route-link" href="/projects">View complete library ↗</a></div><div class="project-grid">${[bySlug.dentalmarket,bySlug.saifinvest,bySlug["equity-crash"],bySlug["dwarven-industry"]].map(projectCard).join("")}</div></section>`);
  }

  const curveControls = () => `<div class="controls"><label>Level <output id="level-out">4.1%</output><input id="level" type="range" min="2" max="7" value="4.1" step="0.1"></label><label>Slope <output id="slope-out">−1.2</output><input id="slope" type="range" min="-4" max="4" value="-1.2" step="0.1"></label><label>Curvature <output id="curve-out">2.4</output><input id="curve" type="range" min="-4" max="4" value="2.4" step="0.1"></label></div>`;
  const curveChart = () => `<div class="chart-wrap"><svg id="ns-chart" viewBox="0 0 700 380" role="img" aria-label="Interactive Nelson-Siegel yield curve"><g class="chart-grid"></g><path class="area"></path><path class="line"></path><g class="points"></g></svg><div class="chart-value"><span>10Y MODEL</span><strong id="ten-year">4.32</strong><small>YIELD %</small></div></div>`;
  function curveLab(){return `<section class="lab bone"><div><div class="section-index">INTERACTIVE / MODEL</div><p class="kicker">TOUCH THE THESIS</p><h2>Shape a yield curve.</h2><p>Nelson–Siegel compresses a term structure into three interpretable forces. Move them and watch the curve respond.</p>${curveControls()}</div>${curveChart()}</section>`;}

  function profilePage(key){
    const p=profiles[key], list=p.featured.map(s=>bySlug[s]);
    return shell(`<section class="hero profile-hero"><canvas id="signal-canvas" aria-hidden="true"></canvas><div class="grid-bg"></div><div class="hero-copy"><p class="eyebrow"><span>${p.code}</span> / ${p.label.toUpperCase()}</p><h1>${p.title.replace("—","<br><em>—</em>")}</h1><p class="intro">${p.intro}</p><div class="hero-actions"><a class="button primary" href="#featured">${p.cta} <span>↘</span></a>${p.cv ? `<a href="${p.cv}" download class="text-link">Download CV ↓</a>`:`<span class="cv-note" title="Add a PDF path in projects.js to enable this action">Profile CV · available on request</span>`}</div></div><div class="hero-readout"><span>PROFILE</span><strong>0${["quant","data","digital"].indexOf(key)+1}</strong><small>${p.thesis}</small></div></section>
    <section class="experience bone"><div class="section-heading"><div class="section-index">01 / POSITIONING</div><h2>${p.thesis}</h2><p>Experience reframed around the problems most relevant to this profile.</p></div><div class="timeline">${p.experience.map((x,i)=>`<article><span>0${i+1}</span><i></i><p>${x}</p></article>`).join("")}</div></section>
    ${key==="quant"?curveLab():key==="data"?dataVisual():workflowVisual()}
    <section class="selected" id="featured"><div class="section-heading"><div class="section-index">02 / FEATURED WORK</div><h2>Evidence,<br>ordered by relevance.</h2><a class="text-link route-link" href="/projects">All projects ↗</a></div><div class="project-grid">${list.map(projectCard).join("")}</div></section>
    <section class="skills bone"><div class="section-index">03 / CAPABILITIES</div>${p.skills.map((s,i)=>`<div class="skill-row"><span>0${i+1}</span><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join("")}</section>`);
  }
  function dataVisual(){return `<section class="visual-section data-visual"><div><div class="section-index">INTERACTIVE / PIPELINE</div><p class="kicker">FROM INPUT TO EVIDENCE</p><h2>A model is only as credible as the path around it.</h2><p>Hover or focus each stage. Validation and interpretation are part of the system—not an appendix.</p></div><div class="pipeline">${["Raw data","Quality checks","Features","Model","Out-of-sample","Decision"].map((x,i)=>`<button><span>0${i+1}</span>${x}<small>${["Source & provenance","Missingness & leakage","Lagged, explainable","Baseline before complexity","Chronological evaluation","Limits stay visible"][i]}</small></button>`).join("<i>→</i>")}</div></section>`;}
  function workflowVisual(){return `<section class="visual-section workflow"><div><div class="section-index">SYSTEM / FLOW</div><p class="kicker">DIGITAL TRANSFORMATION</p><h2>Structure the handoffs, not just the screens.</h2><p>Good business software connects the customer action to an operational record and a decision-ready view.</p></div><div class="flow-map"><span>Customer<small>discovers · requests</small></span><i>→</i><span>Workflow<small>validates · routes</small></span><i>→</i><span>Operations<small>fulfils · records</small></span><i>→</i><span>Decision<small>measures · improves</small></span></div></section>`;}

  /* Tailored landing views: one shared set of sections, composed per specialization (lenses in projects.js)
     and reordered per audience. Recruiters get evidence and experience first; visitors get projects and demos. */
  const pad = n => String(n).padStart(2,"0");
  const mailto = subject => `mailto:elkadirisifeddine@gmail.com?subject=${encodeURIComponent(subject)}`;
  const LINKEDIN = "https://www.linkedin.com/in/sifeddine-el-kadiri-097235390/", GITHUB = "https://github.com/addicteduser04";
  function lensCv(l){
    const cv = l.cv; // role-specific CV path in projects.js; null keeps the request-by-email fallback
    return cv ? `<a class="text-link" href="${cv}" download>Download ${escapeHtml(l.short)} CV ↓</a>` : `<a class="text-link" href="${mailto(`CV request — ${l.label}`)}">Request the ${escapeHtml(l.short)} CV ↗</a>`;
  }
  function lensBar(key){
    const l=lenses[key];
    return `<div class="lens-bar" role="region" aria-label="Tailored view controls"><p class="lens-now"><i aria-hidden="true"></i><span>Tailored view</span><b data-short="${escapeHtml(l.short)}">${escapeHtml(l.label)}</b></p>
      <div class="lens-switch lens-disciplines" role="group" aria-label="Specialization" data-arrows>${lensKeys.map(k=>`<button type="button" data-lens-switch="${k}" aria-pressed="${k===key}">${escapeHtml(lenses[k].short)}</button>`).join("")}</div>
      <div class="lens-switch" role="group" aria-label="Viewing as" data-arrows>${[["recruiter","Recruiter"],["visitor","Visitor"]].map(([a,t])=>`<button type="button" data-audience-switch="${a}" aria-pressed="${a===audience()}">${t}</button>`).join("")}</div>
      <button type="button" class="lens-change" data-lens-change>Change</button>
      <button type="button" class="lens-exit" data-lens-exit>View all work <span aria-hidden="true">×</span></button></div>`;
  }
  function quantInstrument(){
    return `<figure class="lens-instrument quant-figure" id="lens-demo" tabindex="-1"><figcaption><span>Fig. 1</span> Nelson–Siegel term structure. Move level, slope and curvature.</figcaption>${curveChart()}${curveControls()}<p class="figure-note">Illustrative parameters. The underlying research forecasts Moroccan sovereign curves out of sample.</p></figure>`;
  }
  function dataInstrument(){
    return `<div class="lens-instrument data-figure" id="lens-demo" tabindex="-1"><div class="figure-head"><span>Anomaly triage</span><span>Synthetic data</span></div>
      <svg id="anomaly-chart" viewBox="0 0 640 330" role="img" aria-labelledby="anomaly-desc"><desc id="anomaly-desc">Synthetic transaction scores over time. Points outside the review band are flagged for review.</desc><g class="a-grid"></g><rect class="a-band"></rect><g class="a-points"></g></svg>
      <p class="a-legend" aria-hidden="true"><span class="lg-flag">Flagged</span><span class="lg-miss">Missed anomaly</span><span class="lg-norm">Normal</span></p>
      <label class="a-control">Review threshold <output id="a-thr-out">3.0σ</output><input id="a-thr" type="range" min="1.5" max="4.5" step="0.1" value="3"></label>
      <div class="a-readout" aria-live="polite"><p><span>Review queue</span><b id="a-queue">–</b></p><p><span>Anomalies caught</span><b id="a-recall">–</b></p><p><span>False alarms</span><b id="a-false">–</b></p></div>
      <p class="figure-note">Synthetic data showing the trade-off behind anomaly triage: recall against review load. Not a client dataset.</p></div>`;
  }
  const systemDetail = n => `<p class="inspector-path">saifinvest › ${escapeHtml(n.layer.toLowerCase())} › ${escapeHtml(n.id)}</p><p>${escapeHtml(n.detail)}</p><ul>${n.facts.map(f=>`<li>${escapeHtml(f)}</li>`).join("")}</ul>`;
  function systemInstrument(l){
    return `<div class="lens-instrument system-figure"><div class="figure-head"><span>SaifInvest / from need to system</span><span>Verified from repository</span></div>
      <div class="system-map" role="group" aria-label="SaifInvest architecture layers" data-arrows>${l.system.map((n,i)=>`<button type="button" class="system-node" data-node="${n.id}" aria-pressed="${i===0}" aria-controls="system-inspector"><span>${pad(i+1)} / ${escapeHtml(n.layer)}</span><strong>${escapeHtml(n.title)}</strong><small>${escapeHtml(n.meta)}</small></button>`).join("")}</div>
      <div class="system-inspector" id="system-inspector" aria-live="polite">${systemDetail(l.system[0])}</div></div>`;
  }
  function systemSection(l){
    return `<section class="lens-section lens-system"><div class="section-heading"><div class="section-index">INTERACTIVE / SOLUTION DESIGN</div><h2>From business need<br>to <em>architecture.</em></h2><p>How SaifInvest turns an investor’s question into numbers that can be trusted. Select a layer.</p></div>${systemInstrument(l)}</section>`;
  }
  const caseStages = ["Business challenge","Data & analysis","Technology solution","Decision support"];
  const caseDetail = c => `<ol class="case-flow">${c.stages.map((t,i)=>`<li style="--s:${i}"><span>${pad(i+1)}</span><b>${caseStages[i]}</b><p>${escapeHtml(t)}</p></li>`).join("")}</ol>`;
  function caseInstrument(l){
    return `<div class="lens-instrument case-figure" id="lens-demo" tabindex="-1"><div class="figure-head"><span>Case flow</span><span>Verified work</span></div>
      <div class="case-tabs" role="group" aria-label="Choose a case" data-arrows>${l.cases.map((c,i)=>`<button type="button" data-case="${c.id}" aria-pressed="${i===0}" aria-controls="case-detail"><strong>${escapeHtml(c.label)}</strong><small>${escapeHtml(c.kind)}</small></button>`).join("")}</div>
      <div id="case-detail" aria-live="polite">${caseDetail(l.cases[0])}</div></div>`;
  }
  function lensHero(key){
    const l=lenses[key], recruiter=audience()==="recruiter", count=l.projects[audience()].length;
    const instrument = key==="quant" ? quantInstrument() : key==="data" ? dataInstrument() : caseInstrument(l);
    const actions = recruiter
      ? `<a class="button primary" href="#lens-experience" data-jump>View relevant experience <span>↘</span></a>${lensCv(l)}`
      : `<a class="button primary" href="#lens-demo" data-jump>${escapeHtml(l.demoLabel)} <span>↘</span></a><a class="text-link" href="#lens-projects" data-jump>Browse ${count} selected projects ↓</a>`;
    const status = recruiter
      ? `Open to internships from January 2027 · <a href="${mailto(l.cta.recruiter.subject)}">elkadirisifeddine@gmail.com</a>`
      : `${count} projects in this view · ${projects.length} in the full library`;
    return `<section class="lens-hero" aria-labelledby="lens-title">${l.masthead?`<div class="lens-masthead lens-in" style="--d:0">${l.masthead.map(m=>`<span>${escapeHtml(m)}</span>`).join("")}</div>`:""}
      <div class="lens-copy"><p class="eyebrow lens-in" style="--d:1"><span>${pad(lensKeys.indexOf(key)+1)} / ${escapeHtml(l.label)}</span> ${escapeHtml(l.eyebrow)}</p>
        <h1 id="lens-title" class="lens-in" style="--d:2">${l.title.replace(/<br>/g," <br>")}</h1>
        <p class="intro lens-in" style="--d:3">${escapeHtml(l.intro)}</p>
        <ul class="lens-positioning lens-in" style="--d:4" aria-label="Focus areas">${l.positioning.map((p,i)=>`<li data-i="${pad(i+1)}">${escapeHtml(p)}</li>`).join("")}</ul>
        <div class="hero-actions lens-in" style="--d:5">${actions}</div>
        <p class="lens-status lens-in" style="--d:6"><i aria-hidden="true"></i>${status}</p></div>
      <div class="lens-visual lens-in" style="--d:4">${instrument}</div></section>`;
  }
  function lensEvidence(l,n,tone,recruiter){
    return `<section class="lens-section lens-evidence ${tone}"><div class="section-heading"><div class="section-index">${n} / ${recruiter?"EVIDENCE":"FINDINGS"}</div><h2>${recruiter?"Results,<br>not adjectives.":"What the work<br>found."}</h2><p>Drawn from documented project results and professional work, with limitations kept alongside.</p></div>
      <ul class="evidence-grid">${l.evidence.map(([v,t],i)=>`<li class="reveal" style="--i:${i}"><strong>${escapeHtml(v)}</strong><span>${escapeHtml(t)}</span></li>`).join("")}</ul></section>`;
  }
  function lensExperience(l,n,tone,compact){
    return `<section class="lens-section lens-experience ${tone}" id="lens-experience" tabindex="-1"><div class="section-heading"><div class="section-index">${n} / ${compact?"BACKGROUND":"EXPERIENCE"}</div><h2>${compact?"Where the work<br>comes from.":l.experienceTitle}</h2>${compact?`<p>The professional context behind these projects.</p>`:lensCv(l)}</div>
      <div class="lens-roles">${l.experience.map((e,i)=>`<article class="lens-role reveal" style="--i:${i}"><header><span>${escapeHtml(e.period)} · ${escapeHtml(e.place)}</span><h3>${escapeHtml(e.org)}</h3><p>${escapeHtml(e.role)}</p></header><ul>${(compact?e.points.slice(0,1):e.points).map(p=>`<li>${escapeHtml(p)}</li>`).join("")}</ul></article>`).join("")}</div></section>`;
  }
  function lensProjects(l,n,tone,recruiter){
    const list=l.projects[recruiter?"recruiter":"visitor"].map(s=>bySlug[s]).filter(Boolean);
    return `<section class="lens-section selected lens-projects ${tone}" id="lens-projects" tabindex="-1"><div class="section-heading"><div class="section-index">${n} / ${recruiter?"RELEVANT WORK":"START EXPLORING"}</div><h2>${recruiter?`Selected ${escapeHtml(l.short)}<br>work.`:"Projects worth<br>opening."}</h2><a class="text-link route-link" href="/projects">All ${projects.length} projects ↗</a></div><div class="project-grid">${list.map(projectCard).join("")}</div></section>`;
  }
  function lensSkills(l,n,tone){
    return `<section class="lens-section skills lens-skills ${tone}"><div class="section-index">${n} / CAPABILITIES</div>${l.skills.map((s,i)=>`<div class="skill-row"><span>${pad(i+1)}</span><h3>${escapeHtml(s[0])}</h3><p>${escapeHtml(s[1])}</p></div>`).join("")}</section>`;
  }
  function lensBeyond(key,n,tone){
    return `<section class="lens-section lens-beyond ${tone}"><div class="section-heading"><div class="section-index">${n} / KEEP EXPLORING</div><h2>Every project stays<br><em>one click away.</em></h2><p>This view puts ${escapeHtml(lenses[key].label)} first. Nothing else is hidden.</p></div>
      <div class="beyond-grid">${lensKeys.filter(k=>k!==key).map(k=>`<button type="button" class="beyond-card" data-lens-switch="${k}"><span>Switch view</span><strong>${escapeHtml(lenses[k].label)}</strong><small>${escapeHtml(lenses[k].selector)}</small><b aria-hidden="true">→</b></button>`).join("")}<a class="beyond-card route-link" href="/projects"><span>Library</span><strong>All ${projects.length} projects</strong><small>Search and filter everything</small><b aria-hidden="true">↗</b></a><button type="button" class="beyond-card" data-lens-exit><span>Default</span><strong>Original homepage</strong><small>The complete, untailored portfolio</small><b aria-hidden="true">←</b></button></div></section>`;
  }
  function lensContact(l,n,recruiter){
    const c=l.cta[recruiter?"recruiter":"visitor"];
    return `<section class="contact lens-contact"><p class="section-index">${n} / ${recruiter?"NEXT STEP":"SAY HELLO"}</p><h2>${c.title}</h2><p>${escapeHtml(c.copy)}</p><div class="hero-actions"><a class="button primary" href="${mailto(c.subject)}">Email me <span>↗</span></a>${recruiter?lensCv(l):""}<a class="text-link" href="${LINKEDIN}" target="_blank" rel="noreferrer">LinkedIn ↗</a><a class="text-link" href="${GITHUB}" target="_blank" rel="noreferrer">GitHub ↗</a></div>${siteFooter()}</section>`;
  }
  function lensPage(key){
    const l=lenses[key], recruiter=audience()==="recruiter";
    // Each part renders with a section number and a tone; tones alternate unless fixed, starting opposite the hero.
    const part=(render,{tone,numbered=true}={})=>({render,tone,numbered});
    const deepDive = key==="data" ? part(dataVisual,{tone:"dark",numbered:false}) : key==="consulting" ? part(()=>systemSection(l),{tone:"dark",numbered:false}) : null;
    const parts = recruiter
      ? [part((n,t)=>lensEvidence(l,n,t,true)), part((n,t)=>lensExperience(l,n,t,false)), part((n,t)=>lensProjects(l,n,t,true)), part((n,t)=>lensSkills(l,n,t)), part((n,t)=>lensBeyond(key,n,t)), part(n=>lensContact(l,n,true),{tone:"dark"})]
      : [part((n,t)=>lensProjects(l,n,t,false)), deepDive, part((n,t)=>lensEvidence(l,n,t,false)), part((n,t)=>lensExperience(l,n,t,true)), part((n,t)=>lensBeyond(key,n,t)), part(n=>lensContact(l,n,false),{tone:"dark"})];
    let prev = key==="quant" ? "bone" : "dark", count = 0;
    const body = parts.filter(Boolean).map(p=>{const tone=p.tone||(prev==="bone"?"dark":"bone");prev=tone;return p.render(p.numbered?pad(++count):"",tone==="bone"?"bone":"");}).join("");
    return `<div class="lens-page lens-${key} is-${audience()}">${lensBar(key)}${lensHero(key)}${body}</div>`;
  }

  function projectsPage(){return shell(`<section class="page-hero"><p class="eyebrow"><span>LIBRARY / ${projects.length}</span> VERIFIED PROJECTS</p><h1>Complete project<br><em>index.</em></h1><p>Production applications, quantitative research and data systems—each documented from its repository, with limitations left intact.</p></section><section class="library bone"><div class="library-tools"><label class="search"><span class="sr-only">Search projects</span><input id="project-search" type="search" placeholder="Search project, technology or problem…"><b>⌕</b></label><div class="filters" role="group" aria-label="Filter projects">${Object.entries(labels).map(([k,v],i)=>`<button data-filter="${k}" class="${i===0?"active":""}" aria-pressed="${i===0}">${v}</button>`).join("")}</div><p id="results-count" aria-live="polite">${projects.length} projects</p></div><div id="library-grid" class="project-grid light-grid">${projects.map(projectCard).join("")}</div><div id="empty-state" hidden>No projects match that search.</div></section>`);}

  function caseStudy(p){
    const related=(p.related||[]).map(s=>bySlug[s]).filter(Boolean);
    return shell(`<article class="case"><header class="case-hero"><div><p class="eyebrow"><span>CASE STUDY</span> / ${p.date}</p><p class="case-status">● ${p.status}</p><h1>${p.title}</h1><p class="intro">${p.tagline}</p>${chips(p.stack)}<div class="hero-actions"><a class="button primary" href="${p.github}" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>${p.demo?`<a class="text-link" href="${p.demo}" target="_blank" rel="noreferrer">Live application ↗</a>`:""}</div></div>${p.image?`<figure class="${p.imageShape==="square"?"case-media-square":""}"><img src="${p.image}" alt="${escapeHtml(p.imageAlt||"")}" width="1200" height="720"><figcaption>GENUINE REPOSITORY ASSET / ${p.repo}</figcaption></figure>`:`<div class="case-monogram" aria-hidden="true">${p.title.split(" ").map(w=>w[0]).slice(0,3).join("")}</div>`}</header>
    <nav class="case-nav" aria-label="Case study sections"><a href="#overview">Overview</a><a href="#solution">Solution</a><a href="#architecture">Architecture</a><a href="#impact">Impact</a></nav>
    <section id="overview" class="case-section split"><div><p class="section-index">01 / OVERVIEW</p><h2>${p.summary}</h2></div><div><h3>The problem</h3><p>${p.problem}</p></div></section>
    <section id="solution" class="case-section bone"><div class="section-heading"><div class="section-index">02 / SOLUTION</div><h2>What I designed<br>& built.</h2><p>${p.solution}</p></div><div class="feature-grid">${p.features.map((f,i)=>`<div><span>0${i+1}</span><p>${f}</p></div>`).join("")}</div></section>
    <section id="architecture" class="case-section"><div class="section-heading"><div class="section-index">03 / ARCHITECTURE</div><h2>How the system<br>fits together.</h2><p>Verified from repository structure and documentation.</p></div><div class="architecture">${p.architecture.map((a,i)=>`<div><b>${String(i+1).padStart(2,"0")}</b><span>${a}</span></div>`).join("<i>→</i>")}</div><aside><span>ENGINEERING CHALLENGE</span><p>${p.challenge}</p></aside></section>
    <section id="impact" class="case-section impact bone"><p class="section-index">04 / RESULTS & IMPACT</p><blockquote>${p.impact}</blockquote><p class="accuracy">Only repository-verified results and user-confirmed production context are included. Missing business metrics are intentionally omitted.</p></section>
    <section class="related"><div class="section-heading"><div class="section-index">05 / NEXT</div><h2>Related work.</h2></div><div class="project-grid">${related.map(projectCard).join("")}</div></section></article>`);
  }

  function notFound(){return shell(`<section class="page-hero not-found"><p class="eyebrow"><span>404</span> / ROUTE NOT FOUND</p><h1>No signal<br><em>here.</em></h1><p>The page may have moved.</p><a class="button primary route-link" href="/">Return home ↗</a></section>`);}
  function setMeta(title,description,path){document.title=`${title} — Sifeddine EL KADIRI`;document.querySelector('meta[name="description"]').content=description;document.querySelector('meta[property="og:title"]').content=document.title;document.querySelector('meta[property="og:description"]').content=description;const url=`https://personal-website-xi-hazel-44.vercel.app${path}`;document.querySelector('meta[property="og:url"]').content=url;document.querySelector('link[rel="canonical"]').href=url;}
  function render({focus=false}={}){const path=cleanPath(), key=profileKey(path), lens=path==="/"&&personalization.focus;let html,title,desc;if(lens){html=lensPage(lens);title=lenses[lens].label;desc=lenses[lens].intro;}else if(path==="/"){html=home();title="Multidisciplinary Engineer";desc="Quantitative finance, data science and production software by Sifeddine EL KADIRI.";}else if(key){html=profilePage(key);title=profiles[key].label;desc=profiles[key].intro;}else if(path==="/projects"){html=projectsPage();title="Projects";desc=`Explore ${projects.length} engineering projects across finance, AI and digital transformation.`;}else if(path.startsWith("/projects/")){const p=bySlug[path.split("/")[2]];if(p){html=caseStudy(p);title=p.title;desc=p.summary;}else{html=notFound();title="Page not found";desc="The requested page was not found.";}}else{html=notFound();title="Page not found";desc="The requested page was not found.";}main.innerHTML=html;setMeta(title,desc,path);document.body.dataset.profile=key||(lens?lenses[lens].profile:"general");if(lens)document.body.dataset.lens=lens;else delete document.body.dataset.lens;document.querySelectorAll("[data-route]").forEach(a=>a.classList.toggle("active",a.dataset.route===path));changeView.hidden=false;changeView.textContent=personalization.focus?"Change view":"Tailor view";bindRouteLinks();bindReveals();bindCanvas();bindCurve();bindAnomaly();bindSystem();bindCases();bindLensControls();bindLibrary();closeMenu();window.scrollTo({top:0,behavior:"instant"});if(focus)main.focus();}
  function bindRouteLinks(){document.querySelectorAll(".route-link").forEach(a=>a.addEventListener("click",e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const u=new URL(a.href,location.origin);if(u.origin!==location.origin)return;e.preventDefault();history.pushState({},"",u.pathname);render({focus:true});}));}
  function bindReveals(){const els=document.querySelectorAll(".reveal,.skill-row,.timeline article,.feature-grid>div");if(matchMedia("(prefers-reduced-motion: reduce)").matches){els.forEach(e=>e.classList.add("visible"));return;}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target);}}),{threshold:.1});els.forEach(e=>io.observe(e));}
  function bindLibrary(){const input=document.querySelector("#project-search");if(!input)return;let filter="all";const update=()=>{const q=input.value.toLowerCase().trim();let count=0;document.querySelectorAll("#library-grid .project-card").forEach((card,i)=>{const p=projects[i],show=(filter==="all"||p.categories.includes(filter))&&(!q||[p.title,p.summary,...p.stack].join(" ").toLowerCase().includes(q));card.hidden=!show;if(show)count++;});document.querySelector("#results-count").textContent=`${count} project${count===1?"":"s"}`;document.querySelector("#empty-state").hidden=count!==0;};input.addEventListener("input",update);document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",x===b)});update();}));}
  function bindCurve(){const svg=document.querySelector("#ns-chart");if(!svg)return;const ns=(t,b0,b1,b2)=>{const x=t/2.5,a=(1-Math.exp(-x))/x;return b0+b1*a+b2*(a-Math.exp(-x));};const update=()=>{const b0=+document.querySelector("#level").value,b1=+document.querySelector("#slope").value,b2=+document.querySelector("#curve").value;const pts=Array.from({length:70},(_,i)=>{const t=.25+i*(29.75/69),y=ns(t,b0,b1,b2);return [35+i*(630/69),330-(y-1)*48,y]});const d=pts.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");svg.querySelector(".line").setAttribute("d",d);svg.querySelector(".area").setAttribute("d",`${d} L665,340 L35,340 Z`);svg.querySelector(".points").innerHTML=[0,11,23,46,69].map(i=>`<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="6"/>`).join("");document.querySelector("#ten-year").textContent=ns(10,b0,b1,b2).toFixed(2);document.querySelector("#level-out").textContent=`${b0.toFixed(1)}%`;document.querySelector("#slope-out").textContent=b1.toFixed(1);document.querySelector("#curve-out").textContent=b2.toFixed(1);};svg.querySelector(".chart-grid").innerHTML=Array.from({length:8},(_,i)=>`<line x1="35" y1="${40+i*43}" x2="665" y2="${40+i*43}"/>`).join("")+Array.from({length:8},(_,i)=>`<line x1="${35+i*90}" y1="35" x2="${35+i*90}" y2="340"/>`).join("");document.querySelectorAll(".controls input").forEach(x=>x.addEventListener("input",update));update();}
  function bindCanvas(){const c=document.querySelector("#signal-canvas");if(!c||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const ctx=c.getContext("2d");let mx=.72,my=.48,raf;const resize=()=>{const d=Math.min(devicePixelRatio,2);c.width=c.clientWidth*d;c.height=c.clientHeight*d;ctx.setTransform(d,0,0,d,0,0);};const draw=t=>{const w=c.clientWidth,h=c.clientHeight;ctx.clearRect(0,0,w,h);ctx.beginPath();for(let x=0;x<w;x+=5){const n=Math.sin(x*.011+t*.00035)*10*(1-mx),y=h*(.32+.34*x/w)+Math.sin(x*.008+my*6)*55+n;x?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle="#a8e063";ctx.globalAlpha=.72;ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=1;raf=requestAnimationFrame(draw);};resize();addEventListener("resize",resize,{passive:true});c.parentElement.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect();mx=e.clientX/r.width;my=e.clientY/r.height;});raf=requestAnimationFrame(draw);}
  function bindAnomaly(){
    const svg=document.querySelector("#anomaly-chart");if(!svg)return;
    // Deterministic synthetic series: Gaussian noise plus eight injected anomalies, so every visit shows the same picture.
    let seed=11;const rand=()=>(seed=seed*16807%2147483647)/2147483647, gauss=()=>Math.sqrt(-2*Math.log(rand()))*Math.cos(2*Math.PI*rand());
    const mid=165, unit=28, pts=Array.from({length:150},(_,i)=>({x:44+i*(580/149),z:gauss()*.9,a:false}));
    [14,38,57,71,90,104,121,139].forEach((i,j)=>{pts[i].z=(j%2?-1:1)*(3.2+rand()*1.9);pts[i].a=true;});
    svg.querySelector(".a-grid").innerHTML=[-4,-2,0,2,4].map(z=>`<line x1="44" x2="626" y1="${mid-z*unit}" y2="${mid-z*unit}"/><text x="36" y="${mid-z*unit+3}">${z>0?"+":""}${z}σ</text>`).join("");
    svg.querySelector(".a-points").innerHTML=pts.map(p=>`<circle cx="${p.x.toFixed(1)}" cy="${(mid-p.z*unit).toFixed(1)}" r="${p.a?4.6:3}"/>`).join("");
    const dots=[...svg.querySelectorAll(".a-points circle")], band=svg.querySelector(".a-band"), input=document.querySelector("#a-thr"), total=pts.filter(p=>p.a).length;
    band.setAttribute("x","44");band.setAttribute("width","582");
    const update=()=>{const t=+input.value;let queue=0,hit=0;band.setAttribute("y",mid-t*unit);band.setAttribute("height",2*t*unit);pts.forEach((p,i)=>{const flagged=Math.abs(p.z)>=t;dots[i].classList.toggle("flagged",flagged);dots[i].classList.toggle("missed",p.a&&!flagged);if(flagged){queue++;if(p.a)hit++;}});document.querySelector("#a-thr-out").textContent=`${t.toFixed(1)}σ`;document.querySelector("#a-queue").textContent=queue;document.querySelector("#a-recall").textContent=`${hit} / ${total}`;document.querySelector("#a-false").textContent=queue-hit;};
    input.addEventListener("input",update);update();
  }
  function bindSystem(){
    const inspector=document.querySelector("#system-inspector");if(!inspector)return;
    const nodes=lenses.consulting.system, buttons=document.querySelectorAll(".system-node");
    const select=b=>{if(b.getAttribute("aria-pressed")==="true")return;buttons.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));inspector.innerHTML=systemDetail(nodes.find(n=>n.id===b.dataset.node));};
    buttons.forEach(b=>{b.addEventListener("click",()=>select(b));b.addEventListener("focus",()=>select(b));b.addEventListener("pointerenter",()=>select(b));});
  }
  function bindCases(){
    const detail=document.querySelector("#case-detail");if(!detail)return;
    const tabs=document.querySelectorAll("[data-case]");
    tabs.forEach(b=>b.addEventListener("click",()=>{if(b.getAttribute("aria-pressed")==="true")return;tabs.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));detail.innerHTML=caseDetail(lenses.consulting.cases.find(c=>c.id===b.dataset.case));}));
  }
  const reduceMotion=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
  const viewStatus=document.querySelector("#view-status"), changeView=document.querySelector(".change-view");
  function announce(){const l=lenses[personalization.focus];viewStatus.textContent=l?`Showing the ${l.label} view for ${audience()==="recruiter"?"recruiters":"visitors"}.`:"Showing the complete portfolio.";}
  function setLens(change,refocus){
    Object.assign(personalization,change);
    if(personalization.focus&&cleanPath()!=="/")history.pushState({},"","/");
    render();announce();
    (refocus&&document.querySelector(refocus)||main).focus({preventScroll:true});
  }
  function bindLensControls(){
    document.querySelectorAll("[data-lens-switch]").forEach(b=>b.addEventListener("click",()=>setLens({focus:b.dataset.lensSwitch},b.closest(".lens-bar")?`.lens-bar [data-lens-switch="${b.dataset.lensSwitch}"]`:null)));
    document.querySelectorAll("[data-audience-switch]").forEach(b=>b.addEventListener("click",()=>setLens({audience:b.dataset.audienceSwitch},`.lens-bar [data-audience-switch="${b.dataset.audienceSwitch}"]`)));
    document.querySelectorAll("[data-lens-exit]").forEach(b=>b.addEventListener("click",()=>setLens({focus:null,audience:null})));
    document.querySelectorAll("[data-lens-change]").forEach(b=>b.addEventListener("click",()=>openEntry(b)));
    document.querySelectorAll("[data-jump]").forEach(a=>a.addEventListener("click",e=>{const t=document.querySelector(a.getAttribute("href"));if(!t)return;e.preventDefault();t.scrollIntoView({behavior:reduceMotion()?"auto":"smooth",block:"start"});t.focus({preventScroll:true});}));
  }
  // Arrow keys, Home and End move between buttons inside any [data-arrows] group (selector, switcher, system map).
  document.addEventListener("keydown",e=>{
    const group=e.target.closest&&e.target.closest("[data-arrows]");
    if(!group||!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))return;
    const items=[...group.querySelectorAll("button:not([disabled])")], i=items.indexOf(e.target);if(i<0)return;
    e.preventDefault();
    items[e.key==="Home"?0:e.key==="End"?items.length-1:(i+(e.key==="ArrowRight"||e.key==="ArrowDown"?1:-1)+items.length)%items.length].focus();
  });

  const entry=document.querySelector(".entry-layer"), dialog=entry.querySelector(".entry-dialog"), enterButton=entry.querySelector(".entry-enter");
  const draft={audience:null,focus:null};
  let returnFocus=null;
  entry.querySelector(".entry-step").textContent=`A portfolio in ${["one","two","three","four","five","six"][lensKeys.length-1]||lensKeys.length} directions`;
  entry.querySelector(".entry-focus").insertAdjacentHTML("beforeend",lensKeys.map((k,i)=>`<button type="button" data-focus="${k}" aria-pressed="false" style="--swatch:var(--lens-${k})"><span>${pad(i+1)}</span><strong>${escapeHtml(lenses[k].label)}</strong><small>${escapeHtml(lenses[k].selector)}</small></button>`).join(""));
  function updateEntry(){
    entry.querySelectorAll("[data-audience]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.audience===draft.audience)));
    entry.querySelectorAll("[data-focus]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.focus===draft.focus)));
    enterButton.disabled=!draft.focus;
    enterButton.innerHTML=draft.focus?`Open ${escapeHtml(lenses[draft.focus].label)} <span aria-hidden="true">↘</span>`:`Choose a discipline <span aria-hidden="true">↘</span>`;
  }
  function openEntry(trigger){Object.assign(draft,personalization);returnFocus=trigger||(document.activeElement===document.body?main:document.activeElement);entry.hidden=false;document.body.classList.add("entry-open");closeMenu();updateEntry();requestAnimationFrame(()=>{entry.classList.add("active");dialog.focus();});}
  // Applying a discipline opens its landing view; Skip, Close, the backdrop and Escape reset to the original homepage.
  function closeEntry(next){
    entry.classList.remove("active");document.body.classList.remove("entry-open");
    setTimeout(()=>{
      entry.hidden=true;
      const applied=Boolean(next.focus);
      if(applied)setLens(next);
      else{Object.assign(personalization,next);if(cleanPath()==="/")render();else changeView.textContent="Tailor view";announce();(returnFocus&&returnFocus.isConnected?returnFocus:main).focus({preventScroll:true});}
    },reduceMotion()?0:360);
  }
  const reset=()=>closeEntry({audience:null,focus:null});
  entry.querySelectorAll("[data-audience]").forEach(b=>b.addEventListener("click",()=>{draft.audience=b.dataset.audience;updateEntry();}));
  entry.querySelectorAll("[data-focus]").forEach(b=>b.addEventListener("click",()=>{draft.focus=b.dataset.focus;updateEntry();}));
  enterButton.addEventListener("click",()=>closeEntry({...draft}));
  entry.querySelectorAll(".entry-skip,.entry-close,.entry-backdrop").forEach(b=>b.addEventListener("click",reset));
  entry.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();reset();return;}if(e.key!=="Tab")return;const items=[...entry.querySelectorAll("button:not([disabled])")].filter(b=>b.tabIndex>=0);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
  changeView.addEventListener("click",e=>openEntry(e.currentTarget));
  const menu=document.querySelector(".menu-toggle");function closeMenu(){menu.setAttribute("aria-expanded","false");document.querySelector("#site-nav").classList.remove("open");}menu.addEventListener("click",()=>{const open=menu.getAttribute("aria-expanded")==="true";menu.setAttribute("aria-expanded",String(!open));document.querySelector("#site-nav").classList.toggle("open",!open);});addEventListener("popstate",()=>render());render();
  if(initialPath==="/")openEntry();
})();
