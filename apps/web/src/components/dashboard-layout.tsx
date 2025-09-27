"use client";

import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { meQuery, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (meQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (meQuery.isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-600">
          Erro: {meQuery.error.message}
        </div>
      </div>
    );
  }

  const user = {
    name: meQuery.data?.name || "Usuário",
    email: meQuery.data?.email || "",
    gender: "M",
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        user={user}
        onLogOut={logOut}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
