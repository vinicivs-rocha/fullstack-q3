import {
  InvoiceStatus,
  VehicleListResponse,
  VehicleStatus,
} from '@fullstack-q3/contracts';
import { VehicleModel } from 'src/invoices/abstractions/models/vehicle.model';

export class ListVehiclesPresenter {
  static toHttp(vehicles: VehicleModel[]): VehicleListResponse {
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      plate: vehicle.plate,
      model: vehicle.model,
      brand: vehicle.brand,
      year: vehicle.year,
      chassisNumber: vehicle.chassis,
      proprietary: {
        name: vehicle.proprietary.name,
        email: vehicle.proprietary.email,
      },
      createdAt: vehicle.createdAt,
      status: this.getStatus(vehicle.lastInvoice?.status),
      lastSurveyDate: vehicle.lastInvoice?.createdAt,
    }));
  }

  static getStatus(status: InvoiceStatus | undefined): VehicleStatus {
    switch (status) {
      case 'PENDENTE':
        return 'PENDENTE';
      case 'APROVADA':
        return 'ATIVO';
      case 'REPROVADA':
        return 'INATIVO';
      default:
        return 'ATIVO';
    }
  }
}
