-- Fix: Feed should only show activity from yourself + users you follow.
-- Previously, "public" visibility meant activity appeared in ALL users' feeds,
-- even those who don't follow the user. Now, visibility controls what followers
-- can see — not whether strangers see your activity.

-- Drop the two permissive policies that together allow non-followers to see activity
DROP POLICY IF EXISTS "Users can see public activity" ON public.activity_feed;
DROP POLICY IF EXISTS "Users can see followers-only activity if following" ON public.activity_feed;

-- Replace with a single policy: you must follow the user, and their visibility
-- must be 'public' or 'followers' (i.e., not 'private')
CREATE POLICY "Users can see followed users activity"
  ON public.activity_feed FOR SELECT
  USING (
    public.is_following(auth.uid(), user_id)
    AND public.get_activity_visibility(user_id) IN ('public', 'followers')
  );
