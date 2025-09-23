import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSurveyorTable1700000000000 implements MigrationInterface {
  name = 'CreateSurveyorTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'surveyors',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
        ],
        indices: [
          {
            name: 'idx_surveyors_email',
            columnNames: ['email'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('surveyors');
  }
}
