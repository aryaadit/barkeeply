import { DrinkType, drinkTypeLabels, drinkTypeIcons, isBuiltInDrinkType, BuiltInDrinkType } from '@/types/drink';
import { cn } from '@/lib/utils';

interface DrinkTypeBadgeProps {
  type: DrinkType;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  customIcon?: string;
  customColor?: string;
}

const typeClasses: Record<BuiltInDrinkType, string> = {
  whiskey: 'bg-whiskey/20 text-whiskey border-whiskey/30',
  beer: 'bg-beer/20 text-beer border-beer/30',
  wine: 'bg-wine/20 text-wine border-wine/30',
  cocktail: 'bg-cocktail/20 text-cocktail border-cocktail/30',
  other: 'bg-other/20 text-other border-other/30',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function DrinkTypeBadge({ type, size = 'sm', showIcon = true, customIcon, customColor }: DrinkTypeBadgeProps) {
  const isBuiltIn = isBuiltInDrinkType(type);
  const icon = isBuiltIn ? drinkTypeIcons[type] : (customIcon || '🍹');
  const label = isBuiltIn ? drinkTypeLabels[type] : type;

  // Use custom color styling for custom types
  if (!isBuiltIn && customColor) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border font-medium',
          sizeClasses[size]
        )}
        style={{
          backgroundColor: `${customColor}20`,
          color: customColor,
          borderColor: `${customColor}40`,
        }}
      >
        {showIcon && <span>{icon}</span>}
        <span>{label}</span>
      </span>
    );
  }

  const colorClass = isBuiltIn ? typeClasses[type] : 'bg-primary/20 text-primary border-primary/30';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        colorClass,
        sizeClasses[size]
      )}
    >
      {showIcon && <span>{icon}</span>}
      <span>{label}</span>
    </span>
  );
}
