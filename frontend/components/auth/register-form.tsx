"use client";

import { useState } from "react";
import { User, Mail, Lock, AlertCircle } from "lucide-react";
import { useRegister } from "@/queries";
import { useAuth, useUI } from "@/context";
import { Button, Input } from "@/components/ui";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const register = useRegister();
  const { setUser } = useAuth();
  const { closeAuthModal, setAuthModalView } = useUI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    register.mutate(
      { name, email, password },
      {
        onSuccess: (response) => {
          setUser(response.user);
          closeAuthModal();
        },
        onError: (err) => {
          setError(
            err instanceof Error
              ? err.message
              : "Error al registrar. Intenta de nuevo."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-stone-100">Crea tu cuenta</h2>
        <p className="text-stone-400 mt-2">Regístrate para comenzar a comprar</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
          <Input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-12"
            autoComplete="name"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
          <Input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12"
            autoComplete="email"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12"
            autoComplete="new-password"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
          <Input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-12"
            autoComplete="new-password"
          />
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={register.isPending}
      >
        Crear Cuenta
      </Button>

      <p className="text-center text-stone-400">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={() => setAuthModalView("login")}
          className="text-amber-500 hover:text-amber-400 font-medium"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
}

