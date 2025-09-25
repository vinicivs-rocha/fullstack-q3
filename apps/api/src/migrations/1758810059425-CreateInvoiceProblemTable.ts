import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateInvoiceProblemTable1758810059425
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoice_problem',
        columns: [
          {
            name: 'invoiceId',
            type: 'int',
          },
          {
            name: 'problemId',
            type: 'int',
          },
        ],
        indices: [
          {
            name: 'idx_invoice_problem_invoice',
            columnNames: ['invoiceId'],
          },
          {
            name: 'idx_invoice_problem_problem',
            columnNames: ['problemId'],
          },
        ],
      }),
      true,
    );

    // Adicionar foreign keys
    await queryRunner.createForeignKey(
      'invoice_problem',
      new TableForeignKey({
        columnNames: ['invoiceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'invoices',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'invoice_problem',
      new TableForeignKey({
        columnNames: ['problemId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'problems',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoice_problem');
  }
}
