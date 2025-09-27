"use client";

import { BrandsList } from "@/components/reports/brands-list";
import { DailyInspectionsChart } from "@/components/reports/daily-inspections-chart";
import { InspectionStatusChart } from "@/components/reports/inspection-status-chart";
import { ProblemsList } from "@/components/reports/problems-list";
import { ReportsStatsCards } from "@/components/reports/reports-stats-cards";
import { SurveyorsPerformanceTable } from "@/components/reports/surveyors-performance-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReports } from "@/hooks/use-reports";
import { Download, Loader2 } from "lucide-react";

export default function ReportsPage() {
  const {
    invoicesStatsQuery,
    invoicesDailyCountQuery,
    invoicesStatusCountQuery,
    surveyorsInvoiceAggregationStatsQuery,
    problemsIncidenceRateQuery,
    brandsInvoiceCountQuery,
    surveyorsQuery,
    start,
    end,
    setStart,
    setEnd,
    surveyorId,
    setSurveyorId,
    exportReport,
    pendingExport,
    reportContentRef,
  } = useReports();

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-1">
              Análises e estatísticas do sistema de vistorias
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => exportReport()}
          >
            {pendingExport ? (
              <Loader2 className="h-4 w-4 mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Exportar
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Vistoriador:
                </label>
                <Select
                  value={surveyorId?.toString()}
                  onValueChange={(value) => setSurveyorId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o vistoriador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todos os Vistoriadores</SelectItem>
                    {surveyorsQuery.data?.map((surveyor) => (
                      <SelectItem
                        key={surveyor.id}
                        value={surveyor.id.toString()}
                      >
                        {surveyor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Período:
                </label>
                <DateRangePicker
                  date={{
                    from: new Date(start),
                    to: end ? new Date(end) : new Date(),
                  }}
                  onDateChange={(date) => {
                    if (date) {
                      setStart(date.from?.toISOString());
                      setEnd(date.to?.toISOString());
                    }
                  }}
                  placeholder="Selecione o período"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div ref={reportContentRef} className="space-y-6 p-6">
          {/* Cards de Estatísticas */}
          {invoicesStatsQuery.data && (
            <ReportsStatsCards stats={invoicesStatsQuery.data} />
          )}

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyInspectionsChart
              data={invoicesDailyCountQuery.data || []}
              isLoading={invoicesDailyCountQuery.isLoading}
            />
            <InspectionStatusChart
              data={invoicesStatusCountQuery.data || []}
              isLoading={invoicesStatusCountQuery.isLoading}
            />
          </div>

          {/* Tabelas e Listas */}
          <div className="grid grid-rows-2 grid-cols-2 gap-6">
            <div className="col-span-2">
              <SurveyorsPerformanceTable
                data={surveyorsInvoiceAggregationStatsQuery.data || []}
                isLoading={surveyorsInvoiceAggregationStatsQuery.isLoading}
              />
            </div>
            <ProblemsList
              data={problemsIncidenceRateQuery.data || []}
              isLoading={problemsIncidenceRateQuery.isLoading}
            />
            <BrandsList
              data={brandsInvoiceCountQuery.data || []}
              isLoading={brandsInvoiceCountQuery.isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
