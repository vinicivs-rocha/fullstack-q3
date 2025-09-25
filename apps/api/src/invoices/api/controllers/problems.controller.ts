import { Controller, Inject, Get } from '@nestjs/common';
import { ProblemsTypeormRepository } from 'src/invoices/infrastructure/data/repositories/problems.typeorm.repository';
import { ProblemsListResponse } from '@fullstack-q3/contracts';
import { ProblemRepository } from 'src/invoices/abstractions/repositories/problem.repository';
import { ListProblemsPresenter } from '../presenters/list-problems.presenter';

@Controller('problems')
export class ProblemsController {
  constructor(
    @Inject(ProblemsTypeormRepository)
    private readonly problemsRepository: ProblemRepository,
  ) {}

  @Get()
  async findAll(): Promise<ProblemsListResponse> {
    return ListProblemsPresenter.toHttp(
      await this.problemsRepository.findAll(),
    );
  }
}
