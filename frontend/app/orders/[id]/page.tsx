"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  PartyPopper,
} from "lucide-react";
import { useOrder, useCancelOrder } from "@/queries";
import { useAuth, useUI } from "@/context";
import { Button, Badge, Skeleton } from "@/components/ui";
import { OrderStatus } from "@/lib/services";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: "Pendiente",
    variant: "warning" as const,
    icon: Clock,
    description: "Tu pedido está siendo procesado",
  },
  [OrderStatus.PAID]: {
    label: "Pagado",
    variant: "info" as const,
    icon: CheckCircle,
    description: "El pago ha sido confirmado",
  },
  [OrderStatus.SHIPPED]: {
    label: "Enviado",
    variant: "info" as const,
    icon: Truck,
    description: "Tu pedido está en camino",
  },
  [OrderStatus.DELIVERED]: {
    label: "Entregado",
    variant: "success" as const,
    icon: CheckCircle,
    description: "Tu pedido ha sido entregado",
  },
  [OrderStatus.CANCELLED]: {
    label: "Cancelado",
    variant: "danger" as const,
    icon: XCircle,
    description: "Este pedido fue cancelado",
  },
};

export default function OrderPage({ params }: OrderPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();

  const { data: order, isLoading, error } = useOrder(Number(id));
  const cancelOrder = useCancelOrder();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-stone-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-100 mb-2">
          Inicia sesión para ver tu pedido
        </h1>
        <Button onClick={() => openAuthModal("login")}>Iniciar Sesión</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-6">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-stone-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-100 mb-2">
          Pedido no encontrado
        </h1>
        <p className="text-stone-400 mb-6">
          El pedido que buscas no existe o no tienes acceso.
        </p>
        <Button asChild>
          <Link href="/orders">Ver mis pedidos</Link>
        </Button>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const canCancel = order.status === OrderStatus.PENDING;

  const handleCancelOrder = () => {
    if (confirm("¿Estás seguro de que quieres cancelar este pedido?")) {
      cancelOrder.mutate(order.id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Banner */}
      {isSuccess && (
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <PartyPopper className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-100">
                ¡Pedido realizado con éxito!
              </h2>
              <p className="text-stone-400">
                Gracias por tu compra. Te notificaremos cuando sea enviado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver a mis pedidos
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">
            Pedido #{order.id}
          </h1>
          <p className="text-stone-400 mt-1">
            Realizado el{" "}
            {new Date(order.createdAt).toLocaleDateString("es", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge variant={status.variant} size="md">
          <StatusIcon className="w-4 h-4 mr-1" />
          {status.label}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  order.status === OrderStatus.CANCELLED
                    ? "bg-red-500/20"
                    : order.status === OrderStatus.DELIVERED
                    ? "bg-emerald-500/20"
                    : "bg-amber-500/20"
                }`}
              >
                <StatusIcon
                  className={`w-6 h-6 ${
                    order.status === OrderStatus.CANCELLED
                      ? "text-red-400"
                      : order.status === OrderStatus.DELIVERED
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-100">
                  {status.label}
                </h2>
                <p className="text-stone-400">{status.description}</p>
              </div>
            </div>

            {canCancel && (
              <Button
                variant="danger"
                size="sm"
                className="mt-4"
                onClick={handleCancelOrder}
                isLoading={cancelOrder.isPending}
              >
                Cancelar Pedido
              </Button>
            )}
          </div>

          {/* Products */}
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-6">
            <h2 className="text-xl font-semibold text-stone-100 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              Productos
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-stone-800 last:border-0"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-800 flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-stone-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-stone-100 font-medium truncate">
                      {item.product?.name || `Producto #${item.productId}`}
                    </h3>
                    <p className="text-stone-500 text-sm">
                      Cantidad: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-stone-100 font-medium">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Shipping Address */}
          {order.address && (
            <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-6">
              <h2 className="text-lg font-semibold text-stone-100 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                Dirección de Envío
              </h2>
              <div className="text-stone-400 space-y-1">
                <p className="text-stone-100 font-medium">
                  {order.address.fullName}
                </p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                <p>
                  {order.address.city}, {order.address.province}{" "}
                  {order.address.postalCode}
                </p>
                <p>{order.address.country}</p>
                {order.address.phone && (
                  <p className="text-stone-500 mt-2">Tel: {order.address.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-6">
            <h2 className="text-lg font-semibold text-stone-100 mb-4">
              Resumen
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Envío</span>
                <span className="text-emerald-400">Gratis</span>
              </div>
              <div className="border-t border-stone-800 pt-3 flex justify-between text-stone-100 font-semibold text-lg">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

