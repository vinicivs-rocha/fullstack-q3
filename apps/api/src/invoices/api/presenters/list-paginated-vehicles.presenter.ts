import {
  InvoiceStatus,
  VehiclePaginatedListResponse,
  VehicleStatus,
} from '@fullstack-q3/contracts';
import { VehicleRepository } from 'src/invoices/abstractions/repositories/vehicle.repository';

export class ListPaginatedVehiclesPresenter {
  static toHttp(
    data: VehicleRepository.PaginatedListOutput,
  ): VehiclePaginatedListResponse {
    return {
      vehicles: data.vehicles.map((vehicle) => ({
        id: vehicle.id,
        plate: vehicle.plate,
        model: vehicle.model,
        brand: vehicle.brand,
        year: vehicle.year,
        chassisNumber: vehicle.chassis,
        proprietary: vehicle.proprietary,
        createdAt: vehicle.createdAt,
        status: this.getStatus(vehicle.lastInvoice?.status),
        lastSurveyDate: vehicle.lastInvoice?.createdAt,
      })),
      total: data.total,
    };
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
        return 'PENDENTE';
    }
  }
}
