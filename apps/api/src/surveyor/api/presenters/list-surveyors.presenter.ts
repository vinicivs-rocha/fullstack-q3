import { SurveyorListResponse } from '@fullstack-q3/contracts';
import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';

export class ListSurveyorsPresenter {
  static toHttp(surveyors: SurveyorModel[]): SurveyorListResponse {
    return surveyors.map((surveyor) => ({
      id: surveyor.id,
      name: surveyor.name,
    }));
  }
}
