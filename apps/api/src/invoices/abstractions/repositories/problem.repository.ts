import { ProblemModel } from '../models/problem.model';

export abstract class ProblemRepository {
  abstract findAll(): Promise<ProblemModel[]>;
}
