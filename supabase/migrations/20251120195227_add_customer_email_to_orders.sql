/*
  # Add customer_email to stripe_orders

  1. Changes
    - Add `customer_email` column to `stripe_orders` table
    - This will allow us to send ebook emails to customers after purchase

  2. Notes
    - Email is nullable for backward compatibility
    - Email is not unique as same customer can make multiple purchases
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_orders' AND column_name = 'customer_email'
  ) THEN
    ALTER TABLE stripe_orders ADD COLUMN customer_email text;
  END IF;
END $$;