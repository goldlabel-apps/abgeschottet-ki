import fs from 'fs';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

export async function processPdf(
  filePath: string
): Promise<{ text: string | null; error: string | null }> {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    // First attempt: native PDF text extraction
    let parsed = await pdfParse(dataBuffer);
    let extractedText = parsed.text.trim();

    if (isMeaningfulText(extractedText)) {
      return { text: extractedText, error: null };
    }

    // Fallback: OCR via Tesseract
    const ocrResult = await Tesseract.recognize(filePath, 'eng', {
      logger: m => console.log(m) // progress log
    });

    const ocrText = ocrResult.data.text.trim();

    if (isMeaningfulText(ocrText)) {
      return { text: ocrText, error: null };
    }

    return { text: null, error: 'No extractable text found via pdf-parse or OCR' };
  } catch (err: any) {
    console.error('Error processing PDF:', err);
    return { text: null, error: err.message || 'Unknown error while processing PDF' };
  }
}

function isMeaningfulText(text: string): boolean {
  if (!text) return false;
  return text.replace(/\s+/g, '').length > 20;
}
