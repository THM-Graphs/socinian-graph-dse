import { QueryResult } from 'neo4j-driver';
import { IEntity } from '../interfaces/IEntity';
import { IText } from '../interfaces/IText';
import Neo4jDriver from '../utils/Neo4jDriver.js';
import { IAnnotation } from '../interfaces/IAnnotation.js';
import { Nullable } from '../types.js';
import { Utils } from '../utils/Utils.js';
import { IMetadata } from '../interfaces/IMetadata.js';

const ANNOTATIONS_QUERY: string = `
MATCH (t:Text {guid: $guid})-[:HAS_ANNOTATION]-(s:Spo)
RETURN collect(properties(s)) as annotations`;

const COMMENT_QUERY: string = `
MATCH (s:Spo {guid: $guid})<-[:COMMENT_ON]-(t:Text)
RETURN properties(t) as text`;

const REFERENCE_QUERY: string = `
MATCH (s:Spo {guid: $guid})-[:REFERS_TO]->(r:Text)
MATCH (r)-[:COMMENT_ON]-()-[:HAS_ANNOTATION]-()-[:HAS_TEXT]-(m:Metadata)
RETURN properties(r) as reference, properties(m) as metadata`;

const TEXT_QUERY: string = `
MATCH (s:Spo {guid: $guid})-[:REFERS_TO]->(v:Text)
RETURN properties(v) as text`;

const ENTITY_QUERY: string = `
MATCH (s:Spo {guid: $guid})-[:REFERS_TO]->(e:Entity)
RETURN properties(e) as entity`;

export default class AnnotationDAO {
  public static async getAnnotations(textId: string): Promise<IAnnotation[]> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(ANNOTATIONS_QUERY, { guid: textId });
    const annotations: Nullable<IAnnotation[]> = result?.records[0]?.get('annotations');
    if (!annotations) return [];

    return annotations.map(Utils.stringifyNode);
  }

  public static async getComment(annotationId: string): Promise<Nullable<IText>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(COMMENT_QUERY, { guid: annotationId });
    const text: Nullable<IText> = result?.records[0]?.get('text');
    if (!text) return null;

    return Utils.stringifyNode(text);
  }

  public static async getReference(annotationId: string): Promise<Nullable<IText>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(REFERENCE_QUERY, { guid: annotationId });
    const text: Nullable<IText> = result?.records[0]?.get('reference');
    const metadata: Nullable<IMetadata> = result?.records[0]?.get('metadata');
    if (!text) return null;

    text.letter = metadata ?? null;
    return Utils.stringifyNode(text);
  }

  public static async getText(annotationId: string): Promise<Nullable<IText>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(TEXT_QUERY, { guid: annotationId });
    const text: Nullable<IText> = result?.records[0]?.get('text');
    if (!text) return null;

    return Utils.stringifyNode(text);
  }

  public static async getEntity(annotationId: string): Promise<Nullable<IEntity>> {
    const result: Nullable<QueryResult> = await Neo4jDriver.runQuery(ENTITY_QUERY, { guid: annotationId });
    const entity: Nullable<IEntity> = result?.records[0]?.get('entity');
    if (!entity) return null;

    return Utils.stringifyNode(entity);
  }
}
