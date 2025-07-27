CREATE TABLE IF NOT EXISTS "pdfs" (
	"id"	INTEGER,
	"created"	INTEGER,
	"updated"	INTEGER,
	"label"	TEXT,
	"slug"	TEXT,
	"filename"	TEXT NOT NULL,
	"filesize"	INTEGER NOT NULL,
	"text"	TEXT,
	"mimeType"	TEXT,
	"destination"	TEXT,
	"thumbnail"	TEXT,
	"fileNameOnDisk"	TEXT,
	"fullPath"	TEXT,
	"rawText"	BLOB DEFAULT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);