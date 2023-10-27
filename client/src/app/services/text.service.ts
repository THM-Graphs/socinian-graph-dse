import { Injectable } from "@angular/core";
import { Apollo, TypedDocumentNode, gql } from "apollo-angular";
import { IText } from "../models/IText";
import { ApolloQueryResult } from "@apollo/client/core";

const GET_TEXT_BY_ID: TypedDocumentNode = gql`
  query GetTextById($textId: String!) {
    text(id: $textId) {
      guid
      label
      text
      letter {
        guid
      }
      metadataLanguage
      metadataLicence
      metadataShelfmark
      metadataTextGenre
      metadataTextType
      metadataArchive
      metadataIsReference
      metadataPrintSourceName
      metadataPrintSourceUrl
      metadataRemark {
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
export class TextService {
  constructor(private apollo: Apollo) {}

  public async getText(textId: string): Promise<IText | null> {
    try {
      const queryResult: ApolloQueryResult<{ text: IText }> = (await this.apollo
        .watchQuery({
          query: GET_TEXT_BY_ID,
          variables: { textId: textId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ text: IText }>;

      return queryResult.data.text;
    } catch (error: unknown) {
      console.error("Failed to query text by id", textId, error);
      return null;
    }
  }
}
