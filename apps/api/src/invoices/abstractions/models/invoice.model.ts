import { type InvoiceStatus } from '@fullstack-q3/contracts';
import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProblemModel } from './problem.model';
import { VehicleModel } from './vehicle.model';

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

  @ManyToMany(() => ProblemModel, (problem) => problem.invoices)
  @JoinTable({
    name: 'invoice_problem',
    joinColumn: {
      name: 'invoiceId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'problemId',
      referencedColumnName: 'id',
    },
  })
  problems!: ProblemModel[];
}
