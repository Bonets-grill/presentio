-- Presentio Foundation Schema
-- AI-powered interactive presentations with voice narration

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

create type plan_type as enum ('free', 'pro', 'team');
create type presentation_status as enum ('draft', 'generating', 'ready', 'published');
create type section_type as enum (
  'hero', 'kpi_grid', 'data_table', 'step_flow',
  'chat_simulation', 'email_preview', 'progress_bars',
  'card_grid', 'big_impact', 'custom', 'footer'
);
create type language_code as enum ('es', 'en', 'fr', 'de', 'pt', 'it');

-- ============================================================
-- PROFILES
-- ============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  plan plan_type not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  voice_minutes_used numeric(10,2) not null default 0,
  voice_minutes_limit numeric(10,2) not null default 5,
  presentations_count integer not null default 0,
  presentations_limit integer not null default 2,
  locale language_code not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- PRESENTATIONS
-- ============================================================

create table presentations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  slug text unique,
  status presentation_status not null default 'draft',
  company_name text,
  company_description text,
  target_audience text,
  selling_points text[],
  pricing_info text,
  additional_context text,
  language language_code not null default 'en',
  theme_primary text not null default '#0ea5e9',
  theme_accent text not null default '#8b5cf6',
  theme_bg text not null default '#0a0a0f',
  theme_preset text,
  audio_url text,
  audio_duration numeric(10,2),
  voice_id text not null default 'default',
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table presentations enable row level security;

-- Owner can do everything
create policy "Users can CRUD own presentations"
  on presentations for all using (auth.uid() = user_id);

-- Published presentations are readable by anyone
create policy "Published presentations are public"
  on presentations for select using (status = 'published');

create index idx_presentations_user_id on presentations(user_id);
create index idx_presentations_slug on presentations(slug) where slug is not null;
create index idx_presentations_status on presentations(status);

-- ============================================================
-- SECTIONS
-- ============================================================

create table sections (
  id uuid primary key default uuid_generate_v4(),
  presentation_id uuid not null references presentations(id) on delete cascade,
  "order" integer not null default 0,
  section_type section_type not null,
  nav_label text not null,
  title text,
  subtitle text,
  label text,
  content_json jsonb not null default '{}',
  voice_script text,
  audio_url text,
  audio_duration numeric(10,2),
  audio_start_time numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table sections enable row level security;

-- Sections inherit access from their presentation
create policy "Users can CRUD sections of own presentations"
  on sections for all using (
    exists (
      select 1 from presentations
      where presentations.id = sections.presentation_id
        and presentations.user_id = auth.uid()
    )
  );

create policy "Sections of published presentations are public"
  on sections for select using (
    exists (
      select 1 from presentations
      where presentations.id = sections.presentation_id
        and presentations.status = 'published'
    )
  );

create index idx_sections_presentation_id on sections(presentation_id);
create index idx_sections_order on sections(presentation_id, "order");

-- ============================================================
-- PRESENTATION VIEWS (analytics)
-- ============================================================

create table presentation_views (
  id uuid primary key default uuid_generate_v4(),
  presentation_id uuid not null references presentations(id) on delete cascade,
  viewer_ip text,
  user_agent text,
  referrer text,
  sections_viewed text[] not null default '{}',
  max_section_reached integer not null default 0,
  total_time_seconds numeric(10,2) not null default 0,
  voice_started boolean not null default false,
  voice_completed boolean not null default false,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table presentation_views enable row level security;

-- Anyone can insert views (tracking endpoint, no auth required)
create policy "Anyone can insert views"
  on presentation_views for insert with check (true);

-- Presentation owners can read views
create policy "Owners can read views of own presentations"
  on presentation_views for select using (
    exists (
      select 1 from presentations
      where presentations.id = presentation_views.presentation_id
        and presentations.user_id = auth.uid()
    )
  );

create index idx_views_presentation_id on presentation_views(presentation_id);
create index idx_views_created_at on presentation_views(created_at);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger presentations_updated_at
  before update on presentations
  for each row execute function update_updated_at();

create trigger sections_updated_at
  before update on sections
  for each row execute function update_updated_at();

create trigger presentation_views_updated_at
  before update on presentation_views
  for each row execute function update_updated_at();
