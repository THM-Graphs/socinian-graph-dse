# Digitale Methodik und Umsetzung der Edition

## Graphbasierte Digitale Edition

Als Datenspeicher für die Text- und Metadaten der Edition wird die Graphdatenbank [Neo4j](https://neo4j.com/ "Webseite der Graphdatenbank Neo4j") genutzt, deren Struktur die Semantik der TEI einbindet. Dadurch wird die hierarchische Modellierung von Text mit XML in einer graphbasierten Edition durch multidimensionale Strukturen ergänzt. Damit können verschiedene Annotationshierarchien, z.B. Layout, Formatierung, Semantik, inhaltliche Erschließung und Kommentierung etc., gemeinsam modelliert und auch ausgewertet werden.

Die Modellierung des Texts als Graph über Standoff Properties ermöglicht es, sowohl die Kriterien für eine historische als auch eine textkritische Edition zu erfüllen, da textkritische Annotationen (Korrekturen, Ergänzungen, editorische Normalisierungen etc.) wie auch inhaltsbezogene Annotationen (Personen, Orte, Konzepte, Sachanmerkungen) vorgenommen werden können. Durch die graphbasierte Modellierung können die Ergebnisse der beiden Editionsansätze innerhalb einer digitalen Edition zusammengeführt werden.


## Editionsumgebung und Eingabe-Datenmodell

Die Erfassung und editorische Bearbeitung der Briefe erfolgt in der
Editionsumgebung [ediarum](https://www.ediarum.org/ "Webseite von ediarum") der
Berlin-Brandenburgischen Akademie der Wissenschaften, die auf der
XML-Datenbank
[eXist-db](https://exist-db.org "Webseite der XML-Datenbank eXist-db")
und dem XML-Editor
[oXygen](https://www.oxygenxml.com/ "Webseite des oXygen-XML-Editors")
aufbaut.

Die Briefe und ihre Beilagen werden standardkonform nach den Richtlinien
der [Text Encoding
Initiative](https://tei-c.org/ "Webseite der Text Encoding Initiative")
in XML kodiert. Für das Projekt wird das TEI-Subset des Deutschen
Textarchivs, das
[DTA-Basisformat](http://www.deutschestextarchiv.de/doku/basisformat/ "Webseite des DTA-Basisformats"),
verwendet. Die Briefe entsprechen dem XML-Schema der Editionsumgebung
ediarum, das eng an das DTA-Basisformat angelehnt ist.

Der in der Edition verwendete erweiterte Briefbegriff – ein Brief
umfasst neben dem Brieftext auch seine Beilagen (sofern vorhanden),
wobei jeder Text (Brief oder Beilage) in mehreren Varianten (Fassungen:
Entwurf, Ausfertigung, Abschrift etc.) vorliegen kann – wird in der
digitalen Erfassung in separaten, aber miteinander verknüpften
XML-Dateien umgesetzt. Diese Kodierungsform wurde gewählt, um eine
unkomplizierte 1:1-Zuordnung der Metadaten und Textdaten in jeder
TEI-XML-Datei zu gewährleisten.

Beispielsweise hat jede Variante (Textfassung) in der Regel eine eigene
Quellenangabe (im TEI-Element `<sourceDesc>`). Bei dem hier gewählten
Ansatz enthält jede XML-Datei *einen* Text und *eine* Quellenangabe, die
ohne komplexes Parsing als zueinandergehörend interpretiert werden
können. (Im alternativen Ansatz, mehrere Textfassungen in einer Datei
zu pflegen, müssten mehrere Quellenangaben im `<teiHeader>` ihren
entsprechenden Texten mittels eindeutiger Identifier zugeordnet werden.
Für die Erfassung und Auswertung einer großen Menge von Varianten wurde
der Ansatz mit separaten Dateien als handhabbarer und effizienter
eingeschätzt.)

![Schematische, beispielhafte Darstellung der Bestandteile eines Briefes
in den Sozinianischen Briefwechseln](Erweiterter-Brief.png "Abbildung 1")
Abb. 1: Schematische, beispielhafte Darstellung der Bestandteile eines Briefes
in den Sozinianischen Briefwechseln (nach dem erweiterten Briefbegriff):
Ein Brief kann mit Beilagen versendet worden sein (hier zwei Beilagen)
und ist hier mit einer überlieferten Variante des Anschreibens
dargestellt. Auch die Beilagen können in mehreren Varianten erhalten
sein.

Das XML-Schema ist ergänzt um die minimale nötige Anzahl
projektspezifischer, TEI-konformer Erweiterungen – unter anderem zur
Modellierung des erweiterten Briefbegriffs. Die Schema-Erweiterungen
sind folgende:

- Zur Erfassung von Varianten eines Texts in separaten Dateien hat das
  Wurzel-Element `<TEI>` das Attribut `@corresp` erhalten, dessen Wert
  der ID des zugehörigen Referenzdokuments entspricht.
- Beilagen sind in `<accMat>` verknüpft.
- Das Attribut `@rend` des Elements `<msDesc>` hat den zusätzlichen
  Wert `final_copy` für Ausfertigungen (fertige, abgesendete Fassung
  des Briefes) erhalten.
- Digitalisate sind in `<facsimile>` verknüpft, wenn `<pb>` nicht
  verwendet wird oder werden kann (etwa in nicht transkribierten
  Briefen).
- In das Element `<date>` wurde das Attribut `@calendar` mit den zwei
  möglichen Werten `#Julian` und `#Gregorian` für den Julianischen und
  den Gregorianischen Kalender aufgenommen. Beide Kalender sind in den
  Quellen in Verwendung. Wo ein Datum in beiden Kalendersystemen
  genannt wird, sind beide Attributwerte angegeben.
- Das registerverweisende Element `<rs>` hat für das Attribut `@type`
  die zusätzlichen Werte `letter` (d.h. Brief oder Beilage), `source`
  (d.h. gedruckter Quellentext in Zotero) und `comet` (d.h.
  Registereintrag im Himmelserscheinungsregister) erhalten.
- Das Element `<note>` hat für das Attribut `@type` den zusätzlichen
  Wert `receipt` für Dorsualvermerke, d.h. Notizen über den Empfang
  des Briefes, erhalten.
- Das Element `<bibl>` hat für das Attribut `@type` den zusätzlichen
  Wert `ref` für Darstellungen in Zotero (Forschungsliteratur,
  Referenzwerke etc.) erhalten.

## Schnittstellen

Die Korrespondenzmetadaten werden [unter diesem Link](https://gitlab.rlp.net/adwmainz/digicademy/sbw/csv-data-dump/-/raw/main/data/cmif/corresp.xml) im [Correspondence Metadata
Interchange
format (CMIF)](https://correspsearch.net/index.xql?id=participate_cmi-format)
zur Verfügung gestellt und im Metadaten-Aggregator
[correspSearch](https://correspsearch.net/) der Berlin-Brandenburgischen
Akademie der Wissenschaften [eingebunden](https://correspsearch.net/de/suche.html?c=https://gitlab.rlp.net/adwmainz/digicademy/sbw/csv-data-dump/-/raw/main/data/cmif/corresp.xml). Mit correspSearch können
Verzeichnisse digitaler und gedruckter Briefeditionen nach Absender,
Empfänger, Schreibort und ‑datum übergreifend durchsucht werden.

Sämtliche in der Edition vorhandenen und mit GND-​Normdaten referenzierten
Entitäten ([Personen](https://gitlab.rlp.net/adwmainz/digicademy/sbw/csv-data-dump/-/raw/main/data/beacon/persons.txt),
[Orte](https://gitlab.rlp.net/adwmainz/digicademy/sbw/csv-data-dump/-/raw/main/data/beacon/places.txt),
[Sachbegriffe](https://gitlab.rlp.net/adwmainz/digicademy/sbw/csv-data-dump/-/raw/main/data/beacon/terms.txt)) können über
[BEACON-​Dateien](https://de.wikipedia.org/wiki/Wikipedia:BEACON) abgerufen
werden.
