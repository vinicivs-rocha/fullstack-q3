import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceModel } from './invoice.model';

@Entity({ name: 'problems' })
export class ProblemModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  label!: string;

  @ManyToMany(() => InvoiceModel, (invoice) => invoice.problems)
  @JoinTable({
    name: 'invoice_problem',
    joinColumn: {
      name: 'problemId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'invoiceId',
      referencedColumnName: 'id',
    },
  })
  invoices!: InvoiceModel[];
}
