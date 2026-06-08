-- ============================================================
-- CMS Users — multi-user login & management
-- Run this in your Supabase SQL editor.
-- ============================================================

create table if not exists cms_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  name text default '',
  role text not null default 'admin', -- admin | editor (all have CMS access for now)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists cms_users_email on cms_users(email);
