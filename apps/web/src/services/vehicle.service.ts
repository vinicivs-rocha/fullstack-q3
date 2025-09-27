import { inject, injectable } from "inversify";
import { TYPES } from "@/lib/di-types";
import { Axios } from "axios";
import {
  VehicleBrandsResponse,
  VehicleCountsResponse,
  VehicleCreationData,
  VehicleDetailsResponse,
  VehicleListResponse,
  VehiclePaginatedListFilters,
  VehiclePaginatedListResponse,
  VehicleUpdatingData,
  VehicleYearsResponse,
} from "@fullstack-q3/contracts";

@injectable()
export class VehicleService {
  constructor(@inject(TYPES.Axios) private httpClient: Axios) {}

  async list(): Promise<VehicleListResponse> {
    const response =
      await this.httpClient.get<VehicleListResponse>("/vehicles");
    return response.data;
  }

  async paginatedList(
    filters: VehiclePaginatedListFilters,
  ): Promise<VehiclePaginatedListResponse> {
    const response = await this.httpClient.get<VehiclePaginatedListResponse>(
      "/vehicles/paginated",
      { params: filters },
    );
    return response.data;
  }

  async listBrands(): Promise<VehicleBrandsResponse> {
    const response =
      await this.httpClient.get<VehicleBrandsResponse>("/vehicles/brands");
    return response.data;
  }

  async listYears(): Promise<VehicleYearsResponse> {
    const response =
      await this.httpClient.get<VehicleYearsResponse>("/vehicles/years");
    return response.data;
  }

  async getCounts(): Promise<VehicleCountsResponse> {
    const response =
      await this.httpClient.get<VehicleCountsResponse>("/vehicles/counts");
    return response.data;
  }

  async detail(id: number): Promise<VehicleDetailsResponse> {
    const response = await this.httpClient.get<VehicleDetailsResponse>(
      `/vehicles/${id}`,
    );
    return response.data;
  }

  async create(vehicle: VehicleCreationData): Promise<VehicleDetailsResponse> {
    const response = await this.httpClient.post<VehicleDetailsResponse>(
      "/vehicles",
      vehicle,
    );
    return response.data;
  }

  async update(
    id: number,
    vehicle: VehicleUpdatingData,
  ): Promise<VehicleDetailsResponse> {
    const response = await this.httpClient.put<VehicleDetailsResponse>(
      `/vehicles/${id}`,
      vehicle,
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.httpClient.delete<void>(`/vehicles/${id}`);
  }
}
