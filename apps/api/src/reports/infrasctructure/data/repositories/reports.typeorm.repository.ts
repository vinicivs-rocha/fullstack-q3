import { ReportsRepository } from 'src/reports/abstractions/repositories/reports.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { InvoiceModel } from 'src/invoices/abstractions/models/invoice.model';
import type {
  InvoicesAggregationStats,
  InvoicesDailyCount,
  InvoicesStatusCount,
  InvoiceStatus,
  ProblemsIncidenceRate,
  ReportsFilters,
  SurveyorsInvoiceAggregationStats,
  BrandsInvoiceCount,
} from '@fullstack-q3/contracts';

export class ReportsTypeormRepository implements ReportsRepository {
  constructor(
    @InjectRepository(InvoiceModel)
    private readonly invoiceRepository: Repository<InvoiceModel>,
  ) {}

  async getInvoicesStats(
    filters: ReportsFilters,
  ): Promise<InvoicesAggregationStats> {
    const lastMonthStart = new Date(filters.start);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const lastMonthEnd = new Date(filters.start);
    lastMonthEnd.setDate(0);
    lastMonthEnd.setHours(23, 59, 59, 999);

    const lastMonthTotalInvoicesCount = await this.invoiceRepository.count({
      where: {
        createdAt: Between(lastMonthStart, lastMonthEnd),
        surveyor: filters.surveyorId
          ? {
              id: filters.surveyorId,
            }
          : undefined,
      },
    });

    const lastMonthApprovedInvoicesCount = await this.invoiceRepository.count({
      where: {
        createdAt: Between(lastMonthStart, lastMonthEnd),
        surveyor: filters.surveyorId
          ? {
              id: filters.surveyorId,
            }
          : undefined,
        status: 'APROVADA',
      },
    });

    const totalInvoicesCount = await this.invoiceRepository.count({
      where: {
        createdAt: Between(filters.start, filters.end),
        surveyor: filters.surveyorId
          ? {
              id: filters.surveyorId,
            }
          : undefined,
      },
    });
    const approvedInvoicesCount = await this.invoiceRepository.count({
      where: {
        createdAt: Between(filters.start, filters.end),
        surveyor: filters.surveyorId
          ? {
              id: filters.surveyorId,
            }
          : undefined,
        status: 'APROVADA',
      },
    });

    const lastMonthTotalDurationMinutes =
      (await this.invoiceRepository.sum('duration', {
        createdAt: Between(lastMonthStart, lastMonthEnd),
        surveyor: filters.surveyorId
          ? {
              id: filters.surveyorId,
            }
          : undefined,
      })) ?? 0;

    const totalDurationMinutes =
      (await this.invoiceRepository.sum('duration', {
        createdAt: Between(filters.start, filters.end),
        surveyor: filters.surveyorId
          ? {
              id: filters.surveyorId,
            }
          : undefined,
      })) ?? 0;

    const lastMonthTotalReceipt =
      (await this.invoiceRepository.sum('price', {
        createdAt: Between(lastMonthStart, lastMonthEnd),
        surveyor: filters.surveyorId
          ? {
              id: filters.surveyorId,
            }
          : undefined,
      })) ?? 0;

    const totalReceipt =
      (await this.invoiceRepository.sum('price', {
        createdAt: Between(filters.start, filters.end),
        surveyor: filters.surveyorId
          ? {
              id: filters.surveyorId,
            }
          : undefined,
      })) ?? 0;

    return {
      total: {
        count: totalInvoicesCount,
        variationPercentage:
          lastMonthTotalInvoicesCount > 0
            ? ((totalInvoicesCount - lastMonthTotalInvoicesCount) /
                lastMonthTotalInvoicesCount) *
              100
            : 0,
      },
      approvalRate: {
        valuePercentage:
          totalInvoicesCount > 0
            ? (approvedInvoicesCount / totalInvoicesCount) * 100
            : 0,
        variationPercentage:
          lastMonthApprovedInvoicesCount > 0
            ? ((approvedInvoicesCount - lastMonthApprovedInvoicesCount) /
                lastMonthApprovedInvoicesCount) *
              100
            : 0,
      },
      averageDuration: {
        minutes:
          totalInvoicesCount > 0
            ? totalDurationMinutes / totalInvoicesCount
            : 0,
        variationMinutes:
          totalInvoicesCount > 0
            ? (totalDurationMinutes - lastMonthTotalDurationMinutes) /
              totalInvoicesCount
            : 0,
      },
      totalReceipt: {
        sum: totalReceipt,
        variationPercentage:
          lastMonthTotalReceipt > 0
            ? ((totalReceipt - lastMonthTotalReceipt) / lastMonthTotalReceipt) *
              100
            : 0,
      },
    };
  }

  async getInvoicesDailyCount(
    filters: ReportsFilters,
  ): Promise<InvoicesDailyCount> {
    const query = this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('DATE(invoice."createdAt") as date')
      .addSelect('COUNT(invoice.id) as count')
      .where('invoice."createdAt" BETWEEN :start AND :end', {
        start: filters.start,
        end: filters.end,
      })
      .groupBy('DATE(invoice."createdAt")');

    if (filters.surveyorId) {
      query.andWhere('invoice.surveyor.id = :surveyorId', {
        surveyorId: filters.surveyorId,
      });
    }

    const invoices = await query.getRawMany<{ date: string; count: string }>();

    return invoices.map((invoice) => ({
      date: new Date(invoice.date),
      count: Number(invoice.count),
    }));
  }

  async getInvoicesStatusCount(
    filters: ReportsFilters,
  ): Promise<InvoicesStatusCount> {
    const query = this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('invoice.status as status')
      .addSelect('COUNT(invoice.id) as count')
      .where('invoice."createdAt" BETWEEN :start AND :end', {
        start: filters.start,
        end: filters.end,
      })
      .groupBy('invoice.status');

    if (filters.surveyorId) {
      query.andWhere('invoice.surveyor.id = :surveyorId', {
        surveyorId: filters.surveyorId,
      });
    }

    const invoices = await query.getRawMany<{
      status: string;
      count: string;
    }>();

    return invoices.map((invoice) => ({
      status: invoice.status as InvoiceStatus,
      count: Number(invoice.count),
    }));
  }

  async getSurveyorsInvoiceAggregationStats(
    filters: ReportsFilters,
  ): Promise<SurveyorsInvoiceAggregationStats> {
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoices')
      .select(
        'surveyor.id as "surveyorId", surveyor.name as "surveyorName", surveyor.gender as "surveyorGender"',
      )
      .addSelect('COUNT(invoices.id) as count')
      .addSelect('SUM(invoices.price) as "totalPrice"')
      .addSelect('AVG(invoices.duration) as "averageDuration"')
      .where('invoices."createdAt" BETWEEN :start AND :end', {
        start: filters.start,
        end: filters.end,
      })
      .innerJoin('invoices.surveyor', 'surveyor')
      .groupBy('surveyor.id, surveyor.name, surveyor.gender')
      .getRawMany<{
        surveyorId: number;
        surveyorName: string;
        surveyorGender: 'M' | 'F';
        count: string;
        totalPrice: string;
        averageDuration: string;
      }>();

    const approvedInvoices = await this.invoiceRepository
      .createQueryBuilder('invoices')
      .select('surveyor.id as "surveyorId"')
      .addSelect('COUNT(invoices.id) as count')
      .where('invoices."createdAt" BETWEEN :start AND :end', {
        start: filters.start,
        end: filters.end,
      })
      .andWhere('invoices.status = :status', {
        status: 'APROVADA',
      })
      .innerJoin('invoices.surveyor', 'surveyor')
      .groupBy('surveyor.id')
      .getRawMany<{ surveyorId: number; count: string }>();

    console.log(invoices);
    console.log(approvedInvoices);

    return invoices.map((invoice) => ({
      surveyor: {
        id: invoice.surveyorId,
        name: invoice.surveyorName,
        gender: invoice.surveyorGender,
      },
      total: Number(invoice.count),
      approvalRate:
        Number(invoice.count) > 0
          ? (Number(
              approvedInvoices.find(
                (approved) => approved.surveyorId === invoice.surveyorId,
              )!.count,
            ) /
              Number(invoice.count)) *
            100
          : 0,
      durationMean: Number(invoice.averageDuration),
      totalReceipt: Number(invoice.totalPrice),
    }));
  }

  async getProblemsIncidenceRate(
    filters: ReportsFilters,
  ): Promise<ProblemsIncidenceRate> {
    const totalInvoicesCount = await this.invoiceRepository.count({
      where: {
        createdAt: Between(filters.start, filters.end),
        surveyor: filters.surveyorId
          ? {
              id: filters.surveyorId,
            }
          : undefined,
      },
    });

    const query = this.invoiceRepository
      .createQueryBuilder('invoices')
      .select('problems.label as "problemName"')
      .addSelect('COUNT(DISTINCT invoices.id) as "invoicesCount"')
      .innerJoin('invoices.problems', 'problems')
      .where('invoices."createdAt" BETWEEN :start AND :end', {
        start: filters.start,
        end: filters.end,
      })
      .groupBy('problems.label');

    if (filters.surveyorId) {
      query.andWhere('invoices.surveyor.id = :surveyorId', {
        surveyorId: filters.surveyorId,
      });
    }

    const problemInvoicesCount = await query.getRawMany<{
      problemName: string;
      invoicesCount: string;
    }>();

    return problemInvoicesCount.map((problem) => ({
      problemName: problem.problemName,
      rate:
        totalInvoicesCount > 0
          ? (Number(problem.invoicesCount) / totalInvoicesCount) * 100
          : 0,
    }));
  }

  async getBrandsInvoiceCount(
    filters: ReportsFilters,
  ): Promise<BrandsInvoiceCount> {
    const query = this.invoiceRepository
      .createQueryBuilder('invoices')
      .select('vehicle.brand as brand')
      .addSelect('COUNT(invoices.id) as "invoicesCount"')
      .innerJoin('invoices.vehicle', 'vehicle')
      .where('invoices."createdAt" BETWEEN :start AND :end', {
        start: filters.start,
        end: filters.end,
      });

    if (filters.surveyorId) {
      query.andWhere('invoices.surveyor.id = :surveyorId', {
        surveyorId: filters.surveyorId,
      });
    }

    const brandsInvoicesCount = await query
      .groupBy('vehicle.brand')
      .getRawMany<{ brand: string; invoicesCount: string }>();

    return brandsInvoicesCount.map((brand) => ({
      brand: brand.brand,
      count: Number(brand.invoicesCount),
    }));
  }
}
