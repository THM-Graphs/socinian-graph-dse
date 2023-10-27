import { Injectable } from "@angular/core";
import { Apollo, gql, TypedDocumentNode } from "apollo-angular";
import { ApolloQueryResult } from "@apollo/client/core";
import { IProjectText } from "../models/IProjectText";

const GET_PROJECT_TEXT_BY_ID: TypedDocumentNode = gql`
  query GetProjectTextById($textId: String!) {
    projectText(id: $textId) {
      label
      text
      guid
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  constructor(private apollo: Apollo) {}

  public async getProjectText(textId: string): Promise<IProjectText | null> {
    try {
      const queryResult: ApolloQueryResult<{ projectText: IProjectText }> = (await this.apollo
        .watchQuery({
          query: GET_PROJECT_TEXT_BY_ID,
          variables: { textId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ projectText: IProjectText }>;

      return queryResult.data.projectText;
    } catch (error: unknown) {
      console.error("Failed to query project text with id", textId, error);
      return null;
    }
  }
}
