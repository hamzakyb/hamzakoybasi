'use client';

import { PortfolioData, Project, ServiceItem, SkillCategory, Profile, InboxMessage } from './types';
import { INITIAL_DATA, DEFAULT_PROFILE } from './initialData';
import { 
  getSupabase, 
  isSupabaseConfigured, 
  fetchRemotePortfolioState, 
  saveRemotePortfolioState, 
  sendRemoteContactMessage,
  getSupabaseAnonKey,
  setSupabaseAnonKey
} from './supabase';

const STORAGE_KEY = 'hk_portfolio_data_next_v1';
const AUTH_KEY = 'hk_admin_auth_v1';
const THEME_KEY = 'hk_admin_theme_v1';

let isSyncing = false;
let hasSyncedInitial = false;

export const portfolioStore = {
  getSupabaseConfigured(): boolean {
    return isSupabaseConfigured();
  },

  getAnonKey(): string {
    return getSupabaseAnonKey();
  },

  setAnonKey(key: string): void {
    setSupabaseAnonKey(key);
    this.syncFromSupabase();
  },

  async syncFromSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured() || isSyncing) return false;
    isSyncing = true;
    try {
      const remoteData = await fetchRemotePortfolioState();
      if (remoteData && remoteData.projects) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
        window.dispatchEvent(new CustomEvent('portfolio:dataChanged', { detail: remoteData }));
        hasSyncedInitial = true;
        return true;
      } else if (!hasSyncedInitial) {
        // Supabase tablosu henüz boşsa, yerel veriyi Supabase'e ilk kez tohumla (seed et)
        const current = this.getData();
        await saveRemotePortfolioState(current);
        hasSyncedInitial = true;
      }
    } catch (e) {
      console.warn('Supabase sync error:', e);
    } finally {
      isSyncing = false;
    }
    return false;
  },

  getData(): PortfolioData {
    if (typeof window === 'undefined') return INITIAL_DATA;
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        return {
          projects: parsed.projects || INITIAL_DATA.projects,
          services: parsed.services || INITIAL_DATA.services,
          skills: parsed.skills || INITIAL_DATA.skills,
          profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
          inbox: parsed.inbox || INITIAL_DATA.inbox
        };
      }
    } catch (e) {
      console.error('Failed to load portfolio data from localStorage', e);
    }
    return INITIAL_DATA;
  },

  saveData(data: PortfolioData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('portfolio:dataChanged', { detail: data }));
      
      // Supabase'e arka planda asenkron kaydet
      if (isSupabaseConfigured()) {
        saveRemotePortfolioState(data).catch(err => {
          console.warn('Supabase background save warning:', err);
        });
      }
    } catch (e) {
      console.error('Failed to save portfolio data to localStorage', e);
    }
  },

  getProjects(): Project[] {
    return this.getData().projects.slice().sort((a, b) => a.order - b.order);
  },

  saveProject(project: Partial<Project> & { id?: string }): Project {
    const data = this.getData();
    let saved: Project;
    if (project.id) {
      const idx = data.projects.findIndex(p => p.id === project.id);
      if (idx !== -1) {
        saved = { ...data.projects[idx], ...project } as Project;
        data.projects[idx] = saved;
      } else {
        saved = project as Project;
        data.projects.push(saved);
      }
    } else {
      const nextOrder = data.projects.length + 1;
      const id = 'proj-' + Date.now();
      saved = {
        ...project,
        id,
        order: nextOrder,
        featured: project.featured ?? false,
        status: project.status ?? 'active',
        tags: project.tags ?? ['web'],
        mark: project.mark ?? 'HK',
        media: project.media ?? 'm1',
        tr: project.tr || {
          title: 'Yeni Proje',
          kind: 'Web',
          summary: '',
          features: [],
          role: 'Geliştirici',
          stack: 'Next.js'
        },
        en: project.en || {
          title: 'New Project',
          kind: 'Web',
          summary: '',
          features: [],
          role: 'Developer',
          stack: 'Next.js'
        },
        chips: project.chips ?? ['Next.js'],
        links: project.links ?? []
      } as Project;
      data.projects.push(saved);
    }
    this.saveData(data);
    return saved;
  },

  deleteProject(id: string): void {
    const data = this.getData();
    data.projects = data.projects.filter(p => p.id !== id);
    data.projects.forEach((p, i) => { p.order = i + 1; });
    this.saveData(data);
  },

  getServices(): ServiceItem[] {
    return this.getData().services;
  },

  saveServices(services: ServiceItem[]): void {
    const data = this.getData();
    data.services = services;
    this.saveData(data);
  },

  addService(service: { title: string; desc: string; items: string[] }): ServiceItem {
    const data = this.getData();
    const nextNo = data.services.length + 1;
    const numStr = nextNo < 10 ? '0' + nextNo : String(nextNo);
    const item: ServiceItem = {
      id: 'srv-' + Date.now(),
      number: numStr,
      tr: {
        title: service.title,
        desc: service.desc,
        items: service.items
      },
      en: {
        title: service.title,
        desc: service.desc,
        items: service.items
      }
    };
    data.services.push(item);
    this.saveData(data);
    return item;
  },

  deleteService(id: string): void {
    const data = this.getData();
    data.services = data.services.filter(s => s.id !== id);
    data.services.forEach((s, i) => {
      const num = i + 1;
      s.number = num < 10 ? '0' + num : String(num);
    });
    this.saveData(data);
  },

  getSkills(): SkillCategory[] {
    return this.getData().skills;
  },

  saveSkills(skills: SkillCategory[]): void {
    const data = this.getData();
    data.skills = skills;
    this.saveData(data);
  },

  addSkillCategory(category: { title: string; desc: string; chips: string[] }): SkillCategory {
    const data = this.getData();
    const nextNo = data.skills.length + 1;
    const numStr = nextNo < 10 ? '0' + nextNo : String(nextNo);
    const item: SkillCategory = {
      id: 'cat-' + Date.now(),
      number: numStr,
      tr: {
        title: category.title,
        desc: category.desc
      },
      en: {
        title: category.title,
        desc: category.desc
      },
      chips: category.chips
    };
    data.skills.push(item);
    this.saveData(data);
    return item;
  },

  deleteSkillCategory(id: string): void {
    const data = this.getData();
    data.skills = data.skills.filter(c => c.id !== id);
    data.skills.forEach((c, i) => {
      const num = i + 1;
      c.number = num < 10 ? '0' + num : String(num);
    });
    this.saveData(data);
  },

  addSkillToCategory(catId: string, chipName: string): boolean {
    const data = this.getData();
    const target = data.skills.find(c => c.id === catId);
    if (!target) return false;
    if (!target.chips) target.chips = [];
    const clean = chipName.trim();
    if (clean && !target.chips.includes(clean)) {
      target.chips.push(clean);
      this.saveData(data);
      return true;
    }
    return false;
  },

  removeSkillFromCategory(catId: string, chipIdx: number): boolean {
    const data = this.getData();
    const target = data.skills.find(c => c.id === catId);
    if (!target || !target.chips) return false;
    target.chips.splice(chipIdx, 1);
    this.saveData(data);
    return true;
  },

  getProfile(): Profile {
    return this.getData().profile;
  },

  saveProfile(profile: Partial<Profile>): Profile {
    const data = this.getData();
    data.profile = { ...data.profile, ...profile };
    this.saveData(data);
    return data.profile;
  },

  saveCv(base64Data: string, fileName?: string, fileSize?: string): Profile {
    const data = this.getData();
    data.profile.cvData = base64Data;
    data.profile.cvFileName = fileName || 'Hamza-Koybasi-CV.pdf';
    data.profile.cvFileSize = fileSize || '';
    data.profile.cvUploadDate = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
    this.saveData(data);
    return data.profile;
  },

  resetCv(): Profile {
    const data = this.getData();
    delete data.profile.cvData;
    data.profile.cvFileName = 'Hamza-Koybasi-CV.pdf';
    data.profile.cvPath = '/assets/Hamza-Koybasi-CV.pdf';
    delete data.profile.cvFileSize;
    delete data.profile.cvUploadDate;
    this.saveData(data);
    return data.profile;
  },

  getInbox(): InboxMessage[] {
    return this.getData().inbox.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addMessage(msg: { name: string; email: string; topic?: string; message: string }): InboxMessage {
    const data = this.getData();
    const item: InboxMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: msg.name || 'İsimsiz',
      email: msg.email || '',
      topic: msg.topic || 'Genel',
      message: msg.message || '',
      date: new Date().toISOString(),
      read: false
    };
    if (!data.inbox) data.inbox = [];
    data.inbox.unshift(item);
    this.saveData(data);

    if (isSupabaseConfigured()) {
      sendRemoteContactMessage(msg).catch(err => {
        console.warn('Failed to send message to Supabase inbox_messages:', err);
      });
    }

    return item;
  },

  toggleMessageRead(id: string): boolean {
    const data = this.getData();
    const target = (data.inbox || []).find(m => m.id === id);
    if (!target) return false;
    target.read = !target.read;
    this.saveData(data);
    return target.read;
  },

  deleteMessage(id: string): void {
    const data = this.getData();
    data.inbox = (data.inbox || []).filter(m => m.id !== id);
    this.saveData(data);
  },

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  },

  login(pass: string): boolean {
    if (pass === 'admin' || pass === 'hamza2026' || pass === 'hk') {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {}
      return true;
    }
    return false;
  },

  logout(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  },

  getTheme(): string {
    if (typeof window === 'undefined') return 'paper';
    try {
      return localStorage.getItem(THEME_KEY) || 'paper';
    } catch {
      return 'paper';
    }
  },

  setTheme(theme: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch {}
  }
};
