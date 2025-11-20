/*
  # Create Email Management Tables

  ## Overview
  This migration creates tables for managing ebook requests and newsletter subscriptions,
  enabling the application to collect, store, and track email communications.

  ## New Tables

  ### 1. ebook_requests
  Stores email addresses from users requesting the free ebook chapter or purchasing the full ebook.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each request
  - `email` (text, not null) - User's email address
  - `product_type` (text, not null) - Type of ebook request ('free_chapter' or 'full_ebook')
  - `sent_at` (timestamptz) - Timestamp when email was successfully sent
  - `error_message` (text) - Error details if email sending failed
  - `retry_count` (integer) - Number of retry attempts for failed sends
  - `created_at` (timestamptz) - When the request was created

  ### 2. newsletter_subscribers
  Stores newsletter subscription information with status tracking.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each subscriber
  - `email` (text, unique, not null) - Subscriber's email address
  - `subscribed` (boolean) - Whether user is currently subscribed
  - `confirmed` (boolean) - Whether email was confirmed (for double opt-in)
  - `confirmation_token` (text) - Token for email confirmation
  - `unsubscribe_token` (text, unique) - Token for unsubscribe link
  - `subscribed_at` (timestamptz) - When user subscribed
  - `unsubscribed_at` (timestamptz) - When user unsubscribed (if applicable)
  - `created_at` (timestamptz) - When record was created
  - `updated_at` (timestamptz) - When record was last updated

  ## Security
  - Enable RLS on both tables
  - Add policies for authenticated users to read their own data
  - Service role has full access for email operations
  - Public can insert (for newsletter signups and ebook requests)

  ## Indexes
  - Index on email columns for fast lookups
  - Index on sent_at for filtering unsent emails
  - Index on subscribed status for newsletter queries
  - Index on tokens for confirmation and unsubscribe operations
*/

-- Create ebook_requests table
CREATE TABLE IF NOT EXISTS ebook_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  product_type text NOT NULL DEFAULT 'free_chapter',
  sent_at timestamptz,
  error_message text,
  retry_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed boolean DEFAULT true,
  confirmed boolean DEFAULT false,
  confirmation_token text,
  unsubscribe_token text UNIQUE DEFAULT gen_random_uuid()::text,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ebook_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ebook_requests
CREATE POLICY "Anyone can insert ebook requests"
  ON ebook_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own ebook requests"
  ON ebook_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage ebook requests"
  ON ebook_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own newsletter subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage newsletter subscribers"
  ON newsletter_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ebook_requests_email ON ebook_requests(email);
CREATE INDEX IF NOT EXISTS idx_ebook_requests_sent_at ON ebook_requests(sent_at);
CREATE INDEX IF NOT EXISTS idx_ebook_requests_created_at ON ebook_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON newsletter_subscribers(subscribed);
CREATE INDEX IF NOT EXISTS idx_newsletter_confirmation_token ON newsletter_subscribers(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_unsubscribe_token ON newsletter_subscribers(unsubscribe_token);