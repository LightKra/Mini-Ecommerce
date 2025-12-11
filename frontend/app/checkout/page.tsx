"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Plus,
  Check,
  ShoppingBag,
  ChevronLeft,
  Package,
} from "lucide-react";
import { useCart, useAddresses, useCreateOrder, useCreateAddress } from "@/queries";
import { useAuth, useUI } from "@/context";
import { Button, Input, Modal } from "@/components/ui";
import type { CreateAddressRequest } from "@/lib/services";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();

  const { data: cart, isLoading: isLoadingCart } = useCart();
  const { data: addresses, isLoading: isLoadingAddresses } = useAddresses();
  const createOrder = useCreateOrder();
  const createAddress = useCreateAddress();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<CreateAddressRequest>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-stone-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-100 mb-2">
          Inicia sesión para continuar
        </h1>
        <p className="text-stone-400 mb-6">
          Necesitas una cuenta para completar tu compra.
        </p>
        <Button onClick={() => openAuthModal("login")}>Iniciar Sesión</Button>
      </div>
    );
  }

  if (isLoadingCart || isLoadingAddresses) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-stone-800 rounded" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-stone-800 rounded-2xl" />
              <div className="h-32 bg-stone-800 rounded-2xl" />
            </div>
            <div className="h-64 bg-stone-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-stone-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-100 mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-stone-400 mb-6">
          Añade algunos productos para continuar.
        </p>
        <Button asChild>
          <Link href="/products">Ver Productos</Link>
        </Button>
      </div>
    );
  }

  const total = cart.items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const handleCreateAddress = () => {
    createAddress.mutate(newAddress, {
      onSuccess: (address) => {
        setSelectedAddressId(address.id);
        setIsAddressModalOpen(false);
        setNewAddress({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          province: "",
          country: "",
          postalCode: "",
        });
      },
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) return;

    createOrder.mutate(
      { addressId: selectedAddressId },
      {
        onSuccess: (order) => {
          router.push(`/orders/${order.id}?success=true`);
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Continuar comprando
      </Link>

      <h1 className="text-3xl font-bold text-stone-100 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Address & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-6">
            <h2 className="text-xl font-semibold text-stone-100 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Dirección de Envío
            </h2>

            {addresses?.length ? (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedAddressId === address.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-stone-700 hover:border-stone-600"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-stone-100">
                          {address.fullName}
                        </p>
                        <p className="text-stone-400 text-sm mt-1">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-stone-400 text-sm">
                          {address.city}, {address.province} {address.postalCode}
                        </p>
                        <p className="text-stone-400 text-sm">{address.country}</p>
                        {address.phone && (
                          <p className="text-stone-500 text-sm mt-1">
                            Tel: {address.phone}
                          </p>
                        )}
                      </div>
                      {selectedAddressId === address.id && (
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-stone-900" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-stone-400">No tienes direcciones guardadas.</p>
            )}

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsAddressModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar nueva dirección
            </Button>
          </div>

          {/* Order Items */}
          <div className="bg-stone-900/50 rounded-2xl border border-stone-800 p-6">
            <h2 className="text-xl font-semibold text-stone-100 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              Productos ({cart.items.length})
            </h2>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-stone-800 last:border-0"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-800 flex-shrink-0">
                    {item.product.images?.[0] ? (
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
                      {item.product.name}
                    </h3>
                    <p className="text-stone-500 text-sm">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-stone-100 font-medium">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-stone-500 text-sm">
                      ${Number(item.product.price).toFixed(2)} c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-stone-900/50 rounded-2xl border border-stone-800 p-6">
            <h2 className="text-xl font-semibold text-stone-100 mb-4">
              Resumen del Pedido
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span>${Number(total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Envío</span>
                <span className="text-emerald-400">Gratis</span>
              </div>
              <div className="border-t border-stone-800 pt-3 flex justify-between text-stone-100 font-semibold text-lg">
                <span>Total</span>
                <span>${Number(total).toFixed(2)}</span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              className="mt-6"
              disabled={!selectedAddressId || createOrder.isPending}
              isLoading={createOrder.isPending}
              onClick={handlePlaceOrder}
            >
              Confirmar Pedido
            </Button>

            {!selectedAddressId && (
              <p className="text-amber-500 text-sm text-center mt-3">
                Selecciona una dirección de envío
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Nueva Dirección"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre completo"
              value={newAddress.fullName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, fullName: e.target.value })
              }
            />
            <Input
              label="Teléfono"
              value={newAddress.phone || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
            />
          </div>
          <Input
            label="Dirección línea 1"
            value={newAddress.addressLine1}
            onChange={(e) =>
              setNewAddress({ ...newAddress, addressLine1: e.target.value })
            }
          />
          <Input
            label="Dirección línea 2 (opcional)"
            value={newAddress.addressLine2 || ""}
            onChange={(e) =>
              setNewAddress({ ...newAddress, addressLine2: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ciudad"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <Input
              label="Provincia/Estado"
              value={newAddress.province || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, province: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="País"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
            />
            <Input
              label="Código Postal"
              value={newAddress.postalCode || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postalCode: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsAddressModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              onClick={handleCreateAddress}
              isLoading={createAddress.isPending}
              disabled={
                !newAddress.fullName ||
                !newAddress.addressLine1 ||
                !newAddress.city ||
                !newAddress.country
              }
            >
              Guardar Dirección
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

