import { InvoiceModel } from 'src/invoices/abstractions/models/invoice.model';
import { VehicleModel } from 'src/invoices/abstractions/models/vehicle.model';
import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class InvoiceSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const invoiceRepository = dataSource.getRepository(InvoiceModel);

    const surveyors = await factoryManager.get(SurveyorModel).saveMany(2);
    const vehicles = await factoryManager.get(VehicleModel).saveMany(10);

    await invoiceRepository.save(
      await Promise.all(
        Array.from({ length: 20 }).map(() => {
          const randomSurveyor =
            surveyors[Math.floor(Math.random() * surveyors.length)];
          const randomVehicle =
            vehicles[Math.floor(Math.random() * vehicles.length)];

          const status = [
            'PENDENTE' as const,
            'APROVADA' as const,
            'REPROVADA' as const,
          ].at(Math.floor(Math.random() * 3));

          return factoryManager.get(InvoiceModel).make({
            status,
            surveyor: randomSurveyor,
            vehicle: randomVehicle,
          });
        }),
      ),
    );
  }
}
