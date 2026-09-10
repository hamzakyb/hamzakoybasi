import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PortfolioData, InboxMessage } from './types';

const DEFAULT_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://igytzanekayiyybvmqga.supabase.co';
const LOCAL_KEY_STORAGE = 'hk_supabase_anon_key_v1';

export function getSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    const fromLocal = localStorage.getItem(LOCAL_KEY_STORAGE);
    if (fromLocal && fromLocal.trim()) return fromLocal.trim();
  }
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

export function setSupabaseAnonKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem(LOCAL_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(LOCAL_KEY_STORAGE);
    }
  }
}

let cachedClient: SupabaseClient | null = null;
let cachedKey = '';

export function getSupabase(): SupabaseClient | null {
  const url = DEFAULT_SUPABASE_URL;
  const key = getSupabaseAnonKey();

  if (!url || !key || key.includes('your-supabase-anon-key')) {
    return null;
  }

  if (cachedClient && cachedKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    cachedKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Supabase client creation error:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const key = getSupabaseAnonKey();
  return Boolean(DEFAULT_SUPABASE_URL && key && !key.includes('your-supabase-anon-key'));
}

/**
 * Supabase'den portfolyo durumunu çeker
 */
export async function fetchRemotePortfolioState(): Promise<PortfolioData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('portfolio_state')
      .select('data')
      .eq('id', 'default_state')
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return null;
    }

    if (data && data.data) {
      return data.data as PortfolioData;
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch exception:', err);
    return null;
  }
}

/**
 * Portfolyo durumunu Supabase'e kaydeder
 */
export async function saveRemotePortfolioState(data: PortfolioData): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('portfolio_state')
      .upsert({
        id: 'default_state',
        data: data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase save error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save exception:', err);
    return false;
  }
}

/**
 * İletişim mesajını Supabase'e ekler
 */
export async function sendRemoteContactMessage(msg: {
  name: string;
  email: string;
  topic?: string;
  message: string;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('inbox_messages')
      .insert({
        name: msg.name,
        email: msg.email,
        topic: msg.topic || 'Genel',
        message: msg.message,
        date: new Date().toISOString(),
        read: false
      });

    if (error) {
      console.error('Supabase inbox message error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase inbox exception:', err);
    return false;
  }
}

/**
 * CV dosyasını Supabase Storage'a yükler ve public URL döner
 */
export async function uploadCvToSupabaseStorage(file: File): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const fileName = `Hamza-Koybasi-CV-${Date.now()}.pdf`;
    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf'
      });

    if (error) {
      console.error('Supabase CV storage error:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(data.path);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error('Supabase CV upload exception:', err);
    return null;
  }
}
