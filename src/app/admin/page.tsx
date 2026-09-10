'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './admin.css';
import { portfolioStore } from '@/lib/store';
import { Project, ServiceItem, SkillCategory, Profile, InboxMessage, PortfolioData } from '@/lib/types';
import { INITIAL_DATA } from '@/lib/initialData';
import { uploadCvToSupabaseStorage, isSupabaseConfigured, saveRemotePortfolioState } from '@/lib/supabase';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'services' | 'skills' | 'profile' | 'inbox'>('dashboard');
  const [theme, setTheme] = useState('paper');
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modals state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [newSrvTitle, setNewSrvTitle] = useState('');
  const [newSrvDesc, setNewSrvDesc] = useState('');
  const [newSrvItems, setNewSrvItems] = useState('');

  const [skillCatModalOpen, setSkillCatModalOpen] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatChips, setNewCatChips] = useState('');

  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');

  // Supabase Modal & State
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [supabaseAnonKeyInput, setSupabaseAnonKeyInput] = useState('');
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [supabaseSyncing, setSupabaseSyncing] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread'>('all');

  // CV Dropzone
  const [isDragOver, setIsDragOver] = useState(false);
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  // Quick skill input map { [catId]: string }
  const [quickSkillInputs, setQuickSkillInputs] = useState<{ [key: string]: string }>({});

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    if (portfolioStore.isLoggedIn()) {
      setIsAuthenticated(true);
    }
    const currentTheme = portfolioStore.getTheme();
    setTheme(currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);

    const configured = portfolioStore.getSupabaseConfigured();
    setSupabaseConnected(configured);
    setSupabaseAnonKeyInput(portfolioStore.getAnonKey());

    if (configured) {
      portfolioStore.syncFromSupabase().then(res => {
        if (res) showToast('Supabase veritabanı ile eşitlendi', 'success');
      });
    }

    const refreshData = () => {
      setData(portfolioStore.getData());
      setSupabaseConnected(portfolioStore.getSupabaseConfigured());
    };
    refreshData();

    window.addEventListener('portfolio:dataChanged', refreshData);
    return () => window.removeEventListener('portfolio:dataChanged', refreshData);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (portfolioStore.login(authPass.trim())) {
      setIsAuthenticated(true);
      setAuthError(false);
      setAuthPass('');
      showToast('Admin Studio oturumu açıldı', 'success');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    portfolioStore.logout();
    setIsAuthenticated(false);
    showToast('Oturum kapatıldı', 'info');
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'paper' : 'dark';
    setTheme(next);
    portfolioStore.setTheme(next);
    showToast(next === 'dark' ? 'Obsidian Koyu Tema aktif edildi' : 'Paper Editoryal Tema aktif edildi', 'info');
  };

  // --- CV Upload Handler ---
  const handleCvFile = async (file: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      showToast('Lütfen sadece PDF formatında bir CV yükleyin', 'error');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      showToast('Dosya boyutu 10MB sınırını aşıyor', 'error');
      return;
    }

    // Supabase Storage desteği
    if (portfolioStore.getSupabaseConfigured()) {
      try {
        const publicUrl = await uploadCvToSupabaseStorage(file);
        if (publicUrl) {
          const sizeKb = Math.round(file.size / 1024);
          const sizeStr = sizeKb >= 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';
          portfolioStore.saveProfile({ cvPath: publicUrl });
          portfolioStore.saveCv('', file.name, sizeStr);
          showToast('Yeni CV hem yerel ortama hem de Supabase Storage bulutuna yüklendi!', 'success');
          return;
        }
      } catch (err) {
        console.warn('Supabase CV storage upload error:', err);
      }
    }

    try {
      // 1. Try server-side file save via API
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData
      });
      const resJson = await res.json();

      if (resJson.success) {
        portfolioStore.saveCv('', file.name, resJson.fileSize);
        showToast('Yeni CV başarıyla sunucuya yüklendi ve yayına alındı!', 'success');
        return;
      }
    } catch {
      // Fallback: Read as base64 in store
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const sizeKb = Math.round(file.size / 1024);
      const sizeStr = sizeKb >= 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';
      portfolioStore.saveCv(base64, file.name, sizeStr);
      showToast('Yeni CV başarıyla yüklendi ve yayına alındı!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // --- Supabase Actions ---
  const handleSaveSupabaseKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = supabaseAnonKeyInput.trim();
    portfolioStore.setAnonKey(clean);
    setSupabaseSyncing(true);
    try {
      const ok = await portfolioStore.syncFromSupabase();
      setSupabaseConnected(portfolioStore.getSupabaseConfigured());
      if (ok) {
        showToast('Supabase başarıyla bağlandı ve veriler eşitlendi!', 'success');
        setSupabaseModalOpen(false);
      } else {
        showToast('Supabase anahtarı kaydedildi. SQL şeması hazır olduğunda eşitleme başlayacaktır.', 'info');
      }
    } catch {
      showToast('Bağlantı testi sırasında hata oluştu.', 'error');
    } finally {
      setSupabaseSyncing(false);
    }
  };

  const handlePushToSupabase = async () => {
    setSupabaseSyncing(true);
    try {
      const ok = await saveRemotePortfolioState(data);
      if (ok) {
        showToast('Tüm portfolyo içeriği Supabase veritabanına başarıyla gönderildi!', 'success');
      } else {
        showToast('Aktarım yapılamadı. Supabase SQL şemasının çalıştırıldığından emin olun.', 'error');
      }
    } catch (err) {
      showToast('Hata: ' + (err as Error).message, 'error');
    } finally {
      setSupabaseSyncing(false);
    }
  };

  // --- Services Actions ---
  const handleSaveNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvTitle.trim() || !newSrvDesc.trim()) {
      showToast('Lütfen başlık ve açıklama alanlarını doldurun', 'error');
      return;
    }
    const items = newSrvItems.split('\n').map(s => s.trim()).filter(Boolean);
    portfolioStore.addService({
      title: newSrvTitle.trim(),
      desc: newSrvDesc.trim(),
      items
    });
    setServiceModalOpen(false);
    setNewSrvTitle('');
    setNewSrvDesc('');
    setNewSrvItems('');
    showToast('Yeni hizmet başarıyla eklendi', 'success');
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
      portfolioStore.deleteService(id);
      showToast('Hizmet silindi', 'info');
    }
  };

  const handleUpdateServices = () => {
    portfolioStore.saveServices(data.services);
    showToast('Hizmetler başarıyla güncellendi', 'success');
  };

  // --- Skills Actions ---
  const handleSaveNewSkillCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitle.trim()) {
      showToast('Lütfen kategori başlığını doldurun', 'error');
      return;
    }
    const chips = newCatChips.split(',').map(s => s.trim()).filter(Boolean);
    portfolioStore.addSkillCategory({
      title: newCatTitle.trim(),
      desc: newCatDesc.trim(),
      chips
    });
    setSkillCatModalOpen(false);
    setNewCatTitle('');
    setNewCatDesc('');
    setNewCatChips('');
    showToast('Yeni kategori ve yetenekler eklendi', 'success');
  };

  const handleDeleteSkillCategory = (id: string) => {
    if (window.confirm('Bu kategori ve içindeki tüm yetenekleri silmek istediğinize emin misiniz?')) {
      portfolioStore.deleteSkillCategory(id);
      showToast('Kategori silindi', 'info');
    }
  };

  const handleAddChipToCategory = (catId: string) => {
    const val = (quickSkillInputs[catId] || '').trim();
    if (val) {
      portfolioStore.addSkillToCategory(catId, val);
      setQuickSkillInputs(prev => ({ ...prev, [catId]: '' }));
      showToast(`"${val}" yeteneği eklendi`, 'success');
    }
  };

  const handleRemoveChip = (catId: string, idx: number) => {
    portfolioStore.removeSkillFromCategory(catId, idx);
  };

  const handleUpdateSkills = () => {
    portfolioStore.saveSkills(data.skills);
    showToast('Yetenekler başarıyla güncellendi', 'success');
  };

  // --- Project Actions ---
  const handleOpenAddProject = () => {
    setEditingProject({
      tr: { title: '', kind: 'Web Uygulaması', summary: '', lead: '', features: [], role: 'Tasarım & Geliştirme', stack: 'Next.js' },
      en: { title: '', kind: 'Web Application', summary: '', lead: '', features: [], role: 'Design & Dev', stack: 'Next.js' },
      chips: ['Next.js', 'React'],
      links: [{ tr: 'Canlı siteyi aç', en: 'Open live site', href: '' }],
      tags: ['web'],
      mark: 'HK',
      media: 'm1',
      featured: false,
      status: 'active'
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    portfolioStore.saveProject(editingProject);
    setProjectModalOpen(false);
    setEditingProject(null);
    showToast('Proje başarıyla kaydedildi', 'success');
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Bu projeyi silmek istediğinize emin misiniz?')) {
      portfolioStore.deleteProject(id);
      showToast('Proje silindi', 'info');
    }
  };

  // --- Profile Actions ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    portfolioStore.saveProfile(data.profile);
    showToast('Profil ayarları başarıyla kaydedildi', 'success');
  };

  // --- JSON Backup ---
  const handleOpenJsonModal = () => {
    setJsonText(JSON.stringify(portfolioStore.getData(), null, 2));
    setJsonModalOpen(true);
  };

  const handleApplyJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      portfolioStore.saveData(parsed);
      setJsonModalOpen(false);
      showToast('JSON yedeği başarıyla içeri aktarıldı!', 'success');
    } catch {
      showToast('Geçersiz JSON formatı! Lütfen kontrol edin.', 'error');
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hamzakoybasi_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auth Gate check
  if (!isAuthenticated) {
    return (
      <div className="auth-gate">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/assets/logo-icon.png" alt="HK Monogram" width="48" height="48" />
          </div>
          <h1>Admin Studio</h1>
          <p>Portfolyo içerik ve proje yönetim merkezine hoş geldiniz.</p>

          {authError && <div className="auth-error is-visible">Şifre hatalı. Lütfen tekrar deneyin.</div>}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="authPass">Giriş Parolası</label>
              <input
                className="input-text"
                type="password"
                id="authPass"
                placeholder="••••••••"
                required
                value={authPass}
                onChange={e => setAuthPass(e.target.value)}
                autoFocus
              />
            </div>
            <button className="btn btn-primary btn-lg" type="submit">
              <span>Stüdyoya Giriş Yap</span>
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const unreadCount = data.inbox.filter(m => !m.read).length;
  const filteredInbox = inboxFilter === 'unread' ? data.inbox.filter(m => !m.read) : data.inbox;

  return (
    <div className="app-shell">
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-mark">
            <img src="/assets/logo-icon.png" alt="" width="32" height="32" />
          </div>
          <div className="sidebar-brand-text">
            <strong>Hamza Köybaşı</strong>
            <span>Admin Studio</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Yönetim</div>

          <button
            className={`sidebar-link ${activeTab === 'dashboard' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Genel Bakış</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'projects' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <span>Projeler</span>
            <span className="sidebar-badge">{data.projects.length}</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'services' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>Hizmetler &amp; Süreç</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'skills' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Yetenekler &amp; Stack</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'profile' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profil &amp; CV</span>
          </button>

          <div className="nav-section-title">İletişim &amp; Etkileşim</div>

          <button
            className={`sidebar-link ${activeTab === 'inbox' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>Gelen Kutusu</span>
            {unreadCount > 0 && <span className="sidebar-badge highlight">{unreadCount}</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <Link className="btn btn-secondary btn-sm" href="/" target="_blank">
            <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>Canlı Site</span>
          </Link>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} type="button">
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Çıkış</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="app-main">
        {/* TOPBAR */}
        <header className="app-topbar">
          <div className="topbar-left">
            <div className="topbar-title">
              <span style={{ textTransform: 'capitalize' }}>
                {activeTab === 'dashboard' && 'Genel Bakış'}
                {activeTab === 'projects' && 'Projeler'}
                {activeTab === 'services' && 'Hizmetler & Çalışma Süreci'}
                {activeTab === 'skills' && 'Yetenekler & Tech Stack'}
                {activeTab === 'profile' && 'Profil & CV Yönetimi'}
                {activeTab === 'inbox' && 'Gelen Kutusu'}
              </span>
              <small>Next.js Canlı Senkronizasyon</small>
            </div>
          </div>

          <div className="topbar-right">
            <button
              className={`supabase-badge ${supabaseConnected ? 'connected' : 'unconfigured'}`}
              onClick={() => setSupabaseModalOpen(true)}
              type="button"
              title="Supabase Veritabanı ve Senkronizasyon Ayarları"
            >
              <span className="supabase-dot" />
              <span>{supabaseConnected ? 'Supabase Bağlı' : 'Supabase Bağla'}</span>
            </button>

            <button className="btn-icon" onClick={toggleTheme} type="button" title="Temayı Değiştir">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
              )}
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handleOpenJsonModal} type="button">
              <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Yedek &amp; JSON</span>
            </button>

            <Link className="btn btn-primary btn-sm" href="/" target="_blank">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              <span>Siteyi Gör</span>
            </Link>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="app-view">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <section className="view-section is-active">
              <div className="view-header">
                <div className="view-header-copy">
                  <h2>Genel Bakış</h2>
                  <p>Portfolyo performans özeti, aktif projeler ve en son etkileşimler.</p>
                </div>
                <div className="view-header-actions">
                  <button className="btn btn-primary" onClick={handleOpenAddProject} type="button">
                    <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Yeni Proje Ekle</span>
                  </button>
                </div>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Toplam Proje</span>
                    <span className="kpi-icon"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/></svg></span>
                  </div>
                  <div className="kpi-value">{data.projects.length}</div>
                  <div className="kpi-sub">Kayıtlı çalışmalar</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Hizmet Sayısı</span>
                    <span className="kpi-icon" style={{ background: 'var(--ok-dim)', color: 'var(--ok)' }}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>
                  </div>
                  <div className="kpi-value">{data.services.length}</div>
                  <div className="kpi-sub">Yayındaki ana hizmetler</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Gelen Mesajlar</span>
                    <span className="kpi-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg></span>
                  </div>
                  <div className="kpi-value">{data.inbox.length}</div>
                  <div className="kpi-sub">{unreadCount} okunmamış mesaj</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-label">Yetenek Sayısı</span>
                    <span className="kpi-icon"><svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></span>
                  </div>
                  <div className="kpi-value">
                    {data.skills.reduce((acc, cat) => acc + (cat.chips || []).length, 0)}
                  </div>
                  <div className="kpi-sub">{data.skills.length} kategoride</div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <section className="view-section is-active">
              <div className="view-header">
                <div className="view-header-copy">
                  <h2>Projeler Yönetimi</h2>
                  <p>Portfolyoda sergilenen tüm çalışmaları ekleyin, düzenleyin ve sıralayın.</p>
                </div>
                <div className="view-header-actions">
                  <button className="btn btn-primary" onClick={handleOpenAddProject} type="button">
                    <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Yeni Proje Ekle</span>
                  </button>
                </div>
              </div>

              <div className="projects-admin-grid">
                {data.projects.map(proj => (
                  <div className="card-panel" key={proj.id}>
                    <div className="card-panel-head">
                      <h3>{proj.order}. {proj.tr.title}</h3>
                      <div className="card-panel-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => { setEditingProject(proj); setProjectModalOpen(true); }}
                          type="button"
                        >
                          Düzenle
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#ff4757' }}
                          onClick={() => handleDeleteProject(proj.id)}
                          type="button"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                    <div className="card-panel-body">
                      <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 12 }}>{proj.tr.summary}</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {(proj.chips || []).map((c, idx) => (
                          <span key={idx} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'var(--panel-2)', border: '1px solid var(--line)' }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <section className="view-section is-active">
              <div className="view-header">
                <div className="view-header-copy">
                  <h2>Hizmetler &amp; Süreç</h2>
                  <p>Müşterilere sunduğunuz hizmetleri ve alt maddeleri buradan düzenleyin.</p>
                </div>
                <div className="view-header-actions">
                  <button className="btn btn-secondary" onClick={() => setServiceModalOpen(true)} type="button">
                    <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Yeni Hizmet Ekle</span>
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdateServices} type="button">
                    <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>
                    <span>Hizmetleri Kaydet</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {data.services.map((srv, idx) => (
                  <div className="card-panel" key={srv.id || idx}>
                    <div className="card-panel-head">
                      <h3>Hizmet {srv.number}: {srv.tr.title}</h3>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ff4757' }}
                        onClick={() => handleDeleteService(srv.id)}
                        type="button"
                      >
                        Sil
                      </button>
                    </div>
                    <div className="card-panel-body">
                      <div className="form-grid">
                        <div className="form-group col-full">
                          <label className="form-label">Hizmet Başlığı</label>
                          <input
                            className="input-text"
                            value={srv.tr.title}
                            onChange={e => {
                              const val = e.target.value;
                              setData(prev => {
                                const nextServices = [...prev.services];
                                nextServices[idx].tr.title = val;
                                if (nextServices[idx].en) nextServices[idx].en!.title = val;
                                return { ...prev, services: nextServices };
                              });
                            }}
                          />
                        </div>

                        <div className="form-group col-full">
                          <label className="form-label">Hizmet Açıklaması</label>
                          <textarea
                            className="textarea-input"
                            rows={2}
                            value={srv.tr.desc}
                            onChange={e => {
                              const val = e.target.value;
                              setData(prev => {
                                const nextServices = [...prev.services];
                                nextServices[idx].tr.desc = val;
                                if (nextServices[idx].en) nextServices[idx].en!.desc = val;
                                return { ...prev, services: nextServices };
                              });
                            }}
                          />
                        </div>

                        <div className="form-group col-full">
                          <label className="form-label">Maddeler (Her satıra bir)</label>
                          <textarea
                            className="textarea-input"
                            rows={3}
                            value={(srv.tr.items || []).join('\n')}
                            onChange={e => {
                              const items = e.target.value.split('\n');
                              setData(prev => {
                                const nextServices = [...prev.services];
                                nextServices[idx].tr.items = items;
                                if (nextServices[idx].en) nextServices[idx].en!.items = items;
                                return { ...prev, services: nextServices };
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <section className="view-section is-active">
              <div className="view-header">
                <div className="view-header-copy">
                  <h2>Yetenekler &amp; Tech Stack</h2>
                  <p>Yetenek kategorilerini ve her kategorideki teknoloji etiketlerini yönetin.</p>
                </div>
                <div className="view-header-actions">
                  <button className="btn btn-secondary" onClick={() => setSkillCatModalOpen(true)} type="button">
                    <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Yeni Kategori Ekle</span>
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdateSkills} type="button">
                    <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>
                    <span>Yetenekleri Kaydet</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {data.skills.map((cat, idx) => (
                  <div className="card-panel" key={cat.id || idx}>
                    <div className="card-panel-head">
                      <h3>Kategori {cat.number}: {cat.tr.title}</h3>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ff4757' }}
                        onClick={() => handleDeleteSkillCategory(cat.id)}
                        type="button"
                      >
                        Sil
                      </button>
                    </div>
                    <div className="card-panel-body">
                      <div className="form-grid">
                        <div className="form-group col-full">
                          <label className="form-label">Kategori Başlığı</label>
                          <input
                            className="input-text"
                            value={cat.tr.title}
                            onChange={e => {
                              const val = e.target.value;
                              setData(prev => {
                                const nextSkills = [...prev.skills];
                                nextSkills[idx].tr.title = val;
                                if (nextSkills[idx].en) nextSkills[idx].en!.title = val;
                                return { ...prev, skills: nextSkills };
                              });
                            }}
                          />
                        </div>

                        <div className="form-group col-full">
                          <label className="form-label">Kısa Açıklama</label>
                          <input
                            className="input-text"
                            value={cat.tr.desc}
                            onChange={e => {
                              const val = e.target.value;
                              setData(prev => {
                                const nextSkills = [...prev.skills];
                                nextSkills[idx].tr.desc = val;
                                if (nextSkills[idx].en) nextSkills[idx].en!.desc = val;
                                return { ...prev, skills: nextSkills };
                              });
                            }}
                          />
                        </div>

                        <div className="form-group col-full">
                          <label className="form-label">Tanımlı Yetenekler ({cat.chips.length} adet)</label>
                          <div className="skill-tags-wrapper">
                            {cat.chips.map((chip, chipIdx) => (
                              <span className="skill-tag-pill" key={chipIdx}>
                                <span>{chip}</span>
                                <button
                                  className="skill-tag-delete"
                                  type="button"
                                  onClick={() => handleRemoveChip(cat.id, chipIdx)}
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="skill-quick-add">
                            <input
                              className="input-text"
                              placeholder="Yeni yetenek adı (örn: Docker)..."
                              value={quickSkillInputs[cat.id] || ''}
                              onChange={e => setQuickSkillInputs({ ...quickSkillInputs, [cat.id]: e.target.value })}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddChipToCategory(cat.id);
                                }
                              }}
                            />
                            <button
                              className="btn btn-secondary btn-sm"
                              type="button"
                              onClick={() => handleAddChipToCategory(cat.id)}
                            >
                              + Yetenek Ekle
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 5: PROFILE & CV */}
          {activeTab === 'profile' && (
            <section className="view-section is-active">
              <div className="view-header">
                <div className="view-header-copy">
                  <h2>Profil &amp; CV Yönetimi</h2>
                  <p>Portfolyo iletişim detayları, sosyal linkler ve sürükle-bırak CV dosyası.</p>
                </div>
                <div className="view-header-actions">
                  <button className="btn btn-primary" onClick={handleSaveProfile} type="button">
                    <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>
                    <span>Profil Ayarlarını Kaydet</span>
                  </button>
                </div>
              </div>

              {/* CV Drag & Drop Card */}
              <div className="card-panel" style={{ marginBottom: 24 }}>
                <div className="card-panel-head">
                  <h3>CV &amp; Özgeçmiş Dosyası (PDF)</h3>
                  <span
                    className="badge"
                    style={{
                      background: data.profile.cvData ? 'var(--ok-dim)' : 'var(--accent-dim)',
                      color: data.profile.cvData ? 'var(--ok)' : 'var(--accent)',
                      fontWeight: 600
                    }}
                  >
                    {data.profile.cvData ? 'Özel Yüklendi' : 'Varsayılan'}
                  </span>
                </div>
                <div className="card-panel-body">
                  <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 16 }}>
                    Ana sitedeki <strong>"CV'yi İndir"</strong> butonunun indirdiği dosyayı buradan güncelleyebilirsiniz. Yeni PDF dosyanızı aşağıdaki alana sürükleyip bırakmanız yeterlidir.
                  </p>

                  <div
                    className={`cv-dropzone ${isDragOver ? 'is-dragover' : ''}`}
                    onClick={() => cvFileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={e => {
                      e.preventDefault();
                      setIsDragOver(false);
                      if (e.dataTransfer.files?.[0]) handleCvFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <input
                      type="file"
                      ref={cvFileInputRef}
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onChange={e => {
                        if (e.target.files?.[0]) handleCvFile(e.target.files[0]);
                        e.target.value = '';
                      }}
                    />
                    <div className="cv-dropzone-icon">
                      <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <div className="cv-dropzone-title">Yeni CV Dosyanızı Buraya Sürükleyin</div>
                    <div className="cv-dropzone-sub">veya bilgisayarınızdan seçmek için <span>tıklayın</span> (.pdf formatında, maks 10MB)</div>
                  </div>

                  {/* Active CV status bar */}
                  <div className="cv-active-card" style={{ marginTop: 16 }}>
                    <div className="cv-active-info">
                      <div className="cv-pdf-icon">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </div>
                      <div className="cv-active-details">
                        <strong>{data.profile.cvFileName || 'Hamza-Koybasi-CV.pdf'}</strong>
                        <span>
                          {data.profile.cvData
                            ? `Yüklenen Dosya · ${data.profile.cvFileSize || ''} (${data.profile.cvUploadDate || ''})`
                            : 'Orijinal dosya · /assets/Hamza-Koybasi-CV.pdf'}
                        </span>
                      </div>
                    </div>
                    <div className="cv-active-actions">
                      <a
                        className="btn btn-secondary btn-sm"
                        href={data.profile.cvData || data.profile.cvPath || '/assets/Hamza-Koybasi-CV.pdf'}
                        download={data.profile.cvFileName || 'Hamza-Koybasi-CV.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <span>Önizle / İndir</span>
                      </a>
                      {data.profile.cvData && (
                        <button
                          className="btn btn-ghost btn-sm"
                          type="button"
                          onClick={() => {
                            if (window.confirm('Orijinal varsayılan CV dosyasına dönmek istiyor musunuz?')) {
                              portfolioStore.resetCv();
                              showToast('CV dosyası varsayılana sıfırlandı', 'info');
                            }
                          }}
                        >
                          Varsayılana Sıfırla
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile fields */}
              <div className="card-panel">
                <div className="card-panel-head">
                  <h3>Temel Bilgiler</h3>
                </div>
                <div className="card-panel-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Ad Soyad</label>
                      <input
                        className="input-text"
                        value={data.profile.name}
                        onChange={e => setData({ ...data, profile: { ...data.profile, name: e.target.value } })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unvan</label>
                      <input
                        className="input-text"
                        value={data.profile.roleTr}
                        onChange={e => setData({ ...data, profile: { ...data.profile, roleTr: e.target.value } })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">E-posta</label>
                      <input
                        className="input-text"
                        type="email"
                        value={data.profile.email}
                        onChange={e => setData({ ...data, profile: { ...data.profile, email: e.target.value } })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Telefon</label>
                      <input
                        className="input-text"
                        value={data.profile.phone}
                        onChange={e => setData({ ...data, profile: { ...data.profile, phone: e.target.value } })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GitHub</label>
                      <input
                        className="input-text"
                        value={data.profile.github}
                        onChange={e => setData({ ...data, profile: { ...data.profile, github: e.target.value } })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">LinkedIn</label>
                      <input
                        className="input-text"
                        value={data.profile.linkedin}
                        onChange={e => setData({ ...data, profile: { ...data.profile, linkedin: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 6: INBOX */}
          {activeTab === 'inbox' && (
            <section className="view-section is-active">
              <div className="view-header">
                <div className="view-header-copy">
                  <h2>Gelen Kutusu</h2>
                  <p>Portfolyo iletişim formundan gelen tüm mesajlar.</p>
                </div>
                <div className="view-header-actions">
                  <div className="filter-tabs">
                    <button
                      className={`filter-tab ${inboxFilter === 'all' ? 'is-active' : ''}`}
                      onClick={() => setInboxFilter('all')}
                      type="button"
                    >
                      Tümü ({data.inbox.length})
                    </button>
                    <button
                      className={`filter-tab ${inboxFilter === 'unread' ? 'is-active' : ''}`}
                      onClick={() => setInboxFilter('unread')}
                      type="button"
                    >
                      Okunmamış ({unreadCount})
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-panel" style={{ padding: 0 }}>
                {filteredInbox.length === 0 ? (
                  <div className="empty-state" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
                    Görüntülenecek mesaj bulunamadı.
                  </div>
                ) : (
                  <div>
                    {filteredInbox.map(msg => (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 20px',
                          borderBottom: '1px solid var(--line)',
                          background: msg.read ? 'transparent' : 'var(--panel-2)',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (!msg.read) portfolioStore.toggleMessageRead(msg.id);
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                            {!msg.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}></span>}
                            <strong style={{ fontSize: 14 }}>{msg.name}</strong>
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>&lt;{msg.email}&gt;</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                            <strong>{msg.topic}</strong> — {msg.message.slice(0, 70)}...
                          </div>
                        </div>

                        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                          {new Date(msg.date).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ============ MODAL: YENİ HİZMET ============ */}
      {serviceModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setServiceModalOpen(false)}>
          <div className="modal-window" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Yeni Hizmet Ekle</h3>
              <button className="btn-icon" onClick={() => setServiceModalOpen(false)} type="button">
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSaveNewService}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group col-full">
                    <label className="form-label">Hizmet Başlığı *</label>
                    <input
                      className="input-text"
                      required
                      placeholder="Örn: Bulut &amp; DevOps"
                      value={newSrvTitle}
                      onChange={e => setNewSrvTitle(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="form-group col-full">
                    <label className="form-label">Hizmet Açıklaması *</label>
                    <textarea
                      className="textarea-input"
                      required
                      rows={2}
                      placeholder="Sunduğunuz hizmetin kapsamı..."
                      value={newSrvDesc}
                      onChange={e => setNewSrvDesc(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-full">
                    <label className="form-label">Hizmet Maddeleri (Her satıra bir)</label>
                    <textarea
                      className="textarea-input"
                      rows={3}
                      placeholder="Docker ve CI/CD kurulumu&#10;AWS optimizasyonu"
                      value={newSrvItems}
                      onChange={e => setNewSrvItems(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button className="btn btn-secondary" onClick={() => setServiceModalOpen(false)} type="button">Vazgeç</button>
                <button className="btn btn-primary" type="submit">Hizmeti Ekle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ MODAL: YENİ KATEGORİ ============ */}
      {skillCatModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setSkillCatModalOpen(false)}>
          <div className="modal-window" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Yeni Yetenek Kategorisi Ekle</h3>
              <button className="btn-icon" onClick={() => setSkillCatModalOpen(false)} type="button">
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSaveNewSkillCategory}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group col-full">
                    <label className="form-label">Kategori Başlığı *</label>
                    <input
                      className="input-text"
                      required
                      placeholder="Örn: DevOps &amp; Araçlar"
                      value={newCatTitle}
                      onChange={e => setNewCatTitle(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="form-group col-full">
                    <label className="form-label">Kısa Açıklama</label>
                    <input
                      className="input-text"
                      placeholder="Örn: Dağıtım, otomasyon ve altyapı..."
                      value={newCatDesc}
                      onChange={e => setNewCatDesc(e.target.value)}
                    />
                  </div>
                  <div className="form-group col-full">
                    <label className="form-label">Yetenekler (Virgülle ayırın)</label>
                    <input
                      className="input-text"
                      placeholder="Docker, Kubernetes, AWS, Linux"
                      value={newCatChips}
                      onChange={e => setNewCatChips(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button className="btn btn-secondary" onClick={() => setSkillCatModalOpen(false)} type="button">Vazgeç</button>
                <button className="btn btn-primary" type="submit">Kategoriyi Oluştur</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ MODAL: PROJE EKLE/DÜZENLE ============ */}
      {projectModalOpen && editingProject && (
        <div className="modal-backdrop is-open" onClick={() => setProjectModalOpen(false)}>
          <div className="modal-window" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingProject.id ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</h3>
              <button className="btn-icon" onClick={() => setProjectModalOpen(false)} type="button">
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSaveProject}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group col-full">
                    <label className="form-label">Proje Başlığı *</label>
                    <input
                      className="input-text"
                      required
                      value={editingProject.tr?.title || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setEditingProject({
                          ...editingProject,
                          tr: { ...editingProject.tr!, title: val },
                          en: { ...editingProject.en!, title: val }
                        });
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="form-group col-full">
                    <label className="form-label">Kategori / Tür (Örn: E-Ticaret Platformu)</label>
                    <input
                      className="input-text"
                      value={editingProject.tr?.kind || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setEditingProject({
                          ...editingProject,
                          tr: { ...editingProject.tr!, kind: val },
                          en: { ...editingProject.en!, kind: val }
                        });
                      }}
                    />
                  </div>
                  <div className="form-group col-full">
                    <label className="form-label">Özet / Açıklama *</label>
                    <textarea
                      className="textarea-input"
                      rows={2}
                      required
                      value={editingProject.tr?.summary || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setEditingProject({
                          ...editingProject,
                          tr: { ...editingProject.tr!, summary: val, lead: val },
                          en: { ...editingProject.en!, summary: val, lead: val }
                        });
                      }}
                    />
                  </div>
                  <div className="form-group col-full">
                    <label className="form-label">Öne Çıkan Özellikler (Her satıra bir)</label>
                    <textarea
                      className="textarea-input"
                      rows={3}
                      value={(editingProject.tr?.features || []).join('\n')}
                      onChange={e => {
                        const feats = e.target.value.split('\n').filter(Boolean);
                        setEditingProject({
                          ...editingProject,
                          tr: { ...editingProject.tr!, features: feats },
                          en: { ...editingProject.en!, features: feats }
                        });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teknolojiler (Virgülle)</label>
                    <input
                      className="input-text"
                      value={(editingProject.chips || []).join(', ')}
                      onChange={e => {
                        const chips = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
                        setEditingProject({ ...editingProject, chips });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Canlı Site Linki</label>
                    <input
                      className="input-text"
                      type="url"
                      placeholder="https://..."
                      value={editingProject.links?.[0]?.href || ''}
                      onChange={e => {
                        const href = e.target.value;
                        setEditingProject({
                          ...editingProject,
                          links: [{ tr: 'Canlı siteyi aç', en: 'Open live site', href }]
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button className="btn btn-secondary" onClick={() => setProjectModalOpen(false)} type="button">Vazgeç</button>
                <button className="btn btn-primary" type="submit">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ MODAL: MESAJ DETAY ============ */}
      {selectedMessage && (
        <div className="modal-backdrop is-open" onClick={() => setSelectedMessage(null)}>
          <div className="modal-window" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{selectedMessage.topic}</h3>
              <button className="btn-icon" onClick={() => setSelectedMessage(null)} type="button">
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 16 }}>
                <strong>Gönderen:</strong> {selectedMessage.name} &lt;{selectedMessage.email}&gt;
              </div>
              <div style={{ marginBottom: 16, fontSize: 12, color: 'var(--muted)' }}>
                <strong>Tarih:</strong> {new Date(selectedMessage.date).toLocaleString('tr-TR')}
              </div>
              <div style={{ padding: 16, background: 'var(--panel-2)', borderRadius: 8, lineHeight: 1.6 }}>
                {selectedMessage.message}
              </div>
            </div>
            <div className="modal-foot">
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: '#ff4757' }}
                onClick={() => {
                  portfolioStore.deleteMessage(selectedMessage.id);
                  setSelectedMessage(null);
                  showToast('Mesaj silindi', 'info');
                }}
              >
                Mesajı Sil
              </button>
              <a
                className="btn btn-primary btn-sm"
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.topic}`}
              >
                E-posta ile Yanıtla
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL: JSON YEDEK ============ */}
      {jsonModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setJsonModalOpen(false)}>
          <div className="modal-window" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>JSON Yedek &amp; Veri Aktarımı</h3>
              <button className="btn-icon" onClick={() => setJsonModalOpen(false)} type="button">
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <button className="btn btn-secondary btn-sm" onClick={handleDownloadJson} type="button">
                  JSON Dosyasını İndir
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(jsonText);
                    showToast('JSON panoya kopyalandı', 'success');
                  }}
                  type="button"
                >
                  Panoya Kopyala
                </button>
              </div>
              <textarea
                className="textarea-input"
                rows={12}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
              />
            </div>
            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setJsonModalOpen(false)} type="button">Kapat</button>
              <button className="btn btn-primary" onClick={handleApplyJsonImport} type="button">İçe Aktar &amp; Uygula</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL: SUPABASE VERİTABANI & BULUT AYARLARI ============ */}
      {supabaseModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setSupabaseModalOpen(false)}>
          <div className="modal-window" style={{ maxWidth: 660 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>Supabase Backend &amp; Senkronizasyon</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, marginTop: 2 }}>
                  Proje URL: <code>https://igytzanekayiyybvmqga.supabase.co</code>
                </p>
              </div>
              <button className="btn-icon" onClick={() => setSupabaseModalOpen(false)} type="button">
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              {/* Durum Kartı */}
              <div style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--line)',
                background: 'var(--panel-2)',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="supabase-dot" style={{ color: supabaseConnected ? '#27ae60' : '#d68910', width: 10, height: 10 }} />
                  <div>
                    <strong style={{ fontSize: 13.5, display: 'block' }}>
                      {supabaseConnected ? 'Supabase Bağlantısı Aktif' : 'Anon Public Key Bekleniyor'}
                    </strong>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {supabaseConnected 
                        ? 'Admin panelindeki tüm değişiklikler anında Supabase veritabanına yazılır.' 
                        : 'Supabase Dashboard -> Settings -> API -> "anon public" anahtarınızı giriniz.'}
                    </span>
                  </div>
                </div>
                {supabaseConnected && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handlePushToSupabase}
                    disabled={supabaseSyncing}
                    type="button"
                  >
                    {supabaseSyncing ? 'Eşitleniyor...' : 'Buluta Gönder'}
                  </button>
                )}
              </div>

              {/* Form: Anon Key */}
              <form onSubmit={handleSaveSupabaseKey}>
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label className="form-label" htmlFor="supabaseKey">
                    <span>Supabase Anon Public API Key</span>
                    <small>Project Settings ➔ API ➔ anon public</small>
                  </label>
                  <input
                    id="supabaseKey"
                    className="input-text"
                    type="text"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseAnonKeyInput}
                    onChange={e => setSupabaseAnonKeyInput(e.target.value)}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
                  <button className="btn btn-primary btn-sm" type="submit" disabled={supabaseSyncing}>
                    {supabaseSyncing ? 'Kaydediliyor & Test Ediliyor...' : 'Anahtarı Kaydet ve Bağlan'}
                  </button>
                  {supabaseAnonKeyInput && (
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => {
                        setSupabaseAnonKeyInput('');
                        portfolioStore.setAnonKey('');
                        setSupabaseConnected(false);
                        showToast('Supabase anahtarı sıfırlandı', 'info');
                      }}
                    >
                      Anahtarı Temizle
                    </button>
                  )}
                </div>
              </form>

              {/* SQL Şeması Bilgilendirmesi */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                <h4 style={{ fontSize: 14, marginBottom: 6 }}>Supabase SQL Tablo Kurulumu</h4>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0, marginBottom: 10 }}>
                  Veritabanı tablolarınız (portfolio_state, inbox_messages, storage) henüz açılmadıysa aşağıdaki SQL betiğini kopyalayıp Supabase SQL Editor&apos;de bir kere &quot;Run&quot; ediniz:
                </p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const sql = `-- HAMZA KÖYBAŞI PORTFOLYO - SUPABASE VERİTABANI ŞEMASI
create table if not exists public.portfolio_state (
  id text primary key default 'default_state',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.portfolio_state enable row level security;
create policy "Public portfolio read" on public.portfolio_state for select using (true);
create policy "Admin portfolio upsert" on public.portfolio_state for all using (true) with check (true);

create table if not exists public.inbox_messages (
  id text primary key default ('msg-' || floor(extract(epoch from now()) * 1000)::text),
  name text not null,
  email text not null,
  topic text default 'Genel',
  message text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  read boolean default false
);
alter table public.inbox_messages enable row level security;
create policy "Public can submit contact messages" on public.inbox_messages for insert with check (true);
create policy "Admin can manage messages" on public.inbox_messages for all using (true) with check (true);`;
                      navigator.clipboard.writeText(sql);
                      showToast('Supabase SQL betiği panoya kopyalandı!', 'success');
                    }}
                    type="button"
                  >
                    SQL Betiğini Kopyala
                  </button>
                  <a
                    className="btn btn-ghost btn-sm"
                    href="https://supabase.com/dashboard/project/igytzanekayiyybvmqga/sql"
                    target="_blank"
                    rel="noreferrer"
                  >
                    SQL Editor&apos;ü Aç ↗
                  </a>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setSupabaseModalOpen(false)} type="button">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
