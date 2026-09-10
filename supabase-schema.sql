-- ==============================================================================
-- HAMZA KÖYBAŞI PORTFOLYO - SUPABASE VERİTABANI & DEPOLAMA ŞEMASI
-- Supabase Dashboard -> SQL Editor alanına yapıştırıp "Run" butonuna basınız.
-- ==============================================================================

-- 1. PORTFOLYO DURUM TABLOSU (Tüm portfolyo içeriğinin anlık ve eksiksiz senkronizasyonu)
create table if not exists public.portfolio_state (
  id text primary key default 'default_state',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) Etkinleştirme
alter table public.portfolio_state enable row level security;

-- Herkes okuyabilir (ziyaretçiler portfolyoyu görür)
drop policy if exists "Public portfolio read" on public.portfolio_state;
create policy "Public portfolio read"
  on public.portfolio_state for select
  using (true);

-- Anon / Admin güncelleyebilir ve ekleyebilir
drop policy if exists "Admin portfolio upsert" on public.portfolio_state;
create policy "Admin portfolio upsert"
  on public.portfolio_state for all
  using (true)
  with check (true);


-- 2. İLETİŞİM FORMU MESAJLARI TABLOSU
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

-- Ziyaretçiler iletişim formundan mesaj gönderebilir
drop policy if exists "Public can submit contact messages" on public.inbox_messages;
create policy "Public can submit contact messages"
  on public.inbox_messages for insert
  with check (true);

-- Admin mesajları okuyabilir, silebilir ve okundu olarak işaretleyebilir
drop policy if exists "Admin can manage messages" on public.inbox_messages;
create policy "Admin can manage messages"
  on public.inbox_messages for all
  using (true)
  with check (true);


-- 3. PROJELER TABLOSU (İsteğe bağlı ilişkisel tablo)
create table if not exists public.projects (
  id text primary key,
  "order" integer default 1,
  featured boolean default false,
  status text default 'active',
  tags text[] default array['web'],
  mark text default 'HK',
  media text default 'm1',
  tr jsonb not null,
  en jsonb,
  chips text[] default array[]::text[],
  links jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

drop policy if exists "Public projects read" on public.projects;
create policy "Public projects read"
  on public.projects for select
  using (true);

drop policy if exists "Admin projects manage" on public.projects;
create policy "Admin projects manage"
  on public.projects for all
  using (true)
  with check (true);


-- 4. CV & ASSETS DEPOLAMA ALANI (Storage Bucket)
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access to portfolio-assets" on storage.objects;
create policy "Public Access to portfolio-assets"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

drop policy if exists "Admin upload to portfolio-assets" on storage.objects;
create policy "Admin upload to portfolio-assets"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-assets');

drop policy if exists "Admin update portfolio-assets" on storage.objects;
create policy "Admin update portfolio-assets"
  on storage.objects for update
  using (bucket_id = 'portfolio-assets');
