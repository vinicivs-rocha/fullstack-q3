import { InvoicesListResponse } from '@fullstack-q3/contracts';
import { InvoiceRepository } from 'src/invoices/abstractions/repositories/invoice.repository';

export class ListInvoicesPresenter {
  static toHttp({
    invoices,
    total,
  }: InvoiceRepository.FindAllResponse): InvoicesListResponse {
    return {
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        status: invoice.status,
        createdAt: invoice.createdAt.toISOString(),
        vehicle: {
          id: invoice.vehicle.id,
          plate: invoice.vehicle.plate,
          model: invoice.vehicle.model,
          brand: invoice.vehicle.brand,
          year: invoice.vehicle.year,
        },
        surveyor: {
          name: invoice.surveyor.name,
          gender: invoice.surveyor.gender,
        },
      })),
      total,
    };
  }
}
