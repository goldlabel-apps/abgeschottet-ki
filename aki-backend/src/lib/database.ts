// /Users/goldlabel/GitHub/abgeschottet-ki/aki-backend/src/lib/database.ts

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { initDB } from './sql/initDB';

const dbDir = path.resolve(process.cwd(), '..');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'aki.db');

export const db = new Database(dbPath);

initDB(db);
