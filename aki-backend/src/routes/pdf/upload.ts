// /Users/goldlabel/GitHub/abgeschottet-ki/aki-backend/src/routes/pdf/upload.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { header } from '../../lib/header';

const createRouter = Router();

// Ensure upload dir exists
const uploadDir = path.resolve(__dirname, '../../../data/pdfs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  },
});

// Route
createRouter.post('/', upload.single('file'), (req: Request, res: Response) => {
  try {
    const f = req.file;
    if (!f) {
      return res.status(400).json({ success: false, error: 'No file received' });
    }

    const fileMeta = {
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
      destination: f.destination,
      fileNameOnDisk: f.filename,
      fullPath: path.join(f.destination, f.filename),
    };

    res.json({
      ...header,
      severity: 'success',
      title: 'Uploaded OK',
      data: fileMeta,
    });
  } catch (err: any) {
    console.error('Error in /pdf/upload:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
});

export default createRouter;
