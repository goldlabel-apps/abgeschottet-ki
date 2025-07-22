// pdf-smash/src/server.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { insertPdf } from './db.js';
import { processPdf } from './processPdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// persistent storage directory
const uploadDir = path.join(__dirname, '../data/pdfs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const app = express();
const PORT = 4000;

app.use(express.json());

app.post('/process-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filepath = req.file.path;
    const filename = req.file.filename;
    const filesize = req.file.size;

    // process the PDF
    const { text, error } = await processPdf(filepath);

    // insert into database
    const id = insertPdf(filename, filesize, text, error);

    res.json({
      success: true,
      id,
      filename,
      filesize,
      error,
      textLength: text ? text.length : 0
    });
  } catch (err: any) {
    console.error('Error in /process-pdf:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`pdf-smash service running on http://localhost:${PORT}`);
});
