import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceModel } from './abstractions/models/invoice.model';
import { InvoiceTypeormRepository } from './infrastructure/data/repositories/invoice.typeorm.repository';
import { InvoicesController } from './api/controllers/invoices.controller';
import { VehicleModel } from './abstractions/models/vehicle.model';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceModel, VehicleModel])],
  providers: [InvoiceTypeormRepository],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
