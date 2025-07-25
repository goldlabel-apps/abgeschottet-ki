// abgeschottet-ki/db/sql/insertPdf.ts


/*
// Insert a processed PDF record
export function insertPdf(
  filename: string,
  filesize: number,
  text: string | null,
  error: string | null
): number {
  const stmt = db.prepare(
    'INSERT INTO pdfs (filename, filesize, text, error) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(filename, filesize, text, error);
  return info.lastInsertRowid as number;
}
*/