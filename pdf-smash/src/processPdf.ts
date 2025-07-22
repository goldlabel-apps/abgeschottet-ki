// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/server.ts

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors'; // allow cross-origin requests
import { insertPdf } from './db';
import { processPdf } from './processPdf';

const app = express();
const PORT = 4000;

// Resolve to a persistent storage directory inside this repo
// This will work on any machine as long as the relative structure is the same
const pdfsDir = path.join(process.cwd(), 'pdf-smash', 'data', 'pdfs');
fs.mkdirSync(pdfsDir, { recursive: true });

// Enable CORS for all routes (adjust origin as needed)
app.use(cors());

// Parse JSON bodies (not needed for multipart but good for other endpoints)
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, pdfsDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// POST endpoint to process PDF
app.post('/process-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filepath = req.file.path;
    const filename = req.file.filename;
    const filesize = req.file.size;

    // Run PDF processing
    const { text, error } = await processPdf(filepath);

    // Insert metadata into database
    const id = insertPdf(filename, filesize, text, error);

    res.json({
      success: true,
      id,
      filename,
      filesize,
      error,
      textLength: text ? text.length : 0,
    });
  } catch (err: any) {
    console.error('Error in /process-pdf:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`pdf-smash service running on http://localhost:${PORT}`);
  console.log(`PDFs will be saved to: ${pdfsDir}`);
});
