'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { portfolioStore } from '@/lib/store';
import { Project, ServiceItem, SkillCategory, Profile } from '@/lib/types';
import { INITIAL_DATA } from '@/lib/initialData';

export default function HomePage() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [data, setData] = useState(INITIAL_DATA);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTopic, setFormTopic] = useState('Yeni proje teklifi');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    // Load persisted store data on client
    setData(portfolioStore.getData());
    portfolioStore.syncFromSupabase();

    const handleDataChange = () => {
      setData(portfolioStore.getData());
    };

    window.addEventListener('portfolio:dataChanged', handleDataChange);
    return () => window.removeEventListener('portfolio:dataChanged', handleDataChange);
  }, []);

  useEffect(() => {
    if (data.seo?.siteTitle) {
      document.title = data.seo.siteTitle;
    }
  }, [data.seo]);

  const projects = data.projects.filter(p => p.status !== 'draft');
  const services = data.services;
  const skills = data.skills;
  const profile = data.profile;
  const experiences = data.experiences || INITIAL_DATA.experiences || [];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => (p.tags || []).includes(activeFilter));

  const countForTag = (tag: string) => {
    if (tag === 'all') return projects.length;
    return projects.filter(p => (p.tags || []).includes(tag)).length;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email || 'hamzakybsi@gmail.com');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2400);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          topic: formTopic,
          message: formMessage
        })
      });
      const resData = await res.json();
      if (resData.success) {
        portfolioStore.addMessage({
          name: formName,
          email: formEmail,
          topic: formTopic,
          message: formMessage
        });
        setFormSuccess(true);
        setFormName('');
        setFormEmail('');
        setFormMessage('');
        setTimeout(() => setFormSuccess(false), 4000);
      }
    } catch {
      // Fallback to client store
      portfolioStore.addMessage({
        name: formName,
        email: formEmail,
        topic: formTopic,
        message: formMessage
      });
      setFormSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormMessage('');
      setTimeout(() => setFormSuccess(false), 4000);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Service SVG icons lookup
  const serviceIcons = [
    <svg key="0" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.01M9.5 6.5h.01"/></svg>,
    <svg key="1" viewBox="0 0 24 24"><path d="M4 7h16l-1.4 10.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg>,
    <svg key="2" viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M11 18.6h2"/></svg>,
    <svg key="3" viewBox="0 0 24 24"><path d="m12 3 7 4v10l-7 4-7-4V7z"/><path d="M12 12v9M12 12 5 8M12 12l7-4"/></svg>
  ];

  // Skill SVG icons lookup
  const skillIcons = [
    <svg key="0" viewBox="0 0 24 24"><path d="M9 8 5 12l4 4M15 8l4 4-4 4M13.5 5l-3 14"/></svg>,
    <svg key="1" viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>,
    <svg key="2" viewBox="0 0 24 24"><path d="m12 3 7 4v10l-7 4-7-4V7z"/><path d="M12 12v9M12 12 5 8M12 12l7-4"/></svg>,
    <svg key="3" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="8.5" cy="12" r="1.6"/><circle cx="15.5" cy="12" r="1.6"/></svg>,
    <svg key="4" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ];

  return (
    <>
      {/* ============ HEADER ============ */}
      <header className="site-header" id="top">
        <div className="shell header-inner">
          <Link className="brand" href="#top" aria-label="Hamza Köybaşı — Ana sayfa">
            <span className="brand-mark">
              <img src="/assets/logo-icon.png" alt="Hamza Köybaşı monogram" width="36" height="36" />
            </span>
            <span className="brand-text">
              <strong>Hamza Köybaşı</strong>
              <small>Full Stack Developer</small>
            </span>
          </Link>

          <div className="status-pill" aria-label="Çalışma durumu">
            <span className="status-dot"></span>
            <span>{lang === 'en' ? 'Open to new projects' : 'Yeni projelere açık'}</span>
          </div>

          <nav className="site-nav" aria-label="Ana menü">
            <ul>
              <li><a href="#about">{lang === 'en' ? 'About' : 'Hakkımda'}</a></li>
              <li><a href="#experience">{lang === 'en' ? 'Experience' : 'Deneyim'}</a></li>
              <li><a href="#services">{lang === 'en' ? 'Services' : 'Hizmetler'}</a></li>
              <li><a href="#skills">{lang === 'en' ? 'Skills' : 'Yetenekler'}</a></li>
              <li><a href="#projects">{lang === 'en' ? 'Projects' : 'Projeler'}</a></li>
              <li><a href="#contact">{lang === 'en' ? 'Contact' : 'İletişim'}</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            <Link className="btn btn-ghost btn-sm" href="/admin" title="Admin Studio">
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Admin</span>
            </Link>

            <button
              className="lang-toggle"
              type="button"
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              aria-label="Dili değiştir"
            >
              <span className="lang-code">{lang === 'tr' ? 'EN' : 'TR'}</span>
            </button>

            <button
              className={`menu-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
              type="button"
              aria-label="Menü"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
            <nav>
              <ul>
                <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>{lang === 'en' ? 'About' : 'Hakkımda'}</a></li>
                <li><a href="#experience" onClick={() => setMobileMenuOpen(false)}>{lang === 'en' ? 'Experience' : 'Deneyim'}</a></li>
                <li><a href="#services" onClick={() => setMobileMenuOpen(false)}>{lang === 'en' ? 'Services' : 'Hizmetler'}</a></li>
                <li><a href="#skills" onClick={() => setMobileMenuOpen(false)}>{lang === 'en' ? 'Skills' : 'Yetenekler'}</a></li>
                <li><a href="#projects" onClick={() => setMobileMenuOpen(false)}>{lang === 'en' ? 'Projects' : 'Projeler'}</a></li>
                <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>{lang === 'en' ? 'Contact' : 'İletişim'}</a></li>
                <li><Link href="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Studio</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-bg-mark" aria-hidden="true">
          <img src="/assets/logo-icon.png" alt="" width="560" height="560" />
        </div>

        <div className="shell hero-shell">
          <div className="hero-content">
            <span className="hero-overline">
              <span className="mono">00</span> — {lang === 'en' ? 'Full Stack Developer & MIS Vision' : 'Full Stack Developer & YBS Vizyonu'}
            </span>

            <h1 className="hero-title">
              {lang === 'en'
                ? <>Modern web &amp; mobile solutions from <em>concept</em> to production.</>
                : <>Fikirden canlı ürüne modern web &amp; mobil <em>çözümler</em>.</>}
            </h1>

            <p className="hero-lead">
              {lang === 'en'
                ? 'Driven by a Management Information Systems vision: architecting autonomous AI platforms (SaaS/Agents), high-performance B2B portals, and modern web applications with Next.js, Node.js, and cloud ecosystems.'
                : 'Yönetim Bilişim Sistemleri vizyonuyla; Next.js, Node.js, Python ve güncel yapay zekâ / ajan mimarileriyle iş süreçlerini dijitalleştiren yüksek performanslı platformlar, B2B sistemleri ve otonom çözümler geliştiriyorum.'}
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                <span>{lang === 'en' ? 'Explore Projects' : 'Projelerimi gör'}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
              </a>

              <a
                className="btn btn-ghost"
                id="heroCvLink"
                href={profile.cvData || profile.cvPath || '/assets/Hamza-Koybasi-CV.pdf'}
                download={profile.cvFileName || 'Hamza-Koybasi-CV.pdf'}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14"/></svg>
                <span>{lang === 'en' ? 'Download CV' : "CV'yi indir"}</span>
              </a>

              <div className="hero-social">
                <a href={profile.github || 'https://github.com/hamzakyb'} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg className="brand-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.4 4.6-4.6 4.9.3.3.7 1 .7 2v2.9c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2z"/>
                  </svg>
                </a>
                <a href={profile.linkedin || 'https://linkedin.com/in/hamzakybsi'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg className="brand-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.8 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM3.3 8.6h3v12h-3zM9 8.6h2.9v1.6h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8v7.3h-3v-6.5c0-1.5 0-3.5-2.1-3.5s-2.4 1.7-2.4 3.4v6.6H9z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section" id="about">
        <div className="shell">
          <header className="section-head">
            <span className="section-index">01 — {lang === 'en' ? 'About' : 'Hakkımda'}</span>
            <h2>{lang === 'en' ? 'Management Information Systems vision, engineered execution' : 'YBS vizyonu, mühendislik disiplini'}</h2>
            <p className="section-sub">
              {lang === 'en'
                ? 'From business requirement analysis and process modeling to database design and production deployment.'
                : 'İş süreçlerinin analizinden veritabanı mimarisine, yönetim panelinden canlıya dağıtıma kadar tüm süreci tek elden yönetiyorum.'}
            </p>
          </header>

          <div className="about-grid">
            <div className="about-text">
              <p className="lead">
                {lang === 'en'
                  ? 'Driven by a Management Information Systems perspective, I am a solution-oriented Full Stack Developer who analyzes business processes and digitizes them using modern web and mobile technologies. Alongside React, Node.js, Python, and PostgreSQL, I am proficient in data analytics and process modeling.'
                  : 'Yönetim Bilişim Sistemleri vizyonuyla hareket eden; iş süreçlerini analiz edip modern web ve mobil teknolojilerle dijitalleştiren çözüm odaklı bir Full Stack Geliştiriciyim. React, Node.js, Python, PostgreSQL gibi teknolojilerin yanı sıra, veri analitiği ve süreç modelleme konularında yetkinim.'}
              </p>
              <p>
                {lang === 'en'
                  ? 'In my latest flagship project Operairo (AI-powered SaaS hotel concierge platform), I designed operational hotel workflows end-to-end into an autonomous structure, integrating AI directly into business processes via RAG and LLM tool-calling architectures.'
                  : "Son projem Operairo'da (AI destekli SaaS platformu) sadece teknik mimariyi kurmakla kalmadım; otel operasyon süreçlerini uçtan uca tasarlayarak otonom bir yapıya kavuşturdum. RAG ve LLM tool-calling mimarileriyle yapay zekayı iş süreçlerine entegre ettim."}
              </p>
              <p>
                {lang === 'en'
                  ? 'Across AI, E-Commerce, and B2B projects, I translate operational business demands into functional specs and coordinate technical flows. With a continuous learning mindset, I aim to create tangible value in digital transformation and process improvement.'
                  : 'Yapay zeka, E-Ticaret ve B2B projelerimde, iş birimlerinin operasyonel taleplerini dinleyerek fonksiyonel gereksinimlere dönüştürme ve teknik akışların koordinasyonunu sağlama konularında tecrübe edindim. Sürekli öğrenmeye açık yapımla, süreç iyileştirme ve dijital dönüşüm hedeflerine değer katmayı amaçlıyorum.'}
              </p>

              <ul className="about-points">
                <li>
                  <strong>{lang === 'en' ? 'End-to-End SaaS & AI' : 'Uçtan Uca SaaS & Yapay Zekâ'}</strong>
                  <span>{lang === 'en' ? 'RAG, LLM tool-calling, layered APIs, realtime staff feeds and cloud storage.' : 'RAG, LLM tool-calling, katmanlı API, gerçek zamanlı akışlar ve bulut depolama.'}</span>
                </li>
                <li>
                  <strong>{lang === 'en' ? 'Business Analysis & Process Modeling' : 'İş Analizi & Süreç Modelleme'}</strong>
                  <span>{lang === 'en' ? 'Capturing requirements, designing UAT scenarios, and advanced SQL data modeling.' : 'Müşteri gereksinimleri, test senaryoları/UAT ve ileri düzey SQL veri modelleme.'}</span>
                </li>
                <li>
                  <strong>{lang === 'en' ? 'UI Systems & Frontend Engineering' : 'UI Sistemleri & Tasarım Mühendisliği'}</strong>
                  <span>{lang === 'en' ? 'Modular CMS panels, reusable design tokens and SEO-first high-speed rendering.' : 'Modüler CMS panelleri, yeniden kullanılabilir bileşen sistemleri ve SEO render mimarisi.'}</span>
                </li>
              </ul>
            </div>

            <div className="about-side">
              <div className="card info-card">
                <h3>{lang === 'en' ? 'Currently' : 'Şu anda'}</h3>
                <ul className="info-list">
                  <li><span>{lang === 'en' ? 'Location' : 'Konum'}</span><b>{profile.locationTr || 'Nevşehir / Merkez, Türkiye'}</b></li>
                  <li><span>{lang === 'en' ? 'Availability' : 'Çalışma şekli'}</span><b>{profile.availabilityTr || 'Tam zamanlı / Uzaktan'}</b></li>
                  <li><span>{lang === 'en' ? 'Focus' : 'Odak'}</span><b>AI (SaaS/Ajanlar) · Next.js · YBS</b></li>
                  <li><span>{lang === 'en' ? 'Languages' : 'Dil'}</span><b>{profile.languagesTr || 'Türkçe (Ana dil) · İngilizce (B1)'}</b></li>
                </ul>
                <a className="btn btn-ghost btn-block" href="#contact">
                  <span>{lang === 'en' ? 'Get in touch' : 'İletişime geç'}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
                </a>
              </div>

              <div className="card edu-card">
                <h3>{lang === 'en' ? 'Education' : 'Eğitim'}</h3>
                <ul className="edu-list">
                  <li>
                    <span className="edu-year">2021 — 2025</span>
                    <b>İskenderun Teknik Üniversitesi</b>
                    <em>Yönetim Bilişim Sistemleri (Lisans)</em>
                  </li>
                  <li>
                    <span className="edu-year">2018 — 2021</span>
                    <b>Nevşehir Hacı Bektaş Veli Üniversitesi</b>
                    <em>Alternatif Enerji Kaynakları Teknolojisi</em>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCE ============ */}
      <section className="section section-alt" id="experience">
        <div className="shell">
          <header className="section-head">
            <span className="section-index">02 — {lang === 'en' ? 'Experience' : 'İş Deneyimi'}</span>
            <h2>{lang === 'en' ? 'Work Experience & Roles' : 'İş Deneyimi & Kurumsal Roller'}</h2>
            <p className="section-sub">
              {lang === 'en'
                ? 'Frontend engineering, business process modeling and high-impact CMS platforms.'
                : 'Tasarım mühendisliğinden iş analizine ve modüler CMS mimarilerine uzanan kurumsal roller.'}
            </p>
          </header>

          <div className="experience-list">
            {experiences.map((exp, idx) => {
              const d = (lang === 'en' && exp.en) ? exp.en : exp.tr;
              return (
                <article className="experience-card" key={exp.id || idx}>
                  <div className="experience-header">
                    <div className="experience-company-wrap">
                      <span className="experience-company">{exp.company}</span>
                      {exp.badge && <span className="experience-badge">{exp.badge}</span>}
                    </div>
                    <span className="experience-period">{exp.period}</span>
                  </div>

                  <div className="experience-role">
                    {lang === 'en' ? (exp.roleEn || 'Full Stack Developer') : (exp.roleTr || 'Full Stack Yazılım Geliştirici')}
                  </div>

                  <p className="experience-lead">{d.lead}</p>

                  {d.points && d.points.length > 0 && (
                    <ul className="experience-points">
                      {d.points.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  )}

                  {d.tech && (
                    <div className="experience-tech">
                      <span>{lang === 'en' ? 'Technologies & Scope:' : 'Teknolojiler & Kapsam:'}</span>
                      <strong>{d.tech}</strong>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="section" id="services">
        <div className="shell">
          <header className="section-head">
            <span className="section-index">03 — {lang === 'en' ? 'Services' : 'Hizmetler'}</span>
            <h2>{lang === 'en' ? 'What I deliver' : 'Ne yapıyorum?'}</h2>
            <p className="section-sub">
              {lang === 'en'
                ? 'End-to-end expertise across AI SaaS, business analysis, modern web and commerce.'
                : 'Fikirden yayına, tek elden teslim edilen yapay zeka, iş analizi ve web çözümleri.'}
            </p>
          </header>

          <div className="services" id="servicesGrid">
            {services.map((srv, idx) => {
              const d = (lang === 'en' && srv.en && srv.en.title) ? srv.en : srv.tr;
              const icon = serviceIcons[idx % serviceIcons.length];
              return (
                <article className="service is-visible" key={srv.id || idx}>
                  <span className="service-no">{srv.number}</span>
                  <div className="service-icon" aria-hidden="true">{icon}</div>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                  {d.items && d.items.length > 0 && (
                    <ul className="service-list">
                      {d.items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SKILLS ============ */}
      <section className="section" id="skills">
        <div className="shell">
          <header className="section-head">
            <span className="section-index">04 — {lang === 'en' ? 'Skills' : 'Yetenekler'}</span>
            <h2>{lang === 'en' ? 'Technologies & Stack' : 'Kullandığım teknolojiler'}</h2>
            <p className="section-sub">
              {lang === 'en' ? 'Tools, frameworks and libraries in my daily workflow.' : 'Günlük olarak çalıştığım araçlar, kütüphaneler ve altyapılar.'}
            </p>
          </header>

          <div className="skills-grid" id="skillsGrid">
            {skills.map((cat, idx) => {
              const d = (lang === 'en' && cat.en && cat.en.title) ? cat.en : cat.tr;
              const icon = skillIcons[idx % skillIcons.length];
              return (
                <article className="card skill-card is-visible" key={cat.id || idx}>
                  <div className="skill-icon" aria-hidden="true">{icon}</div>
                  <h3>{d.title}</h3>
                  {d.desc && <p>{d.desc}</p>}
                  <ul className="chips">
                    {cat.chips.map((chip, i) => <li key={i}>{chip}</li>)}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ PROJECTS ============ */}
      <section className="section section-alt" id="projects">
        <div className="shell">
          <header className="section-head">
            <span className="section-index">05 — {lang === 'en' ? 'Projects' : 'Projeler'}</span>
            <h2>{lang === 'en' ? 'Selected Works' : 'Seçilmiş işler'}</h2>
            <p className="section-sub">
              {lang === 'en'
                ? 'Production SaaS systems, AI agents, enterprise web portals and mobile experiences.'
                : 'Canlıda çalışan SaaS platformları, AI ajanları, kurumsal web sistemleri ve mobil deneyimler.'}
            </p>
          </header>

          <div className="filters" role="tablist">
            {[
              { id: 'all', tr: 'Tümü', en: 'All' },
              { id: 'ai', tr: 'Yapay Zekâ & Ajanlar', en: 'AI & Agents' },
              { id: 'ecommerce', tr: 'E-Ticaret & B2B', en: 'E-Commerce & B2B' },
              { id: 'web', tr: 'Web & CMS', en: 'Web & CMS' },
              { id: 'ar', tr: 'AR & Mobil', en: 'AR & Mobile' },
              { id: 'web3', tr: 'Web3', en: 'Web3' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`filter ${activeFilter === tab.id ? 'is-active' : ''}`}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
              >
                <span>{lang === 'en' ? tab.en : tab.tr}</span>
                <i>{countForTag(tab.id)}</i>
              </button>
            ))}
          </div>

          <div className="projects-grid" id="projectsGrid">
            {filteredProjects.map(proj => {
              const d = (lang === 'en' && proj.en && proj.en.title) ? proj.en : proj.tr;
              const liveLink = proj.links?.[0]?.href;
              const numStr = proj.order < 10 ? '0' + proj.order : String(proj.order);

              return (
                <article
                  key={proj.id}
                  className={`project is-visible ${proj.featured ? 'featured' : ''}`}
                  data-id={proj.id}
                >
                  <button
                    className={`project-media ${!proj.media?.startsWith('http') && !proj.media?.startsWith('data:') ? (proj.media || 'm1') : ''}`}
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    aria-label={`${d.title} detay`}
                    style={
                      proj.media && (proj.media.startsWith('http') || proj.media.startsWith('data:') || proj.media.startsWith('/'))
                        ? { backgroundImage: `url(${proj.media})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : undefined
                    }
                  >
                    {(!proj.media || (!proj.media.startsWith('http') && !proj.media.startsWith('data:') && !proj.media.startsWith('/'))) && (
                      <span className="media-fallback">
                        <span className="browser">
                          <span className="browser-bar">
                            <i></i><i></i><i></i>
                            <small>{liveLink ? liveLink.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'hamzakoybasi.com'}</small>
                          </span>
                          <span className="browser-body">
                            <span className="mono-mark">{proj.mark || 'HK'}</span>
                          </span>
                        </span>
                      </span>
                    )}
                    <span className="media-hover">
                      <span>{lang === 'en' ? 'View details' : 'Detayları gör'}</span>
                    </span>
                  </button>

                  <div className="project-body">
                    <div className="project-top">
                      <span className="project-no">{numStr}</span>
                      {d.badge && (
                        <span className="badge badge-live">
                          <i></i><span>{d.badge}</span>
                        </span>
                      )}
                    </div>

                    <h3>{d.title} <span className="project-kind">— {d.kind}</span></h3>
                    <p>{d.lead || d.summary}</p>

                    <ul className="chips sm">
                      {(proj.chips || []).map((chip, idx) => <li key={idx}>{chip}</li>)}
                    </ul>

                    {proj.credentials && (
                      <div className="project-creds-preview">
                        <span className="project-creds-title">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          <span>{lang === 'en' ? 'Demo Access' : 'Demo Erişimi'}</span>
                        </span>
                        <div className="project-creds-info">
                          {proj.credentials.username && <span>{lang === 'en' ? 'User:' : 'Kullanıcı:'} <code>{proj.credentials.username}</code></span>}
                          {proj.credentials.password && <span>{lang === 'en' ? 'Pass:' : 'Şifre:'} <code>{proj.credentials.password}</code></span>}
                          {proj.credentials.pin && <span>PIN: <code>{proj.credentials.pin}</code></span>}
                        </div>
                      </div>
                    )}

                    <div className="project-links">
                      <button
                        className="link-btn"
                        type="button"
                        onClick={() => setSelectedProject(proj)}
                      >
                        <span>{lang === 'en' ? 'View details' : 'Detayları gör'}</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
                      </button>

                      {liveLink && (
                        <a href={liveLink} target="_blank" rel="noopener noreferrer">
                          <span>{lang === 'en' ? 'Live site' : 'Canlı site'}</span>
                          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="section" id="contact">
        <div className="shell">
          <header className="section-head">
            <span className="section-index">06 — {lang === 'en' ? 'Contact' : 'İletişim'}</span>
            <h2>{lang === 'en' ? 'Let’s work together' : 'Birlikte çalışalım'}</h2>
            <p className="section-sub">
              {lang === 'en'
                ? 'Have a new project or an inquiry? Reach out anytime.'
                : 'Yeni bir proje fikriniz, iş birliği teklifiniz veya sorularınız için aşağıdaki formu doldurabilir ya da doğrudan e-posta atabilirsiniz.'}
            </p>
          </header>

          <div className="contact-card">
            <div className="contact-info">
              <div className="contact-direct">
                <span className="contact-label">{lang === 'en' ? 'DIRECT EMAIL' : 'DOĞRUDAN E-POSTA'}</span>
                <a className="contact-mail" href={`mailto:${profile.email || 'hamzakybsi@gmail.com'}`}>
                  {profile.email || 'hamzakybsi@gmail.com'}
                </a>
              </div>

              <div className="contact-actions">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleCopyEmail}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  <span>{copySuccess ? (lang === 'en' ? 'Copied!' : 'Kopyalandı!') : (lang === 'en' ? 'Copy email address' : 'E-postayı kopyala')}</span>
                </button>

                <a
                  className="btn btn-ghost"
                  href={profile.cvData || profile.cvPath || '/assets/Hamza-Koybasi-CV.pdf'}
                  download={profile.cvFileName || 'Hamza-Koybasi-CV.pdf'}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14"/>
                  </svg>
                  <span>{lang === 'en' ? 'Download CV (PDF)' : "CV'yi İndir (PDF)"}</span>
                </a>
              </div>

              <div className="contact-meta">
                <div>
                  <span>{lang === 'en' ? 'RESPONSE TIME' : 'YANIT SÜRESİ'}</span>
                  <strong>{lang === 'en' ? 'Within 24 hours' : '24 saat içinde'}</strong>
                </div>
                <div>
                  <span>{lang === 'en' ? 'TIMEZONE' : 'ZAMAN DİLİMİ'}</span>
                  <strong>UTC+3 (TR)</strong>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleFormSubmit}>
              {formSuccess && (
                <div style={{ padding: '14px 18px', background: 'var(--ok-dim)', color: 'var(--ok)', borderRadius: 8, fontSize: 14 }}>
                  {lang === 'en'
                    ? 'Thank you! Your message has been received. I will reply shortly.'
                    : 'Mesajınız başarıyla iletildi! En kısa sürede geri dönüş yapacağım.'}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  {lang === 'en' ? 'Your Name' : 'Adınız Soyadınız'} *
                </label>
                <input
                  className="input-text"
                  type="text"
                  id="name"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder={lang === 'en' ? 'Jane Doe' : 'Ahmet Yılmaz'}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  {lang === 'en' ? 'Your Email' : 'E-posta Adresiniz'} *
                </label>
                <input
                  className="input-text"
                  type="email"
                  id="email"
                  required
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="ornek@sirket.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="topic">
                  {lang === 'en' ? 'Subject' : 'Konu'}
                </label>
                <select
                  className="select-input"
                  id="topic"
                  value={formTopic}
                  onChange={e => setFormTopic(e.target.value)}
                >
                  <option value="Yeni proje teklifi">{lang === 'en' ? 'New Project Proposal' : 'Yeni proje teklifi'}</option>
                  <option value="İş / Danışmanlık">{lang === 'en' ? 'Full-time / Consulting' : 'İş / Danışmanlık'}</option>
                  <option value="Diğer">{lang === 'en' ? 'Other' : 'Diğer'}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  {lang === 'en' ? 'Your Message' : 'Mesajınız'} *
                </label>
                <textarea
                  className="textarea-input"
                  id="message"
                  rows={4}
                  required
                  value={formMessage}
                  onChange={e => setFormMessage(e.target.value)}
                  placeholder={lang === 'en' ? 'Briefly describe your project or questions...' : 'Projenizi, bütçenizi veya sorularınızı kısaca özetleyin...'}
                />
              </div>

              <button className="btn btn-primary btn-lg" type="submit" disabled={formSubmitting}>
                <span>{formSubmitting ? 'Gönderiliyor...' : (lang === 'en' ? 'Send Message' : 'Mesajı Gönder')}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <div className="shell footer-inner">
          <div className="footer-brand">
            <span className="brand-mark">
              <img src="/assets/logo-icon.png" alt="Hamza Köybaşı" width="32" height="32" />
            </span>
            <span>Hamza Köybaşı &copy; {new Date().getFullYear()}</span>
          </div>

          <div className="footer-links">
            <a href="#top">
              <span>{lang === 'en' ? 'Back to top' : 'Başa dön'}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* ============ PROJECT DETAIL MODAL ============ */}
      {selectedProject && (
        <div className="project-modal is-open" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setSelectedProject(null)}></div>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="Kapat"
            >
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {selectedProject.media && (selectedProject.media.startsWith('http') || selectedProject.media.startsWith('data:') || selectedProject.media.startsWith('/')) && (
              <div style={{ width: '100%', height: 210, borderRadius: 12, overflow: 'hidden', marginBottom: 20, border: '1px solid var(--line)' }}>
                <img src={selectedProject.media} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <span className="modal-kind">
              {(lang === 'en' && selectedProject.en?.kind) ? selectedProject.en.kind : selectedProject.tr.kind}
            </span>
            <h3>
              {(lang === 'en' && selectedProject.en?.title) ? selectedProject.en.title : selectedProject.tr.title}
            </h3>
            <p>
              {(lang === 'en' && selectedProject.en?.summary) ? selectedProject.en.summary : selectedProject.tr.summary}
            </p>

            <h4>{lang === 'en' ? 'Key Highlights' : 'Öne çıkan özellikler'}</h4>
            <ul className="modal-features">
              {((lang === 'en' && selectedProject.en?.features) ? selectedProject.en.features : selectedProject.tr.features).map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>

            {selectedProject.credentials && (
              <div className="project-creds-preview" style={{ margin: '20px 0', padding: '14px 18px', background: 'var(--bg-alt)', borderRadius: 10 }}>
                <div className="project-creds-title" style={{ marginBottom: 8, color: 'var(--accent)' }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>{lang === 'en' ? 'Demo Access Credentials' : 'Demo Giriş Bilgileri'}</span>
                </div>
                <div className="project-creds-info" style={{ display: 'grid', gap: 6, fontSize: 13 }}>
                  {selectedProject.credentials.username && (
                    <div><span>{lang === 'en' ? 'Username / Email:' : 'Kullanıcı Adı / E-posta:'}</span> <code>{selectedProject.credentials.username}</code></div>
                  )}
                  {selectedProject.credentials.password && (
                    <div><span>{lang === 'en' ? 'Password:' : 'Şifre:'}</span> <code>{selectedProject.credentials.password}</code></div>
                  )}
                  {selectedProject.credentials.pin && (
                    <div><span>PIN:</span> <code>{selectedProject.credentials.pin}</code></div>
                  )}
                  {(selectedProject.credentials.noteTr || selectedProject.credentials.noteEn) && (
                    <small style={{ color: 'var(--muted)', marginTop: 4 }}>
                      {lang === 'en' ? selectedProject.credentials.noteEn : selectedProject.credentials.noteTr}
                    </small>
                  )}
                </div>
              </div>
            )}

            <div className="modal-meta">
              <div>
                <span>{lang === 'en' ? 'Role' : 'Rolüm'}</span>
                <b>{(lang === 'en' && selectedProject.en?.role) ? selectedProject.en.role : selectedProject.tr.role}</b>
              </div>
              <div>
                <span>{lang === 'en' ? 'Technologies' : 'Teknolojiler'}</span>
                <b>{(lang === 'en' && selectedProject.en?.stack) ? selectedProject.en.stack : selectedProject.tr.stack}</b>
              </div>
            </div>

            <div className="modal-links">
              {selectedProject.links && selectedProject.links.map((link, idx) => (
                <a
                  key={idx}
                  className="btn btn-primary btn-sm"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{lang === 'en' ? (link.en || 'Visit link') : (link.tr || 'Bağlantıyı aç')}</span>
                  <svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
