
-- Create table for Paystack payment transactions
CREATE TABLE public.paystack_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL, -- Amount in kobo (smallest currency unit)
  currency TEXT NOT NULL DEFAULT 'NGN',
  status TEXT NOT NULL DEFAULT 'pending',
  product_id TEXT NOT NULL,
  subscription_tier TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  paystack_transaction_id TEXT,
  authorization_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.paystack_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for paystack_transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.paystack_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
  ON public.paystack_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update transactions" 
  ON public.paystack_transactions 
  FOR UPDATE 
  USING (true);

-- Add index for faster lookups
CREATE INDEX idx_paystack_transactions_reference ON public.paystack_transactions(reference);
CREATE INDEX idx_paystack_transactions_user_id ON public.paystack_transactions(user_id);

-- Add payment_provider column to user_subscriptions to track which provider was used
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'gumroad';

-- Add paystack_reference column to link with paystack transactions
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS paystack_reference TEXT;
