import { Injectable } from '@angular/core';
import { Apollo, TypedDocumentNode } from 'apollo-angular';
import { Nullable } from '../../global.js';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  constructor(private apollo: Apollo) {}

  public async query<T>(query: TypedDocumentNode, variables: Record<string, any> = {}): Promise<Nullable<T>> {
    try {
      const result: ApolloQueryResult<Nullable<T>> = (await this.apollo
        .watchQuery({
          query: query,
          variables: variables,
          fetchPolicy: 'cache-and-network',
        })
        .result()) as ApolloQueryResult<Nullable<T>>;

      return result.data;
    } catch (error: unknown) {
      console.error('Could not complete graph query:', error, variables);
      return null;
    }
  }
}
