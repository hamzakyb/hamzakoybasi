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
    "id": "operairo",
    "order": 1,
    "featured": true,
    "status": "active",
    "tags": [
      "ai",
      "web"
    ],
    "mark": "OP",
    "media": "m1",
    "tr": {
      "kind": "AI Destekli SaaS Otel Konsiyerj Platformu · Amiral Proje",
      "title": "Operairo",
      "badge": "AI SaaS · Canlı",
      "summary": "Google Gemini 2.5 Flash, Supabase pgvector RAG, Cloud TTS/STT ve Upstash altyapısıyla otel operasyonlarını otonomlaştıran yeni nesil konsiyerj platformu.",
      "lead": "Next.js 16 Route Handlers katmanlı mimarisi (19 REST endpoint), Supabase Realtime WebSocket canlı personel akışı, 5 LLM iş aracı (tool-calling), çift katmanlı Upstash rate limiting, PII maskeleme ve Cloudflare R2 depolama ile uçtan uca tasarlandı.",
      "features": [
        "Next.js 16 Route Handler katmanlı mimari (19 REST endpoint) ve bağımsız servis sınırları",
        "Google Gemini 2.5 Flash ile Vercel AI SDK streaming sohbet (streamText) ve 5 LLM iş aracı (tool-calling)",
        "Supabase PostgreSQL & pgvector vektör benzerlik araması (RAG) ve özel match_hotel_documents SQL fonksiyonu",
        "Supabase Realtime (WebSocket) ile personel paneline anlık veri akışı ve çok kiracılı (RLS) veri izolasyonu",
        "Google Cloud TTS (Chirp 3 HD) & Web Speech API (STT) ile tarayıcı sentezine düşen fallback zincirli sesli asistan",
        "Upstash Redis çift katmanlı rate limit, prompt injection tespiti, PII maskeleme ve QStash asenkron iş kuyruğu"
      ],
      "role": "SaaS Sistem Mimarisi, AI Entegrasyonu & Uçtan Uca Geliştirme",
      "stack": "TypeScript · Next.js 16 · Supabase (PostgreSQL, pgvector, Realtime, RLS) · Gemini 2.5 · Upstash · Cloudflare R2 · Jest"
    },
    "en": {
      "kind": "AI-Powered SaaS Hotel Concierge Platform · Flagship Project",
      "title": "Operairo",
      "badge": "AI SaaS · Live",
      "summary": "Autonomous hotel operations platform built with Google Gemini 2.5 Flash, Supabase pgvector RAG, Cloud TTS/STT, and Upstash infrastructure.",
      "lead": "Architected with a layered Next.js 16 Route Handlers architecture (19 REST endpoints), Supabase Realtime WebSocket staff feed, 5 LLM business tools (tool-calling), 2-tier Upstash rate limiting, PII masking, and Cloudflare R2 storage.",
      "features": [
        "Layered Next.js 16 architecture with 19 REST endpoints and decoupled service boundaries",
        "Google Gemini 2.5 Flash streaming chat via Vercel AI SDK and 5 LLM tool-calling actions",
        "Supabase PostgreSQL & pgvector vector similarity search (RAG) with custom match_hotel_documents SQL function",
        "Supabase Realtime (WebSocket) live staff feed and multi-tenant Row Level Security (RLS)",
        "Google Cloud TTS (Chirp 3 HD) & Web Speech API voice assistant with browser fallback chain",
        "Upstash Redis 2-tier rate limiting, prompt injection filter, PII masking, and QStash job queue"
      ],
      "role": "SaaS System Architecture, AI Integration & End-to-End Development",
      "stack": "TypeScript · Next.js 16 · Supabase (PostgreSQL, pgvector, Realtime, RLS) · Gemini 2.5 · Upstash · Cloudflare R2 · Jest"
    },
    "chips": [
      "Next.js 16",
      "Supabase",
      "pgvector",
      "Gemini 2.5 Flash",
      "Vercel AI SDK",
      "Upstash Redis",
      "Cloudflare R2"
    ],
    "links": [
      {
        "tr": "Canlı Landing Page",
        "en": "Live Landing Page",
        "href": "https://www.operairo.com"
      },
      {
        "tr": "Yönetim Paneli Girişi",
        "en": "Admin Portal Login",
        "href": "https://app.operairo.com/login"
      },
      {
        "tr": "Misafir Ekranı Demo",
        "en": "Guest Screen Demo",
        "href": "https://app.operairo.com/room/zeytinbagi-boutique/101/login"
      }
    ],
    "credentials": {
      "username": "demo@zeytinbagi-boutique.com",
      "password": "Zeytin2026!",
      "pin": "4821",
      "noteTr": "Yönetim Paneli: Selin Aydemir (Otel Müdürü) / Misafir Ekranı PIN: 4821",
      "noteEn": "Admin Portal: Selin Aydemir (Hotel Manager) / Guest Screen PIN: 4821"
    }
  },
  {
    "id": "instaflow",
    "order": 2,
    "featured": true,
    "status": "active",
    "tags": [
      "ai",
      "web"
    ],
    "mark": "IF",
    "media": "m2",
    "tr": {
      "kind": "Otonom Yapay Zekâ Instagram Otomasyonu & CRM · Mikroservis",
      "title": "InstaFlow AI",
      "badge": "AI Agent & Mikroservis",
      "summary": "Trendleri internetten tarayarak otonom Instagram içerikleri üreten Python AI Ajanı, Telegram Bot onay mekanizması ve Meta Graph API entegrasyonlu Sosyal CRM.",
      "lead": "TypeScript (Node.js/Express), Python, React (Vite), MongoDB ve Docker Compose ile bağımsız mikroservis mimarisinde geliştirilmiş uçtan uca otomasyon platformu.",
      "features": [
        "Python tabanlı otonom yapay zeka ajanı (AI Agent) ile trend tarama ve metin/hashtag üretimi",
        "Mobil onay için Telegram Bot entegrasyonu ve React tabanlı web yönetim paneli",
        "Meta Graph API entegrasyonuyla planlanmış gönderi paylaşımı, gelen kutusu (DM) ve yorum CRM yönetimi",
        "Dayanıklı (resilient) arka plan kuyruk ve zamanlayıcı (worker/scheduler) mimarisi",
        "Tüm servislerin saniyeler içinde ayağa kaldırılmasını sağlayan Docker Compose kapsayıcılaştırması"
      ],
      "role": "Mikroservis Mimarisi, AI Ajanı & Full Stack Geliştirme",
      "stack": "TypeScript · Python · React (Vite) · MongoDB · Docker Compose · Meta Graph API · Telegram Bot"
    },
    "en": {
      "kind": "Autonomous AI Instagram Automation & Social CRM · Microservices",
      "title": "InstaFlow AI",
      "badge": "AI Agent & Microservices",
      "summary": "Python AI Agent scraping trends to produce Instagram posts, with Telegram Bot approval mechanism and Meta Graph API-backed Social CRM.",
      "lead": "End-to-end automation platform built on a decoupled microservices architecture with TypeScript (Node.js/Express), Python, React (Vite), MongoDB, and Docker Compose.",
      "features": [
        "Python-based autonomous AI agent conducting web trend analysis and multi-modal content generation",
        "Telegram Bot integration for rapid mobile approval and web React Dashboard",
        "Meta Graph API integration for automated scheduling, Direct Message inbox, and comment CRM",
        "Resilient background worker & scheduler architecture for timed publishing",
        "Full containerization with Docker Compose for seamless local and production orchestration"
      ],
      "role": "Microservices Architecture, AI Agent & Full Stack Development",
      "stack": "TypeScript · Python · React (Vite) · MongoDB · Docker Compose · Meta Graph API · Telegram Bot"
    },
    "chips": [
      "Python",
      "TypeScript",
      "Docker Compose",
      "React",
      "MongoDB",
      "Meta Graph API",
      "Telegram Bot"
    ],
    "links": [
      {
        "tr": "GitHub'da İncele",
        "en": "View on GitHub",
        "href": "https://github.com/hamzakyb/InstaFlow-ai"
      }
    ]
  },
  {
    "id": "bist100",
    "order": 3,
    "featured": true,
    "status": "active",
    "tags": [
      "ai",
      "web"
    ],
    "mark": "BIST",
    "media": "m3",
    "tr": {
      "kind": "Fintech Yapay Zekâ & Çoklu Ajan (CrewAI) · BIST 100",
      "title": "BIST 100 Çoklu-Ajan Portföy ve Tahmin",
      "badge": "CrewAI & PyTorch",
      "summary": "Apple Silicon (MPS) hızlandırmalı PyTorch derin öğrenme modelleri ve CrewAI çoklu-ajan orkestrasyonuyla donatılmış yeni nesil otonom finansal analiz platformu.",
      "lead": "BIST 100 hisseleri için PyTorch derin öğrenme modelleri, LLM destekli otonom çoklu-ajan orkestrasyonu, MongoDB RAG hafızası ve Next.js 14 Dashboard arayüzü ile portföy optimizasyonu.",
      "features": [
        "Apple Silicon (MPS) donanım hızlandırmalı PyTorch derin öğrenme modelleri",
        "CrewAI çoklu-ajan (Multi-Agent) orkestrasyonu ile otonom finansal analiz ve karar mekanizması",
        "MongoDB tabanlı RAG (Retrieval-Augmented Generation) piyasa hafıza katmanı",
        "Next.js 14 Dashboard arayüzü ile gerçek zamanlı hisse ve portföy takibi"
      ],
      "role": "Derin Öğrenme, Ajan Mimarisi & Dashboard Geliştirme",
      "stack": "Python · PyTorch · CrewAI · Next.js 14 · MongoDB · Tailwind CSS · Apple Silicon MPS"
    },
    "en": {
      "kind": "Fintech AI & Multi-Agent (CrewAI) · BIST 100",
      "title": "BIST 100 Multi-Agent Portfolio & Forecasting",
      "badge": "CrewAI & PyTorch",
      "summary": "Next-generation autonomous financial analysis platform equipped with Apple Silicon (MPS) PyTorch deep learning models and CrewAI multi-agent orchestration.",
      "lead": "Autonomous LLM agents analyzing BIST 100 market trends, backed by MongoDB RAG memory and a modern Next.js 14 dashboard interface for portfolio management.",
      "features": [
        "PyTorch deep learning models accelerated via Apple Silicon (MPS)",
        "CrewAI multi-agent orchestration for autonomous financial research and strategy formulation",
        "MongoDB-backed RAG memory storing historical market context and filings",
        "Modern Next.js 14 App Router dashboard with real-time financial charts"
      ],
      "role": "Deep Learning, Multi-Agent Architecture & Dashboard Development",
      "stack": "Python · PyTorch · CrewAI · Next.js 14 · MongoDB · Tailwind CSS · Apple Silicon MPS"
    },
    "chips": [
      "PyTorch",
      "CrewAI",
      "Python",
      "Next.js 14",
      "MongoDB",
      "RAG",
      "Apple Silicon MPS"
    ],
    "links": [
      {
        "tr": "GitHub'da İncele",
        "en": "View on GitHub",
        "href": "https://github.com/hamzakyb/Otonom-coklu-ajan-borsa-tahmin-ve-portfoy-yonetim-sistemi"
      }
    ]
  },
  {
    "id": "seyda-360",
    "order": 4,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "360",
    "media": "m4",
    "tr": {
      "kind": "İnteraktif 360° Sanal Tur & Sürükle-Bırak CMS",
      "title": "İnteraktif Mimari Görselleştirme (Seyda HMZ)",
      "badge": "360° Sanal Tur & CMS",
      "summary": "Mimari projeler için 2D/360° panoramik sahneler ve sanal tur rotaları oluşturan, sürükle-bırak destekli özel CMS web uygulaması.",
      "lead": "Kullanıcıların sahne geçişlerini, hotspot noktalarını, marka kimliklerini ve ambiyans seslerini anlık olarak düzenleyebildiği, sürükle-bırak destekli ve canlı önizlemeli özel bir CMS geliştirildi.",
      "features": [
        "2D ve 360° panoramik sahne motoru ve akıcı sanal tur geçişleri",
        "Etkileşim noktaları (hotspot), marka kimliği (renk/logo) ve ambiyans seslerini düzenleyen özel sürükle-bırak CMS",
        "Görsel yoğunluğu yüksek projede optimize edilmiş veri akışları ve anlık durum (state) yönetimi",
        "Admin panelinden canlı önizlemeli anlık düzenleme altyapısı"
      ],
      "role": "360° Görüntüleyici Mimarisi, CMS Tasarımı & Frontend Geliştirme",
      "stack": "Next.js · React · 360 Panorama · Drag & Drop CMS · State Engine · Tailwind CSS"
    },
    "en": {
      "kind": "Interactive 360° Virtual Tour & Drag-and-Drop CMS",
      "title": "Interactive Architectural Visualization (Seyda HMZ)",
      "badge": "360° Virtual Tour & CMS",
      "summary": "Full-featured web application creating 2D/360° panoramic tours for architectural projects, featuring a custom drag-and-drop CMS.",
      "lead": "High-performance platform allowing users to manipulate scene transitions, interactive hotspots, branding, and ambient audio with live preview.",
      "features": [
        "2D and 360° panoramic view engine with smooth transitions",
        "Custom drag-and-drop CMS managing hotspots, branding, colors, and spatial audio",
        "Optimized data pipelines and reactive state management for heavy visual assets",
        "Instant live preview while configuring tours in the admin panel"
      ],
      "role": "360° Viewer Architecture, CMS Design & Frontend Development",
      "stack": "Next.js · React · 360 Panorama · Drag & Drop CMS · State Engine · Tailwind CSS"
    },
    "chips": [
      "Next.js",
      "React",
      "360° Panorama",
      "Custom CMS",
      "Tailwind CSS"
    ],
    "links": [
      {
        "tr": "Canlı Turu Aç",
        "en": "Open Live Tour",
        "href": "https://seyda-hmz.vercel.app"
      },
      {
        "tr": "CMS Admin Paneli",
        "en": "CMS Admin Portal",
        "href": "https://seyda-hmz.vercel.app/admin"
      },
      {
        "tr": "GitHub'da İncele",
        "en": "View on GitHub",
        "href": "https://github.com/hamzakyb/seyda-hmz"
      }
    ],
    "credentials": {
      "username": "admin",
      "password": "admin123",
      "noteTr": "Admin CMS Demo Girişi: admin / admin123",
      "noteEn": "Admin CMS Demo Access: admin / admin123"
    }
  },
  {
    "id": "deqoin",
    "order": 5,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "DQ",
    "media": "m5",
    "tr": {
      "kind": "Kurumsal Web Platformu & UI Tasarım Sistemi",
      "title": "Deqoin Design Studio",
      "badge": "UI Mühendisliği & Next.js",
      "summary": "Deqoin markası için Next.js ve Tailwind CSS altyapısıyla geliştirilen modern, kullanıcı odaklı ve yüksek performanslı kurumsal web platformu.",
      "lead": "Next.js App Router mimarisi, yeniden kullanılabilir React UI bileşenleri ve UAT süreçleriyle optimize edilmiş ölçeklenebilir frontend altyapısı.",
      "features": [
        "Next.js App Router mimarisi ve SSR/SSG sayfa optimizasyonları",
        "Yeniden kullanılabilir, ölçeklenebilir React UI bileşen kütüphanesi ve tasarım sistemi",
        "Platformun görsel yenileme (overhaul) operasyonlarıyla UX ve hız iyileştirmesi",
        "Detaylı test senaryoları ve mock verilerle yürütülen UAT testleri"
      ],
      "role": "Frontend Engineering & UI Bileşen Mimarisi",
      "stack": "Next.js · Tailwind CSS · React · TypeScript · Design System"
    },
    "en": {
      "kind": "Corporate Web Platform & UI Design System",
      "title": "Deqoin Design Studio",
      "badge": "UI Engineering & Next.js",
      "summary": "Modern, high-performance corporate platform and reusable design system built for Deqoin using Next.js and Tailwind CSS.",
      "lead": "Scalable frontend infrastructure built on Next.js App Router, modular React UI components, and rigorous UAT testing with mock data.",
      "features": [
        "Next.js App Router architecture with SSR/SSG optimization",
        "Reusable, scalable React UI component library and design system",
        "UX and page load performance overhaul operations",
        "UAT testing workflow with mock datasets and automated test scenarios"
      ],
      "role": "Frontend Engineering & UI Component Architecture",
      "stack": "Next.js · Tailwind CSS · React · TypeScript · Design System"
    },
    "chips": [
      "Next.js",
      "Tailwind CSS",
      "React",
      "TypeScript",
      "Design Systems"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://www.deqoin.com"
      },
      {
        "tr": "GitHub'da İncele",
        "en": "View on GitHub",
        "href": "https://github.com/deqoin-website/Deqoin-new"
      }
    ]
  },
  {
    "id": "step",
    "order": 6,
    "featured": true,
    "status": "active",
    "tags": [
      "ecommerce",
      "web"
    ],
    "mark": "SF",
    "media": "m6",
    "tr": {
      "kind": "B2B & E-Ticaret Platformu · Aktif Kullanılıyor",
      "title": "Step Filtre",
      "badge": "B2B & E-Ticaret · Üretim",
      "summary": "Filtre üreticisi iş birimlerinin talepleri doğrultusunda toptan ve perakende satış süreçlerini tek panelde birleştiren B2B platformu.",
      "lead": "Kapsamlı iş analizi yapılarak tasarlanan; stok yönetimi, Excel toplu ürün/fiyat aktarımı ve bayi sipariş akışlarını yöneten uçtan uca sistem.",
      "features": [
        "İş birimleriyle fonksiyonel ve teknik iş analizi süreçleri",
        "Toptan ve perakende operasyonlarını birleştiren tekil yönetim paneli",
        "Excel ile toplu ürün, stok ve dinamik fiyatlandırma güncellemesi",
        "Bayi ve son kullanıcı sipariş akışlarının koordinasyonu"
      ],
      "role": "İş Analizi, Sistem Mimarisi & Uçtan Uca Geliştirme",
      "stack": "React · Node.js · MongoDB · Excel Import Engine · REST API"
    },
    "en": {
      "kind": "B2B & E-Commerce Platform · In Active Use",
      "title": "Step Filtre",
      "badge": "B2B & E-Commerce · Production",
      "summary": "B2B management platform merging wholesale and retail operations into a unified portal based on filter manufacturer requirements.",
      "lead": "Designed through rigorous business analysis: end-to-end system managing inventory, bulk Excel catalog/price operations, and dealer orders.",
      "features": [
        "Business analysis and requirement translation with operational stakeholders",
        "Unified management panel merging wholesale and retail operations",
        "Bulk Excel product, stock, and tiered pricing updates",
        "Multi-tier customer order tracking and catalog management"
      ],
      "role": "Business Analysis, Architecture & Full-Stack Development",
      "stack": "React · Node.js · MongoDB · Excel Import Engine · REST API"
    },
    "chips": [
      "React",
      "Node.js",
      "MongoDB",
      "Excel Import",
      "B2B Architecture",
      "İş Analizi"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://www.stepfiltre.com.tr/"
      }
    ]
  },
  {
    "id": "barkone",
    "order": 7,
    "featured": false,
    "status": "active",
    "tags": [
      "ecommerce",
      "web"
    ],
    "mark": "BK",
    "media": "m7",
    "tr": {
      "kind": "E-Ticaret Platformu · Aktif Kullanılıyor",
      "title": "Barkone",
      "badge": "E-Ticaret · Canlı",
      "summary": "Next.js ile geliştirilen, uçtan uca çalışan e-ticaret platformu ve modüler yönetim paneli.",
      "lead": "Ürün kataloğu, dinamik kategori yapısı, sipariş akışı ve yönetim paneli tek bir çatı altında; SEO uyumlu ve yüksek hızlı.",
      "features": [
        "Next.js ile hızlı sayfa yükleme ve SEO uyumlu render",
        "Gelişmiş ürün kataloğu ve sepet/sipariş akışı",
        "Yönetim paneli üzerinden ürün, stok ve içerik kontrolü"
      ],
      "role": "Tasarım & Full Stack Geliştirme",
      "stack": "Next.js · React · Node.js · Tailwind CSS"
    },
    "en": {
      "kind": "E-Commerce Platform · In Active Use",
      "title": "Barkone",
      "badge": "E-Commerce · Live",
      "summary": "End-to-end e-commerce platform and modular management panel built with Next.js.",
      "lead": "Integrated product catalogue, dynamic categories, order pipeline, and admin panel with SEO and high-speed delivery.",
      "features": [
        "Next.js fast page loads and SEO-optimized rendering",
        "Advanced product catalog, cart and checkout flows",
        "Admin panel for catalog, stock and content management"
      ],
      "role": "Design & Full Stack Development",
      "stack": "Next.js · React · Node.js · Tailwind CSS"
    },
    "chips": [
      "Next.js",
      "React",
      "Node.js",
      "Tailwind CSS",
      "E-Commerce"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://www.barkone.com.tr"
      },
      {
        "tr": "Admin Paneli",
        "en": "Admin Portal",
        "href": "https://www.barkone.com.tr/admin"
      },
      {
        "tr": "GitHub'da İncele",
        "en": "View on GitHub",
        "href": "https://github.com/hamzakyb/bark-one"
      }
    ],
    "credentials": {
      "username": "admin",
      "password": "barkone2024",
      "noteTr": "Admin Paneli Demo Girişi: admin / barkone2024",
      "noteEn": "Admin Portal Demo Access: admin / barkone2024"
    }
  },
  {
    "id": "asra",
    "order": 8,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "AC",
    "media": "m8",
    "tr": {
      "kind": "Özelleştirilebilir Otel Web Sitesi & Modüler CMS",
      "title": "Asra Cave Hotel",
      "badge": "Modüler CMS · Vercel",
      "summary": "Site düzeninin, bileşenlerin ve görsel hiyerarşinin admin panelinden anlık değiştirilebildiği otel web platformu.",
      "lead": "Ata Bilgisayar bünyesinde geliştirilen; otel içerik süreçlerini modelleyerek Next.js ve Tailwind CSS ile frontend’e hatasız yansıyan render mimarisi.",
      "features": [
        "Bileşen bazlı modüler CMS mimarisi",
        "Sayfa bloklarının kod yazmadan doğrudan admin panelinden yeniden düzenlenmesi",
        "SEO uyumlu ve yüksek hızlı Next.js render altyapısı"
      ],
      "role": "İş Analizi, CMS Mimarisi & Geliştirme",
      "stack": "Next.js · Tailwind CSS · Modüler CMS · Vercel"
    },
    "en": {
      "kind": "Customizable Hotel Website & Modular CMS",
      "title": "Asra Cave Hotel",
      "badge": "Modular CMS · Vercel",
      "summary": "Hotel web platform allowing instant modification of layout, components, and visual hierarchy from the admin panel.",
      "lead": "Developed at Ata Bilgisayar: models hotel content workflows with a Next.js and Tailwind CSS render engine mirroring admin edits in real time.",
      "features": [
        "Component-based modular CMS architecture",
        "Rearranging page blocks without code modifications",
        "SEO-friendly and high-performance Next.js rendering"
      ],
      "role": "Business Analysis, CMS Architecture & Development",
      "stack": "Next.js · Tailwind CSS · Modular CMS · Vercel"
    },
    "chips": [
      "Next.js",
      "Tailwind CSS",
      "Modular CMS",
      "Vercel"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://asracavehotel.vercel.app/"
      },
      {
        "tr": "Admin Paneli",
        "en": "Admin Portal",
        "href": "https://asracavehotel.vercel.app/admin"
      },
      {
        "tr": "GitHub'da İncele",
        "en": "View on GitHub",
        "href": "https://github.com/hamzakyb/asracave"
      }
    ],
    "credentials": {
      "username": "ata",
      "password": "1234",
      "noteTr": "Admin Paneli Demo Girişi: ata / 1234",
      "noteEn": "Admin Portal Demo Access: ata / 1234"
    }
  },
  {
    "id": "uren",
    "order": 9,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "ÜG",
    "media": "m9",
    "tr": {
      "kind": "Kurumsal Web Sitesi · Aktif Kullanılıyor",
      "title": "Üren Global",
      "badge": "Kurumsal · Canlı",
      "summary": "Kurumsal tanıtım sitesi; içerik ve sayfa düzeni yönetim paneli üzerinden güncelleniyor.",
      "lead": "Yönetim paneli üzerinden içerik ve sayfa düzeni güncellenebilen kurumsal web sitesi.",
      "features": [
        "Kurumsal tanıtım ve hizmet sayfaları",
        "Admin panelinden içerik güncelleme",
        "Mobil öncelikli responsive tasarım"
      ],
      "role": "Tasarım ve geliştirme",
      "stack": "React · Node.js · Express"
    },
    "en": {
      "kind": "Corporate Website · In Active Use",
      "title": "Üren Global",
      "badge": "Corporate · Live",
      "summary": "A corporate website whose content and page layout are managed through an admin panel.",
      "lead": "Corporate website with content and page layout managed through an admin panel.",
      "features": [
        "Corporate presentation and service pages",
        "Content updates from the admin panel",
        "Mobile-first responsive design"
      ],
      "role": "Design and development",
      "stack": "React · Node.js · Express"
    },
    "chips": [
      "React",
      "Node.js",
      "Admin Panel",
      "REST API"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://www.urenglobal.com"
      },
      {
        "tr": "Admin Paneli",
        "en": "Admin Portal",
        "href": "https://www.urenglobal.com/admin"
      },
      {
        "tr": "GitHub'da İncele",
        "en": "View on GitHub",
        "href": "https://github.com/hamzakyb/uren-global"
      }
    ],
    "credentials": {
      "username": "admin",
      "password": "admin123",
      "noteTr": "Admin Paneli Demo Girişi: admin / admin123",
      "noteEn": "Admin Portal Demo Access: admin / admin123"
    }
  },
  {
    "id": "mbseyda",
    "order": 10,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "MB",
    "media": "m10",
    "tr": {
      "kind": "Kurumsal Web Sitesi · Aktif Kullanılıyor",
      "title": "MB Seyda İnşaat",
      "badge": "Kurumsal · Canlı",
      "summary": "İnşaat firması için dinamik proje vitrini ve referans yönetim sistemi.",
      "lead": "İnşaat firması için proje ve referans vitrini; içerikler yönetim paneli üzerinden güncelleniyor.",
      "features": [
        "Proje ve referans galerisi",
        "İçeriklerin admin panelinden güncellenmesi",
        "Kurumsal iletişim sayfası"
      ],
      "role": "Tasarım ve geliştirme",
      "stack": "React · Node.js"
    },
    "en": {
      "kind": "Corporate Website · In Active Use",
      "title": "MB Seyda İnşaat",
      "badge": "Corporate · Live",
      "summary": "A project and reference showcase for a construction company.",
      "lead": "A project and reference showcase for a construction company, with content editable from the admin panel.",
      "features": [
        "Project and reference gallery",
        "Content updates from the admin panel",
        "Corporate contact page"
      ],
      "role": "Design and development",
      "stack": "React · Node.js"
    },
    "chips": [
      "React",
      "Node.js",
      "Portfolio CMS"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://www.mbseydainsaat.com.tr"
      },
      {
        "tr": "Admin Paneli",
        "en": "Admin Portal",
        "href": "https://www.mbseydainsaat.com.tr/admin"
      },
      {
        "tr": "GitHub'da İncele",
        "en": "View on GitHub",
        "href": "https://github.com/hamzakyb/mb-seyda"
      }
    ],
    "credentials": {
      "username": "admin@mbseyda.com",
      "password": "mbseyda_admin",
      "noteTr": "Admin Paneli Demo Girişi: admin@mbseyda.com / mbseyda_admin",
      "noteEn": "Admin Portal Demo Access: admin@mbseyda.com / mbseyda_admin"
    }
  },
  {
    "id": "ilac",
    "order": 11,
    "featured": false,
    "status": "active",
    "tags": [
      "ai"
    ],
    "mark": "NLP",
    "media": "m11",
    "tr": {
      "kind": "Yapay Zekâ · Doğal Dil İşleme (BERTurk)",
      "title": "İlaç Yan Etki Tahmin Sistemi",
      "badge": "NLP · BERTurk",
      "summary": "Kullanıcının yazdığı ilaç adına göre olası yan etkileri tahmin eden model. BERTurk ile eğitildi, canlı demo Hugging Face Spaces üzerinde yayında.",
      "lead": "Kullanıcının yazdığı ilaç adına göre olası yan etkileri tahmin eden doğal dil işleme modeli. BERTurk ile eğitildi; Hugging Face Spaces üzerinde canlı demo.",
      "features": [
        "BERTurk tabanlı Türkçe dil modeli",
        "İlaç adından yan etki tahmini",
        "Hugging Face Spaces üzerinde herkese açık demo",
        "Basit ve tek alanlı kullanıcı arayüzü"
      ],
      "role": "Model eğitimi ve arayüz",
      "stack": "Python · BERTurk · Transformers · Hugging Face"
    },
    "en": {
      "kind": "Artificial Intelligence · NLP",
      "title": "Drug Side-Effect Prediction System",
      "badge": "NLP · BERTurk",
      "summary": "A model that predicts possible side effects from the drug name a user types. Fine-tuned with BERTurk, with a live demo on Hugging Face Spaces.",
      "lead": "A natural language processing model fine-tuned with BERTurk that predicts possible side effects from the drug name a user types. Live demo published on Hugging Face Spaces.",
      "features": [
        "Turkish language model based on BERTurk",
        "Side-effect prediction from a drug name",
        "Public demo on Hugging Face Spaces",
        "Simple single-input user interface"
      ],
      "role": "Model training and interface",
      "stack": "Python · BERTurk · Transformers · Hugging Face"
    },
    "chips": [
      "Python",
      "BERTurk",
      "Transformers",
      "Hugging Face"
    ],
    "links": [
      {
        "tr": "Canlı Demoyu Dene",
        "en": "Try Live Demo",
        "href": "https://huggingface.co/spaces/Hamzakoybasi/ilac-yanetki-tahmin"
      }
    ]
  },
  {
    "id": "ar",
    "order": 12,
    "featured": false,
    "status": "active",
    "tags": [
      "ar"
    ],
    "mark": "AR",
    "media": "m12",
    "tr": {
      "kind": "Mobil · Artırılmış Gerçeklik (Unity & Vuforia)",
      "title": "AR Motor Bilgilendirme Sistemi",
      "badge": "Mobil · AR",
      "summary": "Gerçek bir otomobil motoru maketine artırılmış gerçeklik etkileşimleri entegre ettiğim mobil uygulama.",
      "lead": "Gerçek bir otomobil motoru maketine artırılmış gerçeklik etkileşimleri entegre ettim. Fiziksel motor üzerinde bir parça tarandığında ilgili bilgi ve video kullanıcıya gösteriliyor.",
      "features": [
        "Fiziksel motor parçalarının kamera ile tanınması",
        "Taranan parçaya ait metin ve video içeriği",
        "Unity ve Vuforia ile gerçek zamanlı takip",
        "Eğitim ve tanıtım amaçlı kullanım"
      ],
      "role": "Uygulama geliştirme ve AR entegrasyonu",
      "stack": "Unity · Vuforia · C# · Android"
    },
    "en": {
      "kind": "Mobile · Augmented Reality",
      "title": "AR Engine Information System",
      "badge": "Mobile · AR",
      "summary": "A mobile app in which I integrated augmented reality interactions with a real car engine model.",
      "lead": "I integrated augmented reality interactions with a real car engine model. When a part on the physical engine is scanned, the related information (text and video) is shown to the user.",
      "features": [
        "Recognition of physical engine parts through the camera",
        "Text and video content for the scanned part",
        "Real-time tracking with Unity and Vuforia",
        "Built for training and product presentation"
      ],
      "role": "App development and AR integration",
      "stack": "Unity · Vuforia · C# · Android"
    },
    "chips": [
      "Unity",
      "Vuforia",
      "C#",
      "Android"
    ],
    "links": [
      {
        "tr": "Uygulama Videosunu İzle (Google Drive)",
        "en": "Watch App Video (Google Drive)",
        "href": "https://drive.google.com/file/d/1iWKkqCqtkaBNarpF35dtxWMJXq8DMALc/view"
      }
    ]
  },
  {
    "id": "dapp",
    "order": 13,
    "featured": false,
    "status": "active",
    "tags": [
      "web3"
    ],
    "mark": "W3",
    "media": "m13",
    "tr": {
      "kind": "Web3 · Blokzincir dApp",
      "title": "Web3 Şehir Oylama Sistemi",
      "badge": "Web3 & Solidity",
      "summary": "Blokzincir üzerinde çalışan, şeffaf ve değiştirilemez bir oylama uygulaması.",
      "lead": "Blokzincir üzerinde çalışan oylama uygulaması: akıllı sözleşme ve MetaMask cüzdan bağlantısıyla şeffaf, değiştirilemez oylama.",
      "features": [
        "Solidity ile yazılmış akıllı sözleşme",
        "MetaMask ile cüzdan bağlantısı",
        "Zincire yazılan, değiştirilemez oy kayıtları",
        "React arayüzü üzerinden oy kullanımı"
      ],
      "role": "Akıllı sözleşme ve arayüz",
      "stack": "Solidity · Ethers.js · MetaMask · React"
    },
    "en": {
      "kind": "Web3 · dApp",
      "title": "Web3 City Voting System",
      "badge": "Web3 & Solidity",
      "summary": "A transparent, immutable voting application running on the blockchain.",
      "lead": "A blockchain-based voting application: transparent, immutable voting through a smart contract with MetaMask wallet connection.",
      "features": [
        "Smart contract written in Solidity",
        "Wallet connection through MetaMask",
        "Immutable vote records written on chain",
        "Voting through a React interface"
      ],
      "role": "Smart contract and interface",
      "stack": "Solidity · Ethers.js · MetaMask · React"
    },
    "chips": [
      "Solidity",
      "Ethers.js",
      "MetaMask",
      "React"
    ],
    "links": [
      {
        "tr": "GitHub'da İncele",
        "en": "View on GitHub",
        "href": "https://github.com/hamzakyb/dApp_Oylama"
      }
    ]
  },
  {
    "id": "aytemur",
    "order": 14,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "AP",
    "media": "m14",
    "tr": {
      "kind": "Kurumsal Web Sitesi · Canlı",
      "title": "Aytemur Pastanesi",
      "badge": "Kurumsal Web",
      "summary": "Pastane ve unlu mamuller markası için modern ürün vitrini ve kurumsal web sitesi.",
      "lead": "Geniş ürün yelpazesini modern ve iştah açıcı bir görsel sunumla kullanıcılara aktaran hızlı kurumsal web sitesi.",
      "features": [
        "Ürün ve lezzet kataloğu vitrini",
        "Mobil öncelikli modern görsel sunum",
        "Hızlı sayfa yükleme ve SEO optimizasyonu"
      ],
      "role": "Tasarım ve web geliştirme",
      "stack": "Next.js · React · Tailwind CSS · Vercel"
    },
    "en": {
      "kind": "Corporate Website · Live",
      "title": "Aytemur Pastanesi",
      "badge": "Corporate Web",
      "summary": "Modern product showcase and corporate website for an artisan bakery brand.",
      "lead": "Fast and responsive corporate website presenting a wide bakery assortment through an appetizing visual design.",
      "features": [
        "Product and pastry catalog showcase",
        "Mobile-first modern presentation",
        "Fast page loading and SEO optimization"
      ],
      "role": "Design and web development",
      "stack": "Next.js · React · Tailwind CSS · Vercel"
    },
    "chips": [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Vercel"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://aytemur-pastanesi-d61n.vercel.app"
      }
    ]
  },
  {
    "id": "erkan",
    "order": 15,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "Eİ",
    "media": "m15",
    "tr": {
      "kind": "Kurumsal Web Sitesi · Canlı",
      "title": "Erkan İnşaat",
      "badge": "Kurumsal Web",
      "summary": "İnşaat ve taahhüt projeleri için kurumsal kimlik ve proje tanıtım sitesi.",
      "lead": "Mimari ve taahhüt projelerinin sergilendiği, kurumsal güven veren modern web arayüzü.",
      "features": [
        "Tamamlanan ve devam eden proje galerisi",
        "Kurumsal tanıtım ve iletişim yapısı",
        "Mobil uyumlu hızlı arayüz"
      ],
      "role": "Tasarım ve web geliştirme",
      "stack": "Next.js · React · Tailwind CSS · Vercel"
    },
    "en": {
      "kind": "Corporate Website · Live",
      "title": "Erkan İnşaat",
      "badge": "Corporate Web",
      "summary": "Corporate identity and project portfolio showcase for a construction company.",
      "lead": "Modern corporate interface demonstrating completed and ongoing building developments.",
      "features": [
        "Completed and ongoing construction portfolio",
        "Corporate identity and contact pipeline",
        "Mobile-responsive layout"
      ],
      "role": "Design and web development",
      "stack": "Next.js · React · Tailwind CSS · Vercel"
    },
    "chips": [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Vercel"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://erkan-insaat.vercel.app"
      }
    ]
  },
  {
    "id": "berliner",
    "order": 16,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "BW",
    "media": "m16",
    "tr": {
      "kind": "Kurumsal Web Sitesi · Canlı",
      "title": "Berliner Waffle Cappadocia",
      "badge": "Kurumsal Web",
      "summary": "Kapadokya bölgesinde hizmet veren gastronomi işletmesi için dijital menü ve tanıtım sitesi.",
      "lead": "Ziyaretçilerin menüyü, lezzet çeşitlerini ve işletme konumunu kolayca inceleyebildiği kullanıcı dostu web sayfası.",
      "features": [
        "Dinamik dijital menü ve lezzet sunumları",
        "Bölgesel konum ve ziyaretçi yönlendirme entegrasyonu",
        "Mobil öncelikli akıcı tasarım"
      ],
      "role": "Tasarım ve web geliştirme",
      "stack": "Next.js · React · Tailwind CSS · Vercel"
    },
    "en": {
      "kind": "Corporate Website · Live",
      "title": "Berliner Waffle Cappadocia",
      "badge": "Corporate Web",
      "summary": "Digital menu and brand showcase website for a gastronomy enterprise located in Cappadocia.",
      "lead": "User-friendly web platform allowing guests to inspect the waffle menu, ingredients, and tourist location details.",
      "features": [
        "Dynamic digital menu and visual presentations",
        "Regional location and maps routing integration",
        "Mobile-first responsive UX"
      ],
      "role": "Design and web development",
      "stack": "Next.js · React · Tailwind CSS · Vercel"
    },
    "chips": [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Vercel"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://berlinerwaffle-cappadoccia.vercel.app"
      }
    ]
  },
  {
    "id": "hemcoffee",
    "order": 17,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "HC",
    "media": "m17",
    "tr": {
      "kind": "Kurumsal Web Sitesi · Canlı",
      "title": "Hem Coffee",
      "badge": "Kurumsal Web",
      "summary": "Nitelikli kahve kavurucusu ve kafe markası için modern kurumsal kimlik ve menü deneyimi.",
      "lead": "Özel çekirdek çeşitlerini, demleme yöntemlerini ve kahve kültürünü yansıtan şık ve modern web arayüzü.",
      "features": [
        "Özel kahve çekirdekleri ve içecek menüsü",
        "Minimalist ve marka kimliğini yansıtan arayüz",
        "Hızlı ve mobil optimize yapı"
      ],
      "role": "Tasarım ve web geliştirme",
      "stack": "Next.js · React · Tailwind CSS · Vercel"
    },
    "en": {
      "kind": "Corporate Website · Live",
      "title": "Hem Coffee",
      "badge": "Corporate Web",
      "summary": "Modern corporate identity and menu experience for a specialty coffee roaster and cafe brand.",
      "lead": "Refined web showcase presenting single-origin beans, roasting profiles, and artisanal coffee culture.",
      "features": [
        "Specialty coffee bean catalog and drinks menu",
        "Minimalist interface reflecting brand aesthetics",
        "High-speed mobile performance"
      ],
      "role": "Design and web development",
      "stack": "Next.js · React · Tailwind CSS · Vercel"
    },
    "chips": [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Vercel"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://hemcoffee.vercel.app"
      }
    ]
  },
  {
    "id": "hmz",
    "order": 18,
    "featured": false,
    "status": "active",
    "tags": [
      "web"
    ],
    "mark": "HMZ",
    "media": "m18",
    "tr": {
      "kind": "Yazılım Hizmetleri & Portfolyo Sitesi",
      "title": "HMZ Solutions",
      "badge": "Yazılım Hizmetleri",
      "summary": "Özel yazılım ve dijital dönüşüm hizmetleri için kurumsal vitrin ve iletişim platformu.",
      "lead": "Yazılım hizmetleri, dijitalleşme ve süreç danışmanlığı için kurumsal kimlik ve tanıtım sitesi.",
      "features": [
        "Hizmet ve referans bölümleri",
        "SEO uyumlu sayfa yapısı",
        "Hızlı yükleme için optimize edilmiş arayüz"
      ],
      "role": "Tasarım ve geliştirme",
      "stack": "Next.js · React"
    },
    "en": {
      "kind": "Corporate Website · In active use",
      "title": "HMZ Solutions",
      "badge": "In active use",
      "summary": "Corporate identity and presentation site for software services.",
      "lead": "Corporate identity and presentation site for software services.",
      "features": [
        "Service and reference sections",
        "SEO-friendly page structure",
        "Interface optimised for fast loading"
      ],
      "role": "Design and development",
      "stack": "Next.js · React"
    },
    "chips": [
      "Next.js",
      "React"
    ],
    "links": [
      {
        "tr": "Canlı Siteyi Aç",
        "en": "Open Live Site",
        "href": "https://www.hmzsolutions.com.tr"
      }
    ]
  }
];

  var DEFAULT_SERVICES = [
  {
    "id": "srv-1",
    "number": "01",
    "tr": {
      "title": "Yapay Zekâ, RAG & SaaS Mimarisi",
      "desc": "Büyük dil modelleri (LLM), pgvector ile vektör benzerlik araması (RAG), otonom ajanlar ve sesli asistanlar. İş süreçlerini otonomlaştıran uçtan uca SaaS platformları.",
      "items": [
        "Google Gemini, Vercel AI SDK & Tool-Calling",
        "Supabase pgvector ile RAG ve Semantik Arama",
        "Otonom AI Ajanları (CrewAI, LangChain)",
        "Google Cloud TTS & Web Speech STT sesli asistan"
      ]
    },
    "en": {
      "title": "Artificial Intelligence, RAG & SaaS",
      "desc": "LLMs, vector similarity search with pgvector (RAG), autonomous multi-agents, and voice synthesis. End-to-end SaaS platforms that automate business operations.",
      "items": [
        "Google Gemini, Vercel AI SDK & Tool-Calling",
        "Supabase pgvector RAG & Semantic Search",
        "Autonomous AI Agents (CrewAI, LangChain)",
        "Google Cloud TTS & Web Speech STT voice assistant"
      ]
    }
  },
  {
    "id": "srv-2",
    "number": "02",
    "tr": {
      "title": "İş Analizi & Süreç Yönetimi (YBS Vizyonu)",
      "desc": "Yönetim Bilişim Sistemleri bakış açısıyla; iş birimlerinin operasyonel taleplerini dinleyerek fonksiyonel gereksinimlere dönüştürme ve teknik süreçleri modelleme.",
      "items": [
        "Kapsamlı iş analizi ve süreç modelleme",
        "UAT (Kullanıcı Kabul Testleri) ve test senaryoları",
        "İleri düzey SQL veri modelleme ve raporlama",
        "Operasyonel akışların dijital platforma aktarımı"
      ]
    },
    "en": {
      "title": "Business Analysis & Process Modeling (MIS)",
      "desc": "Driven by Management Information Systems vision: capturing operational requirements, mapping process workflows, and translating them into technical architectures.",
      "items": [
        "Comprehensive business analysis & process modeling",
        "UAT (User Acceptance Testing) & test scenarios",
        "Advanced SQL data modeling & reporting",
        "Translating operations into digital architectures"
      ]
    }
  },
  {
    "id": "srv-3",
    "number": "03",
    "tr": {
      "title": "Modern Web, UI Mühendisliği & CMS",
      "desc": "Next.js App Router, Tailwind CSS ve ölçeklenebilir tasarım sistemleriyle yüksek performanslı web uygulamaları ve müşterinin kod yazmadan yönettiği modüler CMS panelleri.",
      "items": [
        "Next.js (App Router) & React bileşen mimarisi",
        "Modüler, özelleştirilebilir CMS panel altyapıları",
        "Performans, SEO ve Core Web Vitals optimizasyonu"
      ]
    },
    "en": {
      "title": "Modern Web, UI Engineering & CMS",
      "desc": "Next.js App Router, Tailwind CSS, and scalable design systems for high-performance applications and modular CMS panels that clients manage with zero coding.",
      "items": [
        "Next.js (App Router) & React component systems",
        "Modular, customizable CMS administrative panels",
        "Performance, SEO, and Core Web Vitals optimization"
      ]
    }
  },
  {
    "id": "srv-4",
    "number": "04",
    "tr": {
      "title": "E-Ticaret, B2B & Çok Kanallı Sistemler",
      "desc": "Üreticiler ve markalar için sipariş, stok, bayi bazlı fiyatlandırma ve Excel toplu veri aktarımını tek merkezde birleştiren dayanıklı e-ticaret sistemleri.",
      "items": [
        "B2B bayi yönetim portalları ve fiyatlandırma",
        "Excel ile toplu ürün/fiyat/stok entegrasyonu",
        "Çok kanallı sipariş ve müşteri takibi"
      ]
    },
    "en": {
      "title": "E-Commerce, B2B & Multi-Channel Systems",
      "desc": "Resilient commerce platforms merging catalog, inventory, multi-tiered pricing, and bulk Excel data imports into a unified control plane.",
      "items": [
        "B2B dealer management portals & pricing logic",
        "Bulk Excel product/price/inventory import pipelines",
        "Multi-channel order & customer pipeline"
      ]
    }
  }
];

  var DEFAULT_SKILLS = [
  {
    "id": "cat-mis",
    "number": "01",
    "tr": {
      "title": "İş Analizi & Süreç Yönetimi",
      "desc": "YBS vizyonuyla operasyonel süreçlerin analizi, modellenmesi ve dijitalleştirilmesi."
    },
    "en": {
      "title": "Business Analysis & Process Modeling",
      "desc": "Analyzing, modeling and digitizing operational business processes with an MIS vision."
    },
    "chips": [
      "İş Analizi",
      "Süreç Modelleme",
      "UAT (Kullanıcı Kabul Testleri)",
      "Test Senaryosu Hazırlama",
      "İleri Düzey SQL Raporlama",
      "MS Office (İleri Excel)",
      "Fonksiyonel Gereksinimler"
    ]
  },
  {
    "id": "cat-ai",
    "number": "02",
    "tr": {
      "title": "Yapay Zekâ, RAG & Otonom Ajanlar",
      "desc": "Büyük dil modelleri, vektör benzerlik araması ve otonom çoklu-ajan mimarileri."
    },
    "en": {
      "title": "AI, RAG & Autonomous Agents",
      "desc": "Large language models, vector similarity search, and multi-agent orchestration."
    },
    "chips": [
      "Google Gemini 2.5 Flash",
      "Vercel AI SDK (streamText)",
      "pgvector (Vektör Arama)",
      "RAG Mimarisi",
      "CrewAI (Çoklu Ajan)",
      "LLM Tool-Calling",
      "BERTurk / Transformers",
      "Google Cloud TTS",
      "Web Speech API"
    ]
  },
  {
    "id": "cat-frontend",
    "number": "03",
    "tr": {
      "title": "Frontend & UI Mühendisliği",
      "desc": "Next.js App Router, ölçeklenebilir tasarım sistemleri ve performans odaklı arayüzler."
    },
    "en": {
      "title": "Frontend & UI Engineering",
      "desc": "Next.js App Router, scalable design systems and performance-tuned interfaces."
    },
    "chips": [
      "Next.js (App Router)",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Tasarım Sistemleri",
      "React Native",
      "HTML5 / CSS3",
      "JavaScript"
    ]
  },
  {
    "id": "cat-backend",
    "number": "04",
    "tr": {
      "title": "Backend, Bulut & DevOps",
      "desc": "Katmanlı API mimarileri, gerçek zamanlı veritabanları ve dayanıklı kuyruk sistemleri."
    },
    "en": {
      "title": "Backend, Cloud & DevOps",
      "desc": "Layered API architecture, real-time databases and resilient queuing pipelines."
    },
    "chips": [
      "Node.js",
      "Nest.js",
      "Supabase (Auth, RLS, Realtime)",
      "PostgreSQL",
      "MongoDB",
      "Docker Compose",
      "Upstash Redis & QStash",
      "Cloudflare R2",
      "REST API (Route Handlers)"
    ]
  },
  {
    "id": "cat-ar-web3",
    "number": "05",
    "tr": {
      "title": "Mobil, AR & Web3",
      "desc": "Fiziksel nesne takipli artırılmış gerçeklik ve blokzincir akıllı sözleşmeleri."
    },
    "en": {
      "title": "Mobile, AR & Web3",
      "desc": "Real-time object-tracking AR and blockchain smart contracts."
    },
    "chips": [
      "Unity & Vuforia (AR Motor Takibi)",
      "Solidity",
      "Ethers.js",
      "MetaMask",
      "dApp"
    ]
  }
];

  var DEFAULT_EXPERIENCES = [
  {
    "id": "exp-deqoin",
    "period": "2026",
    "company": "Deqoin Design Studio",
    "roleTr": "Full Stack Yazılım Geliştirici",
    "roleEn": "Full Stack Developer",
    "badge": "Frontend Engineering & UI Systems",
    "tr": {
      "lead": "Deqoin markası için Next.js ve Tailwind CSS altyapısıyla modern, kullanıcı odaklı ve yüksek performanslı web arayüzleri geliştirme.",
      "points": [
        "Tasarım süreçlerini doğrudan koda entegre ederek (Frontend Engineering); React tabanlı, yeniden kullanılabilir UI bileşenleri ve ölçeklenebilir tasarım sistemleri inşa ettim.",
        "Next.js 'App Router' mimarisini kurguladım; arayüz bileşenleri için detaylı test senaryoları hazırlayarak ve mock verilerle UAT (Kullanıcı Kabul Testleri) süreçlerini yöneterek sayfa optimizasyonunu sağladım.",
        "Platformun görsel yenileme (overhaul) operasyonlarını frontend seviyesinde gerçekleştirerek, kullanıcı deneyimini (UX) ve sayfa yükleme performansını iyileştirdim."
      ],
      "tech": "Next.js (App Router) · Tailwind CSS · React · UAT · UI Component Architecture"
    },
    "en": {
      "lead": "Developed modern, user-centric, and high-performance web user interfaces (UI) using Next.js and Tailwind CSS for Deqoin.",
      "points": [
        "Integrated design workflows directly into code (Frontend Engineering); engineered reusable React UI components and scalable design systems.",
        "Architected Next.js App Router; drafted comprehensive test scenarios and conducted UAT (User Acceptance Testing) with mock datasets to optimize page flows.",
        "Executed frontend visual overhaul operations, measurably boosting user experience (UX) and page loading performance."
      ],
      "tech": "Next.js (App Router) · Tailwind CSS · React · UAT · UI Component Architecture"
    }
  },
  {
    "id": "exp-ata",
    "period": "2025",
    "company": "Ata Bilgisayar",
    "roleTr": "Full Stack Yazılım Geliştirici",
    "roleEn": "Full Stack Developer",
    "badge": "İş Analizi & Modüler CMS",
    "tr": {
      "lead": "Müşteri gereksinimlerinin belirlenmesi, iş analizi ve otel içerik yönetim süreçlerinin modellenmesiyle dinamik web platformları geliştirme.",
      "points": [
        "Asra Cave Hotel projesinde müşteri gereksinimlerini belirlemek üzere kapsamlı iş analizi yaptım; otel içerik yönetim süreçlerini modelleyerek dinamik ve özelleştirilebilir bir web platformu geliştirdim.",
        "Klasik bir veri giriş panelinin ötesine geçerek; site düzeninin, modüllerin ve görsel hiyerarşinin doğrudan admin panelinden yönetilmesine olanak tanıyan modüler bir CMS (İçerik Yönetim) mimarisi inşa ettim.",
        "Next.js ve Tailwind CSS kullanarak, admin panelinden yapılan özelleştirmelerin ön yüze (frontend) anında, hatasız ve yüksek performansla (SEO uyumlu) yansımasını sağlayan bir render altyapısı kurdum."
      ],
      "tech": "Next.js · Tailwind CSS · İş Analizi & Süreç Modelleme · Modüler CMS · SEO"
    },
    "en": {
      "lead": "Business requirement analysis, process modeling, and development of customizable hotel content platforms.",
      "points": [
        "Conducted comprehensive business analysis for the Asra Cave Hotel project, modeling hotel content management workflows into a dynamic, customizable web platform.",
        "Architected a modular CMS allowing direct administration of layouts, modules, and visual hierarchy from the admin panel.",
        "Implemented a Next.js and Tailwind CSS render engine ensuring seamless, instant, SEO-compliant frontend reflection of admin customizations."
      ],
      "tech": "Next.js · Tailwind CSS · Business Analysis & Process Modeling · Modular CMS · SEO"
    }
  }
];

  var DEFAULT_PROFILE = {
  "name": "Hamza Köybaşı",
  "roleTr": "Full Stack Developer",
  "roleEn": "Full Stack Developer",
  "email": "hamzakybsi@gmail.com",
  "phone": "0(505) 095 99 50",
  "locationTr": "Nevşehir / Merkez, Türkiye",
  "locationEn": "Nevşehir / Central, Turkey",
  "availabilityTr": "Tam Zamanlı / Remote",
  "availabilityEn": "Full-time / Remote",
  "focusTr": "Yapay Zekâ (SaaS/Ajanlar) · Next.js · İş Analizi & Süreç Yönetimi",
  "focusEn": "Artificial Intelligence (SaaS/Agents) · Next.js · Business Analysis",
  "languagesTr": "Türkçe (Ana dil) · İngilizce (B1)",
  "languagesEn": "Turkish (Native) · English (B1)",
  "github": "https://github.com/hamzakyb",
  "linkedin": "https://www.linkedin.com/in/hamzakybsi",
  "cvPath": "/assets/Hamza-Koybasi-CV.pdf",
  "stats": {
    "projectsCount": 18,
    "liveCount": 12,
    "areasCount": 5
  }
};

  var DEFAULT_INBOX = [
  {
    "id": "msg-sample-1",
    "name": "Örnek Müşteri (Operairo / Step Filtre Benzeri)",
    "email": "info@firmaornek.com",
    "topic": "Yeni Proje / Danışmanlık",
    "message": "Merhaba Hamza Bey, portfolyonuzdaki Operairo SaaS konsiyerj platformunuzu ve B2B süreç analizi entegrasyonlarınızı inceledik. Benzer ölçekte yapay zeka destekli bir yönetim portalı geliştirmek istiyoruz. Detayları görüşebilir miyiz?",
    "date": "2026-09-11T06:06:53.294Z",
    "read": false
  }
];

  function getInitialState() {
    return {
      version: 2,
      lastUpdated: new Date().toISOString(),
      profile: JSON.parse(JSON.stringify(DEFAULT_PROFILE)),
      projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
      services: JSON.parse(JSON.stringify(DEFAULT_SERVICES)),
      skills: JSON.parse(JSON.stringify(DEFAULT_SKILLS)),
      experiences: JSON.parse(JSON.stringify(DEFAULT_EXPERIENCES)),
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
