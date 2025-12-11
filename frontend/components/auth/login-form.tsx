"use client";

import { useState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useLogin } from "@/queries";
import { useAuth, useUI } from "@/context";
import { Button, Input } from "@/components/ui";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useLogin();
  const { setUser } = useAuth();
  const { closeAuthModal, setAuthModalView } = useUI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    login.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          setUser(response.user);
          closeAuthModal();
        },
        onError: (err) => {
          setError(
            err instanceof Error
              ? err.message
              : "Error al iniciar sesión. Verifica tus credenciales."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-stone-100">Bienvenido de vuelta</h2>
        <p className="text-stone-400 mt-2">Ingresa tus credenciales para continuar</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12"
            autoComplete="current-password"
          />
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={login.isPending}
      >
        Iniciar Sesión
      </Button>

      <p className="text-center text-stone-400">
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          onClick={() => setAuthModalView("register")}
          className="text-amber-500 hover:text-amber-400 font-medium"
        >
          Regístrate aquí
        </button>
      </p>
    </form>
  );
}

