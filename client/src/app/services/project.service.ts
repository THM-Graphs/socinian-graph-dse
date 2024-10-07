import { Injectable } from '@angular/core';
import { gql, TypedDocumentNode } from 'apollo-angular';
import { IProject } from '../models/IProject.js';
import { ApolloService } from './apollo.service.js';
import { Nullable } from '../../global.js';

const GET_PROJECT: TypedDocumentNode = gql(`
  query GetProject($textId: String!) {
    project(id: $textId) {
      label
      text
      guid
    }
  }
`);

interface QueryResponse {
  project?: IProject;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends ApolloService {
  public async getProjectText(textId: string): Promise<Nullable<IProject>> {
    const variables: Record<string, string> = { textId: textId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_PROJECT, variables);
    return result?.project;
  }
}
