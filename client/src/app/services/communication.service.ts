import { Injectable } from '@angular/core';
import { gql, TypedDocumentNode } from 'apollo-angular';
import { ICommunication } from '../models/ICommunication';
import { ApolloService } from './apollo.service';
import { Nullable } from '../../global';

const GET_ALL_COMMUNICATIONS: TypedDocumentNode = gql(`
  query GetAllCommunications {
    communications {
      guid
      dateStart
      attachments
      variants
      letter {
        doctype
        editor
        label
        status
      }
    }
  }
`);
const GET_COMMUNICATION: TypedDocumentNode = gql(`
  query GetCommunication($communicationId: String!) {
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
        attachedBy {
          guid
          letter {
            guid
            label
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
          metadataFunder
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
      attached {
        guid
        label
        variants {
          guid
          label
        }
      }
    }
  }
`);

interface QueryResponse {
  communications?: ICommunication[];
  communication?: ICommunication;
}

@Injectable({
  providedIn: 'root',
})
export class CommunicationService extends ApolloService {
  public async getCommunications(): Promise<ICommunication[]> {
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_ALL_COMMUNICATIONS);
    return result?.communications ?? [];
  }

  public async getCommunication(communicationId: string): Promise<Nullable<ICommunication>> {
    const variables: Record<string, string> = { communicationId: communicationId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_COMMUNICATION, variables);
    return result?.communication;
  }
}
