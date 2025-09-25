import { InvoiceStatus } from '@fullstack-q3/contracts';
import { InvoiceModel } from '../models/invoice.model';

export abstract class InvoiceRepository {
  abstract count(filters: InvoiceRepository.CountFilters): Promise<number>;
  abstract findAll(
    filters: InvoiceRepository.FindAllFilters,
  ): Promise<InvoiceRepository.FindAllResponse>;
  abstract detail(id: number): Promise<InvoiceModel>;
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
}
