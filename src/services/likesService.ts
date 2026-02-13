import { supabase } from '@/integrations/supabase/client';
import { PublicProfile } from '@/types/social';
import { mapPublicProfileRow } from '@/lib/mappers';

export interface ActivityLikeInfo {
  count: number;
  isLikedByMe: boolean;
}

export async function fetchLikesForActivities(
  activityIds: string[],
  currentUserId: string
): Promise<Map<string, ActivityLikeInfo>> {
  const result = new Map<string, ActivityLikeInfo>();
  if (activityIds.length === 0) return result;

  // Initialize all activities with defaults
  for (const id of activityIds) {
    result.set(id, { count: 0, isLikedByMe: false });
  }

  // Fetch all likes for these activities
  const { data: likes, error } = await supabase
    .from('activity_likes')
    .select('activity_id, user_id')
    .in('activity_id', activityIds);

  if (error) throw error;
  if (!likes) return result;

  for (const like of likes) {
    const info = result.get(like.activity_id)!;
    info.count++;
    if (like.user_id === currentUserId) {
      info.isLikedByMe = true;
    }
  }

  return result;
}

export async function toggleLike(
  activityId: string,
  userId: string,
  isCurrentlyLiked: boolean
): Promise<{ isLiked: boolean }> {
  if (isCurrentlyLiked) {
    const { error } = await supabase
      .from('activity_likes')
      .delete()
      .eq('activity_id', activityId)
      .eq('user_id', userId);

    if (error) throw error;
    return { isLiked: false };
  } else {
    const { error } = await supabase.from('activity_likes').insert({
      activity_id: activityId,
      user_id: userId,
    });

    if (error) throw error;
    return { isLiked: true };
  }
}

export async function fetchLikedByUsers(activityId: string): Promise<PublicProfile[]> {
  const { data: likes, error } = await supabase
    .from('activity_likes')
    .select('user_id')
    .eq('activity_id', activityId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!likes || likes.length === 0) return [];

  const userIds = likes.map((l) => l.user_id);
  const { data: profiles } = await supabase
    .from('profiles_public')
    .select('user_id, username, display_name, avatar_url, bio, is_public, activity_visibility, created_at')
    .in('user_id', userIds);

  if (!profiles) return [];
  return profiles.map(mapPublicProfileRow);
}
