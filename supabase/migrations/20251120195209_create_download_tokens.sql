/*
  # Create download tokens table

  1. New Tables
    - `download_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_type` (text) - type of product (e.g., 'ebook')
      - `token` (text, unique) - secure random token for download
      - `expires_at` (timestamptz) - when the token expires
      - `download_count` (integer) - number of times downloaded
      - `max_downloads` (integer) - maximum allowed downloads
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `download_tokens` table
    - Add policy for users to read their own tokens
    - Add policy for service role to manage tokens
*/

CREATE TABLE IF NOT EXISTS download_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_type text NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  download_count integer DEFAULT 0,
  max_downloads integer DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tokens"
  ON download_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage tokens"
  ON download_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_download_tokens_token ON download_tokens(token);
CREATE INDEX IF NOT EXISTS idx_download_tokens_user_id ON download_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_download_tokens_expires_at ON download_tokens(expires_at);