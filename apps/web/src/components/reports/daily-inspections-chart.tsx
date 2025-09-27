"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { InvoicesDailyCount } from "@fullstack-q3/contracts";

interface DailyInspectionsChartProps {
  data: InvoicesDailyCount;
  isLoading?: boolean;
}

export function DailyInspectionsChart({
  data,
  isLoading = false,
}: DailyInspectionsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vistorias por Dia</CardTitle>
          <CardDescription>Mostra evolução diária</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Carregando gráfico...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vistorias por Dia</CardTitle>
        <CardDescription>Mostra evolução diária</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  format(new Date(value), "dd/MM", { locale: ptBR })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  format(new Date(value), "dd/MM/yyyy", { locale: ptBR })
                }
                formatter={(value) => [value, "Vistorias"]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
