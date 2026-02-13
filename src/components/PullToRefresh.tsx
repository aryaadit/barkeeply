import { useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

const THRESHOLD = 60;

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const pullDistRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (refreshingRef.current) return;
      startYRef.current = e.touches[0].clientY;
      pullingRef.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pullingRef.current || refreshingRef.current) return;

      // Keep resetting start position while page is scrolled
      if (window.scrollY > 0) {
        startYRef.current = e.touches[0].clientY;
        return;
      }

      const diff = e.touches[0].clientY - startYRef.current;
      if (diff > 0) {
        e.preventDefault();
        const dampened = Math.min(diff * 0.4, THRESHOLD * 1.5);
        pullDistRef.current = dampened;
        setPullDistance(dampened);
      } else if (pullDistRef.current > 0) {
        pullDistRef.current = 0;
        setPullDistance(0);
      }
    };

    const onTouchEnd = async () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;

      if (pullDistRef.current >= THRESHOLD && !refreshingRef.current) {
        refreshingRef.current = true;
        setRefreshing(true);
        pullDistRef.current = 30;
        setPullDistance(30);

        try {
          await onRefreshRef.current();
        } finally {
          refreshingRef.current = false;
          setRefreshing(false);
          pullDistRef.current = 0;
          setPullDistance(0);
        }
      } else {
        pullDistRef.current = 0;
        setPullDistance(0);
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          height: pullDistance,
          transition: 'height 0.15s ease-out',
        }}
      >
        {pullDistance > 5 && (
          <Loader2
            className={cn('w-5 h-5 text-muted-foreground', refreshing && 'animate-spin')}
            style={!refreshing ? {
              opacity: Math.min(pullDistance / THRESHOLD, 1),
              transform: `rotate(${pullDistance * 4}deg)`,
            } : { opacity: 1 }}
          />
        )}
      </div>
      {children}
    </div>
  );
}
