-- Activity Likes table for lightweight social interactions
CREATE TABLE public.activity_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES public.activity_feed(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(activity_id, user_id)
);

-- Index for fast lookups by activity
CREATE INDEX idx_activity_likes_activity_id ON public.activity_likes(activity_id);
-- Index for fast lookups by user
CREATE INDEX idx_activity_likes_user_id ON public.activity_likes(user_id);

ALTER TABLE public.activity_likes ENABLE ROW LEVEL SECURITY;

-- SELECT: visible to all authenticated users
CREATE POLICY "activity_likes_select" ON public.activity_likes
  FOR SELECT TO authenticated
  USING (true);

-- INSERT: own user_id only
CREATE POLICY "activity_likes_insert" ON public.activity_likes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- DELETE: own user_id only
CREATE POLICY "activity_likes_delete" ON public.activity_likes
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
