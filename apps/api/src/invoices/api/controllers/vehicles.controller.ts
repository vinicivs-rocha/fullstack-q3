import { VehicleListResponse } from '@fullstack-q3/contracts';
import { Controller, Get, Inject } from '@nestjs/common';
import { VehicleRepository } from 'src/invoices/abstractions/repositories/vehicle.repository';
import { VehicleTypeormRepository } from 'src/invoices/infrastructure/data/repositories/vehicle.typeorm.repository';
import { ListVehiclesPresenter } from '../presenters/list-vehicles.presenter';

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
}
