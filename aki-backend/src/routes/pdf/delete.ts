// aki/aki-backend/src/routes/pdf/delete.ts

import { Router, Request, Response } from 'express';
import { header } from '../../lib/header';
import { db } from '../../lib/database';
import path from 'path';
import fs from 'fs';

const createRouter = Router();

interface PDFRow {
  id: number;
  fileNameOnDisk: string;
  filename?: string;
  thumbnail?: string;
  filesize?: number;
  text?: string;
  created_at?: string;
}

const uploadDir = path.resolve(
  __dirname,
  '../../../../aki-frontend/public/pdf/uploads'
);

const pngDir = path.resolve(
  __dirname,
  '../../../../aki-frontend/public/png/thumbnails'
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

    // Delete the PDF file itself
    if (row.fileNameOnDisk) {
      try {
        const filePath = path.join(uploadDir, row.fileNameOnDisk);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`[pdf/delete] Deleted PDF file: ${filePath}`);
        } else {
          console.warn(`[pdf/delete] PDF file not found on disk: ${filePath}`);
        }
      } catch (fileErr: any) {
        console.error(`[pdf/delete] Error deleting PDF file:`, fileErr);
      }
    }

    // Delete the thumbnail if one exists, including variants with -1 and -01 suffixes
    if (row.thumbnail) {
      try {
        const baseName = path.parse(row.thumbnail).name; // e.g. "1753640842589-Rechnung_SV_Gomelskyy"
        const ext = path.parse(row.thumbnail).ext;       // e.g. ".png"

        const thumbPaths = [
          path.join(pngDir, row.thumbnail),             // original thumbnail file
          path.join(pngDir, `${baseName}-1${ext}`),     // variant with -1
          path.join(pngDir, `${baseName}-01${ext}`),    // variant with -01
        ];

        thumbPaths.forEach((thumbPath) => {
          if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
            console.log(`[pdf/delete] Deleted thumbnail: ${thumbPath}`);
          } else {
            console.warn(`[pdf/delete] Thumbnail not found on disk: ${thumbPath}`);
          }
        });
      } catch (thumbErr: any) {
        console.error(`[pdf/delete] Error deleting thumbnail:`, thumbErr);
      }
    }

    // Remove from DB
    const info = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);

    if (info.changes > 0) {
      return res.json({
        ...header,
        severity: 'success',
        title: `Data, PDF and related thumbnails deleted`,
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
