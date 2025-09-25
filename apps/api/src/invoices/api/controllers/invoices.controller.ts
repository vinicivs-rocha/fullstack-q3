import {
  DetailedInvoiceResponse,
  type InvoiceCreationData,
  InvoicesListResponse,
  InvoicesStatsResponse,
  type InvoicesFilters,
} from '@fullstack-q3/contracts';
import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SurveyorJwtGuard } from 'src/auth/api/guards/surveyor.jwt.guard';
import { InvoiceRepository } from 'src/invoices/abstractions/repositories/invoice.repository';
import { InvoiceTypeormRepository } from 'src/invoices/infrastructure/data/repositories/invoice.typeorm.repository';
import { DetailInvoicePresenter } from '../presenters/detail-invoice.presenter';
import { ListInvoicesPresenter } from '../presenters/list-invoices.presenter';
import { Body } from '@nestjs/common';
import { User } from 'src/auth/api/decorators/user.decorator';
import { UserModel } from 'src/auth/abstractions/models/user.model';

@Controller('invoices')
export class InvoicesController {
  constructor(
    @Inject(InvoiceTypeormRepository)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  @UseGuards(SurveyorJwtGuard)
  @Get('stats')
  async getStats(
    @Query() filters: InvoicesFilters,
  ): Promise<InvoicesStatsResponse> {
    return {
      total: await this.invoiceRepository.count({
        start: filters.start,
        end: filters.end,
      }),
      pending: await this.invoiceRepository.count({
        status: 'PENDENTE',
        start: filters.start,
        end: filters.end,
      }),
      approved: await this.invoiceRepository.count({
        status: 'APROVADA',
        start: filters.start,
        end: filters.end,
      }),
      rejected: await this.invoiceRepository.count({
        status: 'REPROVADA',
        start: filters.start,
        end: filters.end,
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

  @UseGuards(SurveyorJwtGuard)
  @Get(':id')
  async detail(@Param('id') id: number): Promise<DetailedInvoiceResponse> {
    return DetailInvoicePresenter.toHttp(
      await this.invoiceRepository.detail(id),
    );
  }

  @UseGuards(SurveyorJwtGuard)
  @Post()
  async create(
    @Body() data: InvoiceCreationData,
    @User() user: UserModel,
  ): Promise<void> {
    await this.invoiceRepository.create({
      vehicleId: data.vehicleId,
      surveyorId: user.id,
      problems: data.problems,
      status: data.status,
      price: data.price,
      duration: data.duration,
      observation: data.observation,
    });
  }
}
