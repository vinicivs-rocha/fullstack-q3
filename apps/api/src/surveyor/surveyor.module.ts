import { Module } from '@nestjs/common';
import { SurveyorPasswordHashingSubscriber } from './infrastructure/data/subscribers/surveyor-password-hashing.subscriber';
import { SurveyorController } from './api/controllers/surveyor.controller';
import { SurveyorTypeormRepository } from './infrastructure/data/repositories/surveyor.typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyorModel } from './abstractions/models/surveyor.model';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyorModel])],
  providers: [SurveyorPasswordHashingSubscriber, SurveyorTypeormRepository],
  controllers: [SurveyorController],
})
export class SurveyorModule {}
