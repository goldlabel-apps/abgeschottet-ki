// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/processPdf.ts

import fs from 'fs';
import pdfParse from 'pdf-parse';
// add any other imports you need (e.g. tesseract, pdf2pic, etc.)

// Main function to process a PDF
export async function processPdf(
  filePath: string
): Promise<{ text: string | null; error: string | null }> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);
    const extractedText = parsed.text.trim();

    if (extractedText && extractedText.length > 0) {
      return { text: extractedText, error: null };
    }

    // TODO: handle OCR fallback here if needed
    return { text: null, error: 'No meaningful text found' };
  } catch (err: any) {
    console.error('processPdf error:', err);
    return { text: null, error: err.message || 'Unknown error' };
  }
}
