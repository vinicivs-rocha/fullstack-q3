import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceModel } from './abstractions/models/invoice.model';
import { InvoiceTypeormRepository } from './infrastructure/data/repositories/invoice.typeorm.repository';
import { InvoicesController } from './api/controllers/invoices.controller';
import { VehicleModel } from './abstractions/models/vehicle.model';
import { ProblemModel } from './abstractions/models/problem.model';
import { VehicleTypeormRepository } from './infrastructure/data/repositories/vehicle.typeorm.repository';
import { ProblemsTypeormRepository } from './infrastructure/data/repositories/problems.typeorm.repository';
import { VehiclesController } from './api/controllers/vehicles.controller';
import { ProblemsController } from './api/controllers/problems.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceModel, VehicleModel, ProblemModel]),
  ],
  providers: [
    InvoiceTypeormRepository,
    VehicleTypeormRepository,
    ProblemsTypeormRepository,
  ],
  controllers: [InvoicesController, VehiclesController, ProblemsController],
})
export class InvoicesModule {}
