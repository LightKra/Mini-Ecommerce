import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";
import type { Category } from "@/lib/services";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative p-6 bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl border border-stone-700 hover:border-amber-500/50 transition-all duration-300 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors" />

      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
          <Layers className="w-6 h-6 text-amber-500" />
        </div>

        <h3 className="text-lg font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">
          {category.name}
        </h3>

        {category.description && (
          <p className="text-stone-400 text-sm mt-2 line-clamp-2">
            {category.description}
          </p>
        )}

        <div className="flex items-center gap-1 mt-4 text-amber-500 text-sm font-medium">
          Ver productos
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

