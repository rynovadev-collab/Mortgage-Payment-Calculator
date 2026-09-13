-- Fix the user_mortgages table to have a proper unique constraint for upsert operations
-- Add a unique constraint on user_id since each user should have only one mortgage record
ALTER TABLE public.user_mortgages 
ADD CONSTRAINT user_mortgages_user_id_key UNIQUE (user_id);