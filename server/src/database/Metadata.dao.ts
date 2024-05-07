import Neo4jDriver from "./Neo4jDriver";
import { QueryResult } from "neo4j-driver";
import { IText } from "../models/IText";
import { IMetadata } from "../models/IMetadata";
import { IEntity } from "../models/IEntity";
import { IParticipant } from "../models/IParticipant";

export default class MetadataDAO {
  public static async getAllMetadata(): Promise<IMetadata[]> {
    const query: string = `MATCH (m:Metadata) RETURN collect(properties(m)) as metadata`;
    const result: QueryResult = await Neo4jDriver.runQuery(query);

    const metadata: IMetadata[] = result.records[0]?.get("metadata") ?? [];
    return metadata.map((m: IMetadata) => ({ ...m, data: JSON.stringify(m) }));
  }

  public static async getMetadata(metadataId: string): Promise<IMetadata> {
    const query: string = `MATCH (m:Metadata {guid: $metadataId}) RETURN properties(m) as metadata`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, {
      metadataId,
    });

    const metadata: IMetadata = result.records[0]?.get("metadata") ?? null;
    if (metadata) metadata.data = JSON.stringify(metadata);
    return metadata;
  }

  public static async getAbstract(metadataId: string): Promise<IText> {
    const query: string = `
    MATCH (m:Metadata {guid: $metadataId})-[:HAS_TEXT]->(t:Text {type: "abstract"}) 
    RETURN properties(t) as abstract`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, {
      metadataId,
    });

    const abstract: IText = result.records[0]?.get("abstract") ?? null;
    if (abstract) abstract.data = JSON.stringify(abstract);
    return abstract;
  }

  public static async getParticipants(
    metadataId: string,
  ): Promise<IParticipant[]> {
    const query: string = `
    MATCH (m:Metadata {guid: $metadataId})-[:HAS_ANNOTATION]-(unknown)--(e:Entity)
    RETURN properties(unknown) as participant, collect(properties(e)) as entities`;

    const participants: IParticipant[] = [];
    const result: QueryResult = await Neo4jDriver.runQuery(query, {
      metadataId,
    });

    for (const record of result.records) {
      const participant: IParticipant = record.get("participant");
      const entities: IEntity[] = record.get("entities") ?? [];
      const place: IEntity = entities.find((e: IEntity) => e.type === "place");
      const person: IEntity = entities.find(
        (e: IEntity) => e.type === "person",
      );
      const data: string = JSON.stringify(participant ?? "");

      participants.push({ ...participant, place, person, data });
    }

    return participants;
  }

  public static async getVariants(metadataId: string): Promise<IText[]> {
    const query: string = `
    MATCH (m:Metadata {guid: $metadataId})-[:HAS_TEXT]->(t:Text {type: "variant"})
    RETURN collect(properties(t)) as variants`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, {
      metadataId,
    });

    const variants: IText[] = result.records[0]?.get("variants") ?? [];
    return variants.map((v: IText) => ({ ...v, data: JSON.stringify(v) }));
  }
}
