# Download der Briefe als TEI-XML-Dateien

Im GitLab-Daten-Repositorium des Projekts stehen alle publizierten Briefe [zum Download zur Verfügung](https://gitlab.rlp.net/adwmainz/digicademy/sbw/csv-data-dump/-/tree/main/data/xml/letters). Der gesamte Ordner kann u.a. [als Zip heruntergeladen werden](https://gitlab.rlp.net/adwmainz/digicademy/sbw/csv-data-dump/-/archive/main/csv-data-dump-main.zip?path=data/xml/letters).

Die Zusammenstellung der Inhalte pro Datei orientiert sich am Briefbegriff, den das Projekt ansetzt – das heißt, die Zusammenstellung eines Anschreibens und seiner Beilagen.

## TEI-Struktur der Download-Daten

Die Kodierung der Download-Daten ist konform zum TEI P5 Standard.

### `<teiCorpus>` – Anschreiben und Beilagen

Auf oberster struktureller Ebene ist die Zusammenstellung von Anschreiben und (null, einer oder mehrerer) Beilagen im Wurzelknoten `<teiCorpus>` mit potenziell mehreren `<TEI>`-Kind-Elementen umgesetzt. Das reflektiert den im Projekt vorliegenden inhaltlichen Befund, dass Beilagen Texte mit einem höheren Grad an Selbstständigkeit sein können – sie wurden teilweise mehrfach als Beilagen zu verschiedenen Anschreiben zirkuliert, oder stellenweise entstanden sie außerhalb der Korrespondenz (Nachrichten-Drucke) oder wurden nach dem Versand weiterentwickelt (Skizzen, die als professionelle Stiche umgesetzt wurden). In der Kodierpraxis bedeutet das, dass (Anschreibe-)Briefe und Beilagen separate Metadaten erhalten, unter dem Pfad `/teiCorpus/TEI/teiHeader`.

Da Beilagen teilweise im eigentlichen Sinn zirkulierten – also mehrfach weiter versendet wurden – können sie im Sozinianer-Korpus in mehreren Kontexten auftreten. Diese Wiederholungen sind im XML-Download umgesetzt. Die angebotenen Dateien entsprechen nicht einzigartigen Texten, sondern einzelnen Brief-Versand-Vorgängen. Pro Datei gibt es exakt einen Anschreibe-Brief (`/teiCorpus/TEI[@n = 'cover_letter']`) – dieser ist tatsächlich ohne Wiederholungen. Die möglichen Beilagen pro Datei (`/teiCorpus/TEI[@n = 'attachment']`) können auch in anderen Dateien vorkommen. Nicht alle Briefe haben Beilagen, entsprechend sind sie im XML optional. Ebenfalls kann es vorkommen, dass ein Anschreiben i.d.R. vom Empfänger wiederum als Beilage weitergeleitet wurde. Auch in diesen Fällen erscheint in den Download-Dateien dieser Brieftext dann in mehr als einer Datei.

Das Wurzel-Element `<teiCorpus>` enthält unter dem Pfad `/teiCorpus/standOff/(listPerson|listPlace|list)` alle Registereinträge, die für diese Datei relevant sind. Auf die `@xml:id` der Einträge beziehen sich `<rs>`-Elemente im Text mit dem `@corresp`-Attribut. Die Listen-Elemente sind optional und liegen nicht in allen Dateien vor.

### `/teiCorpus/TEI/TEI` – Varianten/Textzeugen

Das Sozinianer-Projekt erfasst, wo mehrere Textzeugen vorliegen, alle im Volltext. Hierbei handelt es sich um Varianten eines grundlegend gleichen Textes. Im Download-XML sind die Textzeugen in ein gemeinsames `<TEI>`-Elternelement gruppiert, das auch die Metadaten fasst, die allen Textzeugen gemeinsam sind – insbesondere `<title type="main">`, `<correspDesc>` und `<abstract>`. Allerdings divergieren andere Teile der Metadaten, insbesondere `<sourceDesc>` und `<notesStmt>`. Deshalb sind mit der hierarchischen Struktur `/teiCorpus/TEI/TEI` folgende Möglichkeit wahrgenommen:

* Gemeinsamkeiten in Metadaten zusammenzulegen: `/teiCorpus/TEI/teiHeader`
* spezifische Metadaten getrennt zu halten: `/teiCorpus/TEI/TEI/teiHeader`
* separate Volltexte von Textzeugen zu erfassen: `/teiCorpus/TEI/TEI/text/body`

Die hierarchische Unterteilung reflektiert damit auch die inhaltliche und abstraktere Auffassung als Text, und die archivarische und konkretere als Textzeuge.

Pro Text (Brief/Beilage – `/teiCorpus/TEI`) ist der erste Textzeuge als Referenz-Variante gekennzeichnet: `/teiCorpus/TEI/TEI[@n = 'reference_witness']`. Die Referenz-Variante wird in der Tiefenerschließung bevorzugt behandelt, erhält also prioritär die Annotation von Entitäten. Die Transkription der weiteren Textzeugen erfolgt nach den gleichen Richtlinien, nur die Auszeichnung von Registereinträgen und die Sachkommentierung entfällt i.d.R. Die Reihenfolge in der Anordnung der zusätzlichen Varianten ist nicht festgelegt; ihr ist keine Bedeutung beizumessen.

### `<revisionDesc>` – Redaktionsstatus/Erschließungstiefe

Unter `/teiCorpus/TEI/TEI/teiHeader/revisionDesc` ist der im Projekt etablierte Redaktionsstatus festgehalten, der die Erschließungstiefe der zur Publikation freigegebenen Daten angibt. Die drei in der Publikation enthaltenen Werte sind:

* »Metadaten« – Korrespondenz-Metadaten in `/teiCorpus/TEI/teiHeader/profileDesc/correspDesc` und Textzeugen-Quellenangaben in `/teiCorpus/TEI/TEI/fileDesc/sourceDesc`, aber noch kein Regest und keine Transkription
* »Transkription« – Transkription mit grundlegenden editorischen Befunden in `/teiCorpus/TEI/TEI/text/body`, aber noch keine inhaltliche Tiefenerschließung
* »Tiefenerschließung« – Regest in `/teiCorpus/TEI/profileDesc/abstract` und Annotation von Entitäten in `/teiCorpus/TEI/TEI/text/body` sowie Sachkommentierung
