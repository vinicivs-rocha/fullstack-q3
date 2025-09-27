"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle,
  FileText,
  Car,
  ChartBar,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    gender: string;
    avatar?: string;
  };
  onLogOut: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const navigation = [
  { name: "Nova Vistoria", href: "/vistorias/nova", icon: <CheckCircle /> },
  { name: "Vistorias", href: "/vistorias", icon: <FileText /> },
  { name: "Veículos", href: "/veiculos", icon: <Car /> },
  { name: "Relatórios", href: "/relatorios", icon: <ChartBar /> },
];

export function Sidebar({
  user,
  onLogOut,
  isOpen = true,
  onClose,
  onOpen,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay para mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <button
        onClick={onOpen}
        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "flex h-full flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-50",
          // Desktop: sempre visível
          "lg:translate-x-0 lg:static lg:w-64",
          // Mobile/Tablet: controlada por estado
          isOpen
            ? "fixed inset-y-0 left-0 w-64 translate-x-0"
            : "fixed inset-y-0 left-0 w-64 -translate-x-full",
        )}
      >
        {/* Header com botão de fechar para mobile */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex justify-center items-center">
            <Link href="/vistorias" onClick={onClose}>
              <Image
                src="/company-logo.svg"
                alt="EPTA TECNOLOGIA"
                width={157}
                height={44}
                className="h-8 w-auto lg:h-11"
              />
            </Link>
          </div>
          {/* Botão de fechar para mobile/tablet */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500">
                {user.gender === "M" ? "Vistoriador" : "Vistoriadora"}
              </p>
            </div>
            <button
              onClick={onLogOut}
              className="ml-2 text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            >
              <span className="sr-only">Sair</span>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
