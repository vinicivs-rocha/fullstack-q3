import { InvoiceStatus } from '@fullstack-q3/contracts';
import { InvoiceModel } from '../models/invoice.model';
import { ProblemModel } from '../models/problem.model';

export abstract class InvoiceRepository {
  abstract count(filters: InvoiceRepository.CountFilters): Promise<number>;
  abstract findAll(
    filters: InvoiceRepository.FindAllFilters,
  ): Promise<InvoiceRepository.FindAllResponse>;
  abstract detail(id: number): Promise<InvoiceModel>;
  abstract create(data: InvoiceRepository.CreateData): Promise<void>;
  abstract update(data: InvoiceRepository.UpdateData): Promise<void>;
}

export namespace InvoiceRepository {
  export interface CountFilters {
    status?: InvoiceStatus;
    start?: Date;
    end?: Date;
  }

  export interface FindAllFilters {
    status?: InvoiceStatus;
    start?: Date;
    end?: Date;
    search?: string;
    page: number;
    limit: number;
  }

  export interface FindAllResponse {
    invoices: InvoiceModel[];
    total: number;
  }

  export interface CreateData {
    vehicleId: number;
    surveyorId: number;
    problems: Partial<ProblemModel>[];
    status: InvoiceStatus;
    price: number;
    duration: number;
    observation?: string;
  }

  export interface UpdateData {
    id: number;
    vehicleId: number;
    problems: Partial<ProblemModel>[];
    status: InvoiceStatus;
    price: number;
    duration: number;
    observation?: string;
  }
}
