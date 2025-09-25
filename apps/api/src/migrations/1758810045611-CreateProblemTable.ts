import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProblemTable1758810045611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'problems',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'label',
            type: 'varchar',
            length: '255',
          },
        ],
        indices: [
          {
            name: 'idx_problem_label',
            columnNames: ['label'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('problems');
  }
}
