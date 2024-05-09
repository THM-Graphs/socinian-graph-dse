import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import SectionDAO from '../../database/Section.dao';
import { ISection } from '../../interfaces/ISection';
import { Communication } from './Communication';
import { ICommunication } from '../../interfaces/ICommunication';
import { Annotation } from './Annotation.js';
import { IAnnotation } from '../../interfaces/IAnnotation.js';

export const Section: GraphQLObjectType = new GraphQLObjectType({
  name: 'Section',
  fields: () => ({
    guid: {
      type: GraphQLString,
      description: 'Identifier (usually UUID).',
    },
    label: {
      type: GraphQLString,
      description: 'Section label.',
    },
    text: {
      type: GraphQLString,
      description: 'Section text or description.',
    },
    data: {
      type: GraphQLString,
      description: 'Section node as string.',
    },
    standoffProperties: {
      type: new GraphQLList(Annotation),
      description: 'Annotations that have been used for this section.',
      resolve: async (context: ISection): Promise<IAnnotation[]> => {
        return await SectionDAO.getAnnotations(context.guid);
      },
    },
    children: {
      type: new GraphQLList(Section),
      description: 'Sections next children.',
      resolve: async (context: ISection): Promise<ISection[]> => {
        return await SectionDAO.getChildren(context.guid);
      },
    },
    communications: {
      type: new GraphQLList(Communication),
      description: 'Section communication nodes.',
      resolve: async (context: ISection): Promise<ICommunication[]> => {
        return await SectionDAO.getCommunication(context.guid);
      },
    },
  }),
});
