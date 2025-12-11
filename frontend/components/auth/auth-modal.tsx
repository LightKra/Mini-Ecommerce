"use client";

import { useUI } from "@/context";
import { Modal } from "@/components/ui";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalView } = useUI();

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} size="md">
      {authModalView === "login" ? <LoginForm /> : <RegisterForm />}
    </Modal>
  );
}

