import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneAndLicenseToSurveyorTable1758719001000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "surveyors" 
            ADD COLUMN "phone" varchar NOT NULL,
            ADD COLUMN "license" varchar NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "surveyors" 
            DROP COLUMN "phone",
            DROP COLUMN "license"
        `);
  }
}
