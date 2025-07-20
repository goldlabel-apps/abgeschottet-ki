import path from 'path';
import Database from 'better-sqlite3';
import { NextResponse } from 'next/server';

export async function GET() {
  // resolve absolute path to the sqlite file
  const dbPath = path.resolve(process.cwd(), '../database/abgeschottet-ki.db');

  // open a connection
  const db = new Database(dbPath);

  // query sqlite_master for table names
  const tables = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    )
    .all();

  // close database (better-sqlite3 closes automatically on GC, but explicit is better)
  db.close();

  return NextResponse.json({
    time: Date.now(),
    tables,
  });
}
