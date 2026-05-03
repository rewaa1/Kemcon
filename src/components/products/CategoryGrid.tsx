"use client";

import { CategoryCard } from "./CategoryCard";
import type { CategoryType } from "@/types/configurator";

interface Category {
  id: CategoryType;
  name: string;
  description: string;
}

interface CategoryGridProps {
  categories: Category[];
  locale: string;
  basePath: string;
}

export function CategoryGrid({ categories, locale, basePath }: CategoryGridProps) {
  const standard = categories.slice(0, categories.length - 1);
  const last = categories[categories.length - 1];

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {standard.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category.id}
            name={category.name}
            description={category.description}
            href={`${basePath}/${category.id}`}
            locale={locale}
            index={index}
          />
        ))}
      </div>
      <CategoryCard
        category={last.id}
        name={last.name}
        description={last.description}
        href={`${basePath}/${last.id}`}
        locale={locale}
        index={standard.length}
        fullWidth
      />
    </div>
  );
}
