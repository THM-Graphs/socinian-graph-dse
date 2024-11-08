import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import CommunicationDAO from '../../database/Communication.dao';
import { ICommunication } from '../../interfaces/ICommunication';
import { Metadata } from './Metadata';
import { Nullable } from '../../types.js';
import { IMetadata } from '../../interfaces/IMetadata.js';
import { Section } from './Section.js';
import { ISection } from '../../interfaces/ISection.js';

export const Communication: GraphQLObjectType = new GraphQLObjectType({
  name: 'Communication',
  fields: () => ({
    guid: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Identifier (usually UUID).',
    },
    dateStart: {
      type: GraphQLString,
      description: 'Sent date for this communication.',
      resolve: async (context: ICommunication): Promise<Nullable<string>> => {
        if (context.dateStart) return context.dateStart;
        return await CommunicationDAO.getDateStart(context.guid);
      },
    },
    attachments: {
      type: GraphQLInt,
      description: 'Amount of communication attachments.',
    },
    variants: {
      type: GraphQLInt,
      description: 'Amount of communication letter variants.',
    },
    letter: {
      type: Metadata,
      description: 'Communication main letter.',
      resolve: async (context: ICommunication): Promise<Nullable<IMetadata>> => {
        if (context.letter) return context.letter;
        return await CommunicationDAO.getLetter(context.guid);
      },
    },
    attached: {
      type: new GraphQLList(Metadata),
      description: 'Communication attachments.',
      resolve: async (context: ICommunication): Promise<IMetadata[]> => {
        if (context.attachments) return context.attached;
        return await CommunicationDAO.getAttachments(context.guid);
      },
    },
    sections: {
      type: new GraphQLList(Section),
      description: 'Communication sections.',
      resolve: async (context: ICommunication): Promise<ISection[]> => {
        if (context.sections) return context.sections;
        return await CommunicationDAO.getSections(context.guid);
      },
    },
    data: {
      type: GraphQLString,
      description: 'Communication node as string.',
    },
  }),
});
