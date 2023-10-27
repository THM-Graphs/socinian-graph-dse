import { QueryResult } from "neo4j-driver";
import { IMetadata } from "../models/IMetadata";
import { IText } from "../models/IText";
import Neo4jDriver from "./Neo4jDriver";

export default class TextDAO {
  public static async getText(textId: string): Promise<IText> {
    const query: string = `MATCH (t:Text {guid: $textId}) RETURN properties(t) as text`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, { textId });

    const text: IText = result.records[0]?.get("text") ?? null;
    if (text) text.data = JSON.stringify(text);
    return text;
  }

  public static async getLetter(textId: string): Promise<IMetadata> {
    const query: string = `
    MATCH (t:Text {guid: $textId})<-[:HAS_TEXT]-(m:Metadata)
    RETURN properties(m) as metadata`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, { textId });

    const metadata: IMetadata = result.records[0]?.get("metadata") ?? null;
    if (metadata) metadata.data = JSON.stringify(metadata);
    return metadata;
  }

  public static async getRemark(textId: string): Promise<IText> {
    const query: string = `
    MATCH (t:Text {guid: $textId})-[:HAS_ANNOTATION]->(s:Spo)<-[:COMMENT_ON]-(r:Text)
    WHERE s.teiType = "comment"
    RETURN properties(r) as remark`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, { textId });

    const text: IText = result.records[0]?.get("remark") ?? null;
    if (text) text.data = JSON.stringify(text);
    return text;
  }
}
