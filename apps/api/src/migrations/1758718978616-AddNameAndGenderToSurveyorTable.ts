import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameAndGenderToSurveyorTable1758718978616
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "surveyors" 
            ADD COLUMN "name" varchar NOT NULL,
            ADD COLUMN "gender" varchar(1) NOT NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "surveyors" 
            ADD CONSTRAINT "CHK_surveyor_gender" CHECK ("gender" IN ('M', 'F'))
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "surveyors" 
            DROP CONSTRAINT "CHK_surveyor_gender"
        `);

    await queryRunner.query(`
            ALTER TABLE "surveyors" 
            DROP COLUMN "name",
            DROP COLUMN "gender"
        `);
  }
}
