"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProblemsIncidenceRate } from "@fullstack-q3/contracts";

interface ProblemsListProps {
  data: ProblemsIncidenceRate;
  isLoading?: boolean;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

export function ProblemsList({ data, isLoading = false }: ProblemsListProps) {
  const formatPercentage = (value: number) => {
    return `${value.toFixed(0)}%`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Principais Problemas Encontrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded" />
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
        <CardTitle>Principais Problemas Encontrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((problem, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{problem.problemName}</span>
              </div>
              <Badge variant="secondary">
                {formatPercentage(problem.rate)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
