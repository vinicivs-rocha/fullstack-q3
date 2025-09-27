import type {
  InvoicesAggregationStats,
  InvoicesDailyCount,
  InvoicesStatusCount,
  ProblemsIncidenceRate,
  ReportsFilters,
  SurveyorsInvoiceAggregationStats,
  BrandsInvoiceCount,
} from '@fullstack-q3/contracts';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import type { ReportsRepository } from 'src/reports/abstractions/repositories/reports.repository';
import { ReportsTypeormRepository } from 'src/reports/infrasctructure/data/repositories/reports.typeorm.repository';

@Controller('reports')
export class ReportsController {
  constructor(
    @Inject(ReportsTypeormRepository)
    private readonly reportsRepository: ReportsRepository,
  ) {}

  @Get('invoices-stats')
  async getInvoicesStats(
    @Query() filters: ReportsFilters,
  ): Promise<InvoicesAggregationStats> {
    return this.reportsRepository.getInvoicesStats(filters);
  }

  @Get('invoices-status-count')
  async getInvoicesStatusCount(
    @Query() filters: ReportsFilters,
  ): Promise<InvoicesStatusCount> {
    return this.reportsRepository.getInvoicesStatusCount(filters);
  }

  @Get('invoices-daily-count')
  async getInvoicesDailyCount(
    @Query() filters: ReportsFilters,
  ): Promise<InvoicesDailyCount> {
    return this.reportsRepository.getInvoicesDailyCount(filters);
  }

  @Get('surveyors-invoice-aggregation-stats')
  async getSurveyorsInvoiceAggregationStats(
    @Query() filters: ReportsFilters,
  ): Promise<SurveyorsInvoiceAggregationStats> {
    return this.reportsRepository.getSurveyorsInvoiceAggregationStats(filters);
  }

  @Get('problems-incidence-rate')
  async getProblemsIncidenceRate(
    @Query() filters: ReportsFilters,
  ): Promise<ProblemsIncidenceRate> {
    return this.reportsRepository.getProblemsIncidenceRate(filters);
  }

  @Get('brands-invoice-count')
  async getBrandsInvoiceCount(
    @Query() filters: ReportsFilters,
  ): Promise<BrandsInvoiceCount> {
    return this.reportsRepository.getBrandsInvoiceCount(filters);
  }
}
