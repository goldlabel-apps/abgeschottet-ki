// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/server.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { processPdf } from './processPdf';
import { insertPdf, getAllPdfs } from './db';

const app = express();
const PORT = 4000;

// enable CORS for all routes
app.use(cors());

// resolve to a persistent storage directory
const uploadDir = path.join(process.cwd(), 'pdf-smash', 'pdfs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(express.json());

// GET endpoint to return all PDFs
app.get('/', (req, res) => {
  try {
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error in /:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

// GET endpoint to return all PDFs
app.get('/pdfs', (req, res) => {
  try {
    const rows = getAllPdfs();
    res.json({ success: true, pdfs: rows });
  } catch (err: any) {
    console.error('Error in /pdfs:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

// POST endpoint to process a single PDF
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
