"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useUI, useAuth } from "@/context";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/queries";
import { Button } from "@/components/ui";

export function CartSidebar() {
  const { isCartOpen, closeCart, openAuthModal } = useUI();
  const { isAuthenticated } = useAuth();
  const { data: cart, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart.mutate(itemId);
    } else {
      updateCartItem.mutate({ itemId, data: { quantity } });
    }
  };

  const total = cart?.items?.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  ) || 0;

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-stone-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <h2 className="text-xl font-semibold text-stone-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            Carrito
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-stone-700 mb-4" />
              <p className="text-stone-400 mb-4">
                Inicia sesión para ver tu carrito
              </p>
              <Button onClick={() => openAuthModal("login")}>
                Iniciar Sesión
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 bg-stone-800/50 rounded-xl animate-pulse"
                >
                  <div className="w-20 h-20 bg-stone-700 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-stone-700 rounded w-3/4" />
                    <div className="h-3 bg-stone-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !cart?.items?.length ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-stone-700 mb-4" />
              <p className="text-stone-400 mb-2">Tu carrito está vacío</p>
              <p className="text-stone-500 text-sm mb-4">
                ¡Explora nuestros productos y añade algunos!
              </p>
              <Button onClick={closeCart} asChild>
                <Link href="/products">Ver Productos</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-stone-800/30 rounded-xl border border-stone-800"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-800 flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-stone-600" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-stone-100 font-medium truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-amber-500 font-semibold">
                      ${Number(item.product.price).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={updateCartItem.isPending || removeFromCart.isPending}
                        className="p-1 text-stone-400 hover:text-stone-100 hover:bg-stone-700 rounded disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-stone-100 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={updateCartItem.isPending}
                        className="p-1 text-stone-400 hover:text-stone-100 hover:bg-stone-700 rounded disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart.mutate(item.id)}
                        disabled={removeFromCart.isPending}
                        className="ml-auto p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && cart?.items?.length ? (
          <div className="p-6 border-t border-stone-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Subtotal</span>
              <span className="text-2xl font-bold text-stone-100">
                ${Number(total).toFixed(2)}
              </span>
            </div>
            <Button fullWidth size="lg" onClick={closeCart} asChild>
              <Link href="/checkout">Ir al Checkout</Link>
            </Button>
            <button
              onClick={closeCart}
              className="w-full text-center text-stone-400 hover:text-amber-400 text-sm"
            >
              Continuar comprando
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

