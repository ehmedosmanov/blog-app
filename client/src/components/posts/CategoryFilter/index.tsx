'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/constants/posts';

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      params.set('page', '1');

      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryClick = (category: string) => {
    const newCategory = currentCategory === category ? '' : category;
    router.push(`?${createQueryString('category', newCategory)}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category: string) => {
          const isSelected = currentCategory === category;

          return (
            <Badge
              key={category}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer hover:bg-primary/90 transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:text-primary-foreground'
              )}
              onClick={() => handleCategoryClick(category)}>
              {isSelected && <Check className="mr-1 h-3 w-3" />}
              {category}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
