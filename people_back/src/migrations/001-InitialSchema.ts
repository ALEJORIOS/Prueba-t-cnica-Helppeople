import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class InitialSchema1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = fs.readFileSync(
      path.join(__dirname, '../../../sql/full_initial_schema.sql'),
      'utf8',
    );

    const statements = sql
      .split(/\bGO\b/gi)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      console.log('Executing SQL statement:', statement);
      await queryRunner.query(statement);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS Catalog.Categories;
        DROP TABLE IF EXISTS Catalog.Products;
    `);
  }
}
