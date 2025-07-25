BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "ki" (
	"id"	INTEGER,
	"label"	TEXT,
	"slug"	TEXT,
	"prompt"	TEXT,
	"completion"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "pdfs" (
	"id"	INTEGER,
	"label"	TEXT,
	"slug"	TEXT,
	"filename"	TEXT,
	"filesize"	INTEGER,
	"text"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "ki" ("id","label","slug","prompt","completion") VALUES (1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit.','lorem-ipsum','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','Quisque nec euismod sem. Suspendisse iaculis erat id tempor lobortis. Donec eu mauris sed mauris blandit feugiat id at mauris.');
INSERT INTO "ki" ("id","label","slug","prompt","completion") VALUES (2,'Nullam ligula purus, volutpat quis tempus id','nullam','Nullam ligula purus, volutpat quis tempus id, facilisis sed eros. Ut at pellentesque ipsum. Donec condimentum rhoncus risus, at pellentesque nibh dapibus vitae.','Cras sollicitudin ligula risus, et blandit lacus congue nec. Vestibulum consequat, dui eu facilisis placerat, nisl dui finibus mi, auctor vestibulum elit ligula in nunc. Aenean interdum augue et risus ultricies, ut ultrices orci sollicitudin.');
INSERT INTO "pdfs" ("id","label","slug","filename","filesize","text") VALUES (1,'Rechnung Breier','rechnung-breier','Rechnung Breier.pdf',NULL,'
Frau
Elisabeth Karrenbauer Pommernring 16

66121 Saarbrücken



Kaiserslautern, den 18.06.2025

R E C H N U N G

Bei Rückfragen und Zahlungen bitte angeben!
Steuernummer: 04020905749
Leistungsdatum: 18.06.2025

Betrifft	Haftpflichtschaden

Versicherung	ADAC Autoversicherung 53289 Bonn
Schaden-Nr.	AD2025-40820619-G002
Versicherungsnehmer	Frau Dr. Dorothee Steeb
Anspruchsteller	Frau Elisabeth Karrenbauer Pommernring 16, 66121 Saarbrücken
Amtl. Kennzeichen	SB-EG 86
Fahrzeug-Ident-Nr.	TMBEP6PJ7R4055876

Wir danken für Ihren Auftrag und erlauben uns in obiger Sache zu berechnen:
Grundhonorar	EUR	600,00
Fotokosten
9
Stück
á
2,00
EUR
EUR
18,00
Fahrtkosten
10
km
á
0,70
EUR
EUR
7,00
Schreibgebühren (Originale)
8
Seiten
á
1,80
EUR
EUR
14,40
Gebühr f. Kopien
8
Seiten
á
0,50
EUR
EUR
4,00
Porto u. Telefonkosten





EUR
15,00
Rechnungsbetrag ohne MwSt.





EUR
658,40
Mehrwertsteuer





EUR
125,10
Rechnungsbetrag mit MwSt.





EUR
783,50

Bitte überweisen Sie den Rechnungsbetrag unter Angabe der Rechnungsnummer bis zum 18.07.2025 auf
eines der unten angegebenen Konten.
');
INSERT INTO "pdfs" ("id","label","slug","filename","filesize","text") VALUES (2,'Foobar','foobar','foobar.pdf',NULL,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce leo urna, accumsan quis mi in, varius cursus enim. Praesent vitae sem at nisi posuere ultricies. Suspendisse eros massa, consequat a gravida vitae, egestas sed arcu. Nam et tristique neque, ac imperdiet urna. Nunc vel libero ut ipsum consectetur bibendum in at libero. Sed ultrices fermentum pharetra. Aenean metus tortor, vestibulum eget consequat vitae, consectetur sit amet diam. Aenean vitae turpis aliquam, lacinia velit non, eleifend risus. Integer maximus lectus tellus, sit amet sagittis nibh malesuada ut.

Curabitur sapien ligula, laoreet vitae nibh ac, ultrices venenatis magna. Etiam et lobortis justo. Proin eu porta nunc, vitae laoreet arcu. Suspendisse sagittis, velit eget suscipit malesuada, risus nisi venenatis magna, a suscipit sem nisi non sem. Praesent nulla mi, faucibus eget enim vitae, congue semper ex. Aenean nec gravida leo. Fusce eu mauris non libero dictum scelerisque nec quis eros.

Sed ac malesuada urna, sed volutpat orci. Suspendisse tristique et odio nec suscipit. Maecenas venenatis finibus neque sollicitudin ultrices. Ut auctor, magna non viverra consectetur, ipsum lectus facilisis dui, vitae facilisis nibh libero sed mi. Maecenas laoreet magna dolor, non porta metus scelerisque id. Nulla libero dui, tempor a orci et, fermentum feugiat ipsum. Vivamus et mollis ipsum, nec interdum orci. Nulla finibus ex et massa efficitur, id mollis nunc laoreet. Aenean ut elit nisi. Nulla risus nulla, tincidunt ut porta vitae, pretium ut sapien. Praesent nec imperdiet arcu, nec tincidunt velit. Duis non enim sem. Aenean pretium mollis lectus, in dapibus nisi faucibus vitae.

Suspendisse sit amet tortor augue. Curabitur lacinia venenatis est, id cursus dolor semper pulvinar. Nam id arcu in libero venenatis commodo. Maecenas eu diam id magna faucibus lacinia sed non leo. Praesent consequat dolor id libero condimentum imperdiet. Etiam vel varius felis. In tincidunt nisl interdum, viverra purus nec, hendrerit sem. Morbi non accumsan ex. Nam pulvinar lacinia nibh et imperdiet. Curabitur id auctor odio. Sed ornare leo dapibus, ornare lorem quis, euismod turpis. Donec dapibus mollis magna ac ullamcorper. Vestibulum ullamcorper, sapien vitae pretium placerat, ipsum nisl ultricies turpis, et porta leo ipsum vel nisi.

Donec nec libero in odio sagittis bibendum et eu neque. Duis pulvinar hendrerit velit, vitae fringilla nulla pharetra vel. Phasellus interdum sapien eu nulla faucibus, porttitor ultrices ante consectetur. Aliquam ut blandit enim. Maecenas aliquam dui sit amet eleifend egestas. Morbi venenatis pharetra magna, et ultrices enim bibendum id. Nulla facilisi. Curabitur at felis vel nibh varius convallis sed ut ligula.');
INSERT INTO "pdfs" ("id","label","slug","filename","filesize","text") VALUES (3,'Christopher''s File','christophers-file','Christopher''s File.pdf',NULL,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce leo urna, accumsan quis mi in, varius cursus enim. Praesent vitae sem at nisi posuere ultricies. Suspendisse eros massa, consequat a gravida vitae, egestas sed arcu. Nam et tristique neque, ac imperdiet urna. Nunc vel libero ut ipsum consectetur bibendum in at libero. Sed ultrices fermentum pharetra. Aenean metus tortor, vestibulum eget consequat vitae, consectetur sit amet diam. Aenean vitae turpis aliquam, lacinia velit non, eleifend risus. Integer maximus lectus tellus, sit amet sagittis nibh malesuada ut.\n\nCurabitur sapien ligula, laoreet vitae nibh ac, ultrices venenatis magna. Etiam et lobortis justo. Proin eu porta nunc, vitae laoreet arcu. Suspendisse sagittis, velit eget suscipit males
');
COMMIT;
