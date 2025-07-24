// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/lib/db.ts
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

// Target directory for the database
// This will resolve to: /abgeschottet-ki/db
const dbDir = path.resolve(process.cwd(), '..', 'db');

// Ensure the directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Full path to the SQLite database file
// Final file: /abgeschottet-ki/db/abgeschottet-ki.db
const dbPath = path.join(dbDir, 'abgeschottet-ki.db');

// Open (or create) the database
export const db = new Database(dbPath);

// Ensure the `pdfs` table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS pdfs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filesize INTEGER NOT NULL,
    text TEXT,
    error TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert a processed PDF record
export function insertPdf(
  filename: string,
  filesize: number,
  text: string | null,
  error: string | null
): number {
  const stmt = db.prepare(
    'INSERT INTO pdfs (filename, filesize, text, error) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(filename, filesize, text, error);
  return info.lastInsertRowid as number;
}

// Get all stored PDF records
export function getAllPdfs() {
  const stmt = db.prepare('SELECT * FROM pdfs ORDER BY id DESC');
  return stmt.all(); // returns an array of rows
}
