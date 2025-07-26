// /Users/goldlabel/GitHub/abgeschottet-ki/aki-backend/src/routes/log/index.ts

import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';
import createRouter from './create';
import updateRouter from './update';

const router = Router();

/**
 * GET /log
 * Returns all rows from the log table.
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const tableName = 'log';
    const sql = `SELECT * FROM ${tableName} ORDER BY updated DESC`;
    const rows = db.prepare(sql).all();

    res.json({
      ...header,
      severity: 'success',
      title: `All records in ${tableName}`,
      description: `Total ${rows.length}`,
      data: {
        count: rows.length,
        rows,
      }
    });
  } catch (err: any) {
    console.error(`[log/index] Error:`, err);
    res.status(500).json({
      ...header,
      severity: 'error',
      title: 'Error reading logs',
      data: {
        error: err.message || 'Internal server error',
      }
    });
  }
});

router.use('/create', createRouter);
router.use('/update', updateRouter);

export default router;
