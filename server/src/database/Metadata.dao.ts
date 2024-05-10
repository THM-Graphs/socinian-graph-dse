import Neo4jDriver from '../utils/Neo4jDriver.js';
import { QueryResult } from 'neo4j-driver';
import { IText } from '../interfaces/IText';
import { IMetadata } from '../interfaces/IMetadata';
import { IEntity } from '../interfaces/IEntity';
import { IParticipant } from '../interfaces/IParticipant';
import { Nullable } from '../types.js';
import { Utils } from '../utils/Utils.js';

const METADATA_QUERY: string = `
MATCH (m:Metadata {guid: $guid}) RETURN properties(m) as metadata`;

const ABSTRACT_QUERY: string = `
MATCH (m:Metadata {guid: $guid})-[:HAS_TEXT]->(t:Text {type: "abstract"})
RETURN properties(t) as abstract`;

const PARTICIPANTS_QUERY: string = `
MATCH (m:Metadata {guid: $guid})-[:HAS_ANNOTATION]-(unknown)--(e:Entity)
RETURN properties(unknown) as participant, collect(properties(e)) as entities`;

const VARIANTS_QUERY: string = `
MATCH (m:Metadata {guid: $guid})-[:HAS_TEXT]->(t:Text {type: "variant"})
RETURN collect(properties(t)) as variants`;

export default class MetadataDAO {
  public static async getMetadata(metadataId: string): Promise<Nullable<IMetadata>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(METADATA_QUERY, { guid: metadataId });
    const metadata: IMetadata = result?.records[0]?.get('metadata');
    if (!metadata) return null;

    return Utils.stringifyNode(metadata);
  }

  public static async getAbstract(metadataId: string): Promise<Nullable<IText>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(ABSTRACT_QUERY, { guid: metadataId });
    const abstract: Nullable<IText> = result?.records[0]?.get('abstract');
    if (!abstract) return null;

    return Utils.stringifyNode(abstract);
  }

  public static async getParticipants(metadataId: string): Promise<IParticipant[]> {
    const participants: IParticipant[] = [];
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(PARTICIPANTS_QUERY, { guid: metadataId });
    if (!result) return [];

    for (const record of result.records) {
      const participant: Nullable<IParticipant> = record.get('participant');
      const entities: Nullable<IEntity[]> = record.get('entities');

      if (!participant || !entities) continue;
      participant.place = entities.find((e: IEntity): boolean => e.type === 'place');
      participant.person = entities.find((e: IEntity): boolean => e.type === 'person');
      Utils.stringifyNode(participant);

      participants.push(participant);
    }

    return participants;
  }

  public static async getVariants(metadataId: string): Promise<IText[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(VARIANTS_QUERY, { guid: metadataId });
    const variants: Nullable<IText[]> = result?.records[0]?.get('variants');
    if (!variants) return [];

    return variants.map(Utils.stringifyNode);
  }
}
