import {
  InvoicesAggregationStats,
  InvoicesDailyCount,
  InvoicesStatusCount,
  ProblemsIncidenceRate,
  ReportsFilters,
  SurveyorsInvoiceAggregationStats,
  BrandsInvoiceCount,
} from '@fullstack-q3/contracts';

export interface ReportsRepository {
  getInvoicesStats(filters: ReportsFilters): Promise<InvoicesAggregationStats>;
  getInvoicesDailyCount(filters: ReportsFilters): Promise<InvoicesDailyCount>;
  getInvoicesStatusCount(filters: ReportsFilters): Promise<InvoicesStatusCount>;
  getSurveyorsInvoiceAggregationStats(
    filters: ReportsFilters,
  ): Promise<SurveyorsInvoiceAggregationStats>;
  getProblemsIncidenceRate(
    filters: ReportsFilters,
  ): Promise<ProblemsIncidenceRate>;
  getBrandsInvoiceCount(filters: ReportsFilters): Promise<BrandsInvoiceCount>;
}
