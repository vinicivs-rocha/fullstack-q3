import { VehicleDetailsResponse } from '@fullstack-q3/contracts';
import { VehicleModel } from '../../abstractions/models/vehicle.model';

export class DetailVehiclePresenter {
  static toHTTP(vehicle: VehicleModel): VehicleDetailsResponse {
    return {
      id: vehicle.id,
      plate: vehicle.plate,
      model: vehicle.model,
      brand: vehicle.brand,
      year: vehicle.year,
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      mileage: vehicle.mileage,
      chassisNumber: vehicle.chassis,
      proprietary: {
        name: vehicle.proprietary.name,
        email: vehicle.proprietary.email,
      },
      createdAt: vehicle.createdAt.toISOString(),
      invoices: vehicle.invoices.map((invoice) => ({
        id: invoice.id,
        status: invoice.status,
        createdAt: invoice.createdAt.toISOString(),
        price: invoice.price,
      })),
    };
  }
}
