import { ProblemsListResponse } from '@fullstack-q3/contracts';
import { ProblemModel } from 'src/invoices/abstractions/models/problem.model';

export class ListProblemsPresenter {
  static toHttp(problems: ProblemModel[]): ProblemsListResponse {
    return problems.map((problem) => ({
      id: problem.id,
      label: problem.label,
    }));
  }
}
