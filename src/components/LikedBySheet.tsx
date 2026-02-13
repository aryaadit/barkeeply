import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useLikedByUsers } from '@/hooks/useLikes';
import { useSignedUrl } from '@/hooks/useSignedUrl';
import { PublicProfile } from '@/types/social';

interface LikedBySheetProps {
  activityId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LikedBySheet({ activityId, open, onOpenChange }: LikedBySheetProps) {
  const { users, isLoading } = useLikedByUsers(open ? activityId : null);
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[60vh] rounded-t-xl">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            Liked by
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto space-y-1 py-2">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No likes yet
            </p>
          ) : (
            users.map((user) => (
              <LikedByUserRow
                key={user.userId}
                user={user}
                onClick={() => {
                  onOpenChange(false);
                  if (user.username) {
                    navigate(`/u/${user.username}`);
                  }
                }}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function LikedByUserRow({
  user,
  onClick,
}: {
  user: PublicProfile;
  onClick: () => void;
}) {
  const { signedUrl: avatarUrl } = useSignedUrl(user.avatarUrl);
  const initials = (user.displayName || user.username || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
    >
      <Avatar className="h-10 w-10">
        {avatarUrl && (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        )}
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {user.displayName || user.username}
        </p>
        {user.username && (
          <p className="text-xs text-muted-foreground truncate">
            @{user.username}
          </p>
        )}
      </div>
    </button>
  );
}
