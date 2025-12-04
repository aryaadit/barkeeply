import { DrinkType, drinkTypeLabels, drinkTypeIcons } from '@/types/drink';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useHaptics } from '@/hooks/useHaptics';

interface DrinkTypeFilterProps {
  selectedType: DrinkType | null;
  onSelectType: (type: DrinkType | null) => void;
}

const types: (DrinkType | null)[] = [null, 'whiskey', 'beer', 'wine', 'cocktail', 'other'];

export function DrinkTypeFilter({ selectedType, onSelectType }: DrinkTypeFilterProps) {
  const { selectionChanged } = useHaptics();

  const handleSelect = (type: DrinkType | null) => {
    if (type !== selectedType) {
      selectionChanged();
    }
    onSelectType(type);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <Button
          key={type ?? 'all'}
          variant={selectedType === type ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSelect(type)}
          className={cn(
            'transition-all duration-200',
            selectedType === type && 'shadow-glow'
          )}
        >
          <span>{type ? drinkTypeIcons[type] : '🍹'}</span>
          <span>{type ? drinkTypeLabels[type] : 'All'}</span>
        </Button>
      ))}
    </div>
  );
}

