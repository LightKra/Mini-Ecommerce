"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProducts, useCategories } from "@/queries";
import { ProductGrid } from "@/components/product";
import { Button, Select } from "@/components/ui";
import type { ProductQueryParams } from "@/lib/services";

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductQueryParams>({
    page: 1,
    limit: 12,
  });
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: productsData, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: categoryId ? Number(categoryId) : undefined,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({ page: 1, limit: 12 });
  };

  const hasActiveFilters = filters.search || filters.categoryId;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-100">
          Productos
        </h1>
        <p className="text-stone-400 mt-2">
          {productsData?.meta.total || 0} productos encontrados
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
            <input
              type="search"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </form>

        {/* Filter Toggle (Mobile) */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden"
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filtros
        </Button>

        {/* Filters (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <Select
            options={
              categories?.map((cat) => ({
                value: cat.id,
                label: cat.name,
              })) || []
            }
            placeholder="Todas las categorías"
            value={filters.categoryId?.toString() || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-48"
          />

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {showFilters && (
        <div className="lg:hidden mb-6 p-4 bg-stone-900/50 rounded-xl border border-stone-800 space-y-4">
          <Select
            label="Categoría"
            options={
              categories?.map((cat) => ({
                value: cat.id,
                label: cat.name,
              })) || []
            }
            placeholder="Todas las categorías"
            value={filters.categoryId?.toString() || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
          />

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" fullWidth onClick={handleClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {/* Products Grid */}
      <ProductGrid products={productsData?.data || []} isLoading={isLoading} />

      {/* Pagination */}
      {productsData && productsData.meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === 1}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
            }
          >
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, productsData.meta.totalPages) }).map(
              (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setFilters((prev) => ({ ...prev, page }))}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      filters.page === page
                        ? "bg-amber-500 text-stone-900"
                        : "text-stone-400 hover:bg-stone-800"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === productsData.meta.totalPages}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
            }
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}

