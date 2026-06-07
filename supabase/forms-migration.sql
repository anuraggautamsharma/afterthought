-- ============================================================
-- Forms Builder Migration
-- Run this in your Supabase SQL editor
-- ============================================================

-- Forms table
create table if not exists forms (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled form',
  slug text unique not null,
  description text default '',
  status text not null default 'draft', -- draft | published | closed

  -- design
  theme_color text default '#111111',
  header_image text,
  custom_font text default 'Inter',

  -- content
  submit_label text default 'Submit',
  confirmation_type text default 'message', -- message | redirect
  confirmation_message text default 'Thank you for your response.',
  redirect_url text default '',
  show_progress boolean default false,
  show_question_numbers boolean default false,
  shuffle_questions boolean default false,

  -- access
  password text default '',
  allowed_domains text[] default '{}',

  -- limits
  response_limit integer,
  open_at timestamptz,
  close_at timestamptz,
  allow_edit_after_submit boolean default false,
  limit_one_response boolean default false,

  -- notifications
  notify_emails text[] default '{}',
  auto_respond boolean default false,
  auto_respond_field text default '',
  auto_respond_subject text default 'Thanks for reaching out',
  auto_respond_body text default '',

  -- webhook
  webhook_url text default '',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Form sections (pages in multi-step forms)
create table if not exists form_sections (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms(id) on delete cascade,
  title text default '',
  description text default '',
  sort_order integer default 0,
  -- skip logic: [{conditions:[{field_id,op,value}], target_section_id}]
  skip_logic jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Form fields
create table if not exists form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms(id) on delete cascade,
  section_id uuid references form_sections(id) on delete set null,

  type text not null,
  label text not null default '',
  description text default '',
  placeholder text default '',
  required boolean default false,
  read_only boolean default false,

  -- options: [{label, value, image_url?}]
  options jsonb default '[]'::jsonb,
  shuffle_options boolean default false,

  -- numeric constraints
  min_value numeric,
  max_value numeric,
  step_value numeric default 1,

  -- text constraints
  min_length integer,
  max_length integer,
  validation_pattern text default '',

  -- scale / rating labels
  min_label text default '',
  max_label text default '',

  -- complex configs
  matrix_config jsonb,    -- {rows:string[], columns:string[], multi:bool}
  file_config jsonb,      -- {accepted_types:string[], max_size_mb:number, max_files:number}

  default_value jsonb,

  -- conditional visibility: {logic:'and'|'or', conditions:[{field_id,op,value}]}
  visibility jsonb,

  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add form linkage to existing submissions table
alter table submissions
  add column if not exists form_id uuid references forms(id),
  add column if not exists responses jsonb default '{}'::jsonb;

-- Indexes
create index if not exists form_sections_form_id on form_sections(form_id);
create index if not exists form_fields_form_id on form_fields(form_id);
create index if not exists form_fields_section_id on form_fields(section_id);
create index if not exists submissions_form_id on submissions(form_id);
