// pdf-smash/src/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve path relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../../database/abgeschottet-ki.db'));

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

export function insertPdf(filename: string, filesize: number, rawText: string | null, error: string | null) {
  const stmt = db.prepare(`
    INSERT INTO pdfs (filename, filesize, rawText, error) VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(filename, filesize, rawText, error);
  return info.lastInsertRowid as number;
}

export default db;
