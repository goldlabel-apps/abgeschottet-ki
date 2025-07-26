import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { header } from '../../lib/header';
import { db } from '../../lib/database'; // your better-sqlite3 instance

const createRouter = Router();

// Absolute path to the Next.js public uploads folder
const uploadDir = path.resolve(
  __dirname,
  '../../../../aki-frontend/public/png/thumbnails'
);

// Ensure the folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Only allow PDFs
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// GET route – advise to use POST instead
createRouter.get('/', (_req: Request, res: Response) => {
  return res.status(405).json({
    ...header,
    severity: 'error',
    title: 'GET method not allowed. Please use POST to upload a PDF.',
    data: { message: 'Use POST instead of GET' },
  });
});

// POST route – handle upload
createRouter.post('/', (req: Request, res: Response) => {
  if (!fs.existsSync(uploadDir)) {
    return res.status(405).json({
      ...header,
      severity: 'error',
      title: 'Upload directory does not exist on server',
      data: { uploadDir },
    });
  }

  upload.single('file')(req, res, function (err: any) {
    if (err instanceof multer.MulterError) {
      return res.status(405).json({
        ...header,
        severity: 'error',
        title: 'Multer error: ' + err.message,
        data: { error: err },
      });
    } else if (err) {
      return res.status(405).json({
        ...header,
        severity: 'error',
        title: err.message || 'Unknown upload error',
        data: { error: err },
      });
    }

    const f = req.file;
    if (!f) {
      return res.status(405).json({
        ...header,
        severity: 'error',
        title: 'No file was received in the request',
        data: { message: 'Expected field name "file"' },
      });
    }

    // ✅ Both created and updated timestamps
    const created = Date.now();
    const updated = created;

    // Build metadata
    const fileMeta = {
      label: f.originalname,
      slug: path.parse(f.originalname).name.toLowerCase().replace(/\s+/g, '-'),
      filename: f.originalname,
      filesize: f.size,
      text: null,
      mimeType: f.mimetype,
      destination: f.destination,
      fileNameOnDisk: f.filename,
      fullPath: path.join(f.destination, f.filename),
      rawText: null,
      created,  // ✅ epoch
      updated,  // ✅ epoch
    };

    try {
      // ✅ Insert into database with created & updated
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
        fileMeta.created, // ✅
        fileMeta.updated  // ✅
      );

      const insertedId = result.lastInsertRowid as number;

      return res.json({
        ...header,
        severity: 'success',
        title: 'Uploaded and saved to database',
        data: {
          id: insertedId,
          ...fileMeta,
          publicUrl: `/pdf/uploads/${f.filename}`,
        },
      });
    } catch (dbErr: any) {
      console.error('[pdf/upload] DB insert error:', dbErr);
      return res.status(500).json({
        ...header,
        severity: 'error',
        title: 'Failed to save PDF metadata to database',
        data: { error: dbErr.message },
      });
    }
  });
});

export default createRouter;
