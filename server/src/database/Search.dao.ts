import { ISearchLetterEntry, ISearchEntity } from "../models/ISearch";
import Neo4jDriver from "./Neo4jDriver";
import { QueryResult } from "neo4j-driver";
import { Utils } from "../utils/Utils";
import removeAccents from "remove-accents";

const OCCURRENCE_LENGTH = 50;

export default class SearchDAO {
  public static async getLetters(
    phrase: string,
  ): Promise<ISearchLetterEntry[]> {
    const searchArray: string[] = Utils.matchWordsAndQuotes(phrase);
    const searchStatement: string[] = searchArray.map((_, index: number) => {
      return `toLower(t.text) CONTAINS toLower($${index.toString()}) 
              OR toLower(t.normalizedText) CONTAINS toLower($${index.toString()})
              OR toLower(lm.label) CONTAINS toLower($${index.toString()})
              OR toLower(lm.normalizedLabel) CONTAINS toLower($${index.toString()})`;
    });

    const query: string = `
    MATCH (t:Text)<-[]-(lm:Metadata) 
    WHERE ${searchStatement.join(" AND ")} 
    RETURN DISTINCT collect({guid: lm.guid, label: lm.label, text: t.text}) as letters`;

    if (searchArray.length === 0) return [];
    searchArray.push(
      ...searchArray.map((searchString: string) => removeAccents(searchString)),
    );

    const result: QueryResult = await Neo4jDriver.runQuery(
      query,
      Utils.arrayToObject(searchArray),
    );
    const letters: ISearchLetterEntry[] =
      result.records[0]?.get("letters") ?? [];

    letters.forEach((letter: ISearchLetterEntry) => {
      letter.occurrences = [];
      const text = (letter as any).text ?? "";
      let index: number = -1;
      let endIndex: number = 0;

      for (let phrase of searchArray) {
        phrase = removeAccents(phrase);
        while (
          (index = text
            .toLocaleLowerCase()
            .indexOf(phrase.toLocaleLowerCase(), endIndex)) > -1
        ) {
          const startIndex =
            index - OCCURRENCE_LENGTH < 0 ? 0 : index - OCCURRENCE_LENGTH;
          endIndex =
            index + OCCURRENCE_LENGTH > text.length
              ? text.length
              : index + OCCURRENCE_LENGTH;
          letter.occurrences.push(text.substring(startIndex, endIndex));
        }
      }

      if (letter.occurrences.length === 0) {
        letter.occurrences.push(text.substring(0, OCCURRENCE_LENGTH * 2));
      }
    });

    return letters;
  }

  public static async getEntities(phrase: string): Promise<ISearchEntity[]> {
    const searchArray: string[] = Utils.matchWordsAndQuotes(phrase);
    if (searchArray.length === 0) return [];

    const searchStatement: string[] = searchArray.map((_, index: number) => {
      return `toLower(e.label) CONTAINS toLower($${index.toString()})`;
    });
    const query: string = `
    MATCH (e:Entity) WHERE ${searchStatement.join(" AND ")}
    RETURN DISTINCT collect({guid: e.guid, label: e.label, type: e.type}) as entities`;

    const result: QueryResult = await Neo4jDriver.runQuery(
      query,
      Utils.arrayToObject(searchArray),
    );
    return result.records[0]?.get("entities") ?? [];
  }
}
