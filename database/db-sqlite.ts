import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'fallmanager-dev.db');
const db = new Database(dbPath);

// Run migrations at startup (optional)
db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    fileName TEXT,
    uploadedAt INTEGER,
    summary TEXT,
    rawTextSeverity TEXT,
    rawTextProcessing INTEGER,
    step INTEGER
  );
`);

// Example query helpers
export function getAllFiles() {
  return db.prepare('SELECT * FROM files').all();
}

export function insertFile(file: {
  id: string;
  fileName: string;
  uploadedAt: number;
  summary?: string;
  rawTextSeverity?: string | null;
  rawTextProcessing?: boolean;
  step?: number;
}) {
  const stmt = db.prepare(`
    INSERT INTO files (id, fileName, uploadedAt, summary, rawTextSeverity, rawTextProcessing, step)
    VALUES (@id, @fileName, @uploadedAt, @summary, @rawTextSeverity, @rawTextProcessing, @step)
  `);
  stmt.run(file);
}
