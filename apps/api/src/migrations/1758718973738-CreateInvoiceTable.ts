import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateInvoiceTable1758718973738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDENTE', 'APROVADA', 'REPROVADA'],
            default: "'PENDENTE'",
          },
          {
            name: 'observation',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'duration',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'surveyorId',
            type: 'int',
          },
          {
            name: 'vehicleId',
            type: 'int',
          },
        ],
        indices: [
          {
            name: 'idx_invoices_status',
            columnNames: ['status'],
          },
          {
            name: 'idx_invoices_surveyor',
            columnNames: ['surveyorId'],
          },
          {
            name: 'idx_invoices_vehicle',
            columnNames: ['vehicleId'],
          },
        ],
      }),
      true,
    );

    // Adicionar foreign keys
    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['surveyorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'surveyors',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['vehicleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'vehicles',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoices');
  }
}
