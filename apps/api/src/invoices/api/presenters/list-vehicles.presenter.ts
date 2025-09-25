import { VehicleListResponse } from '@fullstack-q3/contracts';
import { VehicleModel } from 'src/invoices/abstractions/models/vehicle.model';

export class ListVehiclesPresenter {
  static toHttp(vehicles: VehicleModel[]): VehicleListResponse {
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      plate: vehicle.plate,
      model: vehicle.model,
      brand: vehicle.brand,
      year: vehicle.year,
    }));
  }
}
