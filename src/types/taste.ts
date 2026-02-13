import { DrinkType } from './drink';

export interface TasteBreakdownItem {
  type: DrinkType;
  count: number;
  percentage: number;
  avgRating: number;
}

export interface TasteSignature {
  breakdown: TasteBreakdownItem[];
  totalDrinks: number;
  personalityLabel: string;
}

export interface TopDrinkEntry {
  id: string;
  name: string;
  type: DrinkType;
  rating: number;
  imageUrl: string | null;
  brand: string | null;
}

export interface CategoryTopDrinks {
  type: DrinkType;
  topDrinks: TopDrinkEntry[];
}

export function computePersonalityLabel(breakdown: TasteBreakdownItem[]): string {
  if (breakdown.length === 0) return 'Newcomer';

  const sorted = [...breakdown].sort((a, b) => b.percentage - a.percentage);

  if (sorted[0].percentage > 60) {
    const typeName = sorted[0].type.charAt(0).toUpperCase() + sorted[0].type.slice(1);
    return `${typeName} Devotee`;
  }

  if (sorted.length >= 2 && sorted[0].percentage >= 30 && sorted[1].percentage >= 30) {
    const t1 = sorted[0].type.charAt(0).toUpperCase() + sorted[0].type.slice(1);
    const t2 = sorted[1].type.charAt(0).toUpperCase() + sorted[1].type.slice(1);
    return `${t1} & ${t2} Enthusiast`;
  }

  return 'Eclectic Sipper';
}
