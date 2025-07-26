CREATE TABLE "log" (
	"id"	INTEGER,
	"created"	INTEGER,
	"updated"	INTEGER,
	"severity"	TEXT,
	"title"	TEXT,
	"description"	TEXT,
	"data"	BLOB,
	PRIMARY KEY("id" AUTOINCREMENT)
);