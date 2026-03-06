-- =====================================================
-- APHIA V0 - Script 14: Auth Security Update
-- Adds security columns for rate limiting and lockout
-- =====================================================

-- Add security columns to users table if they don't exist
DO $$ 
BEGIN
  -- Add failed_login_attempts column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'failed_login_attempts') THEN
    ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
  END IF;

  -- Add locked_until column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'locked_until') THEN
    ALTER TABLE users ADD COLUMN locked_until TIMESTAMPTZ DEFAULT NULL;
  END IF;

  -- Add last_failed_login column for tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'last_failed_login') THEN
    ALTER TABLE users ADD COLUMN last_failed_login TIMESTAMPTZ DEFAULT NULL;
  END IF;
END $$;

-- Create index for faster lookups on email (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_email_active 
ON users (email) 
WHERE deleted_at IS NULL;

-- Create index for lockout queries
CREATE INDEX IF NOT EXISTS idx_users_locked_until 
ON users (locked_until) 
WHERE locked_until IS NOT NULL;

-- Function to automatically reset failed attempts after lockout expires
CREATE OR REPLACE FUNCTION reset_expired_lockouts()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET failed_login_attempts = 0, locked_until = NULL
  WHERE locked_until IS NOT NULL AND locked_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comment for documentation
COMMENT ON COLUMN users.failed_login_attempts IS 'Counter for consecutive failed login attempts';
COMMENT ON COLUMN users.locked_until IS 'Timestamp until which the account is locked due to too many failed attempts';
COMMENT ON COLUMN users.last_failed_login IS 'Timestamp of the last failed login attempt';

SELECT 'Auth security columns added successfully' AS status;
