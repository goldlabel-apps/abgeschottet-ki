// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/routes/pdfs.ts

// GET endpoint to return all PDFs
// app.get('/pdfs', (req, res) => {
//   try {
//     const rows = getAllPdfs();
//     res.json({ success: true, pdfs: rows });
//   } catch (err: any) {
//     console.error('Error in /pdfs:', err);
//     res.status(500).json({ success: false, error: err.message || 'Internal server error' });
//   }
// });

// POST endpoint to process a single PDF
// app.post('/process-pdf', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const filepath = req.file.path;
//     const filename = req.file.filename;
//     const filesize = req.file.size;

//     // process the PDF
//     const { text, error } = await processPdf(filepath);

//     // insert into database
//     const id = insertPdf(filename, filesize, text, error);

//     res.json({
//       success: true,
//       id,
//       filename,
//       filesize,
//       error,
//       textLength: text ? text.length : 0
//     });
//   } catch (err: any) {
//     console.error('Error in /process-pdf:', err);
//     res.status(500).json({ error: err.message || 'Internal server error' });
//   }
// });