import fs from 'fs';
import path from 'path';
import os from 'os';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import { fromPath } from 'pdf2pic';
import { v4 as uuidv4 } from 'uuid';

/**
 * Process a PDF file and return extracted text.
 * Tries pdf-parse first; if no meaningful text, converts pages to PNG and OCRs them.
 */
export async function processPdf(
  filePath: string
): Promise<{ text: string | null; error: string | null }> {
  try {
    // 1. Try native text extraction
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);
    const extractedText = parsed.text.trim();

    if (isMeaningfulText(extractedText)) {
      return { text: extractedText, error: null };
    }

    console.log('⚠️ pdf-parse found no meaningful text, falling back to OCR…');

    // 2. Convert each page of the PDF to an image
    const tempDir = path.join(os.tmpdir(), `pdf-smash-${uuidv4()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const convert = fromPath(filePath, {
      density: 200,
      saveFilename: 'page',
      savePath: tempDir,
      format: 'png',
      width: 1024,
      height: 1024
    });

    console.log('⏳ Converting PDF pages to images…');
    const pageCount = parsed.numpages;
    const imagePaths: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const pageResult = await convert(i);
      if (pageResult && pageResult.path) {
        imagePaths.push(pageResult.path);
      }
    }

    if (imagePaths.length === 0) {
      return { text: null, error: 'Failed to convert PDF to images for OCR' };
    }

    // 3. Run OCR on each image
    let ocrText = '';
    for (const imgPath of imagePaths) {
      console.log(`🔎 Running OCR on ${imgPath}…`);
      const ocrResult = await Tesseract.recognize(imgPath, 'eng', {
        logger: m => console.log(m)
      });
      ocrText += ocrResult.data.text.trim() + '\n';
    }

    // 4. Clean up temporary images
    for (const imgPath of imagePaths) {
      try {
        fs.unlinkSync(imgPath);
      } catch (err) {
        console.warn(`⚠️ Could not delete temp image ${imgPath}`, err);
      }
    }
    try {
      fs.rmdirSync(tempDir, { recursive: true });
    } catch (err) {
      console.warn(`⚠️ Could not delete temp folder ${tempDir}`, err);
    }

    // 5. Check OCR output
    if (isMeaningfulText(ocrText)) {
      return { text: ocrText.trim(), error: null };
    } else {
      return { text: null, error: 'No extractable text found via OCR' };
    }
  } catch (err: any) {
    console.error('❌ Error processing PDF:', err);
    return { text: null, error: err.message || 'Unknown error while processing PDF' };
  }
}

/**
 * Heuristic to decide if text is meaningful.
 */
function isMeaningfulText(text: string): boolean {
  if (!text) return false;
  return text.replace(/\s+/g, '').length > 20;
}
