import Neo4jDriver from "./Neo4jDriver";
import { QueryResult } from "neo4j-driver";
import { IAdditionalLabel, IEntity } from "../models/IEntity";
import { IMetadata } from "../models/IMetadata";
import { INormdata } from "../models/INormdata";

export default class EntityDAO {
  public static async getEntities(type: string = ""): Promise<IEntity[]> {
    const query: string = `
    MATCH (e:Entity {type: $type})
    WITH e, 
      [(e)<-[:SENT_BY]-(:Sent)<-[:HAS_ANNOTATION]-(m:Metadata) | m] AS sent, 
      [(e)<-[:SENT_FROM]-(:Sent)<-[:HAS_ANNOTATION]-(m:Metadata) | m] AS from,
      [(e)<-[:SENT_TO]-(:Received)<-[:HAS_ANNOTATION]-(m:Metadata) | m] AS sentTo,
      [(e)<-[:REFERS_TO]-(:Spo)<-[:HAS_ANNOTATION]-(:Text)<-[:HAS_TEXT]-(m:Metadata) | m] AS refers, 
      [(e)<-[:RECEIVED_BY]-(:Received)<-[:HAS_ANNOTATION]-(m:Metadata) | m] AS received
    UNWIND sent + from + sentTo + received + refers AS metadata
    RETURN properties(e) as entity, collect(DISTINCT properties(metadata)) as metadata`;

    const entities: IEntity[] = [];
    const result: QueryResult = await Neo4jDriver.runQuery(query, { type });

    for (const record of result.records) {
      const entity: IEntity = record.get("entity");
      const metadata: IMetadata[] = record.get("metadata") ?? [];
      const occurrences: IMetadata[] = metadata.map((m: IMetadata) => ({
        ...m,
        data: JSON.stringify(m),
      }));
      entities.push({ ...entity, data: JSON.stringify(entity), occurrences });
    }

    return entities;
  }

  public static async getEntity(entityId: string): Promise<IEntity | null> {
    const query: string = `MATCH (e:Entity {guid: $entityId}) RETURN properties(e) as entity`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, { entityId });

    const entity: IEntity = result.records[0]?.get("entity") ?? null;
    if (entity) entity.data = JSON.stringify(entity);
    return entity;
  }

  public static async getOccurrences(entityId: string): Promise<IMetadata[]> {
    const query: string = `
    MATCH (e:Entity {guid: $entityId})
    WITH e, 
      [(e)<-[:SENT_BY]-(:Sent)<-[:HAS_ANNOTATION]-(m:Metadata) | m] AS sent, 
       [(e)<-[:SENT_FROM]-(:Sent)<-[:HAS_ANNOTATION]-(m:Metadata) | m] AS from,
      [(e)<-[:SENT_TO]-(:Received)<-[:HAS_ANNOTATION]-(m:Metadata) | m] AS sentTo,
      [(e)<-[:REFERS_TO]-(:Spo)<-[:HAS_ANNOTATION]-(:Text)<-[:HAS_TEXT]-(m:Metadata) | m] AS refers, 
      [(e)<-[:RECEIVED_BY]-(:Received)<-[:HAS_ANNOTATION]-(m:Metadata) | m] AS received
    UNWIND sent + from + sentTo + received + refers AS metadata
    RETURN collect(DISTINCT properties(metadata)) as occurrences`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { entityId });
    const letter: IMetadata[] = result.records[0]?.get("occurrences") ?? [];
    return letter.map((m: IMetadata) => ({ ...m, data: JSON.stringify(m) }));
  }

  public static async getNormdata(entityId: string): Promise<INormdata[]> {
    const query: string = `
    MATCH (e:Entity {guid: $entityId})-[:HAS_NORMDATA]->(n:Normdata)-[:HAS_PROVIDER]->(p:NormdataProvider)
    RETURN properties(n) as normdata, properties(p) as provider`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { entityId });
    const normdataElements: INormdata[] = [];

    for (const record of result.records) {
      const container: { external_id: string } = record.get("normdata");
      if (!container) continue;

      const provider: INormdata = record.get("provider") ?? {};
      provider.guid = container.external_id;
      normdataElements.push(provider);
    }

    return normdataElements;
  }

  public static async getAdditionalLabels(
    entityId: string,
  ): Promise<IAdditionalLabel[]> {
    const query: string = `
    MATCH (e:Entity {guid: $entityId})-[:HAS_ADDITIONAL_LABEL]->(a:AdditionalLabel)
    RETURN collect(properties(a)) as labels`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { entityId });
    return result.records[0]?.get("labels") ?? [];
  }

  public static async getAdditionalInformation(
    entityId: string,
  ): Promise<string[]> {
    const query: string = `
    MATCH (e:Entity {guid: $entityId})-[:HAS_ADDITIONAL_INFORMATION]->(unknown)
    RETURN collect(properties(unknown)) as nodes`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { entityId });
    const additionalInformation = result.records[0]?.get("nodes") ?? [];
    return additionalInformation.map((u: unknown) => JSON.stringify(u));
  }
}
