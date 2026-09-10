import { PortfolioData, Project, ServiceItem, SkillCategory, Profile } from './types';

export const DEFAULT_PROJECTS: Project[] = [
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

export const DEFAULT_SERVICES: ServiceItem[] = [
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

export const DEFAULT_SKILLS: SkillCategory[] = [
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

export const DEFAULT_PROFILE: Profile = {
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
  cvPath: '/assets/Hamza-Koybasi-CV.pdf',
  stats: {
    projectsCount: 15,
    liveCount: 9,
    areasCount: 4
  }
};

export const INITIAL_DATA: PortfolioData = {
  projects: DEFAULT_PROJECTS,
  services: DEFAULT_SERVICES,
  skills: DEFAULT_SKILLS,
  profile: DEFAULT_PROFILE,
  inbox: [
    {
      id: 'msg-sample-1',
      name: 'Örnek Müşteri (Step Filtre Benzeri)',
      email: 'info@firmaornek.com',
      topic: 'Yeni proje',
      message: 'Merhaba Hamza Bey, portfolyonuzdaki B2B ve E-ticaret entegrasyonu projenizi inceledik. Benzer ölçekte özel bir bayi yönetim portalı geliştirmek istiyoruz. Detayları görüşebilir miyiz?',
      date: new Date(Date.now() - 3600000 * 26).toISOString(),
      read: false
    }
  ]
};
