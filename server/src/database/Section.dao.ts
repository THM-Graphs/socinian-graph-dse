import { ISection } from "../models/ISection";
import Neo4jDriver from "./Neo4jDriver";
import { QueryResult } from "neo4j-driver";
import { ICommunication } from "../models/ICommunication";
import { IStandoffProperty } from "../models/IStandoffProperty";

interface Neo4JSection {
  guid: string;
  label: string;
  [key: string]: unknown;
}

export default class SectionDAO {
  public static async getAllSections(): Promise<ISection[]> {
    const query: string = `
    MATCH (s:Section) WHERE NOT (s)-[:IS_PART_OF]->(:Section)
    RETURN properties(s) as sections`;

    const result: QueryResult = await Neo4jDriver.runQuery(query);
    const sections: ISection[] = [];

    for (const entry of result.records) {
      const section: Neo4JSection = entry.get("sections");
      const data: string = JSON.stringify(section ?? "");
      sections.push({ ...section, data });
    }

    return sections;
  }

  public static async getChildren(sectionId: string): Promise<ISection[]> {
    const query: string = `
    MATCH (:Section {guid: $sectionId})<-[:IS_PART_OF]-(s:Section) 
    RETURN collect(properties(s)) as sections`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { sectionId });
    const sections: Neo4JSection[] = result.records[0]?.get("sections") ?? [];
    return sections.map((section) => ({ ...section, data: JSON.stringify(section) }));
  }

  public static async getSection(sectionId: string): Promise<ISection | null> {
    const query: string = `MATCH (s:Section) WHERE s.guid = $sectionId RETURN properties(s) as section`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { sectionId });
    const section: ISection = result.records[0]?.get("section");
    if (!section) return null;

    const data: string = JSON.stringify(section);
    return { guid: section.guid, label: section.label, text: section.text, data };
  }

  public static async getCommunication(sectionId: string): Promise<ICommunication[]> {
    const query: string = `
    MATCH (s:Section)<-[:IS_PART_OF]-(c:Communication) WHERE s.guid = $sectionId 
    RETURN collect(properties(c)) as communication`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { sectionId });
    return result.records[0]?.get("communication") ?? [];
  }

  public static async getProperties(sectionId: string): Promise<IStandoffProperty[]> {
    const query: string = `
    MATCH (s:Section {guid: $sectionId})-[:HAS_ANNOTATION]-(spo:Spo)
    RETURN collect(properties(spo)) as standoffProperties`;

    const result: QueryResult = await Neo4jDriver.runQuery(query, { sectionId });
    const standoffProperties: IStandoffProperty[] = result.records[0].get("standoffProperties") ?? [];
    return standoffProperties.map((standoffProperty: IStandoffProperty) => ({
      ...standoffProperty,
      startIndex: Number(standoffProperty.startIndex),
      endIndex: Number(standoffProperty.endIndex),
      data: JSON.stringify(standoffProperty),
    }));
  }
}
