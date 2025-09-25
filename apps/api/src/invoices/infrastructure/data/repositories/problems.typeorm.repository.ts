import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblemModel } from 'src/invoices/abstractions/models/problem.model';
import { ProblemRepository } from 'src/invoices/abstractions/repositories/problem.repository';

@Injectable()
export class ProblemsTypeormRepository implements ProblemRepository {
  constructor(
    @InjectRepository(ProblemModel)
    private readonly problemRepository: Repository<ProblemModel>,
  ) {}

  async findAll(): Promise<ProblemModel[]> {
    return this.problemRepository.find({
      select: {
        id: true,
        label: true,
      },
    });
  }
}
