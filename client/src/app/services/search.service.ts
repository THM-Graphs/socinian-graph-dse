import { Injectable } from "@angular/core";
import { Apollo, gql, TypedDocumentNode } from "apollo-angular";
import { ISearch } from "../models/ISearch";
import { ApolloQueryResult } from "@apollo/client/core";

const SEARCH_ALL_QUERY: TypedDocumentNode = gql`
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
`;

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private apollo: Apollo) {}

  public async getSimpleSearchResults(phrase: string): Promise<ISearch> {
    const queryResult: ApolloQueryResult<{ search: ISearch }> = (await this.apollo
      .watchQuery({
        query: SEARCH_ALL_QUERY,
        variables: { phrase },
        fetchPolicy: "cache-and-network",
      })
      .result()) as ApolloQueryResult<{ search: ISearch }>;
    return queryResult?.data?.search ?? null;
  }
}
