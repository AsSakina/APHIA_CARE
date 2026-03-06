-- Add avatar_url column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Comment
COMMENT ON COLUMN users.avatar_url IS 'URL of user profile photo stored in Vercel Blob';
