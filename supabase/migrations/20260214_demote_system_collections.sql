-- Demote all system collections to regular collections
UPDATE collections SET is_system = false WHERE is_system = true;

-- Drop the trigger that prevents deletion of system collections
DROP TRIGGER IF EXISTS prevent_system_collection_delete_trigger ON public.collections;
DROP FUNCTION IF EXISTS public.prevent_system_collection_delete();
