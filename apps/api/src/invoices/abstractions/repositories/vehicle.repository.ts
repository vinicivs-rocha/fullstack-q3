import { FuelType, VehicleStatus } from '@fullstack-q3/contracts';
import { VehicleModel } from '../models/vehicle.model';

export abstract class VehicleRepository {
  abstract findAll(): Promise<VehicleModel[]>;
  abstract listBrands(
    filters: VehicleRepository.ListBrandsFilters,
  ): Promise<string[]>;
  abstract listYears(
    filters: VehicleRepository.ListYearsFilters,
  ): Promise<number[]>;
  abstract count(filters: VehicleRepository.CountFilters): Promise<number>;
  abstract paginatedList(
    filters: VehicleRepository.PaginatedListFilters,
  ): Promise<VehicleRepository.PaginatedListOutput>;
  abstract detail(id: number): Promise<VehicleModel>;
  abstract create(data: VehicleRepository.CreateData): Promise<void>;
  abstract update(
    id: number,
    data: VehicleRepository.UpdateData,
  ): Promise<void>;
  abstract delete(id: number): Promise<void>;
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

  export interface ListBrandsFilters {
    status?: VehicleStatus;
    year?: number;
  }

  export interface ListYearsFilters {
    status?: VehicleStatus;
    brand?: string;
  }

  export interface CreateData {
    plate: string;
    year: number;
    brand: string;
    model: string;
    color: string;
    fuelType: FuelType;
    mileage?: number;
    chassis: string;
    proprietary: {
      name: string;
      email: string;
    };
  }

  export interface UpdateData {
    plate: string;
    year: number;
    brand: string;
    model: string;
    color: string;
    fuelType: FuelType;
    mileage?: number;
    chassis: string;
    proprietary: {
      name: string;
      email: string;
    };
  }
}
