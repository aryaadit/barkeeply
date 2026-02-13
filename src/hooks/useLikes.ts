import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import * as likesService from '@/services/likesService';
import { PublicProfile } from '@/types/social';

export function useLikes(activityIds: string[]) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: likesMap, isLoading } = useQuery({
    queryKey: queryKeys.likes.forActivities(activityIds),
    queryFn: () => likesService.fetchLikesForActivities(activityIds, user!.id),
    enabled: !!user && activityIds.length > 0,
  });

  const toggleMutation = useMutation({
    mutationFn: ({
      activityId,
      isCurrentlyLiked,
    }: {
      activityId: string;
      isCurrentlyLiked: boolean;
    }) => likesService.toggleLike(activityId, user!.id, isCurrentlyLiked),
    onMutate: async ({ activityId, isCurrentlyLiked }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.likes.forActivities(activityIds),
      });

      // Snapshot previous value
      const previous = queryClient.getQueryData(
        queryKeys.likes.forActivities(activityIds)
      );

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.likes.forActivities(activityIds),
        (old: Map<string, likesService.ActivityLikeInfo> | undefined) => {
          if (!old) return old;
          const updated = new Map(old);
          const current = updated.get(activityId);
          if (current) {
            updated.set(activityId, {
              count: isCurrentlyLiked ? current.count - 1 : current.count + 1,
              isLikedByMe: !isCurrentlyLiked,
            });
          }
          return updated;
        }
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.likes.forActivities(activityIds),
          context.previous
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.likes.forActivities(activityIds),
      });
    },
  });

  const toggleLike = (activityId: string, isCurrentlyLiked: boolean) => {
    toggleMutation.mutate({ activityId, isCurrentlyLiked });
  };

  const getLikeInfo = (activityId: string) => {
    return likesMap?.get(activityId) ?? { count: 0, isLikedByMe: false };
  };

  return {
    getLikeInfo,
    toggleLike,
    isLoading,
  };
}

export function useLikedByUsers(activityId: string | null) {
  const { data: users = [], isLoading } = useQuery({
    queryKey: queryKeys.likes.likedBy(activityId ?? ''),
    queryFn: () => likesService.fetchLikedByUsers(activityId!),
    enabled: !!activityId,
  });

  return { users, isLoading };
}
