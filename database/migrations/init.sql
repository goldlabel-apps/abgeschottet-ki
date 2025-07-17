-- save this as migrations/init.sql
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  fileName TEXT,
  uploadedAt INTEGER,
  summary TEXT,
  rawTextSeverity TEXT,
  rawTextProcessing INTEGER,
  step INTEGER
);
