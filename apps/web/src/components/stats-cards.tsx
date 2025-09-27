"use client";

import { Card } from "@/components/ui/card";
import { InvoicesStatsResponse } from "@fullstack-q3/contracts";
import { Check, Clock, File, X } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface StatsCardsProps {
  stats: InvoicesStatsResponse;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
  const cards = [
    {
      title: "Total",
      value: stats.total,
      icon: <File className="h-4 w-4" />,
    },
    {
      title: "Pendentes",
      value: stats.pending,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Aprovadas",
      value: stats.approved,
      icon: <Check className="h-4 w-4" />,
    },
    {
      title: "Reprovadas",
      value: stats.rejected,
      icon: <X className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                {card.title}
              </p>
              {isLoading ? (
                <Skeleton className="w-12 sm:w-16 h-4 mt-1" />
              ) : (
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              )}
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-primary/20 text-primary border border-primary/40 flex-shrink-0 ml-2">
              <span className="text-lg sm:text-xl">{card.icon}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
