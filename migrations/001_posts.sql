-- Run this once in your Supabase dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL DEFAULT '',
  slug            TEXT UNIQUE,
  excerpt         TEXT DEFAULT '',
  content         JSONB DEFAULT '{}',
  cover_image     TEXT,
  category        TEXT DEFAULT 'Essay',
  author          TEXT DEFAULT 'Anurag Gautam & Tina Gidwani',
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  meta_title      TEXT,
  meta_description TEXT,
  og_image        TEXT,
  focus_keyword   TEXT,
  read_time       INTEGER DEFAULT 0
);

-- Auto-update updated_at on every save
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- Row-level security: public can only read published posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published"
  ON posts FOR SELECT
  USING (status = 'published');
