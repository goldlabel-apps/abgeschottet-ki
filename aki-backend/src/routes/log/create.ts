// aki/aki-backend/src/routes/log/create.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const createRouter = Router();

/**
 * GET /log
 * This endpoint is not for retrieving logs.
 * Instructs clients to use POST instead.
 */
createRouter.get('/', (_req: Request, res: Response) => {
  return res.json({
    ...header,
    severity: 'info',
    title: 'To create a log entry, please use POST /log with JSON body.',
    hint: {
      method: 'POST',
      url: '/log',
      bodyExample: {
        severity: 'info',
        title: 'Some title',
        description: 'Some description',
        data: { foo: 'bar' }
      }
    }
  });
});

/**
 * POST /log
 * Creates a new log entry in the database.
 * Expects JSON body with: severity, title, description, and optionally data (object or string)
 */
createRouter.post('/', (req: Request, res: Response) => {
  const tableName = 'log';

  try {
    const {
      severity = 'info',
      title = '(no title)',
      description = '',
      data = null,
    } = req.body || {};

    const now = Date.now();

    // Prepare and run the insert statement
    const stmt = db.prepare(
      `INSERT INTO ${tableName} (created, updated, severity, title, description, data)
       VALUES (?, ?, ?, ?, ?, ?)`
    );

    const info = stmt.run(
      now,
      now,
      severity,
      title,
      description,
      data ? JSON.stringify(data) : null
    );

    const lastInsertRowid = info.lastInsertRowid;

    return res.json({
      ...header,
      severity: 'success',
      title: `${title} log saved`,
      data: {
        id: lastInsertRowid,
      },
    });
  } catch (err: any) {
    console.error(`[log/create] Error:`, err);
    return res.status(500).json({
      ...header,
      severity: 'error',
      title: 'Failed to create log',
      error: err.message || 'Internal server error',
    });
  }
});

export default createRouter;
