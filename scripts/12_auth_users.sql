-- APHIA V0 - Authentication Users Table
-- Run this script to create the users table for authentication

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'pharmacist', 'user')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE deleted_at IS NULL;

-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();

-- Insert demo admin user (password: admin123)
-- Hash generated with bcrypt cost factor 10
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified_at) 
VALUES (
  'admin@aphia.sn',
  '$2a$10$rQZ8K.ORQ5QxVRqHqC0H5.kPZTqZJU1xGZ5VX3YhM7GKIZ5a0VqOe',
  'Admin',
  'APHIA',
  'admin',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert demo pharmacist user (password: pharma123)
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified_at) 
VALUES (
  'pharmacien@aphia.sn',
  '$2a$10$J5qLRuXD6dYJZjH8Qx4FXeYZ2U6wN9V1wK3mL7pQ8sT0uW4xYzA2B',
  'Mamadou',
  'DIALLO',
  'pharmacist',
  NOW()
) ON CONFLICT (email) DO NOTHING;

SELECT 'Users table created successfully' AS status;
