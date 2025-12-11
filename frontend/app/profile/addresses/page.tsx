"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  ChevronLeft,
  Trash2,
  Edit2,
  Phone,
} from "lucide-react";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/queries";
import { useAuth, useUI } from "@/context";
import { Button, Input, Modal, Skeleton } from "@/components/ui";
import type { Address, CreateAddressRequest, UpdateAddressRequest } from "@/lib/services";

export default function AddressesPage() {
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();

  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<CreateAddressRequest>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <MapPin className="w-16 h-16 text-stone-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-100 mb-2">
          Inicia sesión para ver tus direcciones
        </h1>
        <Button onClick={() => openAuthModal("login")}>Iniciar Sesión</Button>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingAddress(null);
    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      province: "",
      country: "",
      postalCode: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone || "",
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      province: address.province || "",
      country: address.country,
      postalCode: address.postalCode || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingAddress) {
      const updateData: UpdateAddressRequest = { ...formData };
      updateAddress.mutate(
        { id: editingAddress.id, data: updateData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingAddress(null);
          },
        }
      );
    } else {
      createAddress.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta dirección?")) {
      deleteAddress.mutate(id);
    }
  };

  const isFormValid =
    formData.fullName &&
    formData.addressLine1 &&
    formData.city &&
    formData.country;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-1 text-stone-400 hover:text-amber-400 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver al perfil
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Mis Direcciones</h1>
          <p className="text-stone-400 mt-1">
            Administra tus direcciones de envío
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Dirección
        </Button>
      </div>

      {/* Addresses List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : !addresses?.length ? (
        <div className="text-center py-16 bg-stone-900/50 rounded-2xl border border-stone-800">
          <MapPin className="w-16 h-16 text-stone-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-stone-100 mb-2">
            No tienes direcciones guardadas
          </h2>
          <p className="text-stone-400 mb-6">
            Agrega una dirección para agilizar tus compras.
          </p>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Dirección
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-stone-900/50 rounded-2xl border border-stone-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(address)}
                    className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deleteAddress.isPending}
                    className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-stone-100">
                {address.fullName}
              </h3>
              <div className="mt-2 text-stone-400 space-y-1">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}
                  {address.province && `, ${address.province}`}{" "}
                  {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>
              {address.phone && (
                <div className="flex items-center gap-2 mt-3 text-stone-500">
                  <Phone className="w-4 h-4" />
                  <span>{address.phone}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? "Editar Dirección" : "Nueva Dirección"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre completo"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            <Input
              label="Teléfono"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <Input
            label="Dirección línea 1"
            value={formData.addressLine1}
            onChange={(e) =>
              setFormData({ ...formData, addressLine1: e.target.value })
            }
          />
          <Input
            label="Dirección línea 2 (opcional)"
            value={formData.addressLine2 || ""}
            onChange={(e) =>
              setFormData({ ...formData, addressLine2: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ciudad"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
            <Input
              label="Provincia/Estado"
              value={formData.province || ""}
              onChange={(e) =>
                setFormData({ ...formData, province: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="País"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
            <Input
              label="Código Postal"
              value={formData.postalCode || ""}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              onClick={handleSubmit}
              isLoading={createAddress.isPending || updateAddress.isPending}
              disabled={!isFormValid}
            >
              {editingAddress ? "Guardar Cambios" : "Agregar Dirección"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

