import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

export function initDB(db: Database.Database) {
  const dbPath = (db as any).name; // better-sqlite3 stores the filename in .name

  const alreadyExists = fs.existsSync(dbPath);

  if (!alreadyExists) {
    console.log(`[initDB] Database did not exist. Creating tables…`);

    db.exec(`
      CREATE TABLE pdfs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ✅ insert into the pdfs table we just created
    const stmt = db.prepare(`INSERT INTO pdfs (name) VALUES (?)`);
    stmt.run('Hello from initDB');

    console.log(`[initDB] Table created and test record inserted.`);
  } else {
    console.log(`[initDB] Database already exists. Skipping init.`);
  }
}
