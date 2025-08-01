import fs from 'fs';
import Database from 'better-sqlite3';

export function initDB(db: Database.Database) {
  const dbPath = (db as any).name; // better-sqlite3 stores the filename in .name

  const alreadyExists = fs.existsSync(dbPath);

  if (!alreadyExists) {
    console.log(`[initDB] Database did not exist. Creating tables…`);

    db.exec(`
      CREATE TABLE IF NOT EXISTS "pdfs" (
        "id"	INTEGER,
        "created"	INTEGER,
        "updated"	INTEGER,
        "label"	TEXT,
        "slug"	TEXT,
        "filename"	TEXT NOT NULL,
        "filesize"	INTEGER NOT NULL,
        "text"	TEXT,
        "mimeType"	TEXT,
        "destination"	TEXT,
        "thumbnail"	TEXT,
        "fileNameOnDisk"	TEXT,
        "fullPath"	TEXT,
        "rawText"	BLOB DEFAULT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
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
