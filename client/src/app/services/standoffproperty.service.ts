import { Injectable } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql, TypedDocumentNode } from "apollo-angular";
import { IEntity } from "../models/IEntity";
import { IText } from "../models/IText";

const GET_COMMENT_BY_ID: TypedDocumentNode = gql`
  query GetCommentById($standoffPropertyId: String!) {
    comment(id: $standoffPropertyId) {
      guid
      label
      text
      standoffProperties {
        startIndex
        guid
        endIndex
        text
        teiType
        type
        data
      }
    }
  }
`;

const GET_REFERS_VARIANT_BY_ID: TypedDocumentNode = gql`
  query GetRefersVariantById($standoffPropertyId: String!) {
    refersVariant(id: $standoffPropertyId) {
      guid
      label
      letter {
        guid
        label
      }
    }
  }
`;

const GET_REFERS_ENTITY_BY_ID: TypedDocumentNode = gql`
  query GetRefersEntityById($standoffPropertyId: String!) {
    refersEntity(id: $standoffPropertyId) {
      guid
      label
    }
  }
`;

const GET_REFERENCE_BY_ID: TypedDocumentNode = gql`
  query GetReferenceById($standoffPropertyId: String!) {
    reference(id: $standoffPropertyId) {
      guid
      label
      text
      letter {
        guid
        label
      }
      standoffProperties {
        startIndex
        guid
        endIndex
        text
        teiType
        type
        data
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class StandoffPropertyService {
  constructor(private apollo: Apollo) {}

  public async getVariant(standoffPropertyId: string): Promise<IText | null> {
    try {
      const queryResult: ApolloQueryResult<{ refersVariant: IText }> = (await this.apollo
        .watchQuery({
          query: GET_REFERS_VARIANT_BY_ID,
          variables: { standoffPropertyId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ refersVariant: IText }>;

      return queryResult.data.refersVariant;
    } catch (error: unknown) {
      console.error("Failed to query refersVariant with id", standoffPropertyId, error);
      return null;
    }
  }

  public async getEntity(standoffPropertyId: string): Promise<IEntity | null> {
    try {
      const queryResult: ApolloQueryResult<{ refersEntity: IEntity }> = (await this.apollo
        .watchQuery({
          query: GET_REFERS_ENTITY_BY_ID,
          variables: { standoffPropertyId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ refersEntity: IEntity }>;

      return queryResult.data.refersEntity;
    } catch (error: unknown) {
      console.error("Failed to query refersEntity with id", standoffPropertyId, error);
      return null;
    }
  }

  public async getComment(standoffPropertyId: string): Promise<IText | null> {
    try {
      const queryResult: ApolloQueryResult<{ comment: IText }> = (await this.apollo
        .watchQuery({
          query: GET_COMMENT_BY_ID,
          variables: { standoffPropertyId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ comment: IText }>;

      return queryResult.data.comment;
    } catch (error: unknown) {
      console.error("Failed to query comment by id", standoffPropertyId, error);
      return null;
    }
  }

  public async getReference(standoffPropertyId: string): Promise<IText | null> {
    try {
      const queryResult: ApolloQueryResult<{ reference: IText }> = (await this.apollo
        .watchQuery({
          query: GET_REFERENCE_BY_ID,
          variables: { standoffPropertyId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ reference: IText }>;

      return queryResult.data.reference;
    } catch (error: unknown) {
      console.error("Failed to query reference by id", standoffPropertyId, error);
      return null;
    }
  }
}
