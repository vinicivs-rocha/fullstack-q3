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
