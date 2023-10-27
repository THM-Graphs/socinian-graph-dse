import { Injectable } from "@angular/core";
import { Apollo, gql, TypedDocumentNode } from "apollo-angular";
import { ApolloQueryResult } from "@apollo/client/core";
import { ICommunication } from "../models/ICommunication";

const GET_ALL_COMMUNICATIONS: TypedDocumentNode = gql`
  query GetAllCommunications {
    communications {
      guid
      letter {
        doctype
        editor
        label
        status
        variants {
          guid
          label
        }
        participants {
          type
          dateStart
        }
      }
      attachments {
        guid
        label
      }
    }
  }
`;

const GET_COMMUNICATION_BY_ID: TypedDocumentNode = gql`
  query GetCommunicationById($communicationId: String!) {
    communication(id: $communicationId) {
      guid
      letter {
        guid
        doctype
        editor
        label
        status
        abstract {
          text
          standoffProperties {
            guid
            startIndex
            endIndex
            text
            teiType
            type
            data
          }
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
        variants {
          guid
          label
          text
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
          metadataLanguage
          metadataLicence
          metadataShelfmark
          metadataTextGenre
          metadataTextType
          metadataArchive
          metadataIsReference
          metadataPrintSourceName
          metadataPrintSourceUrl
          standoffProperties {
            guid
            startIndex
            endIndex
            text
            teiType
            type
            data
          }
        }
      }
      attachments {
        guid
        label
        variants {
          guid
          label
        }
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class CommunicationService {
  constructor(private apollo: Apollo) {}

  public async getCommunications(): Promise<ICommunication[]> {
    try {
      const queryResult: ApolloQueryResult<{ communications: ICommunication[] }> = (await this.apollo
        .watchQuery({
          query: GET_ALL_COMMUNICATIONS,
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ communications: ICommunication[] }>;

      return queryResult.data.communications;
    } catch (error: unknown) {
      console.error("Failed to query communications:", error);
      return [];
    }
  }

  public async getCommunication(communicationId: string): Promise<ICommunication | null> {
    try {
      const queryResult: ApolloQueryResult<{ communication: ICommunication }> = (await this.apollo
        .watchQuery({
          query: GET_COMMUNICATION_BY_ID,
          variables: { communicationId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ communication: ICommunication }>;

      return queryResult.data.communication;
    } catch (error: unknown) {
      console.error("Failed to query communication by id", communicationId, error);
      return null;
    }
  }
}
