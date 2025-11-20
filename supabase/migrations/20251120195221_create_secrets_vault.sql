/*
  # Create Secrets Vault
  
  1. New Tables
    - `app_secrets` - Secure storage for application secrets
      - `key` (text, primary key) - Secret name
      - `value` (text) - Encrypted secret value
      - `created_at` (timestamptz) - Creation timestamp
      
  2. Security
    - Enable RLS on `app_secrets` table
    - Only service role can access secrets
*/

CREATE TABLE IF NOT EXISTS app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access secrets"
  ON app_secrets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);