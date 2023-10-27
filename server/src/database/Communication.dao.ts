import { QueryResult } from "neo4j-driver";
import { ICommunication } from "../models/ICommunication";
import { IMetadata } from "../models/IMetadata";
import { IText } from "../models/IText";
import Neo4jDriver from "./Neo4jDriver";

export default class CommunicationDAO {
  public static async getCommunications(): Promise<ICommunication[]> {
    const query: string = `
    MATCH (l:Metadata)<-[:HAS_LETTER]-(c:Communication)
    OPTIONAL MATCH (c)-[:HAS_ATTACHMENT]->(a:Metadata)
    OPTIONAL MATCH (l)-[:HAS_TEXT]->(v:Text {type: "variant"})
    RETURN  properties(c) as communication, 
            collect(DISTINCT properties(a)) as attachment, 
            properties(l) as letter,
            collect(DISTINCT properties(v)) as variants`;

    const communications: ICommunication[] = [];
    const result: QueryResult = await Neo4jDriver.runQuery(query);

    for (const record of result.records) {
      const communication: ICommunication = record.get("communication");
      const data: string = JSON.stringify(communication ?? "");

      const letter: IMetadata = record.get("letter") ?? null;
      const variants: IText[] = record.get("variants") ?? [];
      const attachments: IMetadata[] = record.get("attachment") ?? [];

      letter.variants = variants;
      communications.push({ guid: communication.guid, letter, attachments, data });
    }

    return communications;
  }

  public static async getCommunication(communicationId: string): Promise<ICommunication> {
    const query: string = `
    MATCH (l:Metadata)<-[:HAS_LETTER]-(c:Communication {guid: $communicationId})
    OPTIONAL MATCH (c)-[:HAS_ATTACHMENT]->(a:Metadata)
    RETURN properties(c) as communication, collect(DISTINCT properties(a)) as attachment, properties(l) as letter`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { communicationId });
    const communication: ICommunication = result.records[0]?.get("communication") ?? null;
    if (!communication) return communication;

    communication.data = JSON.stringify(communication);
    communication.attachments = result.records[0].get("attachment") ?? [];
    communication.letter = result.records[0].get("letter") ?? null;
    return communication;
  }

  public static async getLetter(communicationId: string): Promise<IMetadata> {
    const query: string = `
    MATCH (l:Metadata)<-[:HAS_LETTER]-(c:Communication {guid: $communicationId})
    RETURN properties(l) as letter`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { communicationId });
    const letter: IMetadata = result.records[0]?.get("letter") ?? null;
    if (letter) letter.data = JSON.stringify(letter);
    return letter;
  }

  public static async getAttachments(communicationId: string): Promise<IMetadata[]> {
    const query: string = `
    MATCH (a:Metadata)<-[:HAS_ATTACHMENT]-(c:Communication {guid: $communicationId})
    RETURN collect(DISTINCT properties(a)) as attachment`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { communicationId });
    const attachments: IMetadata[] = result.records[0]?.get("attachment") ?? [];
    return attachments.map((m: IMetadata) => ({ ...m, data: JSON.stringify(m) }));
  }
}
