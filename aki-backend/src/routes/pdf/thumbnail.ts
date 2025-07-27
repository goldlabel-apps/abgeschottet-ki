// aki/aki-backend/src/routes/pdf/thumbnail.ts

/*
  Generate a 1200px high thumbnail png of the first page of a PDF 
  and save it to the public /png/uploads folder
*/

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { header } from '../../lib/header';
import { db } from '../../lib/database';
import sharp from 'sharp'; // yarn add sharp
import { exec } from 'child_process'; // we’ll shell out to poppler-utils

const createRouter = Router();

interface PdfRow {
  id: number;
  fileNameOnDisk: string;
  filename?: string;
  thumbnail?: string;
  [key: string]: any;
}

// Folders
const uploadDir = path.resolve(
  __dirname,
  '../../../../aki-frontend/public/pdf/uploads'
);
const pngDir = path.resolve(
  __dirname,
  '../../../../aki-frontend/public/png/thumbnails'
);

// Ensure pngDir exists
if (!fs.existsSync(pngDir)) {
  fs.mkdirSync(pngDir, { recursive: true });
}

/**
 * Render the first page of a PDF to a temp PNG using `pdftoppm` (poppler-utils)
 */
function renderFirstPageToPng(pdfPath: string, outPngPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const basename = path.join(path.dirname(outPngPath), path.parse(outPngPath).name);
    const cmd = `pdftoppm -f 1 -l 1 -png "${pdfPath}" "${basename}"`;
    exec(cmd, (err) => {
      if (err) return reject(err);

      const firstPage = `${basename}-1.png`;
      if (!fs.existsSync(firstPage)) return reject(new Error('No output PNG found'));
      sharp(firstPage)
        .resize({ width: 630, height: 1200, fit: 'inside' })
        .toFile(outPngPath)
        .then(() => {
          fs.unlinkSync(firstPage);
          resolve();
        })
        .catch(reject);
    });
  });
}

// GET without id gives helpful message
createRouter.get('/', (_req: Request, res: Response) => {
  return res.status(400).json({
    ...header,
    severity: 'error',
    title: 'Missing id',
    data: { message: 'Use /pdf/thumbnail/:id to generate a thumbnail' },
  });
});

// GET with id to generate thumbnail
createRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      ...header,
      severity: 'error',
      title: 'No id provided',
      data: { message: 'You must supply an id parameter' },
    });
  }

  // Phase 1: look up the row
  const row = db.prepare('SELECT * FROM pdfs WHERE id = ?').get(id) as PdfRow | undefined;
  if (!row) {
    return res.status(404).json({
      ...header,
      severity: 'error',
      title: `No PDF record found for id=${id}`,
    });
  }

  const pdfPath = path.join(uploadDir, row.fileNameOnDisk);
  const pngFilename = path.parse(row.fileNameOnDisk).name + '.png';
  const pngPath = path.join(pngDir, pngFilename);

  try {
    // Mark as generating in DB
    db.prepare('UPDATE pdfs SET thumbnail = ? WHERE id = ?').run('generating...', id);

    // Remove any previous thumbnail
    if (fs.existsSync(pngPath)) {
      fs.unlinkSync(pngPath);
    }

    // Render first page to PNG
    await renderFirstPageToPng(pdfPath, pngPath);

    // Update DB with final thumbnail filename
    db.prepare('UPDATE pdfs SET thumbnail = ? WHERE id = ?').run(pngFilename, id);

    // Return success response
    return res.json({
      ...header,
      severity: 'success',
      title: 'Thumbnail generated',
      data: {
        id,
        pdf: row.filename ?? row.fileNameOnDisk,
        thumbnail: `/png/uploads/${pngFilename}`,
      },
    });
  } catch (err: any) {
    console.error('[pdf/thumbnail] generation failed:', err);
    // Update DB to indicate error only if generation or update failed
    db.prepare('UPDATE pdfs SET thumbnail = ? WHERE id = ?').run('error', id);
    return res.status(500).json({
      ...header,
      severity: 'error',
      title: 'Thumbnail generation failed',
      data: { error: err.message },
    });
  }
});

export default createRouter;
