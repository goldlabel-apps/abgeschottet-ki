// abgeschottet-ki/aki-backend/src/routes/pdf/read.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const createRouter = Router();

createRouter.get('/', (_req: Request, res: Response) => {
  const tableName = 'pdfs';
  const sql = `SELECT * FROM ${tableName}`;
  try {
    const rows = db.prepare(sql).all();
    res.json({
      ...header,
      severity: 'success',
      title: `PDFs`,
      message: `aki.db|${tableName}`,
      table: tableName,
      count: rows.length,
      rows,
    });
  } catch (err: any) {
    console.error(`[pdf/read] Error:`, err);
    res.status(500).json({
      ...header,
      severity: 'error',
      title: 'Failed to read PDFs',
      error: err.message || 'Internal server error',
    });
  }
});

export default createRouter;
