-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.can_update_mortgage(_user_id UUID, _mortgage_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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