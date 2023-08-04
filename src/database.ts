import sqlite3 from 'sqlite3';
import fs from 'fs';

const dbFile = './database.db';
const schemaFile = './src/schema.json';

export async function buildSchema() {
  const db = new sqlite3.Database(dbFile);

  try {
    const schemaData = fs.readFileSync(schemaFile, 'utf8');
    const schema = JSON.parse(schemaData);

    for (const tableName in schema) {
      if (schema.hasOwnProperty(tableName)) {
        const tableDefinition = schema[tableName];
        const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${tableDefinition})`;

        db.run(createTableQuery, (err: any) => {
          if (err) {
            console.error(`Error creating table "${tableName}":`, err.message);
          } else {
            console.log(`Table "${tableName}" created successfully.`);
          }
        });
      }
    }
  } catch (err: any) {
    console.error('Error initializing database schema:', err.message);
  } finally {
    db.close();
  }
}
