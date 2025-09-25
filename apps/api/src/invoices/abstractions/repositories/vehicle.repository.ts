import { VehicleStatus } from '@fullstack-q3/contracts';
import { VehicleModel } from '../models/vehicle.model';

export abstract class VehicleRepository {
  abstract findAll(): Promise<VehicleModel[]>;
  abstract listBrands(): Promise<string[]>;
  abstract listYears(): Promise<number[]>;
  abstract count(filters: VehicleRepository.CountFilters): Promise<number>;
  abstract paginatedList(
    filters: VehicleRepository.PaginatedListFilters,
  ): Promise<VehicleRepository.PaginatedListOutput>;
}

export namespace VehicleRepository {
  export interface CountFilters {
    status?: VehicleStatus;
  }

  export interface PaginatedListFilters {
    status?: VehicleStatus;
    year?: number;
    brand?: string;
    search?: string;
    page: number;
    limit: number;
  }

  export interface PaginatedListOutput {
    vehicles: VehicleModel[];
    total: number;
  }
}
