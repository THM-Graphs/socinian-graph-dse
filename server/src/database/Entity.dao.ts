import Neo4jDriver from '../utils/Neo4jDriver.js';
import { QueryResult } from 'neo4j-driver';
import { EntityType, IAdditionalLabel, IEntity } from '../interfaces/IEntity';
import { IMetadata } from '../interfaces/IMetadata';
import { INormdata } from '../interfaces/INormdata';
import { Nullable } from '../types.js';
import { Utils } from '../utils/Utils.js';
import { IAnnotation } from '../interfaces/IAnnotation.js';

const OCCURRENCES_QUERY_FRAGMENT: string = `
WITH e,
  [(e)<-[:SENT_BY]-(:Sent)<-[:HAS_ANNOTATION]-(m:Metadata) | m] as sent,
  [(e)<-[:SENT_FROM]-(:Sent)<-[:HAS_ANNOTATION]-(m:Metadata) | m] as from,
  [(e)<-[:SENT_TO]-(:Received)<-[:HAS_ANNOTATION]-(m:Metadata) | m] as sentTo,
  [(e)<-[:REFERS_TO]-(:Spo)<-[:HAS_ANNOTATION]-(:Text)<-[:HAS_TEXT]-(m:Metadata) | m] as refers,
  [(e)<-[:RECEIVED_BY]-(:Received)<-[:HAS_ANNOTATION]-(m:Metadata) | m] as received,
  [(e)<-[:REFERS_TO]-(:Spo)<-[:HAS_ANNOTATION]-(:Text)<-[:REFERS_TO]-(:Spo)<-[:HAS_ANNOTATION]-(:Text)<-[:HAS_TEXT]-(m:Metadata) | m] as remarked
WITH *, sent + from + sentTo + received + refers + remarked as metadata, e`;

const ENTITIES_QUERY: string = `
MATCH (e:Entity {type: $type})
RETURN collect(properties(e)) as entities`;

const DETAILED_ENTITIES_QUERY: string = `
MATCH (e:Entity {type: $type}) ${OCCURRENCES_QUERY_FRAGMENT}
RETURN properties(e) AS entities,
  apoc.coll.toSet( [x in metadata | properties(x)] ) as metadata`;

const ENTITY_QUERY: string = `
MATCH (e:Entity {guid: $guid})
RETURN properties(e) as entity`;

const OCCURRENCES_QUERY: string = `
MATCH (e:Entity {guid: $guid}) ${OCCURRENCES_QUERY_FRAGMENT}
RETURN apoc.coll.toSet( [x in metadata | properties(x)] ) as occurrences`;

const ANNOTATIONS_QUERY: string = `
MATCH (:Entity {guid: $guid})<-[:REFERS_TO]-(a:Spo)
RETURN properties(a) as annotations`;

const NORMDATA_QUERY: string = `
MATCH (e:Entity {guid: $guid})-[:HAS_NORMDATA]->(n:Normdata)-[:HAS_PROVIDER]->(p:NormdataProvider)
RETURN properties(n) as normdata, properties(p) as provider`;

const LABELS_QUERY: string = `
MATCH (e:Entity {guid: $guid})-[:HAS_ADDITIONAL_LABEL]->(a:AdditionalLabel)
RETURN collect(properties(a)) as labels`;

const INFORMATION_QUERY: string = `
MATCH (e:Entity {guid: $guid})-[:HAS_ADDITIONAL_INFORMATION]->(unknown)
RETURN collect(properties(unknown)) as nodes`;

export default class EntityDAO {
  public static async getEntities(type: EntityType = ''): Promise<IEntity[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(ENTITIES_QUERY, { type });
    const entities: Nullable<IEntity[]> = result?.records[0]?.get('entities');
    if (!entities) return [];

    return entities.map<IEntity>(Utils.stringifyNode);
  }

  public static async getDetailedEntities(type: string = ''): Promise<IEntity[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(DETAILED_ENTITIES_QUERY, { type });
    if (!result) return [];

    const entities: IEntity[] = [];
    for (const record of result.records) {
      const entity: Nullable<IEntity> = record.get('entities');
      const metadata: Nullable<IMetadata[]> = record.get('metadata');
      const occurrences: IMetadata[] = metadata?.map<IMetadata>(Utils.stringifyNode) ?? [];

      if (!entity) continue;
      Utils.stringifyNode(entity);
      entity.occurrences = occurrences;
      entities.push(entity);
    }

    return entities;
  }

  public static async getEntity(entityId: string): Promise<Nullable<IEntity>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(ENTITY_QUERY, { guid: entityId });
    const entity: Nullable<IEntity> = result?.records[0]?.get('entity');
    if (!entity) return null;

    return Utils.stringifyNode(entity);
  }

  public static async getOccurrences(entityId: string): Promise<IMetadata[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(OCCURRENCES_QUERY, { guid: entityId });
    const occurrences: Nullable<IMetadata[]> = result?.records[0]?.get('occurrences');
    if (!occurrences) return [];

    return occurrences.map<IMetadata>(Utils.stringifyNode);
  }

  public static async getAnnotations(entityId: string): Promise<IAnnotation[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(ANNOTATIONS_QUERY, { guid: entityId });
    const annotations: Nullable<IAnnotation[]> = result?.records[0]?.get('annotations');
    if (!annotations) return [];

    return annotations.map<IAnnotation>(Utils.stringifyNode);
  }

  public static async getNormdata(entityId: string): Promise<INormdata[]> {
    const normdataElements: INormdata[] = [];
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(NORMDATA_QUERY, { guid: entityId });
    if (!result) return [];

    for (const record of result.records) {
      const container: Nullable<{ external_id: string }> = record.get('normdata');
      const provider: Nullable<INormdata> = record.get('provider');

      if (!container || !provider) continue;
      Utils.stringifyNode(provider);
      provider.guid = container.external_id;
      normdataElements.push(provider);
    }

    return normdataElements;
  }

  public static async getAdditionalLabels(entityId: string): Promise<IAdditionalLabel[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(LABELS_QUERY, { guid: entityId });
    const labels: Nullable<IAdditionalLabel[]> = result?.records[0]?.get('labels');
    if (!labels) return [];

    return labels.map<IAdditionalLabel>(Utils.stringifyNode);
  }

  public static async getAdditionalInformation(entityId: string): Promise<string[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(INFORMATION_QUERY, { guid: entityId });
    const additionalNodes: Nullable<unknown[]> = result?.records[0]?.get('nodes');
    if (!additionalNodes) return [];

    return additionalNodes.map((node: unknown) => JSON.stringify(node));
  }
}
