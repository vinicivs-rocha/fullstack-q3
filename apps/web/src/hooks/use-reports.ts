import { useMutation, useQuery } from "@tanstack/react-query";
import { ReportsService } from "@/services/reports.service";
import { container } from "@/lib/di-container";
import { useEffect, useRef, useState } from "react";
import { ReportsFiltersSchema } from "@fullstack-q3/contracts";
import { SurveyorsService } from "@/services/surveyors.service";
import { TYPES } from "@/lib/di-types";

export const useReports = (
  reportsService: ReportsService = container.get(TYPES.ReportsService),
  surveyorsService: SurveyorsService = container.get(TYPES.SurveyorsService),
) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const [pendingExport, setPendingExport] = useState(false);
  const reportContentRef = useRef<HTMLDivElement>(null);

  const [start, setStart] = useState<string>(startOfMonth.toISOString());
  const [end, setEnd] = useState<string>(endOfMonth.toISOString());
  const [surveyorId, setSurveyorId] = useState<number | undefined>(undefined);

  const invoicesStatsQuery = useQuery({
    queryKey: ["invoices-stats", start, end, surveyorId],
    queryFn: () =>
      reportsService.getInvoicesStats(
        ReportsFiltersSchema.parse({
          start: new Date(start),
          end: end && new Date(end),
          surveyorId,
        }),
      ),
  });

  const invoicesDailyCountQuery = useQuery({
    queryKey: ["invoices-daily-count", start, end, surveyorId],
    queryFn: () =>
      reportsService.getInvoicesDailyCount(
        ReportsFiltersSchema.parse({
          start: new Date(start),
          end: end && new Date(end),
          surveyorId,
        }),
      ),
  });

  const invoicesStatusCountQuery = useQuery({
    queryKey: ["invoices-status-count", start, end, surveyorId],
    queryFn: () =>
      reportsService.getInvoicesStatusCount(
        ReportsFiltersSchema.parse({
          start: new Date(start),
          end: end && new Date(end),
          surveyorId,
        }),
      ),
  });

  const surveyorsInvoiceAggregationStatsQuery = useQuery({
    queryKey: ["surveyors-invoice-aggregation-stats", start, end, surveyorId],
    queryFn: () =>
      reportsService.getSurveyorsInvoiceAggregationStats(
        ReportsFiltersSchema.parse({
          start: new Date(start),
          end: end && new Date(end),
          surveyorId,
        }),
      ),
  });

  const problemsIncidenceRateQuery = useQuery({
    queryKey: ["problems-incidence-rate", start, end, surveyorId],
    queryFn: () =>
      reportsService.getProblemsIncidenceRate(
        ReportsFiltersSchema.parse({
          start: new Date(start),
          end: end && new Date(end),
          surveyorId,
        }),
      ),
  });

  const brandsInvoiceCountQuery = useQuery({
    queryKey: ["brands-invoice-count", start, end, surveyorId],
    queryFn: () =>
      reportsService.getBrandsInvoiceCount(
        ReportsFiltersSchema.parse({
          start: new Date(start),
          end: end && new Date(end),
          surveyorId,
        }),
      ),
  });

  const surveyorsQuery = useQuery({
    queryKey: ["surveyors"],
    queryFn: () => surveyorsService.getSurveyors(),
  });

  const exportReportMutation = useMutation({
    mutationKey: ["export-report"],
    mutationFn: () =>
      reportsService.export(reportContentRef.current!, start, end, surveyorId),
  });

  useEffect(() => {
    if (
      pendingExport &&
      reportContentRef.current &&
      !invoicesStatsQuery.isLoading &&
      !invoicesDailyCountQuery.isLoading &&
      !invoicesStatusCountQuery.isLoading &&
      !surveyorsInvoiceAggregationStatsQuery.isLoading &&
      !problemsIncidenceRateQuery.isLoading &&
      !brandsInvoiceCountQuery.isLoading
    ) {
      exportReportMutation.mutate();
      setPendingExport(false);
    }
  }, [
    pendingExport,
    invoicesStatsQuery.isLoading,
    invoicesDailyCountQuery.isLoading,
    invoicesStatusCountQuery.isLoading,
    surveyorsInvoiceAggregationStatsQuery.isLoading,
    problemsIncidenceRateQuery.isLoading,
    brandsInvoiceCountQuery.isLoading,
    start,
    end,
    surveyorId,
    // eslint-disable-next-line @tanstack/query/no-unstable-deps
    exportReportMutation,
  ]);

  return {
    invoicesStatsQuery,
    invoicesDailyCountQuery,
    invoicesStatusCountQuery,
    surveyorsInvoiceAggregationStatsQuery,
    problemsIncidenceRateQuery,
    brandsInvoiceCountQuery,
    surveyorsQuery,
    start,
    end,
    surveyorId,
    setStart: (start: string | undefined) =>
      setStart(start ?? startOfMonth.toISOString()),
    setEnd: (end: string | undefined) =>
      setEnd(end ?? endOfMonth.toISOString()),
    setSurveyorId,
    reportContentRef,
    pendingExport,
    exportReport: () => {
      setPendingExport(true);
    },
  };
};
