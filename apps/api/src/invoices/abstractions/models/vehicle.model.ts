import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { InvoiceModel } from './invoice.model';
import type { FuelType } from '@fullstack-q3/contracts';

export class ProprietaryModel {
  @Column()
  name!: string;

  @Column()
  email!: string;
}

@Entity({ name: 'vehicles' })
export class VehicleModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  plate!: string;

  @Column()
  model!: string;

  @Column()
  brand!: string;

  @Column()
  year!: number;

  @Column()
  chassis!: string;

  @Column()
  color!: string;

  @Column({
    type: 'enum',
    enum: ['GASOLINA', 'ETANOL', 'FLEX', 'DIESEL', 'ELETRICO', 'HIBRIDO'],
  })
  fuelType!: FuelType;

  @Column({ nullable: true })
  mileage?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column(() => ProprietaryModel, { prefix: 'proprietary' })
  proprietary!: ProprietaryModel;

  lastInvoice?: InvoiceModel;

  @OneToMany(() => InvoiceModel, (invoice) => invoice.vehicle)
  invoices!: InvoiceModel[];
}
