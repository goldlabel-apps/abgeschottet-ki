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
INSERT INTO "log" ("id","created","updated","severity","title","description","data") VALUES (1,1753524362248,1753529732217,'warning','Unhidden Log','Try hiding something','{"hidden":true}');
INSERT INTO "log" ("id","created","updated","severity","title","description","data") VALUES (2,1753524416401,1753524416401,'info','Test entry','This is a test','{"foo":"bar"}');
INSERT INTO "log" ("id","created","updated","severity","title","description","data") VALUES (3,1753528461522,1753528461522,'success','Log entry','A log can also have a data field, which is stringified JSON','{"foo":"bar"}');
INSERT INTO "log" ("id","created","updated","severity","title","description","data") VALUES (4,1753529306927,1753529306927,'success','Log entry','A log can also have a data field, which is stringified JSON','{"foo":"bar"}');
INSERT INTO "log" ("id","created","updated","severity","title","description","data") VALUES (5,1753530657595,1753530657595,'error','FAIL.','A user has done something wrong','{"foo2":"bar2"}');
INSERT INTO "pdfs" ("id","created","updated","label","slug","filename","filesize","text","mimeType","destination","thumbnail","fileNameOnDisk","fullPath","rawText") VALUES (23,1753535434675,1753535434675,'ADAC.pdf','adac','ADAC.pdf',48938,NULL,'application/pdf','/Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/public/pdf/uploads',NULL,'1753535434668-ADAC.pdf','/Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/public/pdf/uploads/1753535434668-ADAC.pdf',NULL);
INSERT INTO "pdfs" ("id","created","updated","label","slug","filename","filesize","text","mimeType","destination","thumbnail","fileNameOnDisk","fullPath","rawText") VALUES (24,1753535662320,1753535662320,'Aioi Nissan.pdf','aioi-nissan','Aioi Nissan.pdf',159552,NULL,'application/pdf','/Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/public/pdf/uploads',NULL,'1753535662316-Aioi Nissan.pdf','/Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/public/pdf/uploads/1753535662316-Aioi Nissan.pdf',NULL);
INSERT INTO "pdfs" ("id","created","updated","label","slug","filename","filesize","text","mimeType","destination","thumbnail","fileNameOnDisk","fullPath","rawText") VALUES (25,1753535977711,1753535977711,'Allianz.pdf','allianz','Allianz.pdf',41014,NULL,'application/pdf','/Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/public/pdf/uploads',NULL,'1753535977709-Allianz.pdf','/Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/public/pdf/uploads/1753535977709-Allianz.pdf',NULL);
COMMIT;
