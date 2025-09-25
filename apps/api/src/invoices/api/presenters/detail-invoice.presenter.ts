import { DetailedInvoiceResponse } from '@fullstack-q3/contracts';
import { InvoiceModel } from 'src/invoices/abstractions/models/invoice.model';

export class DetailInvoicePresenter {
  static toHttp(invoice: InvoiceModel): DetailedInvoiceResponse {
    return {
      id: invoice.id,
      vehicle: {
        id: invoice.vehicle.id,
        plate: invoice.vehicle.plate,
        model: invoice.vehicle.model,
        brand: invoice.vehicle.brand,
        year: invoice.vehicle.year,
        color: invoice.vehicle.color,
        chassisNumber: invoice.vehicle.chassis,
        fuelType: invoice.vehicle.fuelType,
        mileage: invoice.vehicle.mileage,
      },
      surveyor: {
        id: invoice.surveyor.id,
        name: invoice.surveyor.name,
        gender: invoice.surveyor.gender,
        email: invoice.surveyor.email,
        phone: invoice.surveyor.phone,
        license: invoice.surveyor.license,
      },
      status: invoice.status,
      createdAt: invoice.createdAt,
      observation: invoice.observation,
      price: invoice.price,
      duration: invoice.duration,
      problems: invoice.problems.map((problem) => ({
        id: problem.id,
        label: problem.label,
      })),
    };
  }
}
