import { InvoiceModel } from 'src/invoices/abstractions/models/invoice.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'surveyors',
})
export class SurveyorModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ enum: ['M', 'F'] })
  gender!: 'M' | 'F';

  @Column()
  phone!: string;

  @Column()
  license!: string;

  @Column()
  password!: string;

  @OneToMany(() => InvoiceModel, (invoice) => invoice.surveyor)
  invoices!: InvoiceModel[];
}
