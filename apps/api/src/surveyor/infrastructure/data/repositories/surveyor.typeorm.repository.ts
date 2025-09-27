import { Injectable } from '@nestjs/common';
import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyorRepository } from 'src/surveyor/abstractions/repositories/surveyor.repository';

@Injectable()
export class SurveyorTypeormRepository implements SurveyorRepository {
  constructor(
    @InjectRepository(SurveyorModel)
    private readonly surveyorRepository: Repository<SurveyorModel>,
  ) {}

  async detail(id: number): Promise<SurveyorModel | null> {
    return this.surveyorRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async list(): Promise<SurveyorModel[]> {
    return this.surveyorRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
  }
}
