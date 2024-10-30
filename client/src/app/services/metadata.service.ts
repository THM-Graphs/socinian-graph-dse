import { Injectable } from '@angular/core';
import { gql, TypedDocumentNode } from 'apollo-angular';
import { IMetadata } from '../models/IMetadata';
import { ApolloService } from './apollo.service';
import { Nullable } from '../../global';

const TEXT_FRAGMENT: string = `
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
metadataFunder
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
const GET_METADATA: TypedDocumentNode = gql(`
  query GetMetadata($metadataId: String!) {
    metadata(id: $metadataId) {
      guid
      doctype
      editor
      label
      status
      variants {
        ${TEXT_FRAGMENT}
      }
      abstract {
        ${TEXT_FRAGMENT}
      }
      attachedBy {
        guid
        letter {
          guid
          label
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
    }
  }
`);

interface QueryResponse {
  metadata?: IMetadata;
}

@Injectable({
  providedIn: 'root',
})
export class MetadataService extends ApolloService {
  public async getMetadata(metadataId: string): Promise<Nullable<IMetadata>> {
    const variables: Record<string, string> = { metadataId: metadataId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_METADATA, variables);
    return result?.metadata;
  }
}
