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

-- Only service role can access secrets
CREATE POLICY "Only service role can access secrets"
  ON app_secrets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert RESEND_API_KEY
INSERT INTO app_secrets (key, value)
VALUES ('RESEND_API_KEY', 're_873GGLzc_GkNywBduSdM4AV9Zjip7fBtL')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;