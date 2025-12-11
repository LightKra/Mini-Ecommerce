"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, Layers } from "lucide-react";
import { useCategoryBySlug, useProducts } from "@/queries";
import { ProductGrid } from "@/components/product";
import { Button, Skeleton } from "@/components/ui";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const { data: category, isLoading: isLoadingCategory, error } = useCategoryBySlug(slug);
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    categoryId: category?.id,
    limit: 20,
  });

  if (isLoadingCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Layers className="w-16 h-16 text-stone-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-100 mb-2">
          Categoría no encontrada
        </h1>
        <p className="text-stone-400 mb-6">
          La categoría que buscas no existe.
        </p>
        <Button asChild>
          <Link href="/categories">Ver todas las categorías</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/categories"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver a categorías
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-100">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-stone-400 mt-2">{category.description}</p>
        )}
        <p className="text-stone-500 mt-2">
          {productsData?.meta.total || 0} productos
        </p>
      </div>

      {/* Products */}
      <ProductGrid
        products={productsData?.data || []}
        isLoading={isLoadingProducts}
      />
    </div>
  );
}

