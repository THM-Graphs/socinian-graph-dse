import { QueryResult } from 'neo4j-driver';
import { ICommunication } from '../interfaces/ICommunication';
import { IMetadata } from '../interfaces/IMetadata';
import Neo4jDriver from '../utils/Neo4jDriver.js';
import { Nullable } from '../types.js';
import { ISection } from '../interfaces/ISection.js';
import { Utils } from '../utils/Utils.js';

const COMMUNICATIONS_QUERY: string = `
MATCH (l:Metadata)<-[:HAS_LETTER]-(c:Communication)
OPTIONAL MATCH (l)-[:HAS_ANNOTATION]->(s:Sent {type: "sentPerson"})-[:SENT_BY]->(b:Entity)
WITH c{.*, letter: properties(l), dateStart: s.dateStart, sentBy: b.label} as composite
RETURN collect(properties(composite)) as communications`;

const COMMUNICATION_QUERY: string = `
MATCH (l:Metadata)<-[:HAS_LETTER]-(c:Communication {guid: $guid})
OPTIONAL MATCH (c)-[:HAS_ATTACHMENT]->(a:Metadata)

RETURN properties(c) as communication,
  collect(DISTINCT properties(a)) as attachments,
  properties(l) as letter`;

const DATE_START_QUERY: string = `
MATCH (c:Communication {guid: $guid})-[:HAS_LETTER]->(l:Metadata)-[:HAS_ANNOTATION]->(s:Sent {type: "sentPerson"})
RETURN s.dateStart as dateStart`;

const LETTER_QUERY: string = `
MATCH (l:Metadata)<-[:HAS_LETTER]-(c:Communication {guid: $guid})
RETURN properties(l) as letter`;

const ATTACHMENTS_QUERY: string = `
MATCH (a:Metadata)<-[:HAS_ATTACHMENT]-(c:Communication {guid: $guid})
RETURN collect(DISTINCT properties(a)) as attachments`;

const SECTIONS_QUERY: string = `
MATCH (c:Communication {guid: "MAIN_acr_tnp_42b"})-[:IS_PART_OF]->(s:Section)
RETURN collect(DISTINCT properties(s)) as sections`;

export default class CommunicationDAO {
  public static async getCommunications(): Promise<ICommunication[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(COMMUNICATIONS_QUERY);
    const communications: Nullable<ICommunication[]> = result?.records[0]?.get('communications');
    if (!communications) return [];

    return communications.map<ICommunication>(Utils.stringifyNode);
  }

  public static async getCommunication(communicationId: string): Promise<Nullable<ICommunication>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(COMMUNICATION_QUERY, { guid: communicationId });
    const communication: Nullable<ICommunication> = result?.records[0]?.get('communication');
    if (!communication || !result || !result.records[0]) return null;

    const letter: Nullable<IMetadata> = result.records[0].get('letter');
    const attachments: Nullable<IMetadata[]> = result.records[0].get('attachments');

    Utils.stringifyNode(communication);
    communication.attached = attachments ?? [];
    communication.letter = letter ?? null;

    return communication;
  }

  public static async getLetter(communicationId: string): Promise<Nullable<IMetadata>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(LETTER_QUERY, { guid: communicationId });
    const letter: Nullable<IMetadata> = result?.records[0]?.get('letter');
    if (!letter) return null;

    return Utils.stringifyNode(letter);
  }

  public static async getAttachments(communicationId: string): Promise<IMetadata[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(ATTACHMENTS_QUERY, { guid: communicationId });
    const attachments: Nullable<IMetadata[]> = result?.records[0]?.get('attachments');
    if (!attachments) return [];

    return attachments.map<IMetadata>(Utils.stringifyNode);
  }

  public static async getSections(communicationId: string): Promise<ISection[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(SECTIONS_QUERY, { guid: communicationId });
    const sections: Nullable<ISection[]> = result?.records[0]?.get('sections');
    if (!sections) return [];

    return sections.map<ISection>(Utils.stringifyNode);
  }

  public static async getDateStart(communicationId: string): Promise<Nullable<string>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(DATE_START_QUERY, { guid: communicationId });
    return result?.records[0]?.get('dateStart');
  }
}
