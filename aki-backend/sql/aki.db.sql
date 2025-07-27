BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "log" (
	"id"	INTEGER,
	"created"	INTEGER,
	"updated"	INTEGER,
	"severity"	TEXT,
	"title"	TEXT,
	"description"	TEXT,
	"data"	BLOB,
	PRIMARY KEY("id" AUTOINCREMENT)
);
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
INSERT INTO "log" ("id","created","updated","severity","title","description","data") VALUES (1,1753529306927,1753529306927,'success','Log entry','A log can also have a data field, which is stringified JSON','{"foo":"bar"}');
INSERT INTO "pdfs" ("id","created","updated","label","slug","filename","filesize","text","mimeType","destination","thumbnail","fileNameOnDisk","fullPath","rawText") VALUES (35,1753620029692,1753620029692,'ADAC.pdf','adac','ADAC.pdf',48938,NULL,'application/pdf','/Users/goldlabel/GitHub/aki/aki-frontend/public/pdf/uploads','1753620029660-ADAC.png','1753620029660-ADAC.pdf','/Users/goldlabel/GitHub/aki/aki-frontend/public/pdf/uploads/1753620029660-ADAC.pdf',NULL);
INSERT INTO "pdfs" ("id","created","updated","label","slug","filename","filesize","text","mimeType","destination","thumbnail","fileNameOnDisk","fullPath","rawText") VALUES (36,1753620168670,1753620168670,'Aioi Nissan.pdf','aioi-nissan','Aioi Nissan.pdf',159552,NULL,'application/pdf','/Users/goldlabel/GitHub/aki/aki-frontend/public/pdf/uploads','1753620168667-Aioi Nissan.png','1753620168667-Aioi Nissan.pdf','/Users/goldlabel/GitHub/aki/aki-frontend/public/pdf/uploads/1753620168667-Aioi Nissan.pdf',NULL);
COMMIT;
