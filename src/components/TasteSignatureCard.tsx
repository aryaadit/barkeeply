import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TasteSignature } from '@/types/taste';
import { isBuiltInDrinkType, drinkTypeIcons, drinkTypeLabels, BuiltInDrinkType } from '@/types/drink';

interface TasteSignatureCardProps {
  signature: TasteSignature | null;
  isLoading: boolean;
}

const typeBarColors: Record<BuiltInDrinkType, string> = {
  whiskey: 'bg-whiskey',
  beer: 'bg-beer',
  wine: 'bg-wine',
  cocktail: 'bg-cocktail',
  other: 'bg-other',
};

export function TasteSignatureCard({ signature, isLoading }: TasteSignatureCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-40" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!signature || signature.breakdown.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Taste Profile
      </h3>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              {signature.personalityLabel}
            </span>
          </div>

          <div className="space-y-3">
            {signature.breakdown.map((item) => {
              const isBuiltIn = isBuiltInDrinkType(item.type);
              const icon = isBuiltIn ? drinkTypeIcons[item.type] : '🍹';
              const label = isBuiltIn ? drinkTypeLabels[item.type] : item.type;
              const barColor = isBuiltIn ? typeBarColors[item.type] : 'bg-primary';

              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <span>{icon}</span>
                      <span className="font-medium text-foreground">{label}</span>
                      <span className="text-muted-foreground">({item.count})</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      {item.avgRating > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {item.avgRating.toFixed(1)}
                        </span>
                      )}
                      <span className="font-medium">{item.percentage}%</span>
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${item.percentage}%`, opacity: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
