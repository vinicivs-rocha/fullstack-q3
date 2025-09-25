import { inject, injectable } from "inversify";
import { TYPES } from "@/lib/di-types";
import { Axios } from "axios";
import { VehicleListResponse } from "@fullstack-q3/contracts"; 

@injectable()   
export class VehicleService {
  constructor(
    @inject(TYPES.Axios) private httpClient: Axios,
  ) {}

  async list(): Promise<VehicleListResponse> {
    const response = await this.httpClient.get<VehicleListResponse>('/vehicles');
    return response.data;
  }
}