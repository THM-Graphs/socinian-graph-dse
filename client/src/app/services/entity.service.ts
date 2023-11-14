import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { ENTITY_CATEGORY } from "../constants/ENTITY_CATEGORY";
import { ApolloQueryResult, TypedDocumentNode } from "@apollo/client/core";
import { IEntity } from "../models/IEntity";

const GET_ALL_ENTITIES: TypedDocumentNode = gql`
  query GetAllEntities($type: String) {
    entities(type: $type) {
      guid
      label
      type
      occurrences {
        guid
      }
    }
  }
`;

const GET_ENTITY_BY_ID: TypedDocumentNode = gql`
  query GetEntityById($entityId: String!) {
    entity(id: $entityId) {
      guid
      label
      type
      data
      normdata {
        guid
        label
        namespace
        prefix
        wikidata
      }
      additionalLabels {
        foreName
        surname
        label
      }
      additionalInformation
      occurrences {
        guid
        doctype
        editor
        label
        status
        data
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class EntityService {
  constructor(private apollo: Apollo) {}

  public async getEntities(type?: ENTITY_CATEGORY | string): Promise<IEntity[]> {
    try {
      const queryResult: ApolloQueryResult<{ entities: IEntity[] }> = (await this.apollo
        .watchQuery({
          query: GET_ALL_ENTITIES,
          variables: { type },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ entities: IEntity[] }>;

      return queryResult.data.entities;
    } catch (error: unknown) {
      console.error("Failed to query entities:", error);
      return [];
    }
  }

  public async getEntity(entityId: string): Promise<IEntity | null> {
    try {
      const queryResult: ApolloQueryResult<{ entity: IEntity }> = (await this.apollo
        .watchQuery({
          query: GET_ENTITY_BY_ID,
          variables: { entityId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ entity: IEntity }>;

      return queryResult.data.entity;
    } catch (error: unknown) {
      console.error("Failed to query entity with id", entityId, error);
      return null;
    }
  }
}
