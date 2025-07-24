// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/lib/databaseb.ts

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { initDB } from './sql/initDB';

// Resolve to one level up
const dbDir = path.resolve(process.cwd(), '..');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'abgeschottet-ki.db');

// Open the database (it may or may not exist yet)
export const db = new Database(dbPath);

// Run init script (will create database if needed)
initDB(db);
