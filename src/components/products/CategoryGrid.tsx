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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, index) => (
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
  );
}
