BEGIN TRANSACTION;
DROP TABLE IF EXISTS "pdfs";
CREATE TABLE "pdfs" (
	"id"	INTEGER,
	"created"	INTEGER,
	"updated"	INTEGER,
	"label"	TEXT,
	"slug"	TEXT,
	"filename"	TEXT NOT NULL,
	"filesize"	INTEGER NOT NULL,
	"mimeType"	TEXT,
	"destination"	TEXT,
	"thumbnail"	TEXT,
	"fileNameOnDisk"	TEXT,
	"fullPath"	TEXT,
	"rawText"	BLOB DEFAULT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "pdfs" ("id","created","updated","label","slug","filename","filesize","mimeType","destination","thumbnail","fileNameOnDisk","fullPath","rawText") VALUES (1,1754051939324,1754051939324,'IMMJ Invoice.pdf','immj-invoice','IMMJ Invoice.pdf',75546,'application/pdf','/Users/goldlabel/GitHub/aki/aki-frontend/public/pdf/uploads','1754051939301-IMMJ_Invoice.png','1754051939301-IMMJ_Invoice.pdf','/Users/goldlabel/GitHub/aki/aki-frontend/public/pdf/uploads/1754051939301-IMMJ_Invoice.pdf','Invoice POR000068
Date 31/12/2021

​

From

To

Wei Zang Ltd
Office 602​
182-184 High Street London​
E6 2JA
listingslab@gmail.com

IMMJ Systems Ltd
2a Crendon Street
High Wycombe, Bucks
HP13 6 LW

​

Description
Software Development Services 7 days @ GBP 250/day

Total £ 1750

Please make payment to
Wei Zang Ltd ​
Sort code: 23-14-70​
Account: 23738384
Wise, 56 Shoreditch High Street ​
London E1 6JJ
Thank you');
COMMIT;
