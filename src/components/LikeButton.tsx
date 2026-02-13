import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';
import { ImpactStyle } from '@capacitor/haptics';

interface LikeButtonProps {
  isLiked: boolean;
  count: number;
  onToggle: () => void;
  onCountClick?: () => void;
}

export function LikeButton({ isLiked, count, onToggle, onCountClick }: LikeButtonProps) {
  const [animating, setAnimating] = useState(false);
  const { impact } = useHaptics();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    impact(ImpactStyle.Light);
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 300);
  };

  const handleCountClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (count > 0 && onCountClick) {
      onCountClick();
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className="h-7 w-7 p-0"
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-all duration-200',
            isLiked
              ? 'fill-red-500 text-red-500'
              : 'text-muted-foreground hover:text-red-400',
            animating && 'scale-125'
          )}
        />
      </Button>
      {count > 0 && (
        <button
          onClick={handleCountClick}
          className={cn(
            'text-xs tabular-nums',
            isLiked ? 'text-red-500 font-medium' : 'text-muted-foreground',
            onCountClick && count > 0 && 'hover:underline cursor-pointer'
          )}
        >
          {count}
        </button>
      )}
    </div>
  );
}
