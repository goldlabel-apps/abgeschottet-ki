// aki/aki-backend/src/routes/pdf/thumbnail.ts

/*
  Generate a 1200px high thumbnail png of the first page of a PDF 
  and save it to the public /png/thumbnails folder
*/

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { header } from '../../lib/header';
import { db } from '../../lib/database';
import sharp from 'sharp'; // yarn add sharp
import { spawn } from 'child_process';

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

    const args = ['-f', '1', '-l', '1', '-png', pdfPath, basename];
    const pdftoppm = spawn('pdftoppm', args);

    let stderr = '';
    pdftoppm.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pdftoppm.on('close', (code) => {
      if (code !== 0) {
        console.error('pdftoppm failed with code', code);
        console.error('stderr:', stderr);
        return reject(new Error(`pdftoppm exited with code ${code}: ${stderr}`));
      }

      const firstPage = `${basename}-1.png`;
      if (!fs.existsSync(firstPage)) {
        console.error('Expected PNG not found at:', firstPage);
        return reject(new Error('No output PNG found'));
      }

      sharp(firstPage)
        .resize({ width: 630, height: 1200, fit: 'inside' })
        .toFile(outPngPath)
        .then(() => {
          try {
            fs.unlinkSync(firstPage);
          } catch (unlinkErr) {
            if (unlinkErr instanceof Error) {
              console.warn('Failed to delete temp image:', unlinkErr.message);
            } else {
              console.warn('Failed to delete temp image:', unlinkErr);
            }
          }
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
    // Check PDF exists and is not empty
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found at ${pdfPath}`);
    }
    const stats = fs.statSync(pdfPath);
    if (stats.size < 100) {
      throw new Error('PDF file appears to be empty or invalid');
    }

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
        thumbnail: `/png/thumbnails/${pngFilename}`,
      },
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err);
    const errorEntry = `[ERROR] ${errorMessage}`;

    console.error('[pdf/thumbnail] generation failed:', errorMessage);
    db.prepare('UPDATE pdfs SET thumbnail = ? WHERE id = ?').run(errorEntry, id);

    return res.status(500).json({
      ...header,
      severity: 'error',
      title: 'Thumbnail generation failed',
      data: { error: errorMessage },
    });
  }
});

export default createRouter;
