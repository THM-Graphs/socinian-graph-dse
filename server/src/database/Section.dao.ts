import { ISection } from '../interfaces/ISection';
import Neo4jDriver from '../utils/Neo4jDriver.js';
import { QueryResult } from 'neo4j-driver';
import { ICommunication } from '../interfaces/ICommunication';
import { IAnnotation } from '../interfaces/IAnnotation.js';
import { Nullable } from '../types.js';
import { Utils } from '../utils/Utils.js';

const SECTIONS_QUERY: string = `
MATCH (s:Section) WHERE NOT (s)-[:IS_PART_OF]->(:Section)
RETURN collect(properties(s)) as sections`;

const SECTION_QUERY: string = `
MATCH (s:Section {guid: $guid})
RETURN properties(s) as section`;

const CHILDREN_QUERY: string = `
MATCH (:Section {guid: $guid})<-[:IS_PART_OF]-(s:Section)
RETURN collect(properties(s)) as sections`;

const COMMUNICATIONS_QUERY: string = `
MATCH (s:Section {guid: $guid})<-[:IS_PART_OF]-(c:Communication)
RETURN collect(properties(c)) as communications`;

const ANNOTATIONS_QUERY: string = `
MATCH (s:Section {guid: $guid})-[:HAS_ANNOTATION]-(spo:Spo)
RETURN collect(properties(spo)) as annotations`;

export default class SectionDAO {
  public static async getSections(): Promise<ISection[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(SECTIONS_QUERY);
    const sections: Nullable<ISection[]> = result?.records[0]?.get('sections');
    if (!sections) return [];

    return sections.map(Utils.stringifyNode);
  }

  public static async getSection(sectionId: string): Promise<Nullable<ISection>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(SECTION_QUERY, { guid: sectionId });
    const section: Nullable<ISection> = result?.records[0]?.get('section');
    if (!section) return null;

    return Utils.stringifyNode(section);
  }

  public static async getChildren(sectionId: string): Promise<ISection[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(CHILDREN_QUERY, { guid: sectionId });
    const sections: Nullable<ISection[]> = result?.records[0]?.get('sections');
    if (!sections) return [];

    return sections.map(Utils.stringifyNode);
  }

  public static async getCommunication(sectionId: string): Promise<ICommunication[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(COMMUNICATIONS_QUERY, { guid: sectionId });
    const communications: Nullable<ICommunication[]> = result?.records[0]?.get('communications');
    if (!communications) return [];

    return communications.map(Utils.stringifyNode);
  }

  public static async getAnnotations(sectionId: string): Promise<IAnnotation[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(ANNOTATIONS_QUERY, { guid: sectionId });
    const annotations: Nullable<IAnnotation[]> = result?.records[0]?.get('annotations');
    if (!annotations) return [];

    return annotations.map(
      (annotation: IAnnotation): IAnnotation => ({
        ...annotation,
        startIndex: Number(annotation.startIndex),
        endIndex: Number(annotation.endIndex),
        data: JSON.stringify(annotation),
      }),
    );
  }
}
