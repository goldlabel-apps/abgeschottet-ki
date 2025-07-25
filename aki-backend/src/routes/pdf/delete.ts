// abgeschottet-ki/aki-backend/src/routes/pdf/delete.ts
import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';
import path from 'path';
import fs from 'fs';

const createRouter = Router();

interface PDFRow {
  id: number;
  fileNameOnDisk: string;
  filesize?: number;
  text?: string;
  created_at?: string;
}

const uploadDir = path.resolve(
  __dirname,
  '../../../../aki-frontend/public/pdf/uploads'
);

createRouter.get('/', (_req: Request, res: Response) => {
  return res.status(405).json({
    ...header,
    severity: 'error',
    title: 'Please use DELETE verb with an id on this route',
    data: { hint: 'Example: DELETE /pdf/delete/123' },
  });
});

createRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const tableName = 'pdfs';

  try {
    
    const row = db
      .prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
      .get(id) as PDFRow | undefined;

    if (!row) {
      return res.status(404).json({
        ...header,
        severity: 'error',
        title: `No PDF found with id ${id}`,
        data: { id },
      });
    }

    if (row.fileNameOnDisk) {
      try {
        const filePath = path.join(uploadDir, row.fileNameOnDisk);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`[pdf/delete] Deleted file: ${filePath}`);
        } else {
          console.warn(`[pdf/delete] File not found on disk: ${filePath}`);
        }
      } catch (fileErr: any) {
        console.error(`[pdf/delete] Error deleting file:`, fileErr);
      }
    }

    const info = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);

    if (info.changes > 0) {
      return res.json({
        ...header,
        severity: 'success',
        title: `PDF with id: "${id}" deleted`,
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
