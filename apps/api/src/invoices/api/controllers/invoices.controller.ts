import {
  InvoicesListResponse,
  InvoicesStats,
  type InvoicesFilters,
} from '@fullstack-q3/contracts';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { SurveyorJwtGuard } from 'src/auth/api/guards/surveyor.jwt.guard';
import { InvoiceRepository } from 'src/invoices/abstractions/repositories/invoice.repository';
import { ListInvoicesPresenter } from '../presenters/list-invoices.presenter';
import { InvoiceTypeormRepository } from 'src/invoices/infrastructure/data/repositories/invoice.typeorm.repository';

@Controller('invoices')
export class InvoicesController {
  constructor(
    @Inject(InvoiceTypeormRepository)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  @UseGuards(SurveyorJwtGuard)
  @Get('stats')
  async getStats(@Query() filters: InvoicesFilters): Promise<InvoicesStats> {
    return {
      total: await this.invoiceRepository.count(filters),
      pending: await this.invoiceRepository.count({
        status: 'PENDENTE',
      }),
      approved: await this.invoiceRepository.count({
        status: 'APROVADA',
      }),
      rejected: await this.invoiceRepository.count({
        status: 'REPROVADA',
      }),
    };
  }

  @UseGuards(SurveyorJwtGuard)
  @Get()
  async findAll(
    @Query() filters: InvoicesFilters,
  ): Promise<InvoicesListResponse> {
    return ListInvoicesPresenter.toHttp(
      await this.invoiceRepository.findAll({
        status: filters.status,
        start: filters.start,
        end: filters.end,
        search: filters.search,
        page: filters.page,
        limit: filters.limit,
      }),
    );
  }
}
