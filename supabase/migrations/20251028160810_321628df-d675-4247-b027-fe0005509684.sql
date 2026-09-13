-- Update the can_update_mortgage function to use 2 minutes instead of 3 days for testing
CREATE OR REPLACE FUNCTION public.can_update_mortgage(_user_id uuid, _mortgage_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  last_update TIMESTAMP WITH TIME ZONE;
  minutes_since_update NUMERIC;
BEGIN
  -- Get the last update timestamp
  SELECT last_updated_at INTO last_update
  FROM mortgage_accounts
  WHERE id = _mortgage_id AND user_id = _user_id;
  
  IF last_update IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate minutes since last update
  minutes_since_update := EXTRACT(EPOCH FROM (now() - last_update)) / 60;
  
  -- Allow update if more than 2 minutes have passed
  RETURN minutes_since_update >= 2;
END;
$function$;