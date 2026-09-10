/* =========================================================
   Hamza Köybaşı — Portfolio Shared Data Store
   Synchronizes data between Portfolio and Admin Studio
   Vanilla JS, zero dependencies, localStorage persisted.
   ========================================================= */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortfolioStore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'hk_portfolio_data_v1';
  var AUTH_KEY = 'hk_admin_auth_v1';
  var THEME_KEY = 'hk_admin_theme_v1';

  var DEFAULT_PROJECTS = [
    {
      id: 'step',
      order: 1,
      featured: true,
      status: 'active',
      tags: ['ecommerce', 'web'],
      mark: 'SF',
      media: 'm1',
      tr: {
        kind: 'B2B & E-Ticaret Platformu · Aktif kullanılıyor',
        title: 'Step Filtre',
        badge: 'Aktif kullanılıyor',
        summary: 'Filtre üreticileri için e-ticaret ve B2B sistemini tek çatı altında birleştiren yönetim platformu. Bayi ve son kullanıcı akışları aynı altyapı üzerinde çalışıyor.',
        lead: 'Stok yönetimi, Excel ile toplu ürün ekleme, toplu fiyat ve stok değişimi, ürün kontrolü, müşteri siparişleri ve fiyatlandırma işlemleri tek panelden yönetiliyor.',
        features: [
          'Stok yönetimi ve ürün kontrolü tek panelden',
          'Excel ile toplu ürün ekleme',
          'Toplu fiyat ve stok değişimi',
          'Müşteri siparişlerinin takibi',
          'Fiyatlandırma işlemlerinin yönetimi'
        ],
        role: 'Tasarım ve geliştirme (uçtan uca)',
        stack: 'React · Node.js · MongoDB · Excel Import'
      },
      en: {
        kind: 'B2B & E-Commerce Platform · In active use',
        title: 'Step Filtre',
        badge: 'In active use',
        summary: 'A management platform that merges e-commerce and B2B for filter manufacturers. Dealer and end-user flows run on the same infrastructure.',
        lead: 'Stock management, bulk product import via Excel, bulk price and stock updates, product control, customer orders and pricing are all handled from one panel.',
        features: [
          'Stock management and product control in one panel',
          'Bulk product import via Excel',
          'Bulk price and stock updates',
          'Customer order tracking',
          'Pricing management'
        ],
        role: 'Design and development (end to end)',
        stack: 'React · Node.js · MongoDB · Excel Import'
      },
      chips: ['React', 'Node.js', 'MongoDB', 'Excel Import'],
      links: [
        { tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.stepfiltre.com.tr/' }
      ]
    },
    {
      id: 'barkone',
      order: 2,
      featured: false,
      status: 'active',
      tags: ['ecommerce', 'web'],
      mark: 'BK',
      media: 'm2',
      tr: {
        kind: 'E-Ticaret Platformu · Aktif kullanılıyor',
        title: 'Barkone',
        badge: 'Aktif kullanılıyor',
        summary: 'Next.js ile geliştirilen, uçtan uca çalışan e-ticaret platformu.',
        lead: 'Next.js ile geliştirilen uçtan uca e-ticaret platformu. Ürün kataloğu, sipariş akışı ve yönetim paneli tek bir çatı altında.',
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
        badge: 'In active use',
        summary: 'An end-to-end e-commerce platform built with Next.js.',
        lead: 'An end-to-end e-commerce platform built with Next.js, with product catalogue, order flow and an admin panel.',
        features: [
          'Product catalogue and category structure',
          'Order flow',
          'Content and product management through the admin panel',
          'Fast page loads and SEO with Next.js'
        ],
        role: 'Design and development',
        stack: 'Next.js · React · Node.js'
      },
      chips: ['Next.js', 'React', 'Node.js'],
      links: [
        { tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.barkone.com.tr' }
      ]
    },
    {
      id: 'ilac',
      order: 3,
      featured: false,
      status: 'active',
      tags: ['ai'],
      mark: 'AI',
      media: 'm3',
      tr: {
        kind: 'Yapay Zekâ · Doğal Dil İşleme',
        title: 'İlaç Yan Etki Tahmin Sistemi',
        badge: 'Yapay Zekâ',
        summary: 'Kullanıcının yazdığı ilaç adına göre olası yan etkileri tahmin eden model. BERTurk ile eğitildi, canlı demo Hugging Face Spaces üzerinde yayında.',
        lead: 'Kullanıcının yazdığı ilaç adına göre olası yan etkileri tahmin eden doğal dil işleme modeli. BERTurk ile eğitildi; Hugging Face Spaces üzerinde canlı demo.',
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
        badge: 'Artificial Intelligence',
        summary: 'A model that predicts possible side effects from the drug name a user types. Fine-tuned with BERTurk, with a live demo on Hugging Face Spaces.',
        lead: 'A natural language processing model fine-tuned with BERTurk that predicts possible side effects from the drug name a user types. Live demo published on Hugging Face Spaces.',
        features: [
          'Turkish language model based on BERTurk',
          'Side-effect prediction from a drug name',
          'Public demo on Hugging Face Spaces',
          'Simple single-input user interface'
        ],
        role: 'Model training and interface',
        stack: 'Python · BERTurk · Transformers · Hugging Face'
      },
      chips: ['Python', 'BERTurk', 'Transformers', 'Hugging Face'],
      links: [
        { tr: 'Canlı demoyu dene', en: 'Try the live demo', href: 'https://huggingface.co/spaces/Hamzakoybasi/ilac-yanetki-tahmin' }
      ]
    },
    {
      id: 'ar',
      order: 4,
      featured: false,
      status: 'active',
      tags: ['ar'],
      mark: 'AR',
      media: 'm4',
      tr: {
        kind: 'Mobil · Artırılmış Gerçeklik',
        title: 'AR Motor Bilgilendirme Sistemi',
        badge: 'Mobil · AR',
        summary: 'Gerçek bir otomobil motoru modeline artırılmış gerçeklik etkileşimleri entegre ettiğim mobil uygulama.',
        lead: 'Gerçek bir otomobil motoru maketine artırılmış gerçeklik etkileşimleri entegre ettim. Fiziksel motor üzerinde bir parça tarandığında ilgili bilgi ve video kullanıcıya gösteriliyor.',
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
        badge: 'Mobile · AR',
        summary: 'A mobile app in which I integrated augmented reality interactions with a real car engine model.',
        lead: 'I integrated augmented reality interactions with a real car engine model. When a part on the physical engine is scanned, the related information (text and video) is shown to the user.',
        features: [
          'Recognition of physical engine parts through the camera',
          'Text and video content for the scanned part',
          'Real-time tracking with Unity and Vuforia',
          'Built for training and product presentation'
        ],
        role: 'App development and AR integration',
        stack: 'Unity · Vuforia · C# · Android'
      },
      chips: ['Unity', 'Vuforia', 'C#', 'Android'],
      links: [
        { tr: 'Uygulama videosunu izle', en: 'Watch the app video', href: 'https://bit.ly/ArtirilmisGerceklikVideosu' }
      ]
    },
    {
      id: 'dapp',
      order: 5,
      featured: false,
      status: 'active',
      tags: ['web3'],
      mark: 'W3',
      media: 'm5',
      tr: {
        kind: 'Web3 · dApp',
        title: 'Web3 Şehir Oylama Sistemi',
        badge: 'Web3',
        summary: 'Blokzincir üzerinde çalışan, şeffaf ve değiştirilemez bir oylama uygulaması.',
        lead: 'Blokzincir üzerinde çalışan oylama uygulaması: akıllı sözleşme ve MetaMask cüzdan bağlantısıyla şeffaf, değiştirilemez oylama.',
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
        badge: 'Web3',
        summary: 'A transparent, immutable voting application running on the blockchain.',
        lead: 'A blockchain-based voting application: transparent, immutable voting through a smart contract with MetaMask wallet connection.',
        features: [
          'Smart contract written in Solidity',
          'Wallet connection through MetaMask',
          'Immutable vote records written on chain',
          'Voting through a React interface'
        ],
        role: 'Smart contract and interface',
        stack: 'Solidity · Ethers.js · MetaMask · React'
      },
      chips: ['Solidity', 'Ethers.js', 'MetaMask', 'React'],
      links: [
        { tr: "GitHub'da incele", en: 'View on GitHub', href: 'https://github.com/hamzakyb/dApp_Oylama' }
      ]
    },
    {
      id: 'asra',
      order: 6,
      featured: false,
      status: 'active',
      tags: ['web'],
      mark: 'AC',
      media: 'm6',
      tr: {
        kind: 'Özelleştirilebilir Web Sitesi',
        title: 'Asra Cave Hotel',
        badge: 'Özelleştirilebilir Web Sitesi',
        summary: 'Her bir bileşenin tasarımının ve içeriğinin admin panelinden değiştirilebildiği otel web sitesi.',
        lead: 'Her bileşeninin tasarımının ve içeriğinin admin panelinden değiştirilebildiği otel web sitesi. Sayfa blokları kod yazmadan yeniden düzenlenebiliyor.',
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
        badge: 'Customizable Website',
        summary: 'A hotel website where the design and content of every component can be changed from the admin panel.',
        lead: 'A hotel website where the design and content of every component can be changed from the admin panel. Page blocks can be rearranged without writing code.',
        features: [
          'Component-level design changes',
          'Rearranging page blocks without writing code',
          'Content managed from the admin panel',
          'Deployed on Vercel'
        ],
        role: 'Design and development',
        stack: 'Next.js · CMS · Vercel'
      },
      chips: ['Next.js', 'CMS', 'Vercel'],
      links: [
        { tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://asracavehotel.vercel.app/' }
      ]
    },
    {
      id: 'uren',
      order: 7,
      featured: false,
      status: 'active',
      tags: ['web'],
      mark: 'ÜG',
      media: 'm7',
      tr: {
        kind: 'Kurumsal Web Sitesi · Aktif kullanılıyor',
        title: 'Üren Global',
        badge: 'Aktif kullanılıyor',
        summary: 'Kurumsal tanıtım sitesi; içerik ve sayfa düzeni yönetim paneli üzerinden güncelleniyor.',
        lead: 'Yönetim paneli üzerinden içerik ve sayfa düzeni güncellenebilen kurumsal web sitesi.',
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
        badge: 'In active use',
        summary: 'A corporate website whose content and page layout are managed through an admin panel.',
        lead: 'Corporate website with content and page layout managed through an admin panel.',
        features: [
          'Corporate presentation and service pages',
          'Content updates from the admin panel',
          'Mobile-first responsive design'
        ],
        role: 'Design and development',
        stack: 'React · Node.js'
      },
      chips: ['React', 'Node.js'],
      links: [
        { tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.urenglobal.com' }
      ]
    },
    {
      id: 'mbseyda',
      order: 8,
      featured: false,
      status: 'active',
      tags: ['web'],
      mark: 'MB',
      media: 'm8',
      tr: {
        kind: 'Kurumsal Web Sitesi · Aktif kullanılıyor',
        title: 'MB Seyda İnşaat',
        badge: 'Aktif kullanılıyor',
        summary: 'İnşaat firması için proje ve referans vitrini.',
        lead: 'İnşaat firması için proje ve referans vitrini; içerikler yönetim paneli üzerinden güncelleniyor.',
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
        badge: 'In active use',
        summary: 'A project and reference showcase for a construction company.',
        lead: 'A project and reference showcase for a construction company, with content editable from the admin panel.',
        features: [
          'Project and reference gallery',
          'Content updates from the admin panel',
          'Corporate contact page'
        ],
        role: 'Design and development',
        stack: 'React · Node.js'
      },
      chips: ['React', 'Node.js'],
      links: [
        { tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.mbseydainsaat.com.tr' }
      ]
    },
    {
      id: 'hmz',
      order: 9,
      featured: false,
      status: 'active',
      tags: ['web'],
      mark: 'HMZ',
      media: 'm9',
      tr: {
        kind: 'Kurumsal Web Sitesi · Aktif kullanılıyor',
        title: 'HMZ Solutions',
        badge: 'Aktif kullanılıyor',
        summary: 'Yazılım hizmetleri için kurumsal kimlik ve tanıtım sitesi.',
        lead: 'Yazılım hizmetleri için kurumsal kimlik ve tanıtım sitesi.',
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
        badge: 'In active use',
        summary: 'Corporate identity and presentation site for software services.',
        lead: 'Corporate identity and presentation site for software services.',
        features: [
          'Service and reference sections',
          'SEO-friendly page structure',
          'Interface optimised for fast loading'
        ],
        role: 'Design and development',
        stack: 'Next.js · React'
      },
      chips: ['Next.js', 'React'],
      links: [
        { tr: 'Canlı siteyi aç', en: 'Open live site', href: 'https://www.hmzsolutions.com.tr' }
      ]
    }
  ];

  var DEFAULT_SERVICES = [
    {
      id: 'srv-1',
      number: '01',
      tr: {
        title: 'Web Uygulamaları',
        desc: 'Kurumsal siteler, yönetim panelleri ve özel iş araçları. Hızlı, SEO uyumlu ve müşterinin rahatça yönetebileceği yapıda.',
        items: [
          'Next.js / React ile modern arayüz',
          'Yönetim paneli & içerik yönetimi',
          'Performans & SEO yapılandırması'
        ]
      },
      en: {
        title: 'Web Applications',
        desc: 'Corporate sites, admin panels and custom business tools. Fast, SEO-friendly and manageable by the client.',
        items: [
          'Next.js / React interface',
          'Admin panel & content management',
          'Performance & SEO setup'
        ]
      }
    },
    {
      id: 'srv-2',
      number: '02',
      tr: {
        title: 'E-Ticaret & B2B',
        desc: 'Ürün kataloğu, sipariş akışı, bayi ve fiyat yönetimi — üretim ortamında çalışan sistemlerden edinilen tecrübeyle.',
        items: [
          'Stok & sipariş yönetimi',
          'Excel ile toplu veri işlemleri',
          'Bayi bazlı fiyatlandırma'
        ]
      },
      en: {
        title: 'E-Commerce & B2B',
        desc: 'Product catalogue, order flow, dealer and pricing management — built on experience from systems running in production.',
        items: [
          'Stock & order management',
          'Bulk data operations via Excel',
          'Dealer-based pricing'
        ]
      }
    },
    {
      id: 'srv-3',
      number: '03',
      tr: {
        title: 'Mobil, Yapay Zekâ & AR',
        desc: 'React Native ile mobil uygulamalar, doğal dil işleme modelleri ve Unity/Vuforia ile artırılmış gerçeklik deneyimleri.',
        items: [
          'React Native ile uygulama',
          'NLP modeli & canlı demo',
          'AR ile ürün anlatımı'
        ]
      },
      en: {
        title: 'Mobile, AI & AR',
        desc: 'Mobile apps with React Native, natural language processing models and augmented reality experiences with Unity/Vuforia.',
        items: [
          'React Native application',
          'NLP model & live demo',
          'Product presentation in AR'
        ]
      }
    }
  ];

  var DEFAULT_SKILLS = [
    {
      id: 'cat-frontend',
      number: '01',
      tr: { title: 'Frontend', desc: 'Hızlı, erişilebilir ve mobil öncelikli arayüzler.' },
      en: { title: 'Frontend', desc: 'Fast, accessible and mobile-first interfaces.' },
      chips: ['React', 'Next.js', 'React Native', 'TypeScript', 'TailwindCSS', 'HTML5 / CSS3']
    },
    {
      id: 'cat-backend',
      number: '02',
      tr: { title: 'Backend & API', desc: 'Ölçeklenebilir servisler, veritabanı tasarımı ve entegrasyonlar.' },
      en: { title: 'Backend & API', desc: 'Scalable services, database design and integrations.' },
      chips: ['Node.js', 'Nest.js', 'PostgreSQL', 'MongoDB', 'Supabase', 'PHP', 'REST / GraphQL']
    },
    {
      id: 'cat-web3',
      number: '03',
      tr: { title: 'Web3 & Blokzincir', desc: 'Akıllı sözleşmeler ve cüzdan bağlantılı dApp’ler.' },
      en: { title: 'Web3 & Blockchain', desc: 'Smart contracts and dApps with wallet integration.' },
      chips: ['Solidity', 'MetaMask', 'Ethers.js', 'Smart Contracts', 'Web3.js']
    },
    {
      id: 'cat-ai',
      number: '04',
      tr: { title: 'Yapay Zekâ · AR / VR', desc: 'NLP modelleri ve gerçek zamanlı artırılmış gerçeklik uygulamaları.' },
      en: { title: 'AI · AR / VR', desc: 'NLP models and real-time augmented reality applications.' },
      chips: ['Python', 'BERTurk', 'Transformers', 'Hugging Face', 'Unity', 'Vuforia']
    }
  ];

  var DEFAULT_PROFILE = {
    name: 'Hamza Köybaşı',
    roleTr: 'Full Stack Developer',
    roleEn: 'Full Stack Developer',
    email: 'hamzakybsi@gmail.com',
    phone: '+90 505 095 99 50',
    locationTr: 'Nevşehir, Türkiye',
    locationEn: 'Nevşehir, Turkey',
    availabilityTr: 'Tam Zamanlı / Remote',
    availabilityEn: 'Full-time / Remote',
    focusTr: 'Web & Mobil Uygulamalar · E-Ticaret / B2B · AI',
    focusEn: 'Web & Mobile Applications · E-Commerce / B2B · AI',
    languagesTr: 'Türkçe (Ana dil) · İngilizce (B2)',
    languagesEn: 'Turkish (Native) · English (B2)',
    github: 'https://github.com/hamzakyb',
    linkedin: 'https://linkedin.com/in/hamzakybsi',
    cvPath: 'assets/Hamza-Koybasi-CV.pdf',
    stats: {
      projectsCount: 15,
      liveCount: 9,
      areasCount: 4
    }
  };

  var DEFAULT_INBOX = [
    {
      id: 'msg-sample-1',
      name: 'Örnek Müşteri (Step Filtre Benzeri)',
      email: 'info@firmaornek.com',
      topic: 'Yeni proje',
      message: 'Merhaba Hamza Bey, portfolyonuzdaki B2B ve E-ticaret entegrasyonu projenizi inceledik. Benzer ölçekte özel bir bayi yönetim portalı geliştirmek istiyoruz. Detayları görüşebilir miyiz?',
      date: new Date(Date.now() - 3600000 * 26).toISOString(),
      read: false
    },
    {
      id: 'msg-sample-2',
      name: 'Startup Kurucusu',
      email: 'selim@ai-labs.io',
      topic: 'İş fırsatı',
      message: 'Doğal dil işleme ve React Next.js tecrübeniz tam aradığımız profil. Remote tam zamanlı çalışma imkanını değerlendirir misiniz?',
      date: new Date(Date.now() - 3600000 * 74).toISOString(),
      read: true
    }
  ];

  function getInitialState() {
    return {
      version: 1,
      lastUpdated: new Date().toISOString(),
      profile: JSON.parse(JSON.stringify(DEFAULT_PROFILE)),
      projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
      services: JSON.parse(JSON.stringify(DEFAULT_SERVICES)),
      skills: JSON.parse(JSON.stringify(DEFAULT_SKILLS)),
      inbox: JSON.parse(JSON.stringify(DEFAULT_INBOX))
    };
  }

  /* ---------------------------------------------------------
     Store Controller Class
     --------------------------------------------------------- */
  var Store = {
    _data: null,

    init: function () {
      if (this._data) return this._data;
      var raw = null;
      try {
        raw = localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        console.warn('PortfolioStore: localStorage not available, using in-memory default.');
      }

      if (raw) {
        try {
          this._data = JSON.parse(raw);
        } catch (e) {
          console.error('PortfolioStore: Corrupt storage data, resetting to defaults.', e);
          this._data = getInitialState();
          this.save();
        }
      } else {
        this._data = getInitialState();
        this.save();
      }
      return this._data;
    },

    save: function () {
      if (!this._data) this.init();
      this._data.lastUpdated = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
        this._dispatchChange();
      } catch (e) {
        console.error('PortfolioStore: Failed to save to localStorage', e);
      }
      return this._data;
    },

    resetToDefaults: function () {
      this._data = getInitialState();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
        this._dispatchChange();
      } catch (e) {}
      return this._data;
    },

    getData: function () {
      if (!this._data) this.init();
      return this._data;
    },

    /* --- Projects --- */
    getProjects: function () {
      return (this.getData().projects || []).slice().sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      });
    },

    getProjectById: function (id) {
      var projs = this.getData().projects || [];
      for (var i = 0; i < projs.length; i++) {
        if (projs[i].id === id) return projs[i];
      }
      return null;
    },

    saveProject: function (project) {
      var projs = this.getData().projects || [];
      var existingIndex = -1;
      for (var i = 0; i < projs.length; i++) {
        if (projs[i].id === project.id) {
          existingIndex = i;
          break;
        }
      }

      if (existingIndex >= 0) {
        projs[existingIndex] = Object.assign({}, projs[existingIndex], project);
      } else {
        if (!project.order) project.order = projs.length + 1;
        projs.push(project);
      }
      this.save();
      return project;
    },

    deleteProject: function (id) {
      var projs = this.getData().projects || [];
      this.getData().projects = projs.filter(function (p) { return p.id !== id; });
      this.save();
      return true;
    },

    reorderProjects: function (orderedIds) {
      var map = {};
      var projs = this.getData().projects || [];
      projs.forEach(function (p) { map[p.id] = p; });
      var next = [];
      orderedIds.forEach(function (id, idx) {
        if (map[id]) {
          map[id].order = idx + 1;
          next.push(map[id]);
        }
      });
      // push remaining if any
      projs.forEach(function (p) {
        if (orderedIds.indexOf(p.id) === -1) {
          p.order = next.length + 1;
          next.push(p);
        }
      });
      this.getData().projects = next;
      this.save();
      return next;
    },

    /* --- Services --- */
    getServices: function () {
      return this.getData().services || [];
    },

    saveServices: function (services) {
      this.getData().services = services;
      this.save();
      return services;
    },

    addService: function (srv) {
      var services = this.getServices();
      var nextNo = services.length + 1;
      var numStr = nextNo < 10 ? '0' + nextNo : String(nextNo);
      var item = {
        id: srv.id || ('srv-' + Date.now()),
        number: numStr,
        tr: {
          title: (srv.tr && srv.tr.title) || srv.title || 'Yeni Hizmet',
          desc: (srv.tr && srv.tr.desc) || srv.desc || '',
          items: (srv.tr && srv.tr.items) || srv.items || []
        },
        en: {
          title: (srv.en && srv.en.title) || srv.titleEn || 'New Service',
          desc: (srv.en && srv.en.desc) || srv.descEn || '',
          items: (srv.en && srv.en.items) || srv.itemsEn || []
        }
      };
      services.push(item);
      this.save();
      return item;
    },

    deleteService: function (id) {
      var services = this.getServices();
      var filtered = services.filter(function (s) { return s.id !== id; });
      filtered.forEach(function (s, i) {
        var num = i + 1;
        s.number = num < 10 ? '0' + num : String(num);
      });
      this.getData().services = filtered;
      this.save();
      return filtered;
    },

    /* --- Skills --- */
    getSkills: function () {
      return this.getData().skills || [];
    },

    saveSkills: function (skills) {
      this.getData().skills = skills;
      this.save();
      return skills;
    },

    addSkillCategory: function (cat) {
      var skills = this.getSkills();
      var nextNo = skills.length + 1;
      var numStr = nextNo < 10 ? '0' + nextNo : String(nextNo);
      var item = {
        id: cat.id || ('cat-' + Date.now()),
        number: numStr,
        tr: {
          title: (cat.tr && cat.tr.title) || cat.title || 'Yeni Kategori',
          desc: (cat.tr && cat.tr.desc) || cat.desc || ''
        },
        en: {
          title: (cat.en && cat.en.title) || cat.titleEn || 'New Category',
          desc: (cat.en && cat.en.desc) || cat.descEn || ''
        },
        chips: cat.chips || []
      };
      skills.push(item);
      this.save();
      return item;
    },

    deleteSkillCategory: function (id) {
      var skills = this.getSkills();
      var filtered = skills.filter(function (c) { return c.id !== id; });
      filtered.forEach(function (c, i) {
        var num = i + 1;
        c.number = num < 10 ? '0' + num : String(num);
      });
      this.getData().skills = filtered;
      this.save();
      return filtered;
    },

    addSkillToCategory: function (catId, chipName) {
      var skills = this.getSkills();
      var target = skills.find(function (c) { return c.id === catId; });
      if (!target) return false;
      if (!target.chips) target.chips = [];
      var clean = String(chipName).trim();
      if (clean && target.chips.indexOf(clean) === -1) {
        target.chips.push(clean);
        this.save();
        return true;
      }
      return false;
    },

    removeSkillFromCategory: function (catId, chipIdx) {
      var skills = this.getSkills();
      var target = skills.find(function (c) { return c.id === catId; });
      if (!target || !target.chips) return false;
      target.chips.splice(chipIdx, 1);
      this.save();
      return true;
    },

    /* --- Profile & CV --- */
    getProfile: function () {
      return this.getData().profile || DEFAULT_PROFILE;
    },

    saveProfile: function (profile) {
      this.getData().profile = Object.assign({}, this.getData().profile, profile);
      this.save();
      return this.getData().profile;
    },

    saveCv: function (base64Data, fileName, fileSize) {
      var prof = this.getProfile();
      prof.cvData = base64Data;
      prof.cvFileName = fileName || 'Hamza-Koybasi-CV.pdf';
      prof.cvFileSize = fileSize || '';
      prof.cvUploadDate = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
      this.save();
      return prof;
    },

    resetCv: function () {
      var prof = this.getProfile();
      delete prof.cvData;
      prof.cvFileName = 'Hamza-Koybasi-CV.pdf';
      prof.cvPath = 'assets/Hamza-Koybasi-CV.pdf';
      delete prof.cvFileSize;
      delete prof.cvUploadDate;
      this.save();
      return prof;
    },

    /* --- Inbox (Messages) --- */
    getInbox: function () {
      return (this.getData().inbox || []).slice().sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    },

    addMessage: function (msg) {
      var item = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        name: msg.name || 'İsimsiz',
        email: msg.email || '',
        topic: msg.topic || 'Genel',
        message: msg.message || '',
        date: new Date().toISOString(),
        read: false
      };
      if (!this.getData().inbox) this.getData().inbox = [];
      this.getData().inbox.unshift(item);
      this.save();
      return item;
    },

    markMessageRead: function (id, isRead) {
      var list = this.getData().inbox || [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list[i].read = isRead !== undefined ? isRead : true;
          break;
        }
      }
      this.save();
    },

    deleteMessage: function (id) {
      var list = this.getData().inbox || [];
      this.getData().inbox = list.filter(function (m) { return m.id !== id; });
      this.save();
    },

    getUnreadCount: function () {
      var list = this.getData().inbox || [];
      return list.filter(function (m) { return !m.read; }).length;
    },

    /* --- Import / Export --- */
    exportJSON: function () {
      return JSON.stringify(this.getData(), null, 2);
    },

    importJSON: function (jsonString) {
      try {
        var parsed = JSON.parse(jsonString);
        if (!parsed.projects || !parsed.profile) {
          throw new Error('Geçersiz JSON formatı: projects veya profile eksik.');
        }
        this._data = parsed;
        this.save();
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    /* --- Auth & Theme --- */
    isLoggedIn: function () {
      try {
        return localStorage.getItem(AUTH_KEY) === 'true';
      } catch (e) {
        return false;
      }
    },

    login: function (pass) {
      // Default passcode: hamza2026 or admin or hk
      if (pass === 'hamza2026' || pass === 'admin' || pass === 'hk') {
        try { localStorage.setItem(AUTH_KEY, 'true'); } catch (e) {}
        return true;
      }
      return false;
    },

    logout: function () {
      try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
    },

    getTheme: function () {
      try {
        return localStorage.getItem(THEME_KEY) || 'paper';
      } catch (e) {
        return 'paper';
      }
    },

    setTheme: function (theme) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {}
    },

    /* --- Events --- */
    _dispatchChange: function () {
      if (typeof window !== 'undefined' && window.dispatchEvent && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('portfolio:dataChanged', { detail: this._data }));
      }
    }
  };

  // Initialize store immediately
  Store.init();

  return Store;
});
