import { type InvoiceStatus } from '@fullstack-q3/contracts';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleModel } from './vehicle.model';
import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';

@Entity({ name: 'invoices' })
export class InvoiceModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ enum: ['PENDENTE', 'APROVADA', 'REPROVADA'], default: 'PENDENTE' })
  status!: InvoiceStatus;

  @Column({ type: 'text', nullable: true })
  observation?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  duration!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => SurveyorModel, (surveyor) => surveyor.invoices)
  surveyor!: SurveyorModel;

  @ManyToOne(() => VehicleModel, (vehicle) => vehicle.invoices)
  vehicle!: VehicleModel;
}
