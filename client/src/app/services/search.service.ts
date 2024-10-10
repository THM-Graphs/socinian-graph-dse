import { Injectable } from '@angular/core';
import { gql, TypedDocumentNode } from 'apollo-angular';
import { ISearch } from '../models/ISearch';
import { ApolloService } from './apollo.service';
import { Nullable } from '../../global';

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
  public async getSimpleSearchResults(phrase: Nullable<string>): Promise<Nullable<ISearch>> {
    if (!phrase) return;

    const variables: Record<string, string> = { phrase: phrase };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(SEARCH_ALL_QUERY, variables);
    return result?.search;
  }
}
