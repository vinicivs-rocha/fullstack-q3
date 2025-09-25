import { Injectable } from '@nestjs/common';
import { VehicleRepository } from 'src/invoices/abstractions/repositories/vehicle.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleModel } from 'src/invoices/abstractions/models/vehicle.model';

@Injectable()
export class VehicleTypeormRepository implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleModel)
    private readonly vehicleRepository: Repository<VehicleModel>,
  ) {}

  async findAll(): Promise<VehicleModel[]> {
    return this.vehicleRepository.find({
      select: {
        id: true,
        plate: true,
        model: true,
        brand: true,
        year: true,
      },
    });
  }
}
