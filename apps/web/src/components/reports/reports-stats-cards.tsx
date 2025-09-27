"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  ClipboardCheck,
} from "lucide-react";
import { InvoicesAggregationStats } from "@fullstack-q3/contracts";

interface ReportsStatsCardsProps {
  stats: InvoicesAggregationStats;
}

export function ReportsStatsCards({ stats }: ReportsStatsCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number | null) => {
    return `${value?.toFixed(1) ?? "0"}%`;
  };

  const formatDuration = (minutes: number) => {
    return `${minutes.toFixed(2)}min`;
  };

  const getChangeType = (value: number) => {
    if (value === 0) return "neutral" as const;
    return value > 0 ? ("positive" as const) : ("negative" as const);
  };

  const cards = [
    {
      title: "Vistorias Realizadas",
      value: stats.total.count.toLocaleString(),
      change: `${stats.total.variationPercentage?.toFixed(1) ?? "0"}% vs mês anterior`,
      changeType: getChangeType(stats.total.variationPercentage ?? 0),
      icon: <ClipboardCheck className="h-6 w-6" />,
    },
    {
      title: "Taxa de Aprovação",
      value: formatPercentage(stats.approvalRate.valuePercentage),
      change: `${stats.approvalRate.variationPercentage?.toFixed(1) ?? "0"}% vs mês anterior`,
      changeType: getChangeType(stats.approvalRate.variationPercentage ?? 0),
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      title: "Tempo Médio",
      value: formatDuration(stats.averageDuration.minutes),
      change: `${stats.averageDuration.variationMinutes?.toFixed(1) ?? "0"}min vs mês anterior`,
      changeType: getChangeType(stats.averageDuration.variationMinutes ?? 0),
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: "Receita Total",
      value: formatCurrency(stats.totalReceipt.sum),
      change: `${stats.totalReceipt.variationPercentage?.toFixed(1) ?? "0"}% vs mês anterior`,
      changeType: getChangeType(stats.totalReceipt.variationPercentage ?? 0),
      icon: <DollarSign className="h-6 w-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <div className="flex items-center mt-1">
                  {card.changeType === "positive" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : card.changeType === "negative" ? (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      card.changeType === "positive"
                        ? "text-green-600"
                        : card.changeType === "negative"
                          ? "text-red-600"
                          : "text-gray-500"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
