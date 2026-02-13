import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StorageImage } from '@/components/StorageImage';
import { DrinkTypeBadge } from '@/components/DrinkTypeBadge';
import { CategoryTopDrinks, TopDrinkEntry } from '@/types/taste';
import { isBuiltInDrinkType, drinkTypeIcons, drinkTypeLabels } from '@/types/drink';

interface CategoryTopDrinksShowcaseProps {
  categories: CategoryTopDrinks[];
  isLoading: boolean;
  onDrinkClick: (drink: TopDrinkEntry) => void;
}

export function CategoryTopDrinksShowcase({
  categories,
  isLoading,
  onDrinkClick,
}: CategoryTopDrinksShowcaseProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-3">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="w-32 h-40 flex-shrink-0 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Top Drinks by Category
      </h3>
      <div className="space-y-5">
        {categories.map((category) => {
          const isBuiltIn = isBuiltInDrinkType(category.type);
          const icon = isBuiltIn ? drinkTypeIcons[category.type] : '🍹';
          const label = isBuiltIn ? drinkTypeLabels[category.type] : category.type;

          return (
            <div key={category.type} className="space-y-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {category.topDrinks.map((drink) => (
                  <Card
                    key={drink.id}
                    className="w-32 flex-shrink-0 bg-card/50 border-border/50 hover:bg-card hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
                    onClick={() => onDrinkClick(drink)}
                  >
                    <div className="h-20 bg-muted/50 flex items-center justify-center">
                      {drink.imageUrl ? (
                        <StorageImage
                          storagePath={drink.imageUrl}
                          alt={drink.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">{icon}</span>
                      )}
                    </div>
                    <div className="p-2.5 space-y-1">
                      <p className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
                        {drink.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <DrinkTypeBadge type={drink.type} size="sm" />
                        <span className="text-xs font-medium text-amber-500">
                          {drink.rating}★
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
