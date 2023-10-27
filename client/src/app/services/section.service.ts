import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { ApolloQueryResult, TypedDocumentNode } from "@apollo/client/core";
import { ISection } from "../models/ISection";

const COMMUNICATION: string = `
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

const GET_SECTION_LIST: TypedDocumentNode = gql`
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
`;

const GET_CHILDREN_LIST: TypedDocumentNode = gql`
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
`;

const GET_SECTION_BY_ID: TypedDocumentNode = gql`
  query GetSectionById($sectionId: String!) {
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
      ${COMMUNICATION}
      children {
        guid
        label
        text
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class SectionService {
  constructor(private apollo: Apollo) {}

  public async getSectionList(): Promise<ISection[]> {
    try {
      const queryResult: ApolloQueryResult<{ sections: ISection[] }> = (await this.apollo
        .watchQuery({
          query: GET_SECTION_LIST,
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ sections: ISection[] }>;

      return queryResult.data.sections;
    } catch (error: unknown) {
      console.error("Failed to query sections:", error);
      return [];
    }
  }

  public async getChildrenList(sectionId: string): Promise<ISection[]> {
    try {
      const queryResult: ApolloQueryResult<{ section: ISection }> = (await this.apollo
        .watchQuery({
          query: GET_CHILDREN_LIST,
          variables: { sectionId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ section: ISection }>;

      return queryResult.data.section.children;
    } catch (error: unknown) {
      console.error("Failed to query children list for id", sectionId, error);
      return [];
    }
  }

  public async getSection(sectionId: string): Promise<ISection | null> {
    try {
      const queryResult: ApolloQueryResult<{ section: ISection }> = (await this.apollo
        .watchQuery({
          query: GET_SECTION_BY_ID,
          variables: { sectionId },
          fetchPolicy: "cache-and-network",
        })
        .result()) as ApolloQueryResult<{ section: ISection }>;

      return queryResult.data.section;
    } catch (error: unknown) {
      console.error("Failed to query section with id", sectionId, error);
      return null;
    }
  }
}
