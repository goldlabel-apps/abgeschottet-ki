import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const updateRouter = Router();

/**
 * GET /log/update
 * Let clients know they need to specify an ID.
 */
updateRouter.get('/', (_req: Request, res: Response) => {
  return res.status(400).json({
    ...header,
    severity: 'info',
    title: 'To update a log, use PATCH /log/update/:id',
    hint: {
      method: 'PATCH',
      url: '/log/update/:id',
      bodyExample: {
        title: 'Updated title',
        description: 'Updated description'
      }
    }
  });
});

/**
 * PATCH /log/update
 * No ID provided – return a helpful message.
 */
updateRouter.patch('/', (_req: Request, res: Response) => {
  return res.status(400).json({
    ...header,
    severity: 'error',
    title: 'Missing log ID in URL',
    hint: 'Use PATCH /log/update/:id with a JSON body containing fields to update.'
  });
});

/**
 * PATCH /log/update/:id
 * Updates specific fields of an existing log entry.
 */
updateRouter.patch('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`Patching log ${id}`);
  try {
    const { severity, title, description, data } = req.body || {};
    const now = Date.now();

    const updates: string[] = [];
    const values: any[] = [];

    if (severity !== undefined) {
      updates.push('severity = ?');
      values.push(severity);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (data !== undefined) {
      updates.push('data = ?');
      values.push(JSON.stringify(data));
    }

    // Always update `updated`
    updates.push('updated = ?');
    values.push(now);

    if (updates.length === 0) {
      return res.status(400).json({
        ...header,
        severity: 'error',
        title: 'No fields provided to update',
      });
    }

    // Add id for WHERE clause
    values.push(id);

    const sql = `UPDATE log SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    const info = stmt.run(...values);

    if (info.changes === 0) {
      return res.status(404).json({
        ...header,
        severity: 'error',
        title: `Log with id ${id} not found`,
      });
    }

    return res.json({
      ...header,
      severity: 'success',
      title: `Log ${id} updated`,
      data: info.changes,
    });
  } catch (err: any) {
    console.error(`[log/update] Error:`, err);
    return res.status(500).json({
      ...header,
      severity: 'error',
      title: 'Failed to update log',
      data: {
        error: err.message || 'Internal server error',
      },
    });
  }
});

export default updateRouter;
