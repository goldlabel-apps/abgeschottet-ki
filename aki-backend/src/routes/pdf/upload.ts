import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { header } from '../../lib/header';
import { db } from '../../lib/database';

const createRouter = Router();

const uploadDir = path.resolve(
  __dirname,
  '../../../../aki-frontend/public/pdf/uploads'
);

// Ensure uploadDir exists on server startup
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    // Use timestamp + sanitized original name
    const timestamp = Date.now();
    // Remove unsafe chars from filename to avoid filesystem issues
    const safeName = file.originalname.replace(/[^\w.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});

// Allow only PDFs
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

// GET method not allowed (POST only)
createRouter.get('/', (_req: Request, res: Response) => {
  return res.status(405).json({
    ...header,
    severity: 'error',
    title: 'GET method not allowed. Use POST to upload a PDF.',
    data: { message: 'Please use POST instead of GET' },
  });
});

// POST upload handler
createRouter.post('/', (req: Request, res: Response) => {
  upload.single('file')(req, res, async (err: any) => {
    if (err) {
      // Handle multer errors and others
      const errorMsg = err.message || 'Unknown upload error';
      return res.status(400).json({
        ...header,
        severity: 'error',
        title: 'Upload error',
        data: { error: errorMsg },
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        ...header,
        severity: 'error',
        title: 'No file received',
        data: { message: 'Expected field name "file"' },
      });
    }

    // Build slug safely: lowercase, replace non-alphanumeric with dashes, trim dashes
    const baseName = path.parse(file.originalname).name;
    const slug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const created = Date.now();
    const updated = created;

    const fileMeta = {
      label: file.originalname,
      slug,
      filename: file.originalname,
      filesize: file.size,
      text: null,
      mimeType: file.mimetype,
      destination: file.destination,
      fileNameOnDisk: file.filename,
      fullPath: path.join(file.destination, file.filename),
      rawText: null,
      created,
      updated,
    };

    try {
      const stmt = db.prepare(`
        INSERT INTO pdfs (
          label, slug, filename, filesize, text,
          mimeType, destination, fileNameOnDisk, fullPath, rawText,
          created, updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        fileMeta.label,
        fileMeta.slug,
        fileMeta.filename,
        fileMeta.filesize,
        fileMeta.text,
        fileMeta.mimeType,
        fileMeta.destination,
        fileMeta.fileNameOnDisk,
        fileMeta.fullPath,
        fileMeta.rawText,
        fileMeta.created,
        fileMeta.updated
      );

      const insertedId = result.lastInsertRowid as number;

      return res.json({
        ...header,
        severity: 'success',
        title: `${fileMeta.filename} uploaded`,
        data: {
          id: insertedId,
          ...fileMeta,
          publicUrl: `/pdf/uploads/${file.filename}`,
        },
      });
    } catch (dbErr: unknown) {
      const errorMessage =
        dbErr instanceof Error
          ? dbErr.message
          : typeof dbErr === 'string'
          ? dbErr
          : JSON.stringify(dbErr);

      console.error('[pdf/upload] DB insert error:', errorMessage);

      return res.status(500).json({
        ...header,
        severity: 'error',
        title: 'Failed to save PDF metadata to database',
        data: { error: errorMessage },
      });
    }
  });
});

export default createRouter;
