import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'surveyors',
})
export class SurveyorModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
