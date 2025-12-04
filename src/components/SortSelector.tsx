import { SortOrder, sortOrderLabels } from '@/types/profile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface SortSelectorProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

const sortOptions: SortOrder[] = ['date_desc', 'date_asc', 'rating_desc', 'rating_asc', 'name_asc', 'name_desc'];

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOrder)}>
      <SelectTrigger className="w-[160px] bg-background">
        <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="bg-background border-border">
        {sortOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {sortOrderLabels[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
