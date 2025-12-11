"use client";

import Link from "next/link";
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { useOrders } from "@/queries";
import { useAuth, useUI } from "@/context";
import { Button, Badge, Skeleton } from "@/components/ui";
import { OrderStatus } from "@/lib/services";

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: "Pendiente",
    variant: "warning" as const,
    icon: Clock,
  },
  [OrderStatus.PAID]: {
    label: "Pagado",
    variant: "info" as const,
    icon: CheckCircle,
  },
  [OrderStatus.SHIPPED]: {
    label: "Enviado",
    variant: "info" as const,
    icon: Truck,
  },
  [OrderStatus.DELIVERED]: {
    label: "Entregado",
    variant: "success" as const,
    icon: CheckCircle,
  },
  [OrderStatus.CANCELLED]: {
    label: "Cancelado",
    variant: "danger" as const,
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();
  const { data: orders, isLoading } = useOrders();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-stone-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-100 mb-2">
          Inicia sesión para ver tus pedidos
        </h1>
        <p className="text-stone-400 mb-6">
          Necesitas una cuenta para acceder a tus pedidos.
        </p>
        <Button onClick={() => openAuthModal("login")}>Iniciar Sesión</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-100 mb-8">Mis Pedidos</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : !orders?.length ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-stone-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-stone-100 mb-2">
            No tienes pedidos aún
          </h2>
          <p className="text-stone-400 mb-6">
            ¡Comienza a comprar y verás tus pedidos aquí!
          </p>
          <Button asChild>
            <Link href="/products">Ver Productos</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-stone-900/50 rounded-2xl border border-stone-800 p-6 hover:border-stone-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold text-stone-100">
                        Pedido #{order.id}
                      </h2>
                      <Badge variant={status.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-stone-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("es", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-stone-500 text-sm mt-1">
                      {order.items.length} producto
                      {order.items.length !== 1 && "s"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-stone-100">
                        ${Number(order.total).toFixed(2)}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-500" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

