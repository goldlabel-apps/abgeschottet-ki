// aki/aki-backend/src/routes/pdf/rip.ts

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const exec = promisify(execCb);
const createRouter = Router();

interface PdfRow {
  id: number;
  fileNameOnDisk: string;
  filename?: string;
  rawText?: string;
  [key: string]: any;
}

const uploadDir = path.resolve(
  __dirname,
  '../../../../aki-frontend/public/pdf/uploads'
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function extractTextLayer(pdfPath: string, outPath: string): Promise<string> {
  const cmd = `pdftotext "${pdfPath}" "${outPath}"`;
  await exec(cmd);
  if (!fs.existsSync(outPath)) return '';
  const txt = await fs.promises.readFile(outPath, 'utf-8');
  return txt.trim();
}

async function extractTextViaOCR(pdfPath: string): Promise<string> {
  const tempBase = path.join(path.dirname(pdfPath), `ocr-temp-${Date.now()}`);
  const cmd = `tesseract "${pdfPath}" "${tempBase}" -l deu+eng pdf`;
  await exec(cmd);
  const txtFile = `${tempBase}.txt`;
  if (!fs.existsSync(txtFile)) return '';
  const txt = await fs.promises.readFile(txtFile, 'utf-8');
  try {
    await fs.promises.unlink(txtFile);
  } catch {}
  return txt.trim();
}

createRouter.get('/', (_req: Request, res: Response) => {
  return res.status(400).json({
    ...header,
    severity: 'error',
    title: 'Missing id',
    message: 'Use /pdf/rip/:id to extract text',
  });
});

createRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      ...header,
      severity: 'error',
      title: 'No id provided',
      message: 'You must supply an id parameter',
    });
  }

  const row = db.prepare('SELECT * FROM pdfs WHERE id = ?').get(id) as PdfRow | undefined;
  if (!row) {
    return res.status(404).json({
      ...header,
      severity: 'error',
      title: `No PDF record found for id=${id}`,
    });
  }

  const pdfPath = path.join(uploadDir, row.fileNameOnDisk);
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({
      ...header,
      severity: 'error',
      title: `PDF file not found on disk`,
      message: pdfPath,
    });
  }

  try {
    db.prepare('UPDATE pdfs SET rawText = ? WHERE id = ?').run('extracting...', id);

    const tmpTxt = path.join(uploadDir, `temp-${id}-${Date.now()}.txt`);
    let rawText = '';
    let usedFallback = false;

    try {
      rawText = await extractTextLayer(pdfPath, tmpTxt);
    } catch (e) {
      console.warn('[pdf/rip] text layer extraction failed, will attempt OCR', e);
    } finally {
      if (fs.existsSync(tmpTxt)) {
        try {
          await fs.promises.unlink(tmpTxt);
        } catch {}
      }
    }

    if (!rawText || rawText.length < 5) {
      console.log('[pdf/rip] No text layer found, attempting OCR...');
      usedFallback = true;
      try {
        rawText = await extractTextViaOCR(pdfPath);
      } catch (e) {
        console.error('[pdf/rip] OCR extraction failed', e);
      }
    }

    db.prepare('UPDATE pdfs SET rawText = ? WHERE id = ?').run(rawText || '[ERROR] No text ripped', id);

    if (rawText.length === 0){
      return res.json({
      ...header,
      severity: 'error',
      title: 'Text extraction failed',
      data: {
        id,
        pdf: row.filename ?? row.fileNameOnDisk,
        textLength: rawText.length,
        usedOCR: usedFallback,
        preview: rawText.slice(0, 200),
      },
    });
    }

    return res.json({
      ...header,
      severity: 'success',
      title: 'Text extraction complete',
      data: {
        id,
        pdf: row.filename ?? row.fileNameOnDisk,
        textLength: rawText.length,
        usedOCR: usedFallback,
        preview: rawText.slice(0, 200),
      },
    });
  } catch (err: any) {
    console.error('[pdf/rip] extraction failed:', err);
    db.prepare('UPDATE pdfs SET rawText = ? WHERE id = ?').run('error', id);
    return res.status(500).json({
      ...header,
      severity: 'error',
      title: 'Text rip failed',
      message: err.message,
    });
  }
});

export default createRouter;
