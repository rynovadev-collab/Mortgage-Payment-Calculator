-- Add address field to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add last_mortgage_update timestamp to user_mortgages
ALTER TABLE public.user_mortgages
ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create function to check if user can update mortgage (3 day lock for free users)
CREATE OR REPLACE FUNCTION public.can_update_mortgage(_user_id UUID, _mortgage_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_update TIMESTAMP WITH TIME ZONE;
  days_since_update NUMERIC;
BEGIN
  -- Get the last update timestamp
  SELECT last_updated_at INTO last_update
  FROM user_mortgages
  WHERE id = _mortgage_id AND user_id = _user_id;
  
  IF last_update IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate days since last update
  days_since_update := EXTRACT(EPOCH FROM (now() - last_update)) / 86400;
  
  -- Allow update if more than 3 days have passed
  RETURN days_since_update >= 3;
END;
$$;

-- Update trigger to set last_updated_at
CREATE OR REPLACE FUNCTION public.update_mortgage_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_updated_at = now();
  RETURN NEW;
END;
$$;

-- Add trigger to user_mortgages
DROP TRIGGER IF EXISTS set_mortgage_last_updated ON public.user_mortgages;
CREATE TRIGGER set_mortgage_last_updated
BEFORE UPDATE ON public.user_mortgages
FOR EACH ROW
EXECUTE FUNCTION public.update_mortgage_timestamp();