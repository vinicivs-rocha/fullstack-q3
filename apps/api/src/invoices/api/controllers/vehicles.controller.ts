import {
  VehicleBrandsResponse,
  VehicleCountsResponse,
  VehicleListResponse,
  type VehiclePaginatedListFilters,
  VehiclePaginatedListResponse,
  VehicleYearsResponse,
} from '@fullstack-q3/contracts';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { VehicleRepository } from 'src/invoices/abstractions/repositories/vehicle.repository';
import { VehicleTypeormRepository } from 'src/invoices/infrastructure/data/repositories/vehicle.typeorm.repository';
import { ListVehiclesPresenter } from '../presenters/list-vehicles.presenter';
import { ListPaginatedVehiclesPresenter } from '../presenters/list-paginated-vehicles.presenter';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    @Inject(VehicleTypeormRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  @Get()
  async findAll(): Promise<VehicleListResponse> {
    return ListVehiclesPresenter.toHttp(await this.vehicleRepository.findAll());
  }

  @Get('brands')
  async listBrands(): Promise<VehicleBrandsResponse> {
    return this.vehicleRepository.listBrands();
  }

  @Get('years')
  async listYears(): Promise<VehicleYearsResponse> {
    return this.vehicleRepository.listYears();
  }

  @Get('counts')
  async getCounts(): Promise<VehicleCountsResponse> {
    return {
      total: await this.vehicleRepository.count({}),
      active: await this.vehicleRepository.count({
        status: 'ATIVO',
      }),
      pending: await this.vehicleRepository.count({
        status: 'PENDENTE',
      }),
      inactive: await this.vehicleRepository.count({
        status: 'INATIVO',
      }),
    };
  }

  @Get('paginated')
  async paginatedList(
    @Query() filters: VehiclePaginatedListFilters,
  ): Promise<VehiclePaginatedListResponse> {
    return ListPaginatedVehiclesPresenter.toHttp(
      await this.vehicleRepository.paginatedList({
        status: filters.status,
        year: filters.year,
        brand: filters.brand,
        search: filters.search,
        page: filters.page,
        limit: filters.limit,
      }),
    );
  }
}
