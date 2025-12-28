-- Add color column to custom_drink_types
ALTER TABLE public.custom_drink_types 
ADD COLUMN color TEXT NOT NULL DEFAULT '#8B5CF6';