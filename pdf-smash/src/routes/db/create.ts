// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/routes/db/create.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const createRouter = Router();

createRouter.post('/', (req: Request, res: Response) => {
  try {
    const { table, data } = req.body;

    if (!table || typeof table !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing or invalid table name.' });
    }
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, error: 'Missing or invalid data object.' });
    }

    const keys = Object.keys(data);
    if (keys.length === 0) {
      return res.status(400).json({ success: false, error: 'No columns provided in data object.' });
    }

    const placeholders = keys.map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
    const values = keys.map((k) => data[k]);

    const result = db.prepare(sql).run(values);

    res.json({
      ...header,
      table,
      insertedId: result.lastInsertRowid, // ✅ correct property
      data,
    });
  } catch (err: any) {
    console.error('Error in /db/create:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
});

export default createRouter;
