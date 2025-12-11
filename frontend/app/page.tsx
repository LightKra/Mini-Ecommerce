"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Truck, Shield, Clock } from "lucide-react";
import { useProducts, useCategories } from "@/queries";
import { Button } from "@/components/ui";
import { ProductGrid, CategoryCard } from "@/components/product";

export default function HomePage() {
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 8 });
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  return (
    <div className="hero-gradient">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Nueva colección disponible
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-stone-100 leading-tight">
            Descubre productos{" "}
            <span className="gradient-text">increíbles</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-stone-400 max-w-2xl mx-auto">
            Tu tienda online de confianza. Encuentra los mejores productos al mejor precio con envío rápido a tu puerta.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button size="lg" asChild>
              <Link href="/products">
                Ver Productos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/categories">Explorar Categorías</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-stone-900/50 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100">Envío Rápido</h3>
              <p className="text-sm text-stone-400">Entrega en 24-48 horas</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-stone-900/50 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100">Compra Segura</h3>
              <p className="text-sm text-stone-400">Pago 100% protegido</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-stone-900/50 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100">Soporte 24/7</h3>
              <p className="text-sm text-stone-400">Siempre disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-100">Categorías</h2>
              <p className="text-stone-400 mt-1">Explora por tipo de producto</p>
            </div>
            <Link
              href="/categories"
              className="hidden md:flex items-center gap-1 text-amber-500 hover:text-amber-400 font-medium"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {isLoadingCategories
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl bg-stone-800 animate-pulse"
                  />
                ))
              : categories.slice(0, 6).map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-100">
              Productos Destacados
            </h2>
            <p className="text-stone-400 mt-1">Lo más nuevo y popular</p>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1 text-amber-500 hover:text-amber-400 font-medium"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid
          products={productsData?.data || []}
          isLoading={isLoadingProducts}
        />

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/products">
              Ver todos los productos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-stone-900">
              ¿Listo para comprar?
            </h2>
            <p className="mt-4 text-stone-800 text-lg">
              Regístrate ahora y obtén un 10% de descuento en tu primera compra. 
              ¡No te pierdas nuestras ofertas exclusivas!
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="mt-6 bg-stone-900 text-stone-100 hover:bg-stone-800"
              asChild
            >
              <Link href="/products">Comenzar a Comprar</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
