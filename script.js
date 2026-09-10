/* =========================================================
   Hamza Köybaşı — Portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  /* ---------------------------------------------------------
     1) English dictionary (Turkish lives in the HTML)
     --------------------------------------------------------- */
  var EN = {
    'a11y.skip': 'Skip to content',
    'brand.role': 'Full Stack Developer',

    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.process': 'Process',
    'nav.contact': 'Contact',
    'nav.hire': "Let's work together",

    'hero.title1': 'I turn ideas',
    'hero.title2': 'working',
    'hero.title3': 'into',
    'hero.title4': 'products.',
    'hero.lead': "I'm Hamza Köybaşı, a full stack developer building modern web and mobile applications — from e-commerce and B2B systems to AI, augmented reality and Web3 products, end to end.",
    'hero.cta1': 'View my work',
    'hero.cta2': 'Download CV',
    'hero.stat1': 'Projects built',
    'hero.stat2': 'Products live today',
    'hero.stat3': 'Areas of expertise',

    'about.h': 'I think about design while writing code, and about people while designing.',
    'about.p1': 'As a full stack developer I build modern web and mobile applications. I work with React, Next.js, Node.js, Nest.js, React Native, PostgreSQL, MongoDB, Supabase, PHP and Python.',
    'about.p2': 'I have shipped projects across very different domains: artificial intelligence, augmented reality, e-commerce and B2B systems. I enjoy owning not just the backend, but the interface the user sees, the admin panel and the whole flow behind it.',
    'about.p3': 'I have experience in both software development and user interface design. I work well in a team, keep learning and stay solution-oriented.',
    'about.pt1t': 'End-to-end products',
    'about.pt1d': 'Interface, API, database and admin panel — from a single hand.',
    'about.pt2t': 'Manageable systems',
    'about.pt2d': 'Panels that let the client control content and flow without writing code.',
    'about.pt3t': 'Design sensibility',
    'about.pt3d': 'Measured typography, clear hierarchy and mobile-first interfaces.',
    'about.now': 'Right now',
    'about.now1': 'Location',
    'about.now2': 'Availability',
    'about.now2v': 'Full-time / Remote',
    'about.now3': 'Focus',
    'about.now4': 'Languages',
    'about.now4v': 'Turkish · English (B2)',
    'about.cta': 'Get in touch',

    'edu.h': 'Education',
    'edu.1t': 'İskenderun Technical University',
    'edu.1d': 'Management Information Systems',
    'edu.2t': 'Nevşehir Hacı Bektaş Veli University',
    'edu.2d': 'Alternative Energy Sources Technology',

    'srv.h': 'What I do',
    'srv.sub': 'Three core areas, delivered end to end — from idea to launch.',
    'srv.1t': 'Web Applications',
    'srv.1d': 'Corporate sites, admin panels and custom business tools. Fast, SEO-friendly and manageable by the client.',
    'srv.1a': 'Next.js / React interface',
    'srv.1b': 'Admin panel &amp; content management',
    'srv.1c': 'Performance &amp; SEO setup',
    'srv.2t': 'E-Commerce &amp; B2B',
    'srv.2d': 'Product catalogue, order flow, dealer and pricing management — built on experience from systems running in production.',
    'srv.2a': 'Stock &amp; order management',
    'srv.2b': 'Bulk data operations via Excel',
    'srv.2c': 'Dealer-based pricing',
    'srv.3t': 'Mobile, AI &amp; AR',
    'srv.3d': 'Mobile apps with React Native, natural language processing models and augmented reality experiences with Unity/Vuforia.',
    'srv.3a': 'React Native application',
    'srv.3b': 'NLP model &amp; live demo',
    'srv.3c': 'Product presentation in AR',

    'skills.h': 'Technologies I use',
    'skills.sub': 'The tools and libraries I work with every day.',
    'skills.c1': 'Frontend',
    'skills.c1d': 'Fast, accessible and mobile-first interfaces.',
    'skills.c2': 'Backend &amp; API',
    'skills.c2d': 'Scalable services, database design and integrations.',
    'skills.c3': 'Web3 &amp; Blockchain',
    'skills.c3d': 'Smart contracts and dApps with wallet integration.',
    'skills.c4': 'AI · AR / VR',
    'skills.c4d': 'NLP models and real-time augmented reality applications.',

    'proj.h': 'Selected work',
    'proj.sub': 'Platforms running in production, AI models and experimental work.',
    'proj.f1': 'All',
    'proj.f2': 'Web',
    'proj.f3': 'E-Commerce &amp; B2B',
    'proj.f4': 'Artificial Intelligence',
    'proj.f5': 'AR / Mobile',
    'proj.f6': 'Web3',
    'proj.live': 'In active use',
    'proj.detail': 'View details',
    'proj.visit': 'Live site',
    'proj.demo': 'Live demo',
    'proj.video': 'Video',
    'proj.code': 'GitHub',
    'proj.corp': '— Corporate Website',
    'proj.p1k': '— B2B &amp; E-Commerce Platform',
    'proj.p1d': 'A management platform that merges e-commerce and B2B for filter manufacturers. Stock management, bulk product import via Excel, bulk price and stock updates, product control, customer orders and pricing are all handled from one panel.',
    'proj.p2k': '— E-Commerce Platform',
    'proj.p2d': 'An end-to-end e-commerce platform built with Next.js, with product catalogue, order flow and an admin panel.',
    'proj.p3b': 'Artificial Intelligence',
    'proj.p3t': 'Drug Side-Effect Prediction System',
    'proj.p3d': 'A natural language processing model fine-tuned with BERTurk that predicts possible side effects from the drug name a user types. Live demo published on Hugging Face Spaces.',
    'proj.p4b': 'Mobile · AR',
    'proj.p4t': 'AR Engine Information System',
    'proj.p4d': 'I integrated augmented reality interactions with a real car engine model. When a part on the physical engine is scanned, the related information (text and video) is shown to the user.',
    'proj.p5t': 'Web3 City Voting System',
    'proj.p5d': 'A blockchain-based voting application: transparent, immutable voting through a smart contract with MetaMask wallet connection.',
    'proj.p6b': 'Customizable Website',
    'proj.p6d': 'A hotel website where the design and content of every component can be changed from the admin panel. Page blocks can be rearranged without writing code.',
    'proj.p7d': 'Corporate website with content and page layout managed through an admin panel.',
    'proj.p8d': 'A project and reference showcase for a construction company, with content editable from the admin panel.',
    'proj.p9d': 'Corporate identity and presentation site for software services.',

    'prc.h': 'How I work',
    'prc.sub': 'No surprises: step by step, with visible progress at every stage.',
    'prc.1t': 'Discovery',
    'prc.1d': 'We clarify the need, the user and the scope — including what is not required.',
    'prc.2t': 'Design',
    'prc.2d': 'Flows and interface drafts come first. I do not start coding before the design is approved.',
    'prc.3t': 'Development',
    'prc.3d': 'Delivered piece by piece; you see a working version at every step.',
    'prc.4t': 'Launch &amp; Support',
    'prc.4d': 'Deployment, domain, performance and SEO checks — plus update support after launch.',

    'contact.h': "Let's build the next one together.",
    'contact.sub': 'A new product, a refresh of your existing system, or just an idea — write to me and let’s talk. I usually reply the same day.',
    'contact.mail': 'E-mail',
    'contact.phone': 'Phone',
    'contact.copy': 'Copy e-mail',

    'form.name': 'Full name',
    'form.mail': 'E-mail',
    'form.topic': 'Subject',
    'form.topic1': 'New project',
    'form.topic2': 'Job opportunity',
    'form.topic3': 'Rebuilding an existing system',
    'form.topic4': 'Other',
    'form.msg': 'Message',
    'form.send': 'Send message',
    'form.note': 'Pressing send opens your e-mail app with the message ready.',

    'modal.features': 'Highlights',
    'modal.role': 'My role',
    'modal.stack': 'Technologies',

    'footer.note': 'Designed and coded by me'
  };

  var UI = {
    tr: {
      copyIdle: 'E-postayı kopyala', copyDone: 'Kopyalandı ✓',
      formError: 'Lütfen zorunlu alanları doldurun.',
      formSent: 'E-posta uygulamanız açılıyor…'
    },
    en: {
      copyIdle: 'Copy e-mail', copyDone: 'Copied ✓',
      formError: 'Please fill in the required fields.',
      formSent: 'Opening your e-mail app…'
    }
  };

  /* ---------------------------------------------------------
     2) Project details (modal)
     --------------------------------------------------------- */
  var PROJECTS = {
    step: {
      mark: 'SF', media: 'm1',
      tr: {
        kind: 'B2B & E-Ticaret Platformu · Aktif kullanılıyor',
        title: 'Step Filtre',
        summary: 'Filtre üreticileri için e-ticaret ve B2B sistemini tek çatı altında birleştiren yönetim platformu. Bayi ve son kullanıcı akışları aynı altyapı üzerinde çalışıyor.',
        features: [
          'Stok yönetimi ve ürün kontrolü tek panelden',
          'Excel ile toplu ürün ekleme',
          'Toplu fiyat ve stok değişimi',
          'Müşteri siparişlerinin takibi',
          'Fiyatlandırma işlemlerinin yönetimi'
        ],
        role: 'Tasarım ve geliştirme (uçtan uca)',
        stack: 'React · Node.js · MongoDB'
      },
      en: {
        kind: 'B2B & E-Commerce Platform · In active use',
        title: 'Step Filtre',
        summary: 'A management platform that merges e-commerce and B2B for filter manufacturers. Dealer and end-user flows run on the same infrastructure.',
        features: [
          'Stock management and product control in one panel',
          'Bulk product import via Excel',
          'Bulk price and stock updates',
          'Customer order tracking',
          'Pricing management'
        ],
        role: 'Design and development (end to end)',
        stack: 'React · Node.js · MongoDB'
      },
      links: [{ tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.stepfiltre.com.tr/' }]
    },

    barkone: {
      mark: 'BK', media: 'm2',
      tr: {
        kind: 'E-Ticaret Platformu · Aktif kullanılıyor',
        title: 'Barkone',
        summary: 'Next.js ile geliştirilen, uçtan uca çalışan e-ticaret platformu.',
        features: [
          'Ürün kataloğu ve kategori yapısı',
          'Sipariş akışı',
          'Yönetim paneli üzerinden içerik ve ürün yönetimi',
          'Next.js ile hızlı sayfa yükleme ve SEO uyumu'
        ],
        role: 'Tasarım ve geliştirme',
        stack: 'Next.js · React · Node.js'
      },
      en: {
        kind: 'E-Commerce Platform · In active use',
        title: 'Barkone',
        summary: 'An end-to-end e-commerce platform built with Next.js.',
        features: [
          'Product catalogue and category structure',
          'Order flow',
          'Content and product management through the admin panel',
          'Fast page loads and SEO with Next.js'
        ],
        role: 'Design and development',
        stack: 'Next.js · React · Node.js'
      },
      links: [{ tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.barkone.com.tr' }]
    },

    ilac: {
      mark: 'AI', media: 'm3',
      tr: {
        kind: 'Yapay Zekâ · Doğal Dil İşleme',
        title: 'İlaç Yan Etki Tahmin Sistemi',
        summary: 'Kullanıcının yazdığı ilaç adına göre olası yan etkileri tahmin eden model. BERTurk ile eğitildi, canlı demo Hugging Face Spaces üzerinde yayında.',
        features: [
          'BERTurk tabanlı Türkçe dil modeli',
          'İlaç adından yan etki tahmini',
          'Hugging Face Spaces üzerinde herkese açık demo',
          'Basit ve tek alanlı kullanıcı arayüzü'
        ],
        role: 'Model eğitimi ve arayüz',
        stack: 'Python · BERTurk · Transformers · Hugging Face'
      },
      en: {
        kind: 'Artificial Intelligence · NLP',
        title: 'Drug Side-Effect Prediction System',
        summary: 'A model that predicts possible side effects from the drug name a user types. Fine-tuned with BERTurk, with a live demo on Hugging Face Spaces.',
        features: [
          'Turkish language model based on BERTurk',
          'Side-effect prediction from a drug name',
          'Public demo on Hugging Face Spaces',
          'Simple single-input user interface'
        ],
        role: 'Model training and interface',
        stack: 'Python · BERTurk · Transformers · Hugging Face'
      },
      links: [{ tr: 'Canlı demoyu dene', en: 'Try the live demo', href: 'https://huggingface.co/spaces/Hamzakoybasi/ilac-yanetki-tahmin' }]
    },

    ar: {
      mark: 'AR', media: 'm4',
      tr: {
        kind: 'Mobil · Artırılmış Gerçeklik',
        title: 'AR Motor Bilgilendirme Sistemi',
        summary: 'Gerçek bir otomobil motoru modeline artırılmış gerçeklik etkileşimleri entegre ettiğim mobil uygulama.',
        features: [
          'Fiziksel motor parçalarının kamera ile tanınması',
          'Taranan parçaya ait metin ve video içeriği',
          'Unity ve Vuforia ile gerçek zamanlı takip',
          'Eğitim ve tanıtım amaçlı kullanım'
        ],
        role: 'Uygulama geliştirme ve AR entegrasyonu',
        stack: 'Unity · Vuforia · C# · Android'
      },
      en: {
        kind: 'Mobile · Augmented Reality',
        title: 'AR Engine Information System',
        summary: 'A mobile app in which I integrated augmented reality interactions with a real car engine model.',
        features: [
          'Recognition of physical engine parts through the camera',
          'Text and video content for the scanned part',
          'Real-time tracking with Unity and Vuforia',
          'Built for training and product presentation'
        ],
        role: 'App development and AR integration',
        stack: 'Unity · Vuforia · C# · Android'
      },
      links: [{ tr: 'Uygulama videosunu izle', en: 'Watch the app video', href: 'https://bit.ly/ArtirilmisGerceklikVideosu' }]
    },

    dapp: {
      mark: 'W3', media: 'm5',
      tr: {
        kind: 'Web3 · dApp',
        title: 'Web3 Şehir Oylama Sistemi',
        summary: 'Blokzincir üzerinde çalışan, şeffaf ve değiştirilemez bir oylama uygulaması.',
        features: [
          'Solidity ile yazılmış akıllı sözleşme',
          'MetaMask ile cüzdan bağlantısı',
          'Zincire yazılan, değiştirilemez oy kayıtları',
          'React arayüzü üzerinden oy kullanımı'
        ],
        role: 'Akıllı sözleşme ve arayüz',
        stack: 'Solidity · Ethers.js · MetaMask · React'
      },
      en: {
        kind: 'Web3 · dApp',
        title: 'Web3 City Voting System',
        summary: 'A transparent, immutable voting application running on the blockchain.',
        features: [
          'Smart contract written in Solidity',
          'Wallet connection through MetaMask',
          'Immutable vote records written on chain',
          'Voting through a React interface'
        ],
        role: 'Smart contract and interface',
        stack: 'Solidity · Ethers.js · MetaMask · React'
      },
      links: [{ tr: "GitHub'da incele", en: 'View on GitHub', href: 'https://github.com/hamzakyb/dApp_Oylama' }]
    },

    asra: {
      mark: 'AC', media: 'm6',
      tr: {
        kind: 'Özelleştirilebilir Web Sitesi',
        title: 'Asra Cave Hotel',
        summary: 'Her bir bileşenin tasarımının ve içeriğinin admin panelinden değiştirilebildiği otel web sitesi.',
        features: [
          'Bileşen bazlı tasarım değişikliği',
          'Sayfa bloklarının kod yazmadan yeniden düzenlenmesi',
          'İçeriğin admin panelinden yönetimi',
          'Vercel üzerinde yayında'
        ],
        role: 'Tasarım ve geliştirme',
        stack: 'Next.js · CMS · Vercel'
      },
      en: {
        kind: 'Customizable Website',
        title: 'Asra Cave Hotel',
        summary: 'A hotel website where the design and content of every component can be changed from the admin panel.',
        features: [
          'Component-level design changes',
          'Rearranging page blocks without writing code',
          'Content managed from the admin panel',
          'Deployed on Vercel'
        ],
        role: 'Design and development',
        stack: 'Next.js · CMS · Vercel'
      },
      links: [{ tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://asracavehotel.vercel.app/' }]
    },

    uren: {
      mark: 'ÜG', media: 'm7',
      tr: {
        kind: 'Kurumsal Web Sitesi · Aktif kullanılıyor',
        title: 'Üren Global',
        summary: 'Kurumsal tanıtım sitesi; içerik ve sayfa düzeni yönetim paneli üzerinden güncelleniyor.',
        features: [
          'Kurumsal tanıtım ve hizmet sayfaları',
          'Admin panelinden içerik güncelleme',
          'Mobil öncelikli responsive tasarım'
        ],
        role: 'Tasarım ve geliştirme',
        stack: 'React · Node.js'
      },
      en: {
        kind: 'Corporate Website · In active use',
        title: 'Üren Global',
        summary: 'A corporate website whose content and page layout are managed through an admin panel.',
        features: [
          'Corporate presentation and service pages',
          'Content updates from the admin panel',
          'Mobile-first responsive design'
        ],
        role: 'Design and development',
        stack: 'React · Node.js'
      },
      links: [{ tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.urenglobal.com' }]
    },

    mbseyda: {
      mark: 'MB', media: 'm8',
      tr: {
        kind: 'Kurumsal Web Sitesi · Aktif kullanılıyor',
        title: 'MB Seyda İnşaat',
        summary: 'İnşaat firması için proje ve referans vitrini.',
        features: [
          'Proje ve referans galerisi',
          'İçeriklerin admin panelinden güncellenmesi',
          'Kurumsal iletişim sayfası'
        ],
        role: 'Tasarım ve geliştirme',
        stack: 'React · Node.js'
      },
      en: {
        kind: 'Corporate Website · In active use',
        title: 'MB Seyda İnşaat',
        summary: 'A project and reference showcase for a construction company.',
        features: [
          'Project and reference gallery',
          'Content updates from the admin panel',
          'Corporate contact page'
        ],
        role: 'Design and development',
        stack: 'React · Node.js'
      },
      links: [{ tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.mbseydainsaat.com.tr' }]
    },

    hmz: {
      mark: 'HMZ', media: 'm9',
      tr: {
        kind: 'Kurumsal Web Sitesi · Aktif kullanılıyor',
        title: 'HMZ Solutions',
        summary: 'Yazılım hizmetleri için kurumsal kimlik ve tanıtım sitesi.',
        features: [
          'Hizmet ve referans bölümleri',
          'SEO uyumlu sayfa yapısı',
          'Hızlı yükleme için optimize edilmiş arayüz'
        ],
        role: 'Tasarım ve geliştirme',
        stack: 'Next.js · React'
      },
      en: {
        kind: 'Corporate Website · In active use',
        title: 'HMZ Solutions',
        summary: 'Corporate identity and presentation site for software services.',
        features: [
          'Service and reference sections',
          'SEO-friendly page structure',
          'Interface optimised for fast loading'
        ],
        role: 'Design and development',
        stack: 'Next.js · React'
      },
      links: [{ tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.hmzsolutions.com.tr' }]
    }
  };

  /* Synchronize PROJECTS with PortfolioStore (if loaded) */
  if (window.PortfolioStore) {
    var storedProjs = window.PortfolioStore.getProjects();
    if (storedProjs && storedProjs.length) {
      storedProjs.forEach(function (p) {
        PROJECTS[p.id] = p;
      });
    }
  }

  /* ---------------------------------------------------------
     3) Language
     --------------------------------------------------------- */
  var i18nNodes = $$('[data-i18n]');
  var TR = {};
  i18nNodes.forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (!(key in TR)) TR[key] = el.innerHTML;
  });

  var lang = 'tr';

  function applyLang(next) {
    lang = next === 'en' ? 'en' : 'tr';
    var dict = lang === 'en' ? EN : TR;
    i18nNodes.forEach(function (el) {
      var value = dict[el.getAttribute('data-i18n')];
      if (typeof value === 'string') el.innerHTML = value;
    });
    root.setAttribute('lang', lang);

    var label = $('#langLabel');
    if (label) label.textContent = lang === 'en' ? 'TR' : 'EN';
    var copyLabel = $('#copyMailLabel');
    if (copyLabel) copyLabel.textContent = UI[lang].copyIdle;

    if (openId) fillModal(openId);
    if (typeof renderServicesDynamic === 'function') renderServicesDynamic();
    if (typeof renderSkillsDynamic === 'function') renderSkillsDynamic();
    try { localStorage.setItem('hk-lang', lang); } catch (e) {}
  }

  /* ---------------------------------------------------------
     4) Language toggle
     --------------------------------------------------------- */
  var langBtn = $('#langBtn');
  if (langBtn) langBtn.addEventListener('click', function () { applyLang(lang === 'tr' ? 'en' : 'tr'); });

  /* ---------------------------------------------------------
     5) Mobile menu
     --------------------------------------------------------- */
  var menuBtn = $('#menuBtn');
  var mobileMenu = $('#mobileMenu');

  function closeMenu() {
    if (!mobileMenu || mobileMenu.hidden) return;
    mobileMenu.hidden = true;
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var open = mobileMenu.hidden;
      mobileMenu.hidden = !open;
      menuBtn.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', mobileMenu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* ---------------------------------------------------------
     6) Header state, scroll progress, active nav link
     --------------------------------------------------------- */
  var header = $('#siteHeader');
  var progress = $('#scrollProgress');
  var navLinks = $$('.nav a');
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 12);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    var current = null;
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= 150) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });

    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     7) Reveal on scroll + counters
     --------------------------------------------------------- */
  function runCounters(scope) {
    $$('[data-count]', scope).forEach(function (el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduced) { el.textContent = String(target); return; }
      var start = performance.now(), dur = 900;
      (function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }

  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () {
          el.classList.add('is-visible');
          runCounters(el);
        }, Math.min(i * 70, 280));
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
    runCounters(document);
  }

  /* ---------------------------------------------------------
     8) Project filters & Dynamic Rendering
     --------------------------------------------------------- */
  var gridEl = $('#projectsGrid');
  if (gridEl && window.PortfolioStore) {
    var projsList = window.PortfolioStore.getProjects();
    if (projsList && projsList.length) {
      gridEl.innerHTML = '';
      projsList.forEach(function (p) {
        if (p.status === 'draft') return;
        var num = p.order < 10 ? '0' + p.order : String(p.order);
        var art = document.createElement('article');
        art.className = 'project reveal is-visible' + (p.featured ? ' featured' : '');
        art.setAttribute('data-tags', (p.tags || []).join(' '));
        art.setAttribute('data-id', p.id);

        var dTr = p.tr || {};
        var chipsHtml = (p.chips || []).map(function (c) { return '<li>' + c + '</li>'; }).join('');
        var liveHref = (p.links && p.links[0] && p.links[0].href) || '';

        art.innerHTML =
          '<button class="project-media ' + (p.media || 'm1') + '" type="button" data-open="' + p.id + '" aria-label="' + dTr.title + ' — detay">' +
            '<span class="media-fallback">' +
              '<span class="browser">' +
                '<span class="browser-bar"><i></i><i></i><i></i><small>' + (liveHref ? liveHref.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'hamzakoybasi.com') + '</small></span>' +
                '<span class="browser-body"><span class="mono-mark">' + (p.mark || 'HK') + '</span></span>' +
              '</span>' +
            '</span>' +
            '<span class="media-hover"><span data-i18n="proj.detail">Detayları gör</span></span>' +
          '</button>' +
          '<div class="project-body">' +
            '<div class="project-top">' +
              '<span class="project-no">' + num + '</span>' +
              (dTr.badge ? '<span class="badge badge-live"><i></i><span data-i18n="proj.live">' + dTr.badge + '</span></span>' : '') +
            '</div>' +
            '<h3>' + dTr.title + ' <span class="project-kind">— ' + dTr.kind + '</span></h3>' +
            '<p>' + (dTr.lead || dTr.summary || '') + '</p>' +
            '<ul class="chips sm">' + chipsHtml + '</ul>' +
            '<div class="project-links">' +
              '<button class="link-btn" type="button" data-open="' + p.id + '">' +
                '<span data-i18n="proj.detail">Detayları gör</span>' +
                '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7"/></svg>' +
              '</button>' +
              (liveHref ? '<a href="' + liveHref + '" target="_blank" rel="noopener"><span data-i18n="proj.visit">Canlı site</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>' : '') +
            '</div>' +
          '</div>';

        gridEl.appendChild(art);
      });
    }
  }

  /* --- Synchronize CV Link --- */
  function syncCvLink() {
    var heroCv = $('#heroCvLink');
    if (!heroCv || !window.PortfolioStore) return;
    var prof = window.PortfolioStore.getProfile();
    if (prof && prof.cvData) {
      heroCv.href = prof.cvData;
      heroCv.setAttribute('download', prof.cvFileName || 'Hamza-Koybasi-CV.pdf');
    } else {
      heroCv.href = 'assets/Hamza-Koybasi-CV.pdf';
      heroCv.setAttribute('download', 'Hamza-Koybasi-CV.pdf');
    }
  }

  /* --- Dynamic Services Render --- */
  function renderServicesDynamic() {
    var srvGrid = $('#servicesGrid');
    if (!srvGrid || !window.PortfolioStore) return;
    var services = window.PortfolioStore.getServices();
    if (!services || !services.length) return;

    srvGrid.innerHTML = '';
    var icons = [
      '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.01M9.5 6.5h.01"/>',
      '<path d="M4 7h16l-1.4 10.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
      '<rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M11 18.6h2"/>',
      '<path d="m12 3 7 4v10l-7 4-7-4V7z"/><path d="M12 12v9M12 12 5 8M12 12l7-4"/>'
    ];

    services.forEach(function (srv, i) {
      var d = (lang === 'en' && srv.en && srv.en.title) ? srv.en : (srv.tr || srv);
      var iconSvg = icons[i % icons.length];
      var items = (d.items || []).map(function (it) {
        return '<li>' + it + '</li>';
      }).join('');

      var art = document.createElement('article');
      art.className = 'service reveal is-visible';
      art.innerHTML =
        '<span class="service-no">' + (srv.number || ('0' + (i + 1))) + '</span>' +
        '<div class="service-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24">' + iconSvg + '</svg>' +
        '</div>' +
        '<h3>' + (d.title || '') + '</h3>' +
        '<p>' + (d.desc || '') + '</p>' +
        (items ? '<ul class="service-list">' + items + '</ul>' : '');

      srvGrid.appendChild(art);
    });
  }

  /* --- Dynamic Skills Render --- */
  function renderSkillsDynamic() {
    var skGrid = $('#skillsGrid');
    if (!skGrid || !window.PortfolioStore) return;
    var skills = window.PortfolioStore.getSkills();
    if (!skills || !skills.length) return;

    skGrid.innerHTML = '';
    var icons = [
      '<path d="M9 8 5 12l4 4M15 8l4 4-4 4M13.5 5l-3 14"/>',
      '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
      '<path d="m12 3 7 4v10l-7 4-7-4V7z"/><path d="M12 12v9M12 12 5 8M12 12l7-4"/>',
      '<rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="8.5" cy="12" r="1.6"/><circle cx="15.5" cy="12" r="1.6"/>',
      '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'
    ];

    skills.forEach(function (cat, i) {
      var d = (lang === 'en' && cat.en && cat.en.title) ? cat.en : (cat.tr || cat);
      var iconSvg = icons[i % icons.length];
      var chips = (cat.chips || []).map(function (c) {
        return '<li>' + c + '</li>';
      }).join('');

      var art = document.createElement('article');
      art.className = 'card skill-card reveal is-visible';
      art.innerHTML =
        '<div class="skill-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24">' + iconSvg + '</svg>' +
        '</div>' +
        '<h3>' + (d.title || '') + '</h3>' +
        (d.desc ? '<p>' + d.desc + '</p>' : '') +
        (chips ? '<ul class="chips">' + chips + '</ul>' : '');

      skGrid.appendChild(art);
    });
  }

  // Initial runs
  syncCvLink();
  renderServicesDynamic();
  renderSkillsDynamic();

  // Listen for real-time changes from Admin Studio
  if (typeof window !== 'undefined') {
    window.addEventListener('portfolio:dataChanged', function () {
      syncCvLink();
      renderServicesDynamic();
      renderSkillsDynamic();
    });
  }

  var filters = $$('.filter');
  var projects = $$('.project');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = btn.getAttribute('data-filter');
      filters.forEach(function (f) {
        var on = f === btn;
        f.classList.toggle('is-active', on);
        f.setAttribute('aria-selected', String(on));
      });
      projects = $$('.project');
      projects.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(' ');
        var show = tag === 'all' || tags.indexOf(tag) !== -1;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-visible');
      });
    });
  });

  /* ---------------------------------------------------------
     9) Project modal
     --------------------------------------------------------- */
  var modal = $('#projectModal');
  var openId = null;
  var lastFocused = null;

  function fillModal(id) {
    var p = PROJECTS[id];
    if (!p) return;
    var d = p[lang] || p.tr;

    $('#modalMark').textContent = p.mark;
    var heroEl = $('#modalHero');
    heroEl.className = 'modal-hero ' + p.media;
    $('#modalKind').textContent = d.kind;
    $('#modalTitle').textContent = d.title;
    $('#modalSummary').textContent = d.summary;
    $('#modalRole').textContent = d.role;
    $('#modalStack').textContent = d.stack;

    var list = $('#modalFeatures');
    list.innerHTML = '';
    d.features.forEach(function (f) {
      var li = document.createElement('li');
      li.textContent = f;
      list.appendChild(li);
    });

    var links = $('#modalLinks');
    links.innerHTML = '';
    (p.links || []).forEach(function (l) {
      var a = document.createElement('a');
      a.className = 'btn btn-primary';
      a.href = l.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = l[lang] || l.tr;
      links.appendChild(a);
    });
  }

  function openModal(id) {
    if (!modal || !PROJECTS[id]) return;
    lastFocused = document.activeElement;
    openId = id;
    fillModal(id);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var closeBtn = $('.modal-close', modal);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    openId = null;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* Delegated open handler */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-open]');
    if (trigger) {
      openModal(trigger.getAttribute('data-open'));
    }
  });
  if (modal) {
    $$('[data-close]', modal).forEach(function (el) { el.addEventListener('click', closeModal); });
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled])', modal);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeMenu(); }
  });

  /* ---------------------------------------------------------
     10) Contact form → mailto
     --------------------------------------------------------- */
  var form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var topic = form.topic.value;
      var message = form.message.value.trim();

      var ok = true;
      [['name', name], ['email', email], ['message', message]].forEach(function (pair) {
        var field = form[pair[0]].closest('.field');
        var valid = pair[1].length > 0 && (pair[0] !== 'email' || /.+@.+\..+/.test(pair[1]));
        field.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });

      var note = $('.form-note', form);
      if (!ok) { note.textContent = UI[lang].formError; return; }

      var subject = '[' + topic + '] ' + name;
      var body = name + ' (' + email + ')\n\n' + message;
      note.textContent = UI[lang].formSent;

      /* Persist message to PortfolioStore Inbox */
      if (window.PortfolioStore) {
        window.PortfolioStore.addMessage({
          name: name,
          email: email,
          topic: topic,
          message: message
        });
      }

      window.location.href = 'mailto:hamzakybsi@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------------------------------------------------------
     11) Copy e-mail
     --------------------------------------------------------- */
  var copyBtn = $('#copyMail');
  var copyLabelEl = $('#copyMailLabel');
  var EMAIL = 'hamzakybsi@gmail.com';

  function flashCopied() {
    if (!copyLabelEl) return;
    copyLabelEl.textContent = UI[lang].copyDone;
    setTimeout(function () { copyLabelEl.textContent = UI[lang].copyIdle; }, 2000);
  }
  function fallbackCopy() {
    var ta = document.createElement('textarea');
    ta.value = EMAIL; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); flashCopied(); } catch (e) {}
    document.body.removeChild(ta);
  }
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(flashCopied).catch(fallbackCopy);
      } else { fallbackCopy(); }
    });
  }

  /* ---------------------------------------------------------
     12) Pointer effects: spotlight, cursor, magnetic, cards
     --------------------------------------------------------- */
  var spotlight = $('.spotlight');

  if (finePointer && !reduced) {
    var dot = $('#cursorDot');
    var ring = $('#cursorRing');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    document.body.classList.add('has-cursor');

    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (dot) dot.style.transform = 'translate3d(' + (mx - 3) + 'px,' + (my - 3) + 'px,0)';
      if (spotlight) spotlight.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring) ring.style.transform = 'translate3d(' + (rx - ring.offsetWidth / 2) + 'px,' + (ry - ring.offsetHeight / 2) + 'px,0)';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('a, button, input, select, textarea, .project, .service');
      document.body.classList.toggle('cursor-active', !!t);
    });

    /* Magnetic buttons */
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + dx * 0.18 + 'px,' + dy * 0.3 + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });

    /* Service card glow follows the pointer */
    $$('.service').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ---------------------------------------------------------
     13) Footer year + stored language
     --------------------------------------------------------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  var storedLang;
  try { storedLang = localStorage.getItem('hk-lang'); } catch (e) {}
  if (storedLang === 'en') applyLang('en');

  /* ---------------------------------------------------------
     14) Admin Studio Keyboard Shortcut (Ctrl+Shift+A)
     --------------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin/index.html';
    }
  });
})();
