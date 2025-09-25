import { VehicleModel } from '../models/vehicle.model';

export abstract class VehicleRepository {
  abstract findAll(): Promise<VehicleModel[]>;
}
