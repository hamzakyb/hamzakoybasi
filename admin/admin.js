/* =========================================================
   Hamza Köybaşı — Admin Studio Logic
   Vanilla JS, reactive controller for portfolio store.
   ========================================================= */

(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var store = window.PortfolioStore;
  if (!store) {
    console.error('PortfolioStore could not be loaded.');
    return;
  }

  /* ---------------------------------------------------------
     Toast System
     --------------------------------------------------------- */
  var toastContainer = $('#toastContainer');
  function showToast(message, type) {
    type = type || 'success';
    if (!toastContainer) return;
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 3200);
  }

  /* ---------------------------------------------------------
     Theme Management
     --------------------------------------------------------- */
  var root = document.documentElement;
  var themeBtn = $('#themeToggleBtn');
  var sunIcon = $('#themeIconSun');
  var moonIcon = $('#themeIconMoon');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    store.setTheme(theme);
    if (theme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
  }

  var currentTheme = store.getTheme();
  applyTheme(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'paper' : 'dark';
      applyTheme(next);
      showToast(next === 'dark' ? 'Obsidian Koyu Tema aktif edildi' : 'Paper Editoryal Tema aktif edildi', 'info');
    });
  }

  /* ---------------------------------------------------------
     Authentication Gate
     --------------------------------------------------------- */
  var authGate = $('#authGate');
  var authForm = $('#authForm');
  var authPass = $('#authPass');
  var authError = $('#authError');
  var logoutBtn = $('#logoutBtn');

  function checkAuth() {
    if (store.isLoggedIn()) {
      if (authGate) authGate.classList.add('is-hidden');
      initDashboard();
    } else {
      if (authGate) authGate.classList.remove('is-hidden');
      if (authPass) authPass.focus();
    }
  }

  if (authForm) {
    authForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pass = authPass.value.trim();
      if (store.login(pass)) {
        if (authError) authError.classList.remove('is-visible');
        authPass.value = '';
        checkAuth();
        showToast('Admin Studio oturumu açıldı', 'success');
      } else {
        if (authError) authError.classList.add('is-visible');
        authPass.focus();
        authPass.select();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      store.logout();
      checkAuth();
      showToast('Oturum kapatıldı', 'info');
    });
  }

  /* ---------------------------------------------------------
     Sidebar & View Routing
     --------------------------------------------------------- */
  var sidebarLinks = $$('.sidebar-link');
  var viewSections = $$('.view-section');
  var activeViewTitle = $('#activeViewTitle');
  var mobileMenuToggle = $('#mobileMenuToggle');
  var appSidebar = $('#appSidebar');

  var viewTitles = {
    dashboard: 'Genel Bakış',
    projects: 'Projeler Yönetimi',
    services: 'Hizmetler & Süreç',
    skills: 'Yetenekler & Tech Stack',
    profile: 'Profil & Ayarlar',
    inbox: 'Gelen Kutusu'
  };

  function switchTab(tabId) {
    sidebarLinks.forEach(function (l) {
      l.classList.toggle('is-active', l.getAttribute('data-tab') === tabId);
    });
    viewSections.forEach(function (s) {
      s.classList.toggle('is-active', s.id === 'view-' + tabId);
    });
    if (activeViewTitle) activeViewTitle.textContent = viewTitles[tabId] || 'Yönetim Paneli';

    if (appSidebar) appSidebar.classList.remove('mobile-open');

    // Tab specific initializers
    if (tabId === 'dashboard') renderDashboard();
    if (tabId === 'projects') renderProjectsList();
    if (tabId === 'services') renderServicesEditor();
    if (tabId === 'skills') renderSkillsEditor();
    if (tabId === 'profile') renderProfileForm();
    if (tabId === 'inbox') renderInboxList();
  }

  sidebarLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var tabId = link.getAttribute('data-tab');
      window.location.hash = tabId;
      switchTab(tabId);
    });
  });

  if (mobileMenuToggle && appSidebar) {
    mobileMenuToggle.addEventListener('click', function () {
      appSidebar.classList.toggle('mobile-open');
    });
  }

  $('#dashViewAllProjectsBtn') && $('#dashViewAllProjectsBtn').addEventListener('click', function () { switchTab('projects'); });
  $('#dashViewAllInboxBtn') && $('#dashViewAllInboxBtn').addEventListener('click', function () { switchTab('inbox'); });
  $('#dashAddProjectBtn') && $('#dashAddProjectBtn').addEventListener('click', function () { openProjectModal(); });
  $('#addNewProjectBtn') && $('#addNewProjectBtn').addEventListener('click', function () { openProjectModal(); });

  /* ---------------------------------------------------------
     Dashboard View
     --------------------------------------------------------- */
  function renderDashboard() {
    var projects = store.getProjects();
    var inbox = store.getInbox();
    var skills = store.getSkills();

    // KPIs
    var kpiTotalProjects = $('#kpiTotalProjects');
    var kpiLiveProjects = $('#kpiLiveProjects');
    var kpiTotalMessages = $('#kpiTotalMessages');
    var kpiUnreadMessages = $('#kpiUnreadMessages');
    var kpiTotalSkills = $('#kpiTotalSkills');

    var liveCount = projects.filter(function (p) {
      return (p.tr && p.tr.badge && p.tr.badge.indexOf('Aktif') !== -1) || (p.en && p.en.badge && p.en.badge.indexOf('active') !== -1);
    }).length;

    var unreadCount = store.getUnreadCount();
    var totalSkillChips = 0;
    skills.forEach(function (c) { totalSkillChips += (c.chips || []).length; });

    if (kpiTotalProjects) kpiTotalProjects.textContent = String(projects.length);
    if (kpiLiveProjects) kpiLiveProjects.textContent = String(liveCount);
    if (kpiTotalMessages) kpiTotalMessages.textContent = String(inbox.length);
    if (kpiUnreadMessages) kpiUnreadMessages.textContent = String(unreadCount);
    if (kpiTotalSkills) kpiTotalSkills.textContent = String(totalSkillChips);

    // Sidebar badges
    var badgeProjectCount = $('#badgeProjectCount');
    var badgeUnreadCount = $('#badgeUnreadCount');
    if (badgeProjectCount) badgeProjectCount.textContent = String(projects.length);
    if (badgeUnreadCount) {
      badgeUnreadCount.textContent = String(unreadCount);
      badgeUnreadCount.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    // Recent Projects
    var dashRecentList = $('#dashRecentProjectsList');
    if (dashRecentList) {
      dashRecentList.innerHTML = '';
      projects.slice(0, 5).forEach(function (p) {
        var row = document.createElement('div');
        row.style.cssText = 'padding: 14px 20px; border-bottom: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 12px;';
        row.innerHTML =
          '<div style="display: flex; align-items: center; gap: 12px;">' +
            '<div style="width: 32px; height: 32px; border-radius: 8px; background: var(--paper-2); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--ink);">' +
              (p.mark || 'HK') +
            '</div>' +
            '<div>' +
              '<div style="font-weight: 600; color: var(--ink); font-size: 14px;">' + (p.tr ? p.tr.title : p.id) + '</div>' +
              '<div style="font-size: 12px; color: var(--muted);">' + ((p.chips || []).slice(0, 3).join(' · ')) + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display: flex; align-items: center; gap: 6px;">' +
            '<button class="btn btn-ghost btn-sm btn-edit-proj" data-id="' + p.id + '">Düzenle</button>' +
          '</div>';
        dashRecentList.appendChild(row);
      });

      $$('.btn-edit-proj', dashRecentList).forEach(function (b) {
        b.addEventListener('click', function () {
          openProjectModal(b.getAttribute('data-id'));
        });
      });
    }

    // Recent Messages
    var dashMsgList = $('#dashRecentMessagesList');
    if (dashMsgList) {
      dashMsgList.innerHTML = '';
      if (!inbox.length) {
        dashMsgList.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--muted); font-size: 13.5px;">Henüz mesaj yok.</div>';
      } else {
        inbox.slice(0, 4).forEach(function (m) {
          var item = document.createElement('div');
          item.className = 'inbox-item' + (!m.read ? ' is-unread' : '');
          item.innerHTML =
            '<div class="inbox-meta">' +
              '<span class="inbox-dot"></span>' +
              '<span class="inbox-from">' + m.name + '</span>' +
            '</div>' +
            '<div class="inbox-snippet">' +
              '<strong>' + m.topic + ':</strong>' + m.message +
            '</div>' +
            '<div class="inbox-date">' + formatTime(m.date) + '</div>';
          item.addEventListener('click', function () {
            openMessageModal(m.id);
          });
          dashMsgList.appendChild(item);
        });
      }
    }
  }

  function formatTime(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } catch (e) {
      return '';
    }
  }

  /* ---------------------------------------------------------
     Projects Manager
     --------------------------------------------------------- */
  var currentProjectFilter = 'all';
  var projectSearchQuery = '';

  function renderProjectsList() {
    var grid = $('#projectsAdminGrid');
    if (!grid) return;

    var projects = store.getProjects();
    var filtered = projects.filter(function (p) {
      var matchCategory = currentProjectFilter === 'all' || (p.tags && p.tags.indexOf(currentProjectFilter) !== -1);
      var q = projectSearchQuery.toLowerCase();
      var matchSearch = !q ||
        (p.tr && p.tr.title && p.tr.title.toLowerCase().indexOf(q) !== -1) ||
        (p.tr && p.tr.summary && p.tr.summary.toLowerCase().indexOf(q) !== -1) ||
        (p.chips && p.chips.some(function (c) { return c.toLowerCase().indexOf(q) !== -1; }));
      return matchCategory && matchSearch;
    });

    grid.innerHTML = '';
    if (!filtered.length) {
      grid.innerHTML = '<div style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--muted); background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius);">Eşleşen proje bulunamadı.</div>';
      return;
    }

    filtered.forEach(function (p, idx) {
      var card = document.createElement('article');
      card.className = 'project-card-admin';
      var tr = p.tr || {};
      var chipsHtml = (p.chips || []).map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('');

      card.innerHTML =
        '<div class="project-card-top">' +
          '<div class="project-card-badge-group">' +
            '<span class="badge-tag">' + (p.order < 10 ? '0' + p.order : p.order) + '</span>' +
            (p.featured ? '<span class="badge-tag featured">Öne Çıkan</span>' : '') +
            (tr.badge ? '<span class="badge-tag live">' + tr.badge + '</span>' : '') +
          '</div>' +
          '<div class="project-card-monogram">' + (p.mark || 'HK') + '</div>' +
        '</div>' +
        '<h3>' + (tr.title || p.id) + '</h3>' +
        '<span class="project-card-kind">' + (tr.kind || '') + '</span>' +
        '<p class="project-card-summary">' + (tr.summary || '') + '</p>' +
        '<div class="project-card-chips">' + chipsHtml + '</div>' +
        '<div class="project-card-foot">' +
          '<div class="reorder-btns">' +
            '<button class="btn-mini btn-move-up" data-id="' + p.id + '" title="Yukarı Taşı"' + (p.order === 1 ? ' disabled' : '') + '>' +
              '<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>' +
            '</button>' +
            '<button class="btn-mini btn-move-down" data-id="' + p.id + '" title="Aşağı Taşı"' + (p.order === projects.length ? ' disabled' : '') + '>' +
              '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="action-btns">' +
            '<button class="btn btn-secondary btn-sm btn-edit" data-id="' + p.id + '">Düzenle</button>' +
            '<button class="btn btn-danger btn-sm btn-delete" data-id="' + p.id + '" title="Projeyi Sil">' +
              '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>';

      grid.appendChild(card);
    });

    // Reorder Handlers
    $$('.btn-move-up', grid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        moveProject(id, -1);
      });
    });
    $$('.btn-move-down', grid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        moveProject(id, 1);
      });
    });

    // Edit and Delete Handlers
    $$('.btn-edit', grid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        openProjectModal(btn.getAttribute('data-id'));
      });
    });
    $$('.btn-delete', grid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        if (confirm('Bu projeyi silmek istediğinize emin misiniz?')) {
          store.deleteProject(id);
          renderProjectsList();
          renderDashboard();
          showToast('Proje silindi', 'info');
        }
      });
    });
  }

  function moveProject(id, delta) {
    var projs = store.getProjects();
    var idx = -1;
    for (var i = 0; i < projs.length; i++) {
      if (projs[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return;
    var targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= projs.length) return;

    var temp = projs[idx];
    projs[idx] = projs[targetIdx];
    projs[targetIdx] = temp;

    var orderedIds = projs.map(function (p) { return p.id; });
    store.reorderProjects(orderedIds);
    renderProjectsList();
    showToast('Proje sıralaması güncellendi', 'success');
  }

  // Filter tabs listener
  var filterTabs = $$('#projectFilterTabs .filter-tab');
  filterTabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterTabs.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      currentProjectFilter = btn.getAttribute('data-filter');
      renderProjectsList();
    });
  });

  // Search input listener
  var projectSearchInput = $('#projectSearchInput');
  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', function () {
      projectSearchQuery = projectSearchInput.value.trim();
      renderProjectsList();
    });
  }

  /* ---------------------------------------------------------
     Project Modal (Add / Edit)
     --------------------------------------------------------- */
  var projectModal = $('#projectModal');
  var closeProjectModalBtn = $('#closeProjectModalBtn');
  var cancelProjectModalBtn = $('#cancelProjectModalBtn');
  var saveProjectModalBtn = $('#saveProjectModalBtn');

  function openProjectModal(id) {
    var isNew = !id;
    $('#projectModalHeading').textContent = isNew ? 'Yeni Proje Ekle' : 'Projeyi Düzenle';
    $('#projFormId').value = id || '';

    // Switch to TR tab by default
    switchModalLangTab('tr');

    if (isNew) {
      $('#projTitleTr').value = '';
      $('#projKindTr').value = '';
      $('#projSummaryTr').value = '';
      $('#projRoleTr').value = 'Tasarım ve geliştirme';
      $('#projFeaturesTr').value = '';

      $('#projTitleEn').value = '';
      $('#projKindEn').value = '';
      $('#projSummaryEn').value = '';
      $('#projRoleEn').value = 'Design and development';
      $('#projFeaturesEn').value = '';

      $('#projMark').value = '';
      $('#projMedia').value = 'm1';
      $('#projChips').value = '';
      $('#projLink').value = '';
      $('#projFeatured').checked = false;
      $('#projIsActive').checked = true;

      $$('input[name="projTag"]').forEach(function (cb) { cb.checked = false; });
    } else {
      var p = store.getProjectById(id);
      if (!p) return;
      var tr = p.tr || {};
      var en = p.en || {};

      $('#projTitleTr').value = tr.title || '';
      $('#projKindTr').value = tr.kind || '';
      $('#projSummaryTr').value = tr.summary || '';
      $('#projRoleTr').value = tr.role || '';
      $('#projFeaturesTr').value = (tr.features || []).join('\n');

      $('#projTitleEn').value = en.title || '';
      $('#projKindEn').value = en.kind || '';
      $('#projSummaryEn').value = en.summary || '';
      $('#projRoleEn').value = en.role || '';
      $('#projFeaturesEn').value = (en.features || []).join('\n');

      $('#projMark').value = p.mark || '';
      $('#projMedia').value = p.media || 'm1';
      $('#projChips').value = (p.chips || []).join(', ');
      $('#projLink').value = (p.links && p.links[0] && p.links[0].href) || '';
      $('#projFeatured').checked = !!p.featured;
      $('#projIsActive').checked = p.status !== 'draft';

      var tags = p.tags || [];
      $$('input[name="projTag"]').forEach(function (cb) {
        cb.checked = tags.indexOf(cb.value) !== -1;
      });
    }

    projectModal.classList.add('is-open');
  }

  function closeProjectModal() {
    if (projectModal) projectModal.classList.remove('is-open');
  }

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
  if (cancelProjectModalBtn) cancelProjectModalBtn.addEventListener('click', closeProjectModal);

  // Modal Lang Tabs
  var langTabs = $$('.lang-tab-bar .lang-tab');
  function switchModalLangTab(lang) {
    langTabs.forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-langtab') === lang);
    });
    $('#langPaneTr').style.display = lang === 'tr' ? 'block' : 'none';
    $('#langPaneEn').style.display = lang === 'en' ? 'block' : 'none';
  }
  langTabs.forEach(function (t) {
    t.addEventListener('click', function () {
      switchModalLangTab(t.getAttribute('data-langtab'));
    });
  });

  // Modal Save Handler
  if (saveProjectModalBtn) {
    saveProjectModalBtn.addEventListener('click', function () {
      var id = $('#projFormId').value;
      var titleTr = $('#projTitleTr').value.trim();
      var kindTr = $('#projKindTr').value.trim();

      if (!titleTr || !kindTr) {
        alert('Lütfen Proje Adı ve Tür alanlarını doldurun.');
        switchModalLangTab('tr');
        return;
      }

      if (!id) {
        id = titleTr.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || ('p' + Date.now());
      }

      var existing = store.getProjectById(id) || {};
      var chipsRaw = $('#projChips').value;
      var chips = chipsRaw ? chipsRaw.split(',').map(function (c) { return c.trim(); }).filter(Boolean) : [];

      var selectedTags = [];
      $$('input[name="projTag"]:checked').forEach(function (cb) { selectedTags.push(cb.value); });
      if (!selectedTags.length) selectedTags.push('web');

      var featuresTr = $('#projFeaturesTr').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      var featuresEn = $('#projFeaturesEn').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);

      var linkUrl = $('#projLink').value.trim();
      var links = linkUrl ? [{ tr: 'Canlı siteyi aç', en: 'Open live site', href: linkUrl }] : (existing.links || []);

      var projectData = {
        id: id,
        order: existing.order || (store.getProjects().length + 1),
        featured: $('#projFeatured').checked,
        status: $('#projIsActive').checked ? 'active' : 'draft',
        tags: selectedTags,
        mark: $('#projMark').value.trim().toUpperCase() || titleTr.substr(0, 2).toUpperCase(),
        media: $('#projMedia').value,
        chips: chips,
        links: links,
        tr: {
          title: titleTr,
          kind: kindTr,
          badge: existing.tr ? existing.tr.badge : 'Aktif kullanılıyor',
          summary: $('#projSummaryTr').value.trim(),
          lead: $('#projSummaryTr').value.trim(),
          features: featuresTr,
          role: $('#projRoleTr').value.trim(),
          stack: chips.join(' · ')
        },
        en: {
          title: $('#projTitleEn').value.trim() || titleTr,
          kind: $('#projKindEn').value.trim() || kindTr,
          badge: existing.en ? existing.en.badge : 'In active use',
          summary: $('#projSummaryEn').value.trim() || $('#projSummaryTr').value.trim(),
          lead: $('#projSummaryEn').value.trim() || $('#projSummaryTr').value.trim(),
          features: featuresEn.length ? featuresEn : featuresTr,
          role: $('#projRoleEn').value.trim() || $('#projRoleTr').value.trim(),
          stack: chips.join(' · ')
        }
      };

      store.saveProject(projectData);
      closeProjectModal();
      renderProjectsList();
      renderDashboard();
      showToast('"' + titleTr + '" başarıyla kaydedildi', 'success');
    });
  }

  /* ---------------------------------------------------------
     Services & Process Editor
     --------------------------------------------------------- */
  function renderServicesEditor() {
    var container = $('#servicesEditorContainer');
    if (!container) return;
    var services = store.getServices();

    container.innerHTML = '';
    if (!services.length) {
      container.innerHTML = '<div class="empty-state"><p>Henüz kayıtlı bir hizmet bulunmuyor. Yukarıdaki butondan yeni hizmet ekleyebilirsiniz.</p></div>';
      return;
    }

    services.forEach(function (srv, idx) {
      var card = document.createElement('div');
      card.className = 'card-panel';
      var dTr = srv.tr || {};
      card.innerHTML =
        '<div class="card-panel-head">' +
          '<h3>Hizmet ' + (srv.number || ('0' + (idx + 1))) + ': ' + (dTr.title || '') + '</h3>' +
          '<div class="card-panel-actions">' +
            '<button class="btn btn-ghost btn-sm btn-delete-srv" data-id="' + srv.id + '" style="color:#ff4757;" type="button" title="Hizmeti Sil">' +
              '<svg viewBox="0 0 24 24" style="width:16px; height:16px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
              '<span>Sil</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="card-panel-body">' +
          '<div class="form-grid">' +
            '<div class="form-group col-full">' +
              '<label class="form-label">Hizmet Başlığı</label>' +
              '<input class="input-text srv-title-tr" data-idx="' + idx + '" value="' + (dTr.title || '') + '" />' +
            '</div>' +
            '<div class="form-group col-full">' +
              '<label class="form-label">Hizmet Açıklaması</label>' +
              '<textarea class="textarea-input srv-desc-tr" data-idx="' + idx + '" rows="2">' + (dTr.desc || '') + '</textarea>' +
            '</div>' +
            '<div class="form-group col-full">' +
              '<label class="form-label">Öne Çıkan Maddeler (Her satıra bir tane)</label>' +
              '<textarea class="textarea-input srv-items-tr" data-idx="' + idx + '" rows="3">' + ((dTr.items || []).join('\n')) + '</textarea>' +
            '</div>' +
          '</div>' +
        '</div>';
      container.appendChild(card);
    });

    // Silme butonlarını dinle
    $$('.btn-delete-srv', container).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var srvId = btn.getAttribute('data-id');
        if (confirm('Bu hizmeti silmek istediğinize emin misiniz?')) {
          store.deleteService(srvId);
          renderServicesEditor();
          showToast('Hizmet başarıyla silindi', 'info');
        }
      });
    });
  }

  var saveServicesBtn = $('#saveServicesBtn');
  if (saveServicesBtn) {
    saveServicesBtn.addEventListener('click', function () {
      var services = store.getServices();
      services.forEach(function (srv, idx) {
        var titleTr = $('.srv-title-tr[data-idx="' + idx + '"]');
        var descTr = $('.srv-desc-tr[data-idx="' + idx + '"]');
        var itemsTr = $('.srv-items-tr[data-idx="' + idx + '"]');

        if (!srv.tr) srv.tr = {};
        if (!srv.en) srv.en = {};

        if (titleTr) {
          srv.tr.title = titleTr.value.trim();
          srv.en.title = srv.tr.title;
        }
        if (descTr) {
          srv.tr.desc = descTr.value.trim();
          srv.en.desc = srv.tr.desc;
        }
        if (itemsTr) {
          srv.tr.items = itemsTr.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
          srv.en.items = srv.tr.items;
        }
      });
      store.saveServices(services);
      showToast('Hizmetler başarıyla güncellendi', 'success');
      renderServicesEditor();
    });
  }

  // Yeni Hizmet Modal İşlemleri
  var serviceModal = $('#serviceModal');
  var addServiceBtn = $('#addServiceBtn');
  var closeServiceModalBtn = $('#closeServiceModalBtn');
  var cancelServiceModalBtn = $('#cancelServiceModalBtn');
  var saveServiceModalBtn = $('#saveServiceModalBtn');
  var serviceModalForm = $('#serviceModalForm');

  function openServiceModal() {
    if (!serviceModal) return;
    if (serviceModalForm) serviceModalForm.reset();
    serviceModal.classList.add('is-open');
    serviceModal.classList.add('is-active');
    var firstInput = $('#newSrvTitleTr');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
  }

  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('is-open');
    serviceModal.classList.remove('is-active');
  }

  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openServiceModal();
    });
  }

  if (closeServiceModalBtn) closeServiceModalBtn.addEventListener('click', closeServiceModal);
  if (cancelServiceModalBtn) cancelServiceModalBtn.addEventListener('click', closeServiceModal);

  if (serviceModal) {
    serviceModal.addEventListener('click', function (e) {
      if (e.target === serviceModal) closeServiceModal();
    });
  }

  if (saveServiceModalBtn) {
    saveServiceModalBtn.addEventListener('click', function () {
      var title = ($('#newSrvTitleTr') && $('#newSrvTitleTr').value.trim()) || '';
      var desc = ($('#newSrvDescTr') && $('#newSrvDescTr').value.trim()) || '';
      var itemsRaw = ($('#newSrvItemsTr') && $('#newSrvItemsTr').value) || '';
      var items = itemsRaw.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);

      if (!title || !desc) {
        showToast('Lütfen başlık ve açıklama alanlarını doldurun', 'error');
        return;
      }

      store.addService({
        tr: { title: title, desc: desc, items: items },
        en: { title: title, desc: desc, items: items }
      });

      closeServiceModal();
      renderServicesEditor();
      showToast('Yeni hizmet başarıyla eklendi', 'success');
    });
  }

  /* ---------------------------------------------------------
     Skills & Stack Editor
     --------------------------------------------------------- */
  function renderSkillsEditor() {
    var container = $('#skillsEditorContainer');
    if (!container) return;
    var skills = store.getSkills();

    container.innerHTML = '';
    if (!skills.length) {
      container.innerHTML = '<div class="empty-state"><p>Henüz kayıtlı bir yetenek kategorisi bulunmuyor.</p></div>';
      return;
    }

    skills.forEach(function (cat, idx) {
      var card = document.createElement('div');
      card.className = 'card-panel';
      var dTr = cat.tr || {};

      var chipsHtml = (cat.chips || []).map(function (chip, chipIdx) {
        return (
          '<span class="skill-tag-pill">' +
            '<span>' + chip + '</span>' +
            '<button class="skill-tag-delete" data-cat="' + cat.id + '" data-chip-idx="' + chipIdx + '" type="button" title="Sil">&times;</button>' +
          '</span>'
        );
      }).join('');

      card.innerHTML =
        '<div class="card-panel-head">' +
          '<h3>Kategori ' + (cat.number || ('0' + (idx + 1))) + ': ' + (dTr.title || '') + '</h3>' +
          '<div class="card-panel-actions">' +
            '<button class="btn btn-ghost btn-sm btn-delete-cat" data-id="' + cat.id + '" style="color:#ff4757;" type="button" title="Kategoriyi Sil">' +
              '<svg viewBox="0 0 24 24" style="width:16px; height:16px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
              '<span>Sil</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="card-panel-body">' +
          '<div class="form-grid">' +
            '<div class="form-group col-full">' +
              '<label class="form-label">Kategori Başlığı</label>' +
              '<input class="input-text skill-title-tr" data-idx="' + idx + '" value="' + (dTr.title || '') + '" />' +
            '</div>' +
            '<div class="form-group col-full">' +
              '<label class="form-label">Kısa Açıklama</label>' +
              '<input class="input-text skill-desc-tr" data-idx="' + idx + '" value="' + (dTr.desc || '') + '" />' +
            '</div>' +
            '<div class="form-group col-full">' +
              '<label class="form-label">Tanımlı Yetenekler (' + ((cat.chips || []).length) + ' adet)</label>' +
              '<div class="skill-tags-wrapper">' +
                (chipsHtml || '<span style="font-size:12.5px; color:var(--muted);">Henüz yetenek eklenmedi.</span>') +
              '</div>' +
              '<div class="skill-quick-add">' +
                '<input class="input-text skill-add-input" data-cat="' + cat.id + '" placeholder="Yeni yetenek adı (örn: Docker, Tailwind)..." />' +
                '<button class="btn btn-secondary btn-sm skill-add-btn" data-cat="' + cat.id + '" type="button">+ Yetenek Ekle</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      container.appendChild(card);
    });

    // Tekil yetenek silme dinleyicileri
    $$('.skill-tag-delete', container).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var catId = btn.getAttribute('data-cat');
        var chipIdx = parseInt(btn.getAttribute('data-chip-idx'), 10);
        store.removeSkillFromCategory(catId, chipIdx);
        renderSkillsEditor();
        renderDashboard();
      });
    });

    // Hızlı yetenek ekleme dinleyicileri
    $$('.skill-add-btn', container).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var catId = btn.getAttribute('data-cat');
        var input = $('.skill-add-input[data-cat="' + catId + '"]', container);
        if (!input) return;
        var val = input.value.trim();
        if (val) {
          store.addSkillToCategory(catId, val);
          input.value = '';
          renderSkillsEditor();
          renderDashboard();
          showToast('"' + val + '" yeteneği eklendi', 'success');
        }
      });
    });

    $$('.skill-add-input', container).forEach(function (inp) {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var catId = inp.getAttribute('data-cat');
          var val = inp.value.trim();
          if (val) {
            store.addSkillToCategory(catId, val);
            inp.value = '';
            renderSkillsEditor();
            renderDashboard();
            showToast('"' + val + '" yeteneği eklendi', 'success');
          }
        }
      });
    });

    // Kategori silme
    $$('.btn-delete-cat', container).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var catId = btn.getAttribute('data-id');
        if (confirm('Bu yetenek kategorisini ve içindeki tüm yetenekleri silmek istediğinize emin misiniz?')) {
          store.deleteSkillCategory(catId);
          renderSkillsEditor();
          renderDashboard();
          showToast('Kategori silindi', 'info');
        }
      });
    });
  }

  var saveSkillsBtn = $('#saveSkillsBtn');
  if (saveSkillsBtn) {
    saveSkillsBtn.addEventListener('click', function () {
      var skills = store.getSkills();
      skills.forEach(function (cat, idx) {
        var titleTr = $('.skill-title-tr[data-idx="' + idx + '"]');
        var descTr = $('.skill-desc-tr[data-idx="' + idx + '"]');

        if (!cat.tr) cat.tr = {};
        if (!cat.en) cat.en = {};

        if (titleTr) {
          cat.tr.title = titleTr.value.trim();
          cat.en.title = cat.tr.title;
        }
        if (descTr) {
          cat.tr.desc = descTr.value.trim();
          cat.en.desc = cat.tr.desc;
        }
      });
      store.saveSkills(skills);
      showToast('Tüm yetenek kategorileri kaydedildi', 'success');
      renderDashboard();
      renderSkillsEditor();
    });
  }

  // Yeni Kategori Modal İşlemleri
  var skillCatModal = $('#skillCatModal');
  var addSkillCatBtn = $('#addSkillCatBtn');
  var closeSkillCatModalBtn = $('#closeSkillCatModalBtn');
  var cancelSkillCatModalBtn = $('#cancelSkillCatModalBtn');
  var saveSkillCatModalBtn = $('#saveSkillCatModalBtn');
  var skillCatModalForm = $('#skillCatModalForm');

  function openSkillCatModal() {
    if (!skillCatModal) return;
    if (skillCatModalForm) skillCatModalForm.reset();
    skillCatModal.classList.add('is-open');
    skillCatModal.classList.add('is-active');
    var firstInput = $('#newCatTitleTr');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
  }

  function closeSkillCatModal() {
    if (!skillCatModal) return;
    skillCatModal.classList.remove('is-open');
    skillCatModal.classList.remove('is-active');
  }

  if (addSkillCatBtn) {
    addSkillCatBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openSkillCatModal();
    });
  }

  if (closeSkillCatModalBtn) closeSkillCatModalBtn.addEventListener('click', closeSkillCatModal);
  if (cancelSkillCatModalBtn) cancelSkillCatModalBtn.addEventListener('click', closeSkillCatModal);

  if (skillCatModal) {
    skillCatModal.addEventListener('click', function (e) {
      if (e.target === skillCatModal) closeSkillCatModal();
    });
  }

  if (saveSkillCatModalBtn) {
    saveSkillCatModalBtn.addEventListener('click', function () {
      var title = ($('#newCatTitleTr') && $('#newCatTitleTr').value.trim()) || '';
      var desc = ($('#newCatDescTr') && $('#newCatDescTr').value.trim()) || '';
      var chipsRaw = ($('#newCatChips') && $('#newCatChips').value.trim()) || '';
      var chips = chipsRaw ? chipsRaw.split(',').map(function (c) { return c.trim(); }).filter(Boolean) : [];

      if (!title) {
        showToast('Lütfen kategori başlığını doldurun', 'error');
        return;
      }

      store.addSkillCategory({
        tr: { title: title, desc: desc },
        en: { title: title, desc: desc },
        chips: chips
      });

      closeSkillCatModal();
      renderSkillsEditor();
      renderDashboard();
      showToast('Yeni kategori ve yetenekler eklendi', 'success');
    });
  }

  /* ---------------------------------------------------------
     Profile & Settings Form & CV Drag-Drop
     --------------------------------------------------------- */
  function renderCvStatus() {
    var p = store.getProfile();
    var fileNameDisplay = $('#cvFileNameDisplay');
    var metaDisplay = $('#cvMetaDisplay');
    var downloadBtn = $('#cvDownloadBtn');
    var resetBtn = $('#cvResetBtn');
    var statusBadge = $('#cvStatusBadge');

    if (p.cvData) {
      if (fileNameDisplay) fileNameDisplay.textContent = p.cvFileName || 'Ozel-CV.pdf';
      if (metaDisplay) metaDisplay.textContent = 'Yüklenen Dosya · ' + (p.cvFileSize || '') + (p.cvUploadDate ? ' (' + p.cvUploadDate + ')' : '');
      if (downloadBtn) {
        downloadBtn.href = p.cvData;
        downloadBtn.setAttribute('download', p.cvFileName || 'Hamza-Koybasi-CV.pdf');
      }
      if (statusBadge) {
        statusBadge.textContent = 'Özel Yüklendi';
        statusBadge.style.background = 'var(--ok-dim)';
        statusBadge.style.color = 'var(--ok)';
      }
      if (resetBtn) resetBtn.style.display = 'inline-flex';
    } else {
      if (fileNameDisplay) fileNameDisplay.textContent = 'Hamza-Koybasi-CV.pdf';
      if (metaDisplay) metaDisplay.textContent = 'Orijinal dosya · assets/Hamza-Koybasi-CV.pdf';
      if (downloadBtn) {
        downloadBtn.href = '../assets/Hamza-Koybasi-CV.pdf';
        downloadBtn.setAttribute('download', 'Hamza-Koybasi-CV.pdf');
      }
      if (statusBadge) {
        statusBadge.textContent = 'Varsayılan';
        statusBadge.style.background = 'var(--accent-dim)';
        statusBadge.style.color = 'var(--accent)';
      }
      if (resetBtn) resetBtn.style.display = 'none';
    }
  }

  function handleCvUpload(file) {
    if (!file) return;
    var nameLower = file.name.toLowerCase();
    if (!nameLower.endsWith('.pdf') && file.type !== 'application/pdf') {
      showToast('Lütfen sadece PDF formatında bir CV dosyası yükleyin', 'error');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      showToast('Dosya boyutu çok büyük (Maksimum 10MB)', 'error');
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      var base64 = e.target.result;
      var sizeKb = Math.round(file.size / 1024);
      var sizeStr = sizeKb >= 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';
      store.saveCv(base64, file.name, sizeStr);
      renderCvStatus();
      showToast('Yeni CV başarıyla yüklendi ve yayına alındı!', 'success');
    };
    reader.onerror = function () {
      showToast('Dosya okunurken bir hata oluştu', 'error');
    };
    reader.readAsDataURL(file);
  }

  var cvDropzone = $('#cvDropzone');
  var cvFileInput = $('#cvFileInput');
  var cvResetBtn = $('#cvResetBtn');

  if (cvDropzone && cvFileInput) {
    cvDropzone.addEventListener('click', function () {
      cvFileInput.click();
    });

    cvFileInput.addEventListener('change', function () {
      if (this.files && this.files.length) {
        handleCvUpload(this.files[0]);
        this.value = '';
      }
    });

    ['dragenter', 'dragover'].forEach(function (evtName) {
      cvDropzone.addEventListener(evtName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        cvDropzone.classList.add('is-dragover');
      });
    });

    ['dragleave', 'dragend'].forEach(function (evtName) {
      cvDropzone.addEventListener(evtName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        cvDropzone.classList.remove('is-dragover');
      });
    });

    cvDropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      cvDropzone.classList.remove('is-dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        handleCvUpload(e.dataTransfer.files[0]);
      }
    });
  }

  if (cvResetBtn) {
    cvResetBtn.addEventListener('click', function () {
      if (confirm('Varsayılan orijinal CV dosyasına dönmek istediğinize emin misiniz?')) {
        store.resetCv();
        renderCvStatus();
        showToast('CV dosyası varsayılana sıfırlandı', 'info');
      }
    });
  }

  function renderProfileForm() {
    var p = store.getProfile();
    if ($('#profName')) $('#profName').value = p.name || '';
    if ($('#profRoleTr')) $('#profRoleTr').value = p.roleTr || '';
    if ($('#profEmail')) $('#profEmail').value = p.email || '';
    if ($('#profPhone')) $('#profPhone').value = p.phone || '';
    if ($('#profLocationTr')) $('#profLocationTr').value = p.locationTr || '';
    if ($('#profAvailabilityTr')) $('#profAvailabilityTr').value = p.availabilityTr || '';
    if ($('#profGithub')) $('#profGithub').value = p.github || '';
    if ($('#profLinkedin')) $('#profLinkedin').value = p.linkedin || '';
    if ($('#profCvPath')) $('#profCvPath').value = p.cvPath || '';
    renderCvStatus();
  }

  var saveProfileBtn = $('#saveProfileBtn');
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', function () {
      var p = {
        name: ($('#profName') && $('#profName').value.trim()) || '',
        roleTr: ($('#profRoleTr') && $('#profRoleTr').value.trim()) || '',
        email: ($('#profEmail') && $('#profEmail').value.trim()) || '',
        phone: ($('#profPhone') && $('#profPhone').value.trim()) || '',
        locationTr: ($('#profLocationTr') && $('#profLocationTr').value.trim()) || '',
        availabilityTr: ($('#profAvailabilityTr') && $('#profAvailabilityTr').value.trim()) || '',
        github: ($('#profGithub') && $('#profGithub').value.trim()) || '',
        linkedin: ($('#profLinkedin') && $('#profLinkedin').value.trim()) || '',
        cvPath: ($('#profCvPath') && $('#profCvPath').value.trim()) || ''
      };
      store.saveProfile(p);
      showToast('Profil ve iletişim ayarları kaydedildi', 'success');
    });
  }

  /* ---------------------------------------------------------
     Inbox View & Messages
     --------------------------------------------------------- */
  var currentInboxFilter = 'all';

  function renderInboxList() {
    var list = $('#inboxItemsList');
    if (!list) return;
    var messages = store.getInbox();

    var filtered = messages.filter(function (m) {
      if (currentInboxFilter === 'unread') return !m.read;
      return true;
    });

    list.innerHTML = '';
    if (!filtered.length) {
      list.innerHTML = '<div style="padding: 48px; text-align: center; color: var(--muted);">Gelen kutusu boş.</div>';
      return;
    }

    filtered.forEach(function (m) {
      var row = document.createElement('div');
      row.className = 'inbox-item' + (!m.read ? ' is-unread' : '');
      row.innerHTML =
        '<div class="inbox-meta">' +
          '<span class="inbox-dot"></span>' +
          '<span class="inbox-from">' + m.name + '</span>' +
        '</div>' +
        '<div class="inbox-snippet">' +
          '<strong>' + m.topic + ':</strong> ' + m.message +
        '</div>' +
        '<div class="inbox-date">' + formatTime(m.date) + '</div>';
      row.addEventListener('click', function () {
        openMessageModal(m.id);
      });
      list.appendChild(row);
    });
  }

  var inboxFilterTabs = $$('#inboxFilterTabs .filter-tab');
  inboxFilterTabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      inboxFilterTabs.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      currentInboxFilter = btn.getAttribute('data-inbox');
      renderInboxList();
    });
  });

  // Message Modal
  var messageModal = $('#messageModal');
  var closeMessageModalBtn = $('#closeMessageModalBtn');
  var currentViewingMessageId = null;

  function openMessageModal(id) {
    var messages = store.getInbox();
    var msg = null;
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].id === id) { msg = messages[i]; break; }
    }
    if (!msg) return;
    currentViewingMessageId = id;

    // Automatically mark as read
    store.markMessageRead(id, true);
    renderDashboard();

    var bodyEl = $('#messageModalBody');
    bodyEl.innerHTML =
      '<div class="message-modal-content">' +
        '<div class="message-modal-head">' +
          '<h3>' + msg.name + '</h3>' +
          '<p><strong>Konu:</strong> ' + msg.topic + ' · <strong>E-posta:</strong> ' + (msg.email || 'Belirtilmedi') + ' · ' + formatTime(msg.date) + '</p>' +
        '</div>' +
        '<div class="message-modal-body">' + msg.message + '</div>' +
      '</div>';

    var replyBtn = $('#replyMsgBtn');
    if (replyBtn) {
      var mailto = 'mailto:' + encodeURIComponent(msg.email) + '?subject=' + encodeURIComponent('Ynt: [' + msg.topic + '] Portfolyo İletişim');
      replyBtn.href = mailto;
    }

    messageModal.classList.add('is-open');
  }

  function closeMessageModal() {
    if (messageModal) messageModal.classList.remove('is-open');
    renderInboxList();
  }

  if (closeMessageModalBtn) closeMessageModalBtn.addEventListener('click', closeMessageModal);

  $('#deleteMsgBtn') && $('#deleteMsgBtn').addEventListener('click', function () {
    if (currentViewingMessageId && confirm('Bu mesajı silmek istiyor musunuz?')) {
      store.deleteMessage(currentViewingMessageId);
      closeMessageModal();
      renderDashboard();
      showToast('Mesaj silindi', 'info');
    }
  });

  $('#toggleReadMsgBtn') && $('#toggleReadMsgBtn').addEventListener('click', function () {
    if (currentViewingMessageId) {
      store.markMessageRead(currentViewingMessageId, false);
      closeMessageModal();
      renderDashboard();
      showToast('Mesaj okunmadı olarak işaretlendi', 'info');
    }
  });

  /* ---------------------------------------------------------
     JSON Modal & Backup / Restore
     --------------------------------------------------------- */
  var jsonModal = $('#jsonModal');
  var exportModalBtn = $('#exportModalBtn');
  var closeJsonModalBtn = $('#closeJsonModalBtn');
  var cancelJsonModalBtn = $('#cancelJsonModalBtn');
  var jsonViewerArea = $('#jsonViewerArea');
  var downloadJsonBtn = $('#downloadJsonBtn');
  var copyJsonBtn = $('#copyJsonBtn');
  var applyJsonImportBtn = $('#applyJsonImportBtn');

  function openJsonModal() {
    if (jsonViewerArea) jsonViewerArea.value = store.exportJSON();
    if (jsonModal) jsonModal.classList.add('is-open');
  }
  function closeJsonModal() {
    if (jsonModal) jsonModal.classList.remove('is-open');
  }

  if (exportModalBtn) exportModalBtn.addEventListener('click', openJsonModal);
  if ($('#btnQuickBackup')) $('#btnQuickBackup').addEventListener('click', openJsonModal);
  if (closeJsonModalBtn) closeJsonModalBtn.addEventListener('click', closeJsonModal);
  if (cancelJsonModalBtn) cancelJsonModalBtn.addEventListener('click', closeJsonModal);

  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener('click', function () {
      var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(store.exportJSON());
      var a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', 'hamzakoybasi_portfolio_backup_' + new Date().toISOString().slice(0, 10) + '.json');
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('Yedek dosyası indirildi', 'success');
    });
  }

  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', function () {
      if (jsonViewerArea) {
        jsonViewerArea.select();
        try {
          navigator.clipboard.writeText(jsonViewerArea.value);
          showToast('JSON panoya kopyalandı', 'success');
        } catch (e) {
          document.execCommand('copy');
          showToast('JSON panoya kopyalandı', 'success');
        }
      }
    });
  }

  if (applyJsonImportBtn) {
    applyJsonImportBtn.addEventListener('click', function () {
      if (!jsonViewerArea) return;
      var str = jsonViewerArea.value.trim();
      var res = store.importJSON(str);
      if (res.success) {
        closeJsonModal();
        initDashboard();
        showToast('JSON başarıyla uygulandı ve kaydedildi', 'success');
      } else {
        alert('Hata: ' + res.error);
      }
    });
  }

  // Quick reset to factory defaults
  var btnQuickReset = $('#btnQuickReset');
  if (btnQuickReset) {
    btnQuickReset.addEventListener('click', function () {
      if (confirm('Tüm portfolyo verisini varsayılan başlangıç haline sıfırlamak istiyor musunuz? (Bu işlem geri alınamaz)')) {
        store.resetToDefaults();
        initDashboard();
        showToast('Portfolyo fabrika ayarlarına sıfırlandı', 'info');
      }
    });
  }

  /* ---------------------------------------------------------
     App Initialization
     --------------------------------------------------------- */
  function initDashboard() {
    var hash = (window.location.hash || '#dashboard').replace('#', '');
    if (!viewTitles[hash]) hash = 'dashboard';
    switchTab(hash);
  }

  // Check auth state on start
  checkAuth();

})();
