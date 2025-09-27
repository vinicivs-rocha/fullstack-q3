import { SurveyorModel } from '../models/surveyor.model';

export abstract class SurveyorRepository {
  abstract detail(id: number): Promise<SurveyorModel | null>;
  abstract list(): Promise<SurveyorModel[]>;
}
