import path from 'path';
import Database from 'better-sqlite3';

// go up one folder from pdf-smash to the monorepo root, then into database
const dbPath = path.resolve(__dirname, '..', '..', 'database', 'abgeschottet-ki.db');
console.log('🔧 Opening SQLite database at:', dbPath);

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS pdfs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    filesize INTEGER,
    rawText TEXT,
    error TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

export function insertPdf(
  filename: string,
  filesize: number,
  rawText: string | null,
  error: string | null
) {
  const stmt = db.prepare(
    `INSERT INTO pdfs (filename, filesize, rawText, error) VALUES (?, ?, ?, ?)`
  );
  const info = stmt.run(filename, filesize, rawText, error);
  return info.lastInsertRowid as number;
}

export default db;
