"use client";

import Link from "next/link";
import {
  User,
  MapPin,
  Package,
  ChevronRight,
  LogOut,
  Mail,
  Calendar,
} from "lucide-react";
import { useAuth, useUI } from "@/context";
import { useOrders, useAddresses } from "@/queries";
import { Button, Skeleton } from "@/components/ui";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { openAuthModal } = useUI();
  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const { data: addresses, isLoading: isLoadingAddresses } = useAddresses();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="w-16 h-16 text-stone-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-100 mb-2">
          Inicia sesión para ver tu perfil
        </h1>
        <p className="text-stone-400 mb-6">
          Necesitas una cuenta para acceder a tu perfil.
        </p>
        <Button onClick={() => openAuthModal("login")}>Iniciar Sesión</Button>
      </div>
    );
  }

  const menuItems = [
    {
      href: "/orders",
      icon: Package,
      label: "Mis Pedidos",
      description: isLoadingOrders
        ? "Cargando..."
        : `${orders?.length || 0} pedidos`,
    },
    {
      href: "/profile/addresses",
      icon: MapPin,
      label: "Mis Direcciones",
      description: isLoadingAddresses
        ? "Cargando..."
        : `${addresses?.length || 0} direcciones`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-100 mb-8">Mi Perfil</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-stone-900">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-stone-100">
                {user?.name}
              </h2>

              <div className="flex items-center gap-2 text-stone-400 mt-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>

              {user?.createdAt && (
                <div className="flex items-center gap-2 text-stone-500 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Miembro desde{" "}
                    {new Date(user.createdAt).toLocaleDateString("es", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-2 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-6 bg-stone-900/50 rounded-2xl border border-stone-800 hover:border-stone-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-stone-100">
                  {item.label}
                </h3>
                <p className="text-stone-400 text-sm">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-500" />
            </Link>
          ))}

          {/* Recent Orders */}
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-stone-100">
                Pedidos Recientes
              </h3>
              <Link
                href="/orders"
                className="text-amber-500 hover:text-amber-400 text-sm font-medium"
              >
                Ver todos
              </Link>
            </div>

            {isLoadingOrders ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : !orders?.length ? (
              <p className="text-stone-400 text-center py-4">
                No tienes pedidos aún
              </p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-stone-800/50 hover:bg-stone-800 transition-colors"
                  >
                    <div>
                      <p className="text-stone-100 font-medium">
                        Pedido #{order.id}
                      </p>
                      <p className="text-stone-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString("es")}
                      </p>
                    </div>
                    <span className="text-stone-100 font-semibold">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

