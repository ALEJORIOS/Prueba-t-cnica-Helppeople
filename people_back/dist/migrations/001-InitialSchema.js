"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1234567890 = void 0;
const fs = require("fs");
const path = require("path");
class InitialSchema1234567890 {
    async up(queryRunner) {
        const sql = fs.readFileSync(path.join(__dirname, '../../../sql/full_initial_schema.sql'), 'utf8');
        const statements = sql
            .split(/\bGO\b/gi)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        for (const statement of statements) {
            console.log('Executing SQL statement:', statement);
            await queryRunner.query(statement);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`
        DROP TABLE IF EXISTS Catalog.Categories;
        DROP TABLE IF EXISTS Catalog.Products;
    `);
    }
}
exports.InitialSchema1234567890 = InitialSchema1234567890;
//# sourceMappingURL=001-InitialSchema.js.map