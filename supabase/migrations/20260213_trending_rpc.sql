-- Trending drinks RPC function
-- Returns popular drinks from public activity across the platform
CREATE OR REPLACE FUNCTION public.get_trending_drinks(days int DEFAULT 7, lim int DEFAULT 10)
RETURNS TABLE (
  drink_name text,
  drink_type text,
  log_count bigint,
  avg_rating numeric,
  sample_image text
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    metadata->>'name',
    metadata->>'type',
    count(*),
    avg((metadata->>'rating')::numeric),
    (array_agg(metadata->>'image_url' ORDER BY created_at DESC))[1]
  FROM activity_feed
  WHERE activity_type = 'new_drink'
    AND created_at > now() - make_interval(days => days)
  GROUP BY metadata->>'name', metadata->>'type'
  ORDER BY count(*) DESC
  LIMIT lim;
$$;
