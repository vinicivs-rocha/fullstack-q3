import { SurveyorModel } from 'src/surveyor/abstractions/models/surveyor.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class SurveyorSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await factoryManager.get(SurveyorModel).save({
      email: 'john.doe@example.com',
      password: '123456',
    });
  }
}
