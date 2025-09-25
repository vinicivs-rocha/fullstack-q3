import { MeResponse } from '@fullstack-q3/contracts';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { UserModel } from 'src/auth/abstractions/models/user.model';
import { User } from 'src/auth/api/decorators/user.decorator';
import { SurveyorJwtGuard } from 'src/auth/api/guards/surveyor.jwt.guard';
import { SurveyorRepository } from 'src/surveyor/abstractions/repositories/surveyor.repository';
import { SurveyorTypeormRepository } from 'src/surveyor/infrastructure/data/repositories/surveyor.typeorm.repository';

@Controller('surveyor')
export class SurveyorController {
  constructor(
    @Inject(SurveyorTypeormRepository)
    private readonly surveyorRepository: SurveyorRepository,
  ) {}

  @Get('me')
  @UseGuards(SurveyorJwtGuard)
  async me(@User() user: UserModel): Promise<MeResponse> {
    const surveyor = (await this.surveyorRepository.detail(user.id))!;

    return {
      id: surveyor.id,
      email: surveyor.email,
      name: surveyor.name,
    };
  }
}
