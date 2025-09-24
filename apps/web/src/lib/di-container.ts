import "reflect-metadata";
import { Container } from "inversify";
import axios, { AxiosInstance } from "axios";
import { AuthService } from "@/services/auth.service";
import { InvoiceService } from "@/services/invoices.service";
import { TYPES } from "./di-types";
import { setupAxiosInterceptors } from "./axios-interceptors";

const container = new Container();

container.bind<AxiosInstance>(TYPES.Axios).toResolvedValue(
  () => {
    const axiosInstance = axios.create({
      baseURL: process.env.API_URL || "http://localhost:3001",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return setupAxiosInterceptors(axiosInstance);
  }
).inSingletonScope();

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<InvoiceService>(TYPES.InvoiceService).to(InvoiceService);

export { container };
