import { Injectable } from '@nestjs/common';
import { VehicleRepository } from 'src/invoices/abstractions/repositories/vehicle.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { VehicleModel } from 'src/invoices/abstractions/models/vehicle.model';

@Injectable()
export class VehicleTypeormRepository implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleModel)
    private readonly vehicleRepository: Repository<VehicleModel>,
  ) {}

  async findAll(): Promise<VehicleModel[]> {
    return this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select([
        'vehicle.id',
        'vehicle.plate',
        'vehicle.model',
        'vehicle.brand',
        'vehicle.year',
        'vehicle.chassis',
        'vehicle.proprietary.name',
        'vehicle.proprietary.email',
        'lastInvoice.status',
        'lastInvoice.createdAt',
      ])
      .leftJoinAndMapOne(
        'vehicle.lastInvoice',
        'vehicle.invoices',
        'lastInvoice',
        '"lastInvoice"."createdAt" = (SELECT MAX("createdAt") FROM invoices WHERE "vehicleId" = "vehicle"."id")',
      )
      .getMany();
  }

  async count(filters: VehicleRepository.CountFilters): Promise<number> {
    const query = this.vehicleRepository.createQueryBuilder('vehicle');

    switch (filters.status) {
      case 'ATIVO':
        query
          .innerJoinAndMapOne(
            'vehicle.lastInvoice',
            'vehicle.invoices',
            'lastInvoice',
            '"lastInvoice"."createdAt" = (SELECT MAX("createdAt") FROM invoices WHERE "vehicleId" = "vehicle"."id")',
          )
          .andWhere('lastInvoice.status = :status', { status: 'APROVADA' });
        break;
      case 'PENDENTE':
        query
          .leftJoinAndMapOne(
            'vehicle.lastInvoice',
            'vehicle.invoices',
            'lastInvoice',
            '"lastInvoice"."createdAt" = (SELECT MAX("createdAt") FROM invoices WHERE "vehicleId" = "vehicle"."id")',
          )
          .andWhere(
            new Brackets((qb) => {
              qb.where('lastInvoice.status = :status', { status: 'PENDENTE' });
              qb.orWhere('lastInvoice.status IS NULL');
            }),
          );
        break;
      case 'INATIVO':
        query
          .leftJoinAndMapOne(
            'vehicle.lastInvoice',
            'vehicle.invoices',
            'lastInvoice',
            '"lastInvoice"."createdAt" = (SELECT MAX("createdAt") FROM invoices WHERE "vehicleId" = "vehicle"."id")',
          )
          .andWhere('lastInvoice.status = :status', { status: 'REPROVADA' });
        break;
      default:
        break;
    }

    return query.getCount();
  }

  async listBrands(): Promise<string[]> {
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select(['vehicle.brand'])
      .distinctOn(['vehicle.brand'])
      .orderBy('vehicle.brand', 'ASC')
      .getMany();
    return vehicles.map((vehicle) => vehicle.brand);
  }

  async listYears(): Promise<number[]> {
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select(['vehicle.year'])
      .distinctOn(['vehicle.year'])
      .orderBy('vehicle.year', 'ASC')
      .getMany();
    return vehicles.map((vehicle) => vehicle.year);
  }

  async paginatedList(
    filters: VehicleRepository.PaginatedListFilters,
  ): Promise<VehicleRepository.PaginatedListOutput> {
    const query = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select([
        'vehicle.id',
        'vehicle.plate',
        'vehicle.model',
        'vehicle.brand',
        'vehicle.year',
        'vehicle.chassis',
        'vehicle.proprietary.name',
        'vehicle.proprietary.email',
        'vehicle.createdAt',
        'lastInvoice.id',
        'lastInvoice.status',
        'lastInvoice.createdAt',
      ])
      .leftJoinAndMapOne(
        'vehicle.lastInvoice',
        'vehicle.invoices',
        'lastInvoice',
        '"lastInvoice"."createdAt" = (SELECT MAX("createdAt") FROM invoices WHERE "vehicleId" = "vehicle"."id")',
      );

    switch (filters.status) {
      case 'ATIVO':
        query.andWhere('lastInvoice.status = :status', { status: 'APROVADA' });
        break;
      case 'PENDENTE':
        query.andWhere(
          new Brackets((qb) => {
            qb.where('lastInvoice.status = :status', { status: 'PENDENTE' });
            qb.orWhere('lastInvoice.status IS NULL');
          }),
        );
        break;
      case 'INATIVO':
        query.andWhere('lastInvoice.status = :status', { status: 'REPROVADA' });
        break;
      default:
        break;
    }

    if (filters.year) {
      query.andWhere('vehicle.year = :year', { year: filters.year });
    }

    if (filters.brand) {
      query.andWhere('vehicle.brand = :brand', { brand: filters.brand });
    }

    if (filters.search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('vehicle.plate ILIKE :search', {
            search: `%${filters.search}%`,
          });
          qb.orWhere('vehicle.model ILIKE :search', {
            search: `%${filters.search}%`,
          }).orWhere('vehicle.proprietary.name ILIKE :search', {
            search: `%${filters.search}%`,
          });
        }),
      );
    }

    query.skip((filters.page - 1) * filters.limit).take(filters.limit);

    const [vehicles, total] = await query.getManyAndCount();

    return {
      vehicles,
      total,
    };
  }

  async detail(id: number): Promise<VehicleModel> {
    return this.vehicleRepository.findOneOrFail({
      select: {
        id: true,
        plate: true,
        model: true,
        brand: true,
        year: true,
        chassis: true,
        proprietary: {
          name: true,
          email: true,
        },
        color: true,
        fuelType: true,
        mileage: true,
        createdAt: true,
        invoices: {
          id: true,
          status: true,
          createdAt: true,
          price: true,
        },
      },
      where: { id },
      relations: ['invoices'],
    });
  }

  async create(data: VehicleRepository.CreateData): Promise<void> {
    await this.vehicleRepository.save(data);
  }

  async update(id: number, data: VehicleRepository.UpdateData): Promise<void> {
    await this.vehicleRepository.save({
      id,
      ...data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
