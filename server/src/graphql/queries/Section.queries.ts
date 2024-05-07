import {GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLString,} from "graphql";
import SectionDAO from "../../database/Section.dao";
import {filterXSS} from "xss";
import {Section} from "../types/Section";

export const SectionQueries: GraphQLFieldConfigMap<string, string> = {
  sections: {
    type: new GraphQLList(Section),
    resolve: async () => {
      return await SectionDAO.getAllSections();
    },
  },
  section: {
    type: Section,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }) => {
      const sectionId: string = filterXSS(args.id);
      return await SectionDAO.getSection(sectionId);
    },
  },
};
