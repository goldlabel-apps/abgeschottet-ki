// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/routes/db/schema.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const schemaRouter = Router();

// GET /db/schema
schemaRouter.get('/', (req: Request, res: Response) => {
  try {
    // Get all tables (ignore SQLite internal ones)
    const tables = db
      .prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
      )
      .all()
      .map((row: any) => row.name);

    // Build schema info
    const schema: Record<string, any[]> = {};
    for (const table of tables) {
      schema[table] = db.prepare(`PRAGMA table_info(${table})`).all();
    }

    res.json({
      ...header,
      tables,
      schema,
    });
  } catch (err: any) {
    console.error('Error in /db/schema:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
});

export default schemaRouter;
