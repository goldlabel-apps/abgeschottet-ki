// aki/aki-backend/src/routes/pdf/rip.ts
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const createRouter = Router();

interface PdfRow {
  id: number;
  fileNameOnDisk: string;
  filename?: string;
  rawText?: string;
  [key: string]: any;
}

// Paths
const uploadDir = path.resolve(
  __dirname,
  '../../../../aki-frontend/public/pdf/uploads'
);

// ensure uploadDir exists (should already)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Run pdftotext to extract embedded text
 */
function extractTextLayer(pdfPath: string, outPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const cmd = `pdftotext "${pdfPath}" "${outPath}"`;
    exec(cmd, (err) => {
      if (err) return reject(err);
      if (!fs.existsSync(outPath)) return resolve('');
      const txt = fs.readFileSync(outPath, 'utf-8').trim();
      resolve(txt);
    });
  });
}

/**
 * Run tesseract OCR on the PDF (requires conversion to images)
 * This will be slower but works for scanned docs
 */
function extractTextViaOCR(pdfPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // tesseract can work directly on PDFs in many installs:
    // but to be safe, convert first page(s) to tif or png, then OCR.
    // Here we just call tesseract directly and let it do multi-page pdfs.
    const tempBase = path.join(
      path.dirname(pdfPath),
      `ocr-temp-${Date.now()}`
    );
    const cmd = `tesseract "${pdfPath}" "${tempBase}" -l deu+eng pdf`;
    // Note: using -l deu+eng to support German/English OCR
    exec(cmd, (err) => {
      if (err) return reject(err);
      const txtFile = `${tempBase}.txt`;
      if (!fs.existsSync(txtFile)) return resolve('');
      const txt = fs.readFileSync(txtFile, 'utf-8').trim();
      // cleanup
      try {
        fs.unlinkSync(txtFile);
      } catch {}
      resolve(txt);
    });
  });
}

// GET without id gives helpful message
createRouter.get('/', (_req: Request, res: Response) => {
  return res.status(400).json({
    ...header,
    severity: 'error',
    title: 'Missing id',
    message: 'Use /pdf/rip/:id to extract text',
  });
});

// GET with id to rip text
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
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({
      ...header,
      severity: 'error',
      title: `PDF file not found on disk`,
      message: pdfPath,
    });
  }

  try {
    // Mark as processing in DB
    db.prepare('UPDATE pdfs SET rawText = ? WHERE id = ?').run('extracting...', id);

    // Temp txt path for pdftotext
    const tmpTxt = path.join(uploadDir, `temp-${id}-${Date.now()}.txt`);
    let rawText = '';

    // Try direct text extraction first
    try {
      rawText = await extractTextLayer(pdfPath, tmpTxt);
    } catch (e) {
      console.warn('[pdf/rip] text layer extraction failed, falling back to OCR', e);
    } finally {
      if (fs.existsSync(tmpTxt)) {
        try {
          fs.unlinkSync(tmpTxt);
        } catch {}
      }
    }

    // If no text found, try OCR
    if (!rawText || rawText.length < 5) {
      console.log('[pdf/rip] No text layer found, attempting OCR...');
      try {
        rawText = await extractTextViaOCR(pdfPath);
      } catch (e) {
        console.error('[pdf/rip] OCR extraction failed', e);
      }
    }

    // Update DB
    db.prepare('UPDATE pdfs SET rawText = ? WHERE id = ?').run(rawText || '', id);

    return res.json({
      ...header,
      severity: 'success',
      title: 'Text extraction complete',
      data: {
        id,
        pdf: row.filename ?? row.fileNameOnDisk,
        textLength: rawText.length,
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
