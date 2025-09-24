import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceModel } from 'src/invoices/abstractions/models/invoice.model';
import { InvoiceRepository } from 'src/invoices/abstractions/repositories/invoice.repository';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceTypeormRepository implements InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceModel)
    private readonly invoiceRepository: Repository<InvoiceModel>,
  ) {}

  async count(filters: InvoiceRepository.CountFilters): Promise<number> {
    return this.invoiceRepository.count({
      where: {
        status: filters.status,
      },
    });
  }

  async findAll(
    filters: InvoiceRepository.FindAllFilters,
  ): Promise<InvoiceRepository.FindAllResponse> {
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.vehicle', 'vehicle')
      .leftJoinAndSelect('invoice.surveyor', 'surveyor')
      .select([
        'invoice.id',
        'invoice.status',
        'invoice.createdAt',
        'vehicle.id',
        'vehicle.plate',
        'vehicle.model',
        'vehicle.brand',
        'vehicle.year',
        'surveyor.id',
        'surveyor.name',
        'surveyor.gender',
      ]);

    if (filters.status) {
      queryBuilder.andWhere('invoice.status = :status', {
        status: filters.status,
      });
    }

    if (filters.start) {
      queryBuilder.andWhere('date(invoice.createdAt) >= date(:start)', {
        start: filters.start,
      });
    }
    if (filters.end) {
      queryBuilder.andWhere('date(invoice.createdAt) <= date(:end)', {
        end: filters.end,
      });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(vehicle.brand ILIKE :search OR vehicle.model ILIKE :search OR vehicle.plate ILIKE :search OR surveyor.name ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    queryBuilder
      .orderBy('invoice.createdAt', 'ASC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit);

    const [invoices, total] = await queryBuilder.getManyAndCount();

    return {
      invoices,
      total,
    };
  }
}
