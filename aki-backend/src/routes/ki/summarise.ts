import { Router, Request, Response } from 'express';
import { db } from '../../lib/database'; // your better-sqlite3 instance
import { header } from '../../lib/header';

const createRouter = Router();

interface PdfRow {
  id: number;
  filename?: string;
  fileNameOnDisk?: string;
  rawText?: string;
  summary?: string;
}

createRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const row = db.prepare('SELECT * FROM pdfs WHERE id = ?').get(id) as PdfRow | undefined;

    if (!row) {
      throw new Error(`No PDF record found for id=${id}`);
    }

    if (!row.rawText || row.rawText.length < 5) {
      const msg = '[ERROR] No rawText available to summarise';
      db.prepare('UPDATE pdfs SET summary = ? WHERE id = ?').run(msg, id);
      return res.json({
        ...header,
        severity: 'error',
        title: 'Missing rawText',
        data: { id, pdf: row.filename ?? row.fileNameOnDisk },
      });
    }

    const prompt = `
The following is the full text of a car accident-related legal document. Read the text carefully and create a short summary with these guidelines - The \`summary\` field must be a short, tweet-length (max 280 characters) summary of the document content.

${row.rawText}
    `.trim();

    // POST to LLM API for streaming response
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "phi3",
        prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM API error: ${response.status} ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body from LLM');

    let done = false;
    let summaryText = '';

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunkStr = new TextDecoder().decode(value);
        // The LLM sends concatenated JSON lines — split by line breaks
        const jsonStrings = chunkStr.trim().split(/\r?\n/).filter(Boolean);

        for (const jsonStr of jsonStrings) {
          try {
            const obj = JSON.parse(jsonStr);
            if (obj.response) summaryText += obj.response;
            if (obj.done) done = true;
          } catch {
            // Ignore partial or malformed chunks
          }
        }
      }
    }

    // Save the full summary in the DB
    db.prepare('UPDATE pdfs SET summary = ? WHERE id = ?').run(summaryText, id);

    return res.json({
      ...header,
      severity: 'success',
      title: 'Summary generated',
      data: {
        id,
        pdf: row.filename ?? row.fileNameOnDisk,
        summary: summaryText,
      },
    });
  } catch (err: any) {
    const errorMsg = `[ERROR] ${err.message || 'Unknown error'}`;
    db.prepare('UPDATE pdfs SET summary = ? WHERE id = ?').run(errorMsg, req.params.id);
    return res.status(500).json({
      ...header,
      severity: 'error',
      title: 'Summarisation failed',
      message: err.message || 'Unknown error',
    });
  }
});

export default createRouter;
