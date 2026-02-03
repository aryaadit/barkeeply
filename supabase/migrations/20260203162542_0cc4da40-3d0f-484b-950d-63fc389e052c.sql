-- Fix drinks_public view to use security_invoker=on
DROP VIEW IF EXISTS public.drinks_public;

CREATE VIEW public.drinks_public
WITH (security_invoker = on) AS
SELECT 
    d.id, 
    d.user_id, 
    d.name, 
    d.type, 
    d.rating, 
    d.image_url, 
    d.date_added, 
    d.is_wishlist, 
    d.brand, 
    d.created_at
FROM public.drinks d;

-- Add RLS policy to allow viewing drinks based on owner's activity_visibility
-- Users can see drinks when:
-- 1. It's their own drink
-- 2. Owner has activity_visibility = 'public'
-- 3. Owner has activity_visibility = 'followers' AND viewer is following them
CREATE POLICY "Users can view drinks based on activity visibility"
  ON public.drinks FOR SELECT
  USING (
    auth.uid() = user_id
    OR get_activity_visibility(user_id) = 'public'
    OR (get_activity_visibility(user_id) = 'followers' AND is_following(auth.uid(), user_id))
  );

-- Fix collections_public view to use security_invoker=on  
DROP VIEW IF EXISTS public.collections_public;

CREATE VIEW public.collections_public
WITH (security_invoker = on) AS
SELECT 
    id, 
    name, 
    description, 
    icon, 
    cover_color, 
    is_public, 
    share_id, 
    created_at, 
    updated_at
FROM public.collections
WHERE is_public = true;

-- Add RLS policy to allow viewing public collections
CREATE POLICY "Anyone can view public collections"
  ON public.collections FOR SELECT
  USING (is_public = true);