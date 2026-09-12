export interface Project {
  id: string;
  order: number;
  featured: boolean;
  status: 'active' | 'draft';
  tags: string[];
  mark: string;
  media: string;
  tr: {
    kind: string;
    title: string;
    badge?: string;
    summary: string;
    lead?: string;
    features: string[];
    role: string;
    stack: string;
  };
  en: {
    kind: string;
    title: string;
    badge?: string;
    summary: string;
    lead?: string;
    features: string[];
    role: string;
    stack: string;
  };
  chips: string[];
  links: {
    tr: string;
    en: string;
    href: string;
  }[];
  credentials?: {
    username?: string;
    password?: string;
    pin?: string;
    noteTr?: string;
    noteEn?: string;
  };
}

export interface ServiceItem {
  id: string;
  number: string;
  tr: {
    title: string;
    desc: string;
    items: string[];
  };
  en?: {
    title: string;
    desc: string;
    items: string[];
  };
}

export interface SkillCategory {
  id: string;
  number: string;
  tr: {
    title: string;
    desc: string;
  };
  en?: {
    title: string;
    desc: string;
  };
  chips: string[];
}

export interface Profile {
  name: string;
  roleTr: string;
  roleEn: string;
  email: string;
  phone: string;
  locationTr: string;
  locationEn: string;
  availabilityTr: string;
  availabilityEn: string;
  focusTr: string;
  focusEn: string;
  languagesTr: string;
  languagesEn: string;
  github: string;
  linkedin: string;
  cvPath: string;
  cvData?: string;
  cvFileName?: string;
  cvFileSize?: string;
  cvUploadDate?: string;
  stats: {
    projectsCount: number;
    liveCount: number;
    areasCount: number;
  };
}

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SeoConfig {
  siteTitle?: string;
  metaDesc?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface SecurityConfig {
  adminPassword?: string;
  passwordChangedAt?: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  company: string;
  roleTr: string;
  roleEn: string;
  badge?: string;
  tr: {
    lead: string;
    points: string[];
    tech: string;
  };
  en?: {
    lead: string;
    points: string[];
    tech: string;
  };
}

export interface PortfolioData {
  projects: Project[];
  services: ServiceItem[];
  skills: SkillCategory[];
  profile: Profile;
  inbox: InboxMessage[];
  experiences?: ExperienceItem[];
  security?: SecurityConfig;
  seo?: SeoConfig;
}
