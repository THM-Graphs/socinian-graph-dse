import { Injectable } from '@angular/core';
import { gql, TypedDocumentNode } from 'apollo-angular';
import { IEntity } from '../models/IEntity';
import { IText } from '../models/IText';
import { Nullable } from '../../global';
import { ApolloService } from './apollo.service';

const GET_COMMENT: TypedDocumentNode = gql(`
  query GetComment($annotationId: String!) {
    refersComment(id: $annotationId) {
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
        isZeroPoint
        data
      }
    }
  }
`);
const GET_REFERS_VARIANT: TypedDocumentNode = gql(`
  query GetRefersVariant($annotationId: String!) {
    refersText(id: $annotationId) {
      guid
      label
      letter {
        guid
        label
      }
    }
  }
`);
const GET_REFERS_ENTITY: TypedDocumentNode = gql(`
  query GetRefersEntity($annotationId: String!) {
    refersEntity(id: $annotationId) {
      guid
      label
    }
  }
`);
const GET_REFERENCE: TypedDocumentNode = gql(`
  query GetReference($annotationId: String!) {
    refersReference(id: $annotationId) {
      guid
      label
      text
      letter {
        guid
        label
      }
      standoffProperties {
        startIndex
        isZeroPoint
        guid
        endIndex
        text
        teiType
        type
        data
      }
    }
  }
`);

interface QueryResponse {
  refersText?: IText;
  refersEntity?: IEntity;
  refersComment?: IText;
  refersReference?: IText;
}

@Injectable({
  providedIn: 'root',
})
export class AnnotationService extends ApolloService {
  public async getVariant(annotationId: string): Promise<Nullable<IText>> {
    const variables: Record<string, string> = { annotationId: annotationId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_REFERS_VARIANT, variables);
    return result?.refersText;
  }

  public async getEntity(annotationId: string): Promise<Nullable<IEntity>> {
    const variables: Record<string, string> = { annotationId: annotationId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_REFERS_ENTITY, variables);
    return result?.refersEntity;
  }

  public async getComment(annotationId: string): Promise<Nullable<IText>> {
    const variables: Record<string, string> = { annotationId: annotationId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_COMMENT, variables);
    return result?.refersComment;
  }

  public async getReference(annotationId: string): Promise<Nullable<IText>> {
    const variables: Record<string, string> = { annotationId: annotationId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_REFERENCE, variables);
    return result?.refersReference;
  }
}
