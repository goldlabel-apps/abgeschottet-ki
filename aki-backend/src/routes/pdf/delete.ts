// abgeschottet-ki/aki-backend/src/routes/pdf/delete.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const createRouter = Router();

// GET route – warn user to use DELETE with an id
createRouter.get('/', (_req: Request, res: Response) => {
  return res.status(405).json({
    ...header,
    severity: 'error',
    title: 'Please use DELETE verb with an id on this route',
    data: { 
        hint: 'Example: DELETE /pdf/delete/123',
    },
  });
});

// DELETE route – delete by id
createRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = 'pdfs';

  try {
    // Check if record exists
    const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);

    if (!row) {
      return res.status(404).json({
        ...header,
        severity: 'error',
        title: `No PDF found with id ${id}`,
        data: { id },
      });
    }

    // Perform deletion
    const info = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);

    if (info.changes > 0) {
      return res.json({
        ...header,
        severity: 'success',
        title: `PDF with id ${id} deleted`,
        data: { id },
      });
    } else {
      return res.status(500).json({
        ...header,
        severity: 'error',
        title: `Failed to delete PDF with id ${id}`,
        data: { id },
      });
    }
  } catch (err: any) {
    console.error(`[pdf/delete] Error:`, err);
    return res.status(500).json({
      ...header,
      severity: 'error',
      title: 'Internal server error while deleting PDF',
      data: { error: err.message },
    });
  }
});

export default createRouter;
