-- ============================================================
-- Forms & Inbox Unification — Phase 1
-- Run this in your Supabase SQL editor AFTER forms-migration.sql
-- ============================================================

-- ── forms: category, site_role, is_system ──────────────────
alter table forms
  add column if not exists category text not null default 'general',
  add column if not exists site_role text,
  add column if not exists is_system boolean not null default false;

-- Only one form may hold a given built-in site slot at a time
-- (e.g. only one form can be the 'contact' form).
create unique index if not exists forms_site_role_unique
  on forms(site_role) where site_role is not null;

create index if not exists forms_category on forms(category);

-- ── jobs: dedicated application form per job ────────────────
alter table jobs
  add column if not exists application_form_id uuid references forms(id) on delete set null;

create index if not exists jobs_application_form_id on jobs(application_form_id);

-- ── submissions: ensure linkage columns exist + read flag ──
-- (form_id and responses were added in forms-migration.sql; this is
--  defensive in case that migration was only partially applied.)
alter table submissions
  add column if not exists form_id uuid references forms(id) on delete set null,
  add column if not exists responses jsonb default '{}'::jsonb;

create index if not exists submissions_form_id on submissions(form_id);
