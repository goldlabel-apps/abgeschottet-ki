# pdf-smash Setup Guide

This document describes how to build and integrate the **pdf-smash** service into the existing project.  
All processing stays **on-premise** — no PDFs ever leave the building.

---

## Overview

**Goal:**  
A local Node.js + TypeScript service that:
- Accepts PDF uploads from the Next.js app
- Extracts raw text (text-based or via OCR)
- Stores uploaded files in a local persistent directory
- Saves results and errors into a `pdfs` table in the SQLite database
- Returns JSON responses with processing info

---

## Architecture

```
Next.js App (UI & API)
    │
    └─> pdf-smash Service (Express/TS)
          ├─ Accept upload (POST /process-pdf)
          ├─ Store file under /pdf-smash/data/pdfs
          ├─ Extract text (pdf-parse → OCR fallback)
          ├─ Insert record into SQLite (db/abgeschottet-ki.db)
          └─ Respond with JSON
```

---

## Prerequisites

- Node.js 20+
- Yarn or npm
- SQLite database present in `db/abgeschottet-ki.db`

---

## Setup Steps

### 1. Create the `pdf-smash` Service

In the root of your repo:
```bash
mkdir pdf-smash
cd pdf-smash
npm init -y
npm install express multer better-sqlite3 pdf-parse tesseract.js
npm install --save-dev typescript @types/express @types/multer @types/node
npx tsc --init
```

### 2. Directory Structure

```
pdf-smash/
  src/
    server.ts
    db.ts
    processPdf.ts
  data/
    pdfs/        # storage (ignored by git)
  package.json
  tsconfig.json
  .gitignore
```

**.gitignore**
```
/data
/node_modules
/dist
```

---

### 3. Database Integration (db.ts)

Connect to existing SQLite database and ensure `pdfs` table exists:
```ts
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../abgeschottet-ki.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS pdfs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    filesize INTEGER,
    rawText TEXT,
    error TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

export function insertPdf(filename: string, filesize: number, rawText: string | null, error: string | null) {
  const stmt = db.prepare(\`
    INSERT INTO pdfs (filename, filesize, rawText, error) VALUES (?, ?, ?, ?)
  \`);
  const info = stmt.run(filename, filesize, rawText, error);
  return info.lastInsertRowid;
}

export default db;
```

---

### 4. PDF Processing (processPdf.ts)

- Use `pdf-parse` first
- If no valid text → fallback to OCR via `tesseract.js`
- Return `{ text, error }`

---

### 5. Express Server (server.ts)

Handle file uploads and processing:
- POST `/process-pdf`
- Uses `multer` to store in `/data/pdfs`
- Calls `processPdf` then `insertPdf`
- Returns JSON response

---

### 6. Integrate with Next.js

In your Next.js API route:
- Use `fetch` or `axios` to `POST` the uploaded PDF to `http://localhost:4000/process-pdf`
- After processing, query the `pdfs` table (e.g. via an API route) to list stored PDFs

---

## Running the Service

In the `pdf-smash` folder:
```bash
npx tsc
node dist/server.js
```

Optionally, add an npm script to `package.json`:
```json
"scripts": {
  "dev": "ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## Security Notes

- All processing is local — no external services are used.
- Ensure `/pdf-smash/data` is secured and backed up according to firm policy.
- Add network restrictions if necessary to keep pdf-smash internal only.

---

## Next Steps

- Implement and test the server, DB, and extraction logic.
- Build a simple Next.js UI to upload PDFs and display stored records.
- Once stable, proceed to next phase of development (e.g., search, tagging, etc.).

---

**Author:**  
Internal Development Team  
**Project:** Abgeschottet KI — pdf-smash module
