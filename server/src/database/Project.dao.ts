import { QueryResult } from 'neo4j-driver';
import Neo4jDriver from '../utils/Neo4jDriver.js';
import { Nullable } from '../types.js';
import { IBaseText } from '../interfaces/IText.js';
import { Utils } from '../utils/Utils.js';

const PROJECT_TEXT_QUERY: string = `
MATCH (t:Project {guid: $guid})
RETURN properties(t) as projectText`;

export default class ProjectDAO {
  public static async getProjectText(projectTextId: string): Promise<Nullable<IBaseText>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(PROJECT_TEXT_QUERY, { guid: projectTextId });
    const text: Nullable<IBaseText> = result?.records[0]?.get('projectText');
    if (!text) return null;

    return Utils.stringifyNode(text);
  }
}
