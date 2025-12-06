import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function StarRating({ rating, onChange, size = 'md', readonly = false }: StarRatingProps) {
  const { impact, ImpactStyle } = useHaptics();

  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      // Stronger haptic for higher ratings
      const style = value >= 4 ? ImpactStyle.Medium : ImpactStyle.Light;
      impact(style);
      onChange(value);
    }
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          disabled={readonly}
          className={cn(
            'transition-all duration-150 flex items-center justify-center',
            !readonly && 'hover:scale-110 cursor-pointer min-w-[44px] min-h-[44px] -mx-1.5',
            readonly && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              'transition-colors duration-150',
              value <= rating
                ? 'fill-star-filled text-star-filled'
                : 'fill-transparent text-star-empty'
            )}
          />
        </button>
      ))}
    </div>
  );
}
