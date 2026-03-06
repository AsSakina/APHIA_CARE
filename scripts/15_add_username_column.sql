-- Migration: Add username column to users table
-- Run this script to add username support

-- Add username column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'username'
  ) THEN
    ALTER TABLE users ADD COLUMN username VARCHAR(30);
  END IF;
END $$;

-- Create unique index on username
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique 
ON users(username) WHERE deleted_at IS NULL AND username IS NOT NULL;

-- Add phone column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone VARCHAR(20);
  END IF;
END $$;

-- Add avatar_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Update existing users with default usernames based on email
UPDATE users 
SET username = LOWER(SPLIT_PART(email, '@', 1))
WHERE username IS NULL;

-- Make username NOT NULL after setting defaults
-- ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Add comment
COMMENT ON COLUMN users.username IS 'Unique username for the user, 3-30 characters, alphanumeric with dots, dashes, underscores';
