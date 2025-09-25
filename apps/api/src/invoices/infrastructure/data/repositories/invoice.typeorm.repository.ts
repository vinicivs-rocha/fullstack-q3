import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceModel } from 'src/invoices/abstractions/models/invoice.model';
import { InvoiceRepository } from 'src/invoices/abstractions/repositories/invoice.repository';
import { ProblemModel } from 'src/invoices/abstractions/models/problem.model';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceTypeormRepository implements InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceModel)
    private readonly invoiceRepository: Repository<InvoiceModel>,
    @InjectRepository(ProblemModel)
    private readonly problemRepository: Repository<ProblemModel>,
  ) {}

  async count(filters: InvoiceRepository.CountFilters): Promise<number> {
    const qb = this.invoiceRepository.createQueryBuilder('invoice');

    if (filters.status) {
      qb.andWhere('invoice.status = :status', {
        status: filters.status,
      });
    }

    if (filters.start) {
      qb.andWhere('date(invoice.createdAt) >= date(:start)', {
        start: filters.start,
      });
    }

    if (filters.end) {
      qb.andWhere('date(invoice.createdAt) <= date(:end)', {
        end: filters.end,
      });
    }

    return qb.getCount();
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

  async detail(id: number): Promise<InvoiceModel> {
    return this.invoiceRepository.findOneOrFail({
      select: {
        id: true,
        status: true,
        createdAt: true,
        observation: true,
        price: true,
        duration: true,
        vehicle: {
          id: true,
          plate: true,
          model: true,
          brand: true,
          year: true,
          color: true,
          fuelType: true,
          mileage: true,
          chassis: true,
        },
        surveyor: {
          id: true,
          name: true,
          gender: true,
          email: true,
          phone: true,
          license: true,
        },
        problems: {
          id: true,
          label: true,
        },
      },
      where: { id },
      relations: ['vehicle', 'surveyor', 'problems'],
    });
  }

  async create(data: InvoiceRepository.CreateData): Promise<void> {
    await this.invoiceRepository.save({
      status: data.status,
      observation: data.observation,
      price: data.price,
      duration: data.duration,
      vehicle: { id: data.vehicleId },
      surveyor: { id: data.surveyorId },
      problems: await Promise.all(
        data.problems.map(async (problem) => {
          const { id } = problem.id
            ? { id: problem.id }
            : await this.problemRepository.save({
                label: problem.label,
              });
          return { id };
        }),
      ),
    });
  }

  async update(data: InvoiceRepository.UpdateData): Promise<void> {
    console.log(data);
    await this.invoiceRepository.save({
      id: data.id,
      observation: data.observation,
      price: data.price,
      duration: data.duration,
      status: data.status,
      vehicle: { id: data.vehicleId },
      problems: await Promise.all(
        data.problems.map(async (problem) => {
          const { id } = problem.id
            ? { id: problem.id }
            : await this.problemRepository.save({
                label: problem.label,
              });
          return { id };
        }),
      ),
    });
  }
}
