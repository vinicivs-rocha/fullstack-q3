import "reflect-metadata";
import { Container } from "inversify";
import axios, { AxiosInstance } from "axios";
import { AuthService } from "@/services/auth.service";
import { InvoiceService } from "@/services/invoices.service";
import { TYPES } from "./di-types";
import { setupAxiosInterceptors } from "./axios-interceptors";
import { VehicleService } from "@/services/vehicle.service";
import { ProblemsService } from "@/services/problems.service";
import { ReportsService } from "@/services/reports.service";
import { SurveyorsService } from "@/services/surveyors.service";

const container = new Container();

container
  .bind<AxiosInstance>(TYPES.Axios)
  .toResolvedValue(() => {
    const axiosInstance = axios.create({
      baseURL: process.env.API_URL || "http://localhost:3001",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return setupAxiosInterceptors(axiosInstance);
  })
  .inSingletonScope();

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<InvoiceService>(TYPES.InvoiceService).to(InvoiceService);
container.bind<VehicleService>(TYPES.VehicleService).to(VehicleService);
container.bind<ProblemsService>(TYPES.ProblemsService).to(ProblemsService);
container.bind<ReportsService>(TYPES.ReportsService).to(ReportsService);
container.bind<SurveyorsService>(TYPES.SurveyorsService).to(SurveyorsService);

export { container };
