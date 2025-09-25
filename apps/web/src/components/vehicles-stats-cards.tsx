"use client";

import { Card } from "@/components/ui/card";
import { Car, Check, Clock, X } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface VehicleStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

interface VehicleStatsCardsProps {
  stats: VehicleStats;
  isLoading?: boolean;
}

export function VehicleStatsCards({ stats, isLoading = false }: VehicleStatsCardsProps) {
  const cards = [
    {
      title: "Total",
      value: stats.total,
      icon: <Car className="h-4 w-4" />,
    },
    {
      title: "Ativos",
      value: stats.active,
      icon: <Check className="h-4 w-4" />,
    },
    {
      title: "Pendentes",
      value: stats.pending,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Inativos",
      value: stats.inactive,
      icon: <X className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="p-6">
          <div className="flex justify-between items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              {isLoading ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              )}
            </div>
            <div className="p-3 rounded-lg bg-primary/20 text-primary border border-primary/40">
              <span className="text-xl">{card.icon}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 