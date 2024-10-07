import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { TypedDocumentNode } from '@apollo/client/core';
import { ISection } from '../models/ISection';
import { ApolloService } from './apollo.service.js';
import { Nullable } from '../../global.js';

const COMMUNICATIONS_FRAGMENT: string = `
  communications {
    guid
    letter {
      label
      guid
      status
      variants {
        guid
      }
      participants {
        type
        dateStart
        dateEnd
        dateCertainty
        dateType
      }
    }
    attachments {
      label
      guid
    }
  }
`;
const GET_SECTION_LIST: TypedDocumentNode = gql(`
  query GetSectionList {
    sections {
      guid
      label
      text
      standoffProperties {
        startIndex
        endIndex
        text
        teiType
        type
        data
      }
      children {
        guid
        label
        text
        standoffProperties {
          startIndex
          endIndex
          text
          teiType
          type
          data
        }
      }
    }
  }
`);
const GET_CHILDREN_LIST: TypedDocumentNode = gql(`
  query GetChildrenList($sectionId: String!) {
    section(id: $sectionId) {
      guid
      children {
        guid
        label
        text
      }
    }
  }
`);
const GET_SECTION: TypedDocumentNode = gql(`
  query GetSection($sectionId: String!) {
    section(id: $sectionId) {
      guid
      label
      text
      standoffProperties {
        startIndex
        endIndex
        text
        teiType
        type
        data
      }
      ${COMMUNICATIONS_FRAGMENT}
      children {
        guid
        label
        text
      }
    }
  }
`);

interface QueryResponse {
  section?: ISection;
  sections?: ISection[];
}

@Injectable({
  providedIn: 'root',
})
export class SectionService extends ApolloService {
  public async getSectionList(): Promise<ISection[]> {
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_SECTION_LIST);
    return result?.sections ?? [];
  }

  public async getChildrenList(sectionId: string): Promise<ISection[]> {
    const variables: Record<string, string> = { sectionId: sectionId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_CHILDREN_LIST, variables);
    return result?.section?.children ?? [];
  }

  public async getSection(sectionId: string): Promise<Nullable<ISection>> {
    const variables: Record<string, string> = { sectionId: sectionId };
    const result: Nullable<QueryResponse> = await this.query<QueryResponse>(GET_SECTION, variables);
    return result?.section;
  }
}
