import { Injectable } from '@angular/core';
import { gql, TypedDocumentNode } from 'apollo-angular';
import { IEntity } from '../models/IEntity';
import { IText } from '../models/IText';
import { Nullable } from '../../global.js';
import { ApolloService } from './apollo.service.js';

const GET_COMMENT: TypedDocumentNode = gql(`
  query GetComment($annotationId: String!) {
    comment(id: $annotationId) {
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
`);
const GET_REFERS_VARIANT: TypedDocumentNode = gql(`
  query GetRefersVariant($annotationId: String!) {
    refersVariant(id: $annotationId) {
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
    reference(id: $annotationId) {
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
`);

interface QueryResponse {
  refersVariant?: IText;
  refersEntity?: IEntity;
  comment?: IText;
  reference?: IText;
}

@Injectable({
  providedIn: 'root',
})
export class AnnotationService extends ApolloService {
  public async getVariant(annotationId: string): Promise<Nullable<IText>> {
    const variables: Record<string, string> = { annotationId: annotationId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_REFERS_VARIANT, variables);
    return result?.refersVariant;
  }

  public async getEntity(annotationId: string): Promise<Nullable<IEntity>> {
    const variables: Record<string, string> = { annotationId: annotationId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_REFERS_ENTITY, variables);
    return result?.refersEntity;
  }

  public async getComment(annotationId: string): Promise<Nullable<IText>> {
    const variables: Record<string, string> = { annotationId: annotationId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_COMMENT, variables);
    return result?.comment;
  }

  public async getReference(annotationId: string): Promise<Nullable<IText>> {
    const variables: Record<string, string> = { annotationId: annotationId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_REFERENCE, variables);
    return result?.reference;
  }
}
