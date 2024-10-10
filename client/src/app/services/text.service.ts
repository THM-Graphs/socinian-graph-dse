import { Injectable } from '@angular/core';
import { gql, TypedDocumentNode } from 'apollo-angular';
import { IText } from '../models/IText';
import { ApolloService } from './apollo.service';
import { Nullable } from '../../global';

const GET_TEXT: TypedDocumentNode = gql(`
  query GetText($textId: String!) {
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
`);

interface QueryResponse {
  text?: IText;
}

@Injectable({
  providedIn: 'root',
})
export class TextService extends ApolloService {
  public async getText(textId: string): Promise<Nullable<IText>> {
    const variables: Record<string, string> = { textId: textId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_TEXT, variables);
    return result?.text;
  }
}
