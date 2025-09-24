import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { InvoiceModel } from './invoice.model';

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

  @CreateDateColumn()
  createdAt!: Date;

  @Column(() => ProprietaryModel, { prefix: 'proprietary' })
  proprietary!: ProprietaryModel;

  lastInvoice?: InvoiceModel;

  @OneToMany(() => InvoiceModel, (invoice) => invoice.vehicle)
  invoices!: InvoiceModel[];
}
