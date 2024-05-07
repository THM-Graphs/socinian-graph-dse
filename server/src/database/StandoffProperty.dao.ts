import { QueryResult } from "neo4j-driver";
import { IEntity } from "../models/IEntity";
import { IMetadata } from "../models/IMetadata";
import { IStandoffProperty as IStandoffProperty } from "../models/IStandoffProperty";
import { IText } from "../models/IText";
import Neo4jDriver from "./Neo4jDriver";

export default class StandoffPropertyDAO {
  public static async getProperties(
    textId: string,
  ): Promise<IStandoffProperty[]> {
    const query: string = `
    MATCH (t:Text {guid: $textId})-[:HAS_ANNOTATION]-(s:Spo)
    RETURN collect(properties(s)) as standoffProperties`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { textId });
    const standoffProperties: IStandoffProperty[] =
      result.records[0]?.get("standoffProperties") ?? [];
    return standoffProperties.map((standoffProperty: IStandoffProperty) => ({
      ...standoffProperty,
      data: JSON.stringify(standoffProperty),
    }));
  }

  public static async getComment(standoffPropertyId: string): Promise<IText> {
    const query: string = `
    MATCH (s:Spo {guid: $standoffPropertyId})<-[:COMMENT_ON]-(t:Text)
    RETURN properties(t) as text`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, {
      standoffPropertyId,
    });

    const text: IText = result.records[0]?.get("text") ?? null;
    if (text) text.data = JSON.stringify(text);
    return text;
  }

  public static async getReference(standoffPropertyId: string): Promise<IText> {
    const query: string = `
    MATCH (s:Spo {guid: $standoffPropertyId})-[:REFERS_TO]->(r:Text)
    MATCH (r)-[:COMMENT_ON]-()-[:HAS_ANNOTATION]-()-[:HAS_TEXT]-(m:Metadata)
    RETURN properties(r) as reference, properties(m) as metadata`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, {
      standoffPropertyId,
    });

    const text: IText = result.records[0]?.get("reference") ?? null;
    if (!text) return null;

    text.letter = result.records[0]?.get("metadata") ?? null;
    return text;
  }

  public static async getVariant(standoffPropertyId: string): Promise<IText> {
    const query: string = `
    MATCH (s:Spo {guid: $standoffPropertyId})-[:REFERS_TO]->(v:Text)
    RETURN properties(v) as variant`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, {
      standoffPropertyId,
    });

    const text: IText = result.records[0]?.get("variant") ?? null;
    if (text) text.data = JSON.stringify(text);
    return text;
  }

  public static async getEntity(standoffPropertyId: string): Promise<IEntity> {
    const query: string = `
    MATCH (s:Spo {guid: $standoffPropertyId})-[:REFERS_TO]->(e:Entity)
    RETURN properties(e) as entity`;
    const result: QueryResult = await Neo4jDriver.runQuery(query, {
      standoffPropertyId,
    });

    const entity: IEntity = result.records[0]?.get("entity") ?? null;
    if (entity) entity.data = JSON.stringify(entity);
    return entity;
  }
}
