import { TYPES } from "@/lib/di-types";
import { ProblemsListResponse } from "@fullstack-q3/contracts";
import { Axios } from "axios";
import { inject, injectable } from "inversify";

@injectable()
export class ProblemsService {
  constructor(
    @inject(TYPES.Axios) private httpClient: Axios,
  ) {}

  async list(): Promise<ProblemsListResponse> {
    const response = await this.httpClient.get<ProblemsListResponse>('/problems');
    return response.data;
  }
}