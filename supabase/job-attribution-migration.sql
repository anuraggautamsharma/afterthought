-- Job attribution for form submissions
-- ─────────────────────────────────────────────────────────────────────────────
-- Adds a job_id column to submissions so that when a single application form is
-- reused across multiple job postings, each response records which job it came
-- from. Safe to run multiple times.

alter table submissions
  add column if not exists job_id uuid references jobs(id) on delete set null;

create index if not exists submissions_job_id on submissions(job_id);
