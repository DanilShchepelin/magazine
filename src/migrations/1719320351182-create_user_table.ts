import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUserTable1719320351182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: 'Уникальный идентификатор пользователя',
          },
          {
            name: 'firstName',
            type: 'varchar',
            comment: 'Имя пользователя',
          },
          {
            name: 'lastName',
            type: 'varchar',
            comment: 'Фамилия пользователя',
          },
          {
            name: 'patronymic',
            type: 'varchar',
            isNullable: true,
            comment: 'Отчество пользователя',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            comment: 'Email пользователя',
          },
          {
            name: 'password',
            type: 'varchar',
            comment: 'Пароль пользователя',
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
            comment: 'Дата создания',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
            comment: 'Дата последнего обновления',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_EMAIL',
        columnNames: ['email'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_EMAIL');
    await queryRunner.dropTable('users');
  }
}
