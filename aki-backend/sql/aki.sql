BEGIN TRANSACTION;

CREATE TABLE pdfs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT,
  slug TEXT,
  filename TEXT NOT NULL,
  filesize INTEGER NOT NULL,
  text TEXT,
  mimeType TEXT,
  destination TEXT,
  fileNameOnDisk TEXT,
  fullPath TEXT,
  rawText BLOB DEFAULT NULL
);
