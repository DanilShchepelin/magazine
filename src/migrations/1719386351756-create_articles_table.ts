import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateArticlesTable1719386351756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'articles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            comment: 'Уникальный идентификатор статьи',
          },
          {
            name: 'title',
            type: 'varchar',
            comment: 'Заголовок статьи',
          },
          {
            name: 'description',
            type: 'text',
            comment: 'Описание статьи',
          },
          {
            name: 'published',
            type: 'boolean',
            default: false,
            comment: 'Флаг опубликована ли статья',
          },
          {
            name: 'publishedAt',
            type: 'timestamptz',
            isNullable: true,
            comment: 'Дата публикации',
          },
          {
            name: 'authorId',
            type: 'int',
            isNullable: true,
            comment: 'Уникальный идентификатор автора статьи',
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
            comment: 'Дата создания',
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
            comment: 'ЧПУ',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
            comment: 'Дата последнего обновления',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'articles',
      new TableIndex({
        name: 'IDX_SLUG',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
      'articles',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('articles');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('authorId') !== -1);
    await queryRunner.dropForeignKey('articles', foreignKey);
    await queryRunner.dropIndex('articles', 'IDX_SLUG');
    await queryRunner.dropTable('articles');
  }
}
