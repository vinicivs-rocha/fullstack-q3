"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, FileText, Car, ChartBar, LogOut } from "lucide-react";
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
}

const navigation = [
  { name: "Nova Vistoria", href: "/vistorias/nova", icon: <CheckCircle /> },
  { name: "Vistorias", href: "/vistorias", icon: <FileText /> },
  { name: "Veículos", href: "/veiculos", icon: <Car /> },
  { name: "Relatórios", href: "/relatorios", icon: <ChartBar /> },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex justify-center items-center">
          <Link href="/vistorias">
            <Image src="/company-logo.svg" alt="EPTA TECNOLOGIA" width={157} height={44} />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
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
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.gender === "M" ? "Vistoriador" : "Vistoriadora"}</p>
          </div>
          <button className="ml-2 text-gray-400 hover:text-gray-600">
            <span className="sr-only">Sair</span>
              <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
