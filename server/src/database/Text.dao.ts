import { QueryResult } from 'neo4j-driver';
import { IMetadata } from '../interfaces/IMetadata';
import { IText } from '../interfaces/IText';
import Neo4jDriver from '../utils/Neo4jDriver.js';
import { Nullable } from '../types.js';
import { Utils } from '../utils/Utils.js';

const TEXT_QUERY: string = `
MATCH (t:Text {guid: $guid})
RETURN properties(t) as text`;

const METADATA_QUERY: string = `
MATCH (t:Text {guid: $guid})<-[:HAS_TEXT]-(m:Metadata)
RETURN properties(m) as metadata`;

const REMARK_QUERY: string = `
MATCH (t:Text {guid: $guid})-[:HAS_ANNOTATION]->(s:Spo)<-[:COMMENT_ON]-(r:Text)
WHERE s.teiType = "comment"
RETURN properties(r) as remark`;

export default class TextDAO {
  public static async getText(textId: string): Promise<Nullable<IText>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(TEXT_QUERY, { guid: textId });
    const text: Nullable<IText> = result?.records[0]?.get('text');
    if (!text) return null;

    return Utils.stringifyNode(text);
  }

  public static async getMetadata(textId: string): Promise<Nullable<IMetadata>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(METADATA_QUERY, { guid: textId });
    const metadata: Nullable<IMetadata> = result?.records[0]?.get('metadata');
    if (!metadata) return null;

    return Utils.stringifyNode(metadata);
  }

  public static async getRemark(textId: string): Promise<Nullable<IText>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(REMARK_QUERY, { guid: textId });
    const text: Nullable<IText> = result?.records[0]?.get('remark');
    if (!text) return null;

    return Utils.stringifyNode(text);
  }
}
