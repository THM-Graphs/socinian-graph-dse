import { Injectable } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Apollo, gql, TypedDocumentNode } from "apollo-angular";
import { IMetadata } from "../models/IMetadata";

const TEXT: string = `
guid
label
text
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
}`;

const GET_METADATA_BY_ID: TypedDocumentNode = gql`
  query GetMetadataById($metadataId: String!) {
    metadata(id: $metadataId) {
      guid
      doctype
      editor
      label
      status
      variants {
        ${TEXT}
      }
      abstract {
        ${TEXT}
      }
      participants {
        type
        dateStart
        dateEnd
        dateCertainty
        dateType
        person {
          guid
          label
          type
        }
        place {
          guid
          label
          type
        }
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class MetadataService {
  constructor(private apollo: Apollo) {}

  public async getMetadata(metadataId: string): Promise<IMetadata | null> {
    try {
      const queryResult: ApolloQueryResult<{ metadata: IMetadata }> = (await this.apollo
        .watchQuery({
          query: GET_METADATA_BY_ID,
          variables: { metadataId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ metadata: IMetadata }>;

      return queryResult.data.metadata;
    } catch (error: unknown) {
      console.error("Failed to query metadata by id", metadataId, error);
      return null;
    }
  }
}
