"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SurveyorsInvoiceAggregationStats } from "@fullstack-q3/contracts";

interface SurveyorsPerformanceTableProps {
  data: SurveyorsInvoiceAggregationStats;
  isLoading?: boolean;
}

export function SurveyorsPerformanceTable({
  data,
  isLoading = false,
}: SurveyorsPerformanceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDuration = (minutes: number) => {
    return `${minutes.toFixed(2)}min`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance por Vistoriador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="text-center">
                      <div className="h-4 w-16 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance por Vistoriador</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {getInitials(item.surveyor.name)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{item.surveyor.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.surveyor.gender === "M"
                      ? "Vistoriador"
                      : "Vistoriadora"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium">{item.total.toLocaleString()}</p>
                  <p className="text-gray-500">Vistorias</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">
                    {formatPercentage(item.approvalRate)}
                  </p>
                  <p className="text-gray-500">Taxa Aprovação</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">
                    {formatDuration(item.durationMean)}
                  </p>
                  <p className="text-gray-500">Tempo Médio</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">
                    {formatCurrency(item.totalReceipt)}
                  </p>
                  <p className="text-gray-500">Receita</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
