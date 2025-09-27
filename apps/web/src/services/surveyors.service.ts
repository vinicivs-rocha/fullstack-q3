import { TYPES } from "@/lib/di-types";
import { SurveyorListResponse } from "@fullstack-q3/contracts";
import { Axios } from "axios";
import { inject, injectable } from "inversify";

@injectable()
export class SurveyorsService {
  constructor(@inject(TYPES.Axios) private httpClient: Axios) {}

  async getSurveyors(): Promise<SurveyorListResponse> {
    const response = await this.httpClient.get("/surveyors");
    return response.data;
  }
}
