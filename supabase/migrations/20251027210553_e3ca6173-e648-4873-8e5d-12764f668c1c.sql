-- Create mortgage_accounts table to support multiple accounts per user
CREATE TABLE IF NOT EXISTS public.mortgage_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  account_name text NOT NULL,
  mortgage_amount numeric NOT NULL,
  current_rate numeric NOT NULL,
  monthly_payment numeric NOT NULL,
  contract_end_date date NOT NULL,
  payment_day_of_month integer NOT NULL,
  overpayment_amount numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  last_updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT mortgage_accounts_user_id_account_name_key UNIQUE (user_id, account_name)
);

-- Enable RLS
ALTER TABLE public.mortgage_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own mortgage accounts"
ON public.mortgage_accounts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mortgage accounts"
ON public.mortgage_accounts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mortgage accounts"
ON public.mortgage_accounts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mortgage accounts"
ON public.mortgage_accounts
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_mortgage_accounts_updated_at
BEFORE UPDATE ON public.mortgage_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for last_updated_at (similar to user_mortgages)
CREATE TRIGGER update_mortgage_accounts_timestamp
BEFORE UPDATE ON public.mortgage_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_mortgage_timestamp();

-- Migrate existing data from user_mortgages to mortgage_accounts
INSERT INTO public.mortgage_accounts (
  user_id,
  account_name,
  mortgage_amount,
  current_rate,
  monthly_payment,
  contract_end_date,
  payment_day_of_month,
  overpayment_amount,
  created_at,
  updated_at,
  last_updated_at
)
SELECT 
  user_id,
  'Primary Mortgage' as account_name,
  mortgage_amount,
  current_rate,
  monthly_payment,
  contract_end_date,
  payment_day_of_month,
  overpayment_amount,
  created_at,
  updated_at,
  last_updated_at
FROM public.user_mortgages
ON CONFLICT (user_id, account_name) DO NOTHING;