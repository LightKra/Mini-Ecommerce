"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye, Package } from "lucide-react";
import { useAddToCart } from "@/queries";
import { useUI, useAuth } from "@/context";
import type { Product } from "@/lib/services";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();
  const addToCart = useAddToCart();

  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-stone-800">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-stone-700" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="flex items-center gap-2 text-stone-100 text-sm font-medium">
            <Eye className="w-4 h-4" />
            Ver detalles
          </span>
        </div>

        {/* Stock Badge */}
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-amber-500 text-stone-900 rounded-lg">
            ¡Quedan {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-lg">
            Agotado
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <span className="text-xs text-amber-500 font-medium uppercase tracking-wide">
            {product.category.name}
          </span>
        )}

        {/* Name */}
        <h3 className="text-stone-100 font-semibold mt-1 truncate group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-stone-500 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-stone-100">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addToCart.isPending}
            className="p-2.5 rounded-xl bg-amber-500 text-stone-900 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
