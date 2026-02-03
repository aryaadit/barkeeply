import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div 
      className={cn(
        "fixed top-[env(safe-area-inset-top)] left-0 right-0 z-[100]",
        "bg-amber-500 text-amber-950 px-4 py-2",
        "flex items-center justify-center gap-2 text-sm font-medium",
        "animate-in slide-in-from-top duration-300"
      )}
    >
      <WifiOff className="w-4 h-4" />
      <span>You're offline — viewing cached data</span>
    </div>
  );
}
