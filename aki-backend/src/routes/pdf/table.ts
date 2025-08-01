// abgeschottet-ki/aki-backend/src/routes/pdf/table.ts

import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const createRouter = Router();
const tableName = 'pdfs';

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS "pdfs" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "created" INTEGER,
    "updated" INTEGER,
    "label" TEXT,
    "slug" TEXT,
    "filename" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "mimeType" TEXT,
    "destination" TEXT,
    "thumbnail" TEXT,
    "fileNameOnDisk" TEXT,
    "fullPath" TEXT,
    "rawText" BLOB DEFAULT NULL
  );
`;

// GET /pdf/table — all rows
createRouter.get('/', (req: Request, res: Response) => {
  try {
    db.prepare(createTableSQL).run();

    const schema = db.prepare(`PRAGMA table_info(${tableName})`).all();
    const rowCount = (db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get() as { count: number }).count;
    const rows = db.prepare(`SELECT * FROM ${tableName}`).all();

    return res.json({
      ...header,
      severity: 'success',
      title: `PDFs`,
      message: `Table "${tableName}" queried successfully`,
      table: tableName,
      schema,
      rowCount,
      rows,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[pdf/table] Error:`, error);
    return res.status(500).json({
      ...header,
      severity: 'error',
      title: 'PDF Table Error',
      message: error.message || 'Internal server error',
    });
  }
});

// GET /pdf/table/:id — single row by ID
createRouter.get('/:id', (req: Request, res: Response) => {
  try {
    db.prepare(createTableSQL).run();

    const schema = db.prepare(`PRAGMA table_info(${tableName})`).all();
    const rowCount = (db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get() as { count: number }).count;
    const id = req.params.id;
    const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);

    if (row) {
      return res.json({
        ...header,
        severity: 'success',
        title: `PDFs → Row ${id}`,
        message: `Row ${id} retrieved successfully`,
        row,
        schema,
        rowCount,
      });
    } else {
      return res.json({
        ...header,
        severity: 'warning',
        title: `PDFs → Row ${id}`,
        message: `Row ${id} not found`,
        schema,
        rowCount,
      });
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[pdf/table/:id] Error:`, error);
    return res.status(500).json({
      ...header,
      severity: 'error',
      title: 'PDF Table Error',
      message: error.message || 'Internal server error',
    });
  }
});

export default createRouter;
