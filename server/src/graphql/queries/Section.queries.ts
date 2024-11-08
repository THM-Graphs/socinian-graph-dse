import { GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import SectionDAO from '../../database/Section.dao';
import { filterXSS } from 'xss';
import { Section } from '../types/Section';
import { ISection } from '../../interfaces/ISection.js';
import { Nullable } from '../../types.js';

export const SectionQueries: GraphQLFieldConfigMap<string, string> = {
  sections: {
    type: new GraphQLList(Section),
    resolve: async (): Promise<ISection[]> => {
      return await SectionDAO.getSections();
    },
  },

  section: {
    type: Section,
    args: { id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async (_, args: { id: string }): Promise<Nullable<ISection>> => {
      const sectionId: string = filterXSS(args.id);
      return await SectionDAO.getSection(sectionId);
    },
  },
};
