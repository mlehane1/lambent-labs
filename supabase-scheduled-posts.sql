-- Add scheduled_at column for auto-publishing blog posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
