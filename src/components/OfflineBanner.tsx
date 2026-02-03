import { WifiOff, CloudOff, Loader2 } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { usePendingMutations } from '@/hooks/usePendingMutations';
import { cn } from '@/lib/utils';

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const { pendingCount, hasPending } = usePendingMutations();

  // Show nothing if online and no pending mutations
  if (isOnline && !hasPending) return null;

  return (
    <div 
      className={cn(
        "fixed top-[env(safe-area-inset-top)] left-0 right-0 z-[100]",
        "px-4 py-2",
        "flex items-center justify-center gap-2 text-sm font-medium",
        "animate-in slide-in-from-top duration-300",
        !isOnline 
          ? "bg-amber-500 text-amber-950" 
          : "bg-blue-500 text-white"
      )}
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span>
            You're offline
            {hasPending && ` — ${pendingCount} change${pendingCount > 1 ? 's' : ''} pending`}
          </span>
        </>
      ) : (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Syncing {pendingCount} change{pendingCount > 1 ? 's' : ''}...</span>
        </>
      )}
    </div>
  );
}
