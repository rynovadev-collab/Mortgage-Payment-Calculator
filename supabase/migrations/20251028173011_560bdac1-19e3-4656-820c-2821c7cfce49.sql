-- Add show_name_on_forum column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN show_name_on_forum BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.show_name_on_forum IS 'Controls whether the user''s name is displayed on community forum posts';