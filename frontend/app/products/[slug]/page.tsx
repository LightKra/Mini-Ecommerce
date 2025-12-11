"use client";

import { useState } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  ChevronLeft,
  Package,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useProductBySlug, useAddToCart } from "@/queries";
import { useUI, useAuth } from "@/context";
import { Button, Badge, Skeleton } from "@/components/ui";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useProductBySlug(slug);
  const addToCart = useAddToCart();
  const { isAuthenticated } = useAuth();
  const { openAuthModal, openCart } = useUI();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    if (product) {
      addToCart.mutate(
        { productId: product.id, quantity },
        {
          onSuccess: () => {
            openCart();
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-stone-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-100 mb-2">
          Producto no encontrado
        </h1>
        <p className="text-stone-400 mb-6">
          El producto que buscas no existe o fue eliminado.
        </p>
        <Button asChild>
          <Link href="/products">Ver todos los productos</Link>
        </Button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver a productos
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-800">
            {currentImage ? (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-stone-700" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === index
                      ? "border-amber-500"
                      : "border-transparent hover:border-stone-600"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-amber-500 hover:text-amber-400 text-sm font-medium uppercase tracking-wide"
            >
              {product.category.name}
            </Link>
          )}

          {/* Name */}
          <h1 className="text-3xl md:text-4xl font-bold text-stone-100">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-stone-100">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <Badge variant="success">En stock ({product.stock})</Badge>
            ) : (
              <Badge variant="danger">Agotado</Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-stone-400 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-stone-300 font-medium">Cantidad:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-stone-100 font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="p-2 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              fullWidth
              disabled={product.stock === 0 || addToCart.isPending}
              isLoading={addToCart.isPending}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Añadir al Carrito
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-800">
            <div className="flex items-center gap-3 text-stone-400">
              <Truck className="w-5 h-5 text-amber-500" />
              <span className="text-sm">Envío gratis +$50</span>
            </div>
            <div className="flex items-center gap-3 text-stone-400">
              <Shield className="w-5 h-5 text-amber-500" />
              <span className="text-sm">Garantía 1 año</span>
            </div>
            <div className="flex items-center gap-3 text-stone-400">
              <RotateCcw className="w-5 h-5 text-amber-500" />
              <span className="text-sm">Devolución 30 días</span>
            </div>
            <div className="flex items-center gap-3 text-stone-400">
              <Package className="w-5 h-5 text-amber-500" />
              <span className="text-sm">Empaque seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

