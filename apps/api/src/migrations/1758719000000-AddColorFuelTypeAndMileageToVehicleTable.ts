import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColorFuelTypeAndMileageToVehicleTable1758719000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "vehicles" 
            ADD COLUMN "color" varchar NOT NULL,
            ADD COLUMN "fuelType" varchar NOT NULL,
            ADD COLUMN "mileage" int
        `);

    await queryRunner.query(`
            ALTER TABLE "vehicles" 
            ADD CONSTRAINT "CHK_vehicle_fuelType" CHECK ("fuelType" IN ('GASOLINA', 'ETANOL', 'FLEX', 'DIESEL', 'ELETRICO', 'HIBRIDO'))
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "vehicles" 
            DROP CONSTRAINT "CHK_vehicle_fuelType"
        `);

    await queryRunner.query(`
            ALTER TABLE "vehicles" 
            DROP COLUMN "color",
            DROP COLUMN "fuelType",
            DROP COLUMN "mileage"
        `);
  }
}
