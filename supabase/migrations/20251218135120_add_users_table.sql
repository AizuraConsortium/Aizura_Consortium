/*
  # Create Users Table for Role Management

  ## Summary
  Creates a comprehensive users table for managing user roles and future features like subscriptions.
  This table will be the central repository for all user-related data beyond authentication.

  ## Changes
  
  1. New Tables
    - `users` table
      - `id` (uuid, primary key) - Unique user identifier
      - `auth_user_id` (uuid, unique, references auth.users) - Links to Supabase auth
      - `role` (text) - User role: 'admin' or 'client'
      - `email` (text) - User email for quick reference
      - `created_at` (timestamptz) - When user was created
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on users table
    - No policies created - using server-side RBAC with service role key
    - Service role bypasses RLS for all operations
  
  3. Helper Functions
    - `get_user_role(user_id uuid)` - Returns user role as text
    - Used by backend middleware for authorization checks
  
  4. Indexes
    - Index on auth_user_id for fast lookups
    - Index on role for filtering queries
  
  ## Notes
  - This table is designed for expansion (subscriptions, preferences, etc.)
  - All access is controlled server-side via Express middleware
  - RLS is enabled but has no policies - service role handles all database operations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'client')),
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS (service role bypasses it)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM users
  WHERE auth_user_id = user_id;
  
  RETURN user_role;
END;
$$;

-- Add comment explaining server-side RBAC approach
COMMENT ON TABLE users IS 'Central user management table. RLS is enabled but has no policies. All access is controlled server-side via Express middleware using service role key.';
