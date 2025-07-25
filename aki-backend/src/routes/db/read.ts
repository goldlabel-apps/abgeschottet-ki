// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/routes/db/read.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const readRouter = Router();

/**
 * GET /db/read/table/:tableName
 * Returns:
 *  - all rows from the specified table
 *  - schema (columns) of the table
 */
readRouter.get('/table/:tableName', (req: Request, res: Response) => {
  try {
    const { tableName } = req.params;

    if (!tableName || typeof tableName !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid table name',
      });
    }

    // Fetch all rows
    const sql = `SELECT * FROM ${tableName}`;
    const rows = db.prepare(sql).all();

    // Fetch table info (PRAGMA)
    const rawSchema: any[] = db.prepare(`PRAGMA table_info(${tableName})`).all();

    // Map schema to a clean structure for frontend
    const schema = rawSchema.map((col) => ({
      name: col.name,                // column name
      type: col.type,                // SQLite type
      notNull: !!col.notnull,        // is NOT NULL
      defaultValue: col.dflt_value,  // default value if any
      primaryKey: col.pk === 1       // is part of primary key
    }));

    res.json({
      ...header,
      table: tableName,
      count: rows.length,
      rows,
      schema
    });
  } catch (err: any) {
    console.error('Error in /db/read/table/:tableName:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
});

export default readRouter;
