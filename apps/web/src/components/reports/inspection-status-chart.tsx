"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { InvoicesStatusCount } from "@fullstack-q3/contracts";

interface InspectionStatusChartProps {
  data: InvoicesStatusCount;
  isLoading?: boolean;
}

const STATUS_COLORS = {
  APPROVED: "#10b981",
  REJECTED: "#ef4444",
  PENDING: "#f59e0b",
};

export function InspectionStatusChart({
  data,
  isLoading = false,
}: InspectionStatusChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status das Vistorias</CardTitle>
          <CardDescription>Aprovado vs Reprovado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Carregando gráfico...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status das Vistorias</CardTitle>
          <CardDescription>Aprovado vs Reprovado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex flex-col items-center justify-center text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="text-gray-500 text-sm">
              Nenhuma vistoria encontrada
            </div>
            <div className="text-gray-400 text-xs mt-1">
              Tente ajustar os filtros
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name:
      item.status === "APROVADA"
        ? "Aprovadas"
        : item.status === "REPROVADA"
          ? "Reprovadas"
          : "Pendentes",
    value: item.count,
    color:
      STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || "#6b7280",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status das Vistorias</CardTitle>
        <CardDescription>Aprovado vs Reprovado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent as number) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, "Vistorias"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
