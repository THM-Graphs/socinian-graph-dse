import { QueryResult } from "neo4j-driver";
import { IProjectText } from "../models/IProjectText";
import Neo4jDriver from "./Neo4jDriver";

export default class ProjectTextDao {
  public static async getProjectText(projectTextId: string): Promise<IProjectText> {
    const query: string = `MATCH (t:Project {guid: $projectTextId}) RETURN properties(t) as projectText`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, { projectTextId });

    const projectText: IProjectText = result.records[0]?.get("projectText") ?? null;
    if (projectText) projectText.data = JSON.stringify(projectText);
    return projectText;
  }
}
