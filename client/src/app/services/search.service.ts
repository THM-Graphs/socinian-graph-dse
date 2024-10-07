import { Injectable } from '@angular/core';
import { gql, TypedDocumentNode } from 'apollo-angular';
import { ISearch } from '../models/ISearch';
import { ApolloService } from './apollo.service.js';
import { Nullable } from '../../global.js';

const SEARCH_ALL_QUERY: TypedDocumentNode = gql(`
  query search($phrase: String!) {
    search(phrase: $phrase) {
      letters {
        guid
        occurrences
        label
      }
      entities {
        guid
        label
        type
      }
    }
  }
`);

interface QueryResponse {
  search: ISearch;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService extends ApolloService {
  public async getSimpleSearchResults(phrase: string): Promise<Nullable<ISearch>> {
    const variables: Record<string, string> = { phrase: phrase };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(SEARCH_ALL_QUERY);
    return result?.search;
  }
}
