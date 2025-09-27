import { Module } from '@nestjs/common';
import { ReportsController } from './api/controllers/reports.controller';
import { ReportsTypeormRepository } from './infrasctructure/data/repositories/reports.typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceModel } from 'src/invoices/abstractions/models/invoice.model';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceModel])],
  controllers: [ReportsController],
  providers: [ReportsTypeormRepository],
})
export class ReportsModule {}
