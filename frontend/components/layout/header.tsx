"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X, Search, Package } from "lucide-react";
import { useUI, useAuth } from "@/context";
import { useCart } from "@/queries";
import { Button } from "@/components/ui";

export function Header() {
  const { openCart, openMobileMenu, closeMobileMenu, isMobileMenuOpen, openAuthModal } = useUI();
  const { isAuthenticated, user, logout } = useAuth();
  const { data: cart } = useCart();

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/80 backdrop-blur-xl border-b border-stone-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-stone-900" />
            </div>
            <span className="text-xl font-bold text-stone-100 hidden sm:block">
              MiniShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-stone-300 hover:text-amber-400 transition-colors font-medium"
            >
              Productos
            </Link>
            <Link
              href="/categories"
              className="text-stone-300 hover:text-amber-400 transition-colors font-medium"
            >
              Categorías
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 md:p-3 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-all"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Salir
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal("login")}
                >
                  Ingresar
                </Button>
                <Button size="sm" onClick={() => openAuthModal("register")}>
                  Registrarse
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
              className="p-2 text-stone-300 hover:text-amber-400 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-800 animate-in slide-in-from-top-2">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                href="/products"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-all"
              >
                Productos
              </Link>
              <Link
                href="/categories"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-all"
              >
                Categorías
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-all"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    href="/orders"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-all"
                  >
                    Mis Pedidos
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="px-4 py-3 text-left text-red-400 hover:bg-stone-800 rounded-xl transition-all"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      openAuthModal("login");
                      closeMobileMenu();
                    }}
                  >
                    Ingresar
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => {
                      openAuthModal("register");
                      closeMobileMenu();
                    }}
                  >
                    Registrarse
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

